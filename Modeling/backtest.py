"""
Rolling-origin, multi-horizon backtest.

The old pipeline only measured one-step-ahead accuracy, which said nothing about
the 2040 horizon it actually forecasts. This module trains on data up to a
cutoff year and checks the forecast 1, 3, 5 and 10 years later against what
really happened, so the reported error reflects the horizons we care about.

Metrics are reported on both scales:
  * `_y`     : transformed modelling scale (what the model optimises).
  * `_value` : original units after inverse transform (what a reader sees).
"""

import numpy as np
import pandas as pd

from .diagnostics import compute_series_diagnostics
from .simple_forecaster import forecast_transformed
from .transforms import inverse_transform_value


DEFAULT_HORIZONS = (1, 3, 5, 10)


def _meta_rows(modeling_df: pd.DataFrame) -> pd.DataFrame:
    cols = ["proxy_id", "proxy_type", "lower_bound", "upper_bound", "allow_negative"]
    return (
        modeling_df.sort_values("year")
        .groupby("proxy_id", as_index=False)
        .tail(1)[cols]
        .set_index("proxy_id")
    )


def _r2(actual: np.ndarray, pred: np.ndarray) -> float:
    actual = np.asarray(actual, dtype=float)
    pred = np.asarray(pred, dtype=float)
    mask = ~np.isnan(actual) & ~np.isnan(pred)
    if mask.sum() < 2:
        return np.nan
    a, p = actual[mask], pred[mask]
    ss_res = float(np.sum((a - p) ** 2))
    ss_tot = float(np.sum((a - a.mean()) ** 2))
    if ss_tot <= 1e-12:
        return np.nan
    return float(1 - ss_res / ss_tot)


def _mae(actual: np.ndarray, pred: np.ndarray) -> float:
    actual = np.asarray(actual, dtype=float)
    pred = np.asarray(pred, dtype=float)
    mask = ~np.isnan(actual) & ~np.isnan(pred)
    if not mask.any():
        return np.nan
    return float(np.mean(np.abs(actual[mask] - pred[mask])))


def run_backtest(
    modeling_df: pd.DataFrame,
    horizons=DEFAULT_HORIZONS,
    min_train_years: int = 5,
) -> pd.DataFrame:
    """Return one metrics row per horizon plus an ALL-horizons summary row."""
    meta = _meta_rows(modeling_df)
    years = sorted(int(y) for y in modeling_df["year"].dropna().unique())
    max_h = max(horizons)

    preds = []
    for cutoff in years:
        train = modeling_df[modeling_df["year"] <= cutoff].copy()
        # need at least one series with enough history to fit trends
        if train.dropna(subset=["y"]).groupby("proxy_id").size().max() < min_train_years:
            continue
        target_years = [cutoff + h for h in horizons if cutoff + h <= years[-1]]
        if not target_years:
            continue

        diag = compute_series_diagnostics(train)
        fc = forecast_transformed(train, diag, target_years)
        if fc.empty:
            continue
        fc = fc.rename(columns={"yhat": "yhat"})
        fc["cutoff"] = cutoff
        fc["horizon"] = fc["year"].astype(int) - cutoff

        actual = modeling_df[modeling_df["year"].isin(target_years)][
            ["proxy_id", "year", "value", "y"]
        ].rename(columns={"value": "value_true", "y": "y_true"})
        merged = fc.merge(actual, on=["proxy_id", "year"], how="inner")
        preds.append(merged)

    if not preds:
        return pd.DataFrame()

    allp = pd.concat(preds, ignore_index=True)

    # inverse-transform predictions to value scale for value metrics
    def _inv(row):
        m = meta.loc[row["proxy_id"]] if row["proxy_id"] in meta.index else {}
        return inverse_transform_value(row["yhat"], m)

    allp["valuehat"] = allp.apply(_inv, axis=1)

    rows = []
    for h in sorted(horizons):
        sub = allp[allp["horizon"] == h]
        if sub.empty:
            continue
        rows.append({
            "horizon_years": h,
            "n": int(len(sub)),
            "r2_y": _r2(sub["y_true"], sub["yhat"]),
            "mae_y": _mae(sub["y_true"], sub["yhat"]),
            "r2_value": _r2(sub["value_true"], sub["valuehat"]),
            "mae_value": _mae(sub["value_true"], sub["valuehat"]),
        })
    # overall summary across all horizon rows
    rows.append({
        "horizon_years": "ALL",
        "n": int(len(allp)),
        "r2_y": _r2(allp["y_true"], allp["yhat"]),
        "mae_y": _mae(allp["y_true"], allp["yhat"]),
        "r2_value": _r2(allp["value_true"], allp["valuehat"]),
        "mae_value": _mae(allp["value_true"], allp["valuehat"]),
    })
    return pd.DataFrame(rows)
