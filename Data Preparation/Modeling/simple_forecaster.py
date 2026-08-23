"""
Simplified, transparent forecaster.

Replaces the ElasticNet + HistGradientBoosting stacking ensemble with a single,
explainable model that stays realistic over long horizons.

Core idea (everything on the transformed `y` scale):

    y_hat(h) = last_y + clip( blended_slope * damped_steps(h, phi) )

where

    blended_slope = credibility * local_slope + (1 - credibility) * pooled_slope
    credibility   = n_obs / (n_obs + SHRINKAGE_K)
    damped_steps  = phi * (1 - phi**h) / (1 - phi)   ->  phi / (1 - phi) as h grows
    phi           = per-series damping from uncertainty_level

Two guardrails keep long-horizon paths realistic:

1. Damping (`damped_steps`) makes the cumulative trend converge to a finite level
   instead of running to +/- infinity, so bounded proxies no longer collapse onto
   their 0/100 bounds and the path flattens over time.
2. Drift cap: the total move in y is limited to DRIFT_SPAN_MULT times the series'
   own observed y-range, so a series never travels far outside what it has ever
   historically done.

Local slope  : weighted OLS slope of y over time (shock years down-weighted).
Pooled slope : median local slope of the same proxy family (`id`). This avoids
               pooling across proxy families with incompatible value scales.
               Strong local trends use their own local slope directly.
"""

import numpy as np
import pandas as pd


# --- tunable, documented constants ----------------------------------------

SHRINKAGE_K = 8.0  # n/(n+K): with ~10 pts credibility ~= 0.56 (half local, half pooled)

# Damping by uncertainty level. Effective drift horizon = phi/(1-phi):
#   0.85 -> 5.7 effective years, 0.80 -> 4.0, 0.72 -> 2.6.
DAMPING_BY_UNCERTAINTY = {"LOW": 0.85, "MEDIUM": 0.80, "HIGH": 0.72}
DEFAULT_DAMPING = 0.80

SLOPE_CLIP_VOL_MULT = 3.0    # annual step <= 3x the series' yearly-change volatility
DRIFT_SPAN_MULT = 2.0        # total y move <= 2x the observed y-range
MIN_Y_SPAN = 1e-6
LOCAL_SLOPE_MIN_OBS = 10
LOCAL_SLOPE_MIN_R2_RAW = 0.60
LOCAL_SLOPE_DIRECTIONS = {"INCREASING", "DECREASING"}


def _damped_steps(horizon: int, phi: float) -> float:
    """Sum of a geometric decay of the annual step; -> phi/(1-phi) as h grows."""
    h = int(horizon)
    if h <= 0:
        return 0.0
    if phi >= 1.0:
        return float(h)
    return float(phi * (1.0 - phi ** h) / (1.0 - phi))


def _weighted_slope(years: np.ndarray, y: np.ndarray, weights: np.ndarray) -> float:
    if len(y) < 2 or np.ptp(years) <= 0:
        return 0.0
    t = years - years.min()
    slope, _ = np.polyfit(t, y, 1, w=weights)
    return float(slope)


def _pooled_slopes_by_id(modeling_df: pd.DataFrame) -> dict:
    """Median local trend by proxy family (`id`), mapped back to each proxy_id."""
    recs = []
    for proxy_id, g in modeling_df.groupby("proxy_id", sort=False):
        g = g.sort_values("year").dropna(subset=["y"])
        if len(g) < 2:
            continue
        years = g["year"].to_numpy(dtype=float)
        y = g["y"].to_numpy(dtype=float)
        w = g.get("sample_weight", pd.Series(1.0, index=g.index)).to_numpy(dtype=float)
        recs.append({"proxy_id": proxy_id, "id": g["id"].iloc[0],
                     "slope": _weighted_slope(years, y, w)})
    if not recs:
        return {}
    df = pd.DataFrame(recs)
    overall = float(df["slope"].median())
    df["pooled"] = df.groupby("id")["slope"].transform("median").fillna(overall)
    return dict(zip(df["proxy_id"], df["pooled"]))


def _direction_guard(blended_slope: float, local_slope: float, credibility: float, diag_row) -> float:
    """Prevent a clear local trend from reversing only because the pooled slope disagrees."""
    if diag_row is None or blended_slope == 0 or local_slope == 0:
        return blended_slope

    direction = str(diag_row.get("change_direction", "")).upper()
    if direction == "INCREASING":
        expected_sign = 1
    elif direction == "DECREASING":
        expected_sign = -1
    else:
        return blended_slope

    if np.sign(local_slope) != expected_sign:
        return blended_slope
    if np.sign(blended_slope) == expected_sign:
        return blended_slope

    # Keep the well-evidenced direction, but shrink toward flat when peer data disagrees.
    return float(local_slope * credibility)


def _should_use_local_slope(n_obs: int, diag_row) -> bool:
    """Use local slope directly when the series has enough clean historical evidence."""
    if diag_row is None:
        return False
    direction = str(diag_row.get("change_direction", "")).upper()
    trend_r2_raw = pd.to_numeric(diag_row.get("trend_r2_raw"), errors="coerce")
    if pd.isna(trend_r2_raw):
        return False
    return (
        int(n_obs) >= LOCAL_SLOPE_MIN_OBS
        and float(trend_r2_raw) >= LOCAL_SLOPE_MIN_R2_RAW
        and direction in LOCAL_SLOPE_DIRECTIONS
    )


def _series_table(modeling_df: pd.DataFrame, diagnostics: pd.DataFrame) -> pd.DataFrame:
    """One row per proxy_id with everything needed to project the future."""
    pooled_slope = _pooled_slopes_by_id(modeling_df)
    diag = diagnostics.set_index("proxy_id") if diagnostics is not None else None

    rows = []
    for proxy_id, g in modeling_df.groupby("proxy_id", sort=False):
        g = g.sort_values("year").dropna(subset=["y"])
        n = len(g)
        if n < 2:
            continue
        years = g["year"].to_numpy(dtype=float)
        y = g["y"].to_numpy(dtype=float)
        weights = g.get("sample_weight", pd.Series(1.0, index=g.index)).to_numpy(dtype=float)

        local_slope = _weighted_slope(years, y, weights)
        vol = float(np.std(np.diff(y), ddof=1)) if n >= 3 else abs(local_slope)
        slope_cap = SLOPE_CLIP_VOL_MULT * vol if vol > 0 else np.inf
        diag_row = diag.loc[proxy_id] if (diag is not None and proxy_id in diag.index) else None
        if _should_use_local_slope(n, diag_row):
            p_slope = local_slope
            pooled_slope_source = "local_strong_evidence"
        else:
            p_slope = float(pooled_slope.get(proxy_id, local_slope))
            pooled_slope_source = "same_id_median"

        credibility = n / (n + SHRINKAGE_K)
        blended = float(np.clip(
            credibility * local_slope + (1.0 - credibility) * p_slope,
            -slope_cap, slope_cap,
        ))

        blended = _direction_guard(blended, local_slope, credibility, diag_row)

        unc = diag_row["uncertainty_level"] if diag_row is not None else "MEDIUM"
        phi = DAMPING_BY_UNCERTAINTY.get(str(unc).upper(), DEFAULT_DAMPING)

        y_span = float(np.ptp(y)) if n >= 2 else 0.0
        max_drift = DRIFT_SPAN_MULT * max(y_span, MIN_Y_SPAN)

        rows.append({
            "proxy_id": proxy_id, "last_year": int(years[-1]), "last_y": float(y[-1]),
            "n_obs": n, "local_slope": local_slope, "pooled_slope": p_slope,
            "pooled_slope_source": pooled_slope_source,
            "credibility": float(credibility), "blended_slope": blended, "phi": phi,
            "effective_years": _damped_steps(10_000, phi),
            "max_drift": max_drift,
        })
    return pd.DataFrame(rows).set_index("proxy_id")


def forecast_transformed(modeling_df, diagnostics, future_years) -> pd.DataFrame:
    """Transformed-scale yhat for every proxy_id and future year.

    Columns: proxy_id, year, yhat.
    """
    table = _series_table(modeling_df, diagnostics)
    future_years = [int(y) for y in future_years]

    records = []
    for proxy_id, row in table.iterrows():
        for year in future_years:
            horizon = year - int(row["last_year"])
            if horizon <= 0:
                continue
            drift = row["blended_slope"] * _damped_steps(horizon, row["phi"])
            drift = float(np.clip(drift, -row["max_drift"], row["max_drift"]))
            yhat = row["last_y"] + drift
            records.append({"proxy_id": proxy_id, "year": year, "yhat": float(yhat)})
    return pd.DataFrame(records)


def model_components(modeling_df, diagnostics) -> pd.DataFrame:
    """Transparent per-series breakdown of how each forecast is built."""
    table = _series_table(modeling_df, diagnostics).reset_index()
    return table[[
        "proxy_id", "n_obs", "last_y", "local_slope", "pooled_slope",
        "pooled_slope_source", "credibility", "blended_slope", "phi",
        "effective_years", "max_drift",
    ]]
