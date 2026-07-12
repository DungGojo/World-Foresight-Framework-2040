"""
Statistical behaviour labels for each country-proxy time series.

These outputs replace subjective scenario-direction flags with observed
direction, speed, and uncertainty behaviour.
"""

import numpy as np
import pandas as pd


def _safe_r2(y, yhat) -> float:
    y = np.asarray(y, dtype=float)
    yhat = np.asarray(yhat, dtype=float)
    ss_res = np.sum((y - yhat) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    if ss_tot <= 0:
        return 1.0 if ss_res <= 1e-12 else 0.0
    return float(max(0.0, min(1.0, 1 - ss_res / ss_tot)))


def _safe_cagr(start, end, years):
    if years <= 0 or start is None or end is None:
        return np.nan
    if pd.isna(start) or pd.isna(end) or start <= 0 or end <= 0:
        return np.nan
    return float((end / start) ** (1 / years) - 1)


def _speed_from_normalized_slope(abs_norm_slope: float) -> str:
    if pd.isna(abs_norm_slope):
        return "UNKNOWN"
    if abs_norm_slope < 0.01:
        return "SLOW"
    if abs_norm_slope < 0.03:
        return "MEDIUM"
    return "FAST"


def _ols_slope(years, values, denom: float):
    years = np.asarray(years, dtype=float)
    values = np.asarray(values, dtype=float)
    valid = ~np.isnan(years) & ~np.isnan(values)
    years = years[valid]
    values = values[valid]
    if len(values) < 2 or np.ptp(years) <= 0:
        return np.nan
    slope, _ = np.polyfit(years - years.min(), values, 1)
    return float(slope / denom)


def _ols_fit(years, values):
    years = np.asarray(years, dtype=float)
    values = np.asarray(values, dtype=float)
    valid = ~np.isnan(years) & ~np.isnan(values)
    years = years[valid]
    values = values[valid]
    if len(values) < 2 or np.ptp(years) <= 0:
        return np.nan, np.nan, None
    t = years - years.min()
    slope, intercept = np.polyfit(t, values, 1)
    yhat = intercept + slope * t
    return float(slope), float(intercept), yhat


def _period_ols_slope(years, values, start_year: int, end_year: int, denom: float):
    years = np.asarray(years, dtype=float)
    values = np.asarray(values, dtype=float)
    mask = (years >= start_year) & (years <= end_year)
    return _ols_slope(years[mask], values[mask], denom)


def _significant_reversal(slope_p1y, slope_p3y, threshold: float = 0.04) -> bool:
    if pd.isna(slope_p1y) or pd.isna(slope_p3y):
        return False
    return (
        abs(slope_p1y) >= threshold
        and abs(slope_p3y) >= threshold
        and slope_p1y * slope_p3y < 0
    )


def _large_slope_divergence(slope_p1y, slope_p3y) -> bool:
    if pd.isna(slope_p1y) or pd.isna(slope_p3y):
        return False
    absolute_gap = abs(slope_p1y - slope_p3y)
    relative_base = max(abs(slope_p3y), 0.03)
    return absolute_gap >= 0.03 and absolute_gap / relative_base >= 1.5


def _large_cagr_divergence(cagr_1y, cagr_3y) -> bool:
    if pd.isna(cagr_1y) or pd.isna(cagr_3y):
        return False
    absolute_gap = abs(cagr_1y - cagr_3y)
    relative_base = max(abs(cagr_3y), 0.03)
    return absolute_gap >= 0.05 and absolute_gap / relative_base >= 1.5


def _classify_uncertainty(
    *,
    slope_p1y,
    slope_p3y,
    cagr_1y,
    cagr_3y,
    trend_r2_raw: float,
    y_change_volatility_ratio: float,
    shock_sensitivity: float,
    change_direction: str,
    change_speed: str,
) -> str:
    """Classify uncertainty with ordered historical-pattern cases."""
    has_reversal = _significant_reversal(slope_p1y, slope_p3y)
    has_cagr_divergence = _large_cagr_divergence(cagr_1y, cagr_3y)
    has_slope_divergence = _large_slope_divergence(slope_p1y, slope_p3y)
    has_fallback_slope_divergence = has_slope_divergence and not has_cagr_divergence
    has_deceleration = has_fallback_slope_divergence and not has_reversal

    is_weak_but_usable_trend = 0.20 <= trend_r2_raw < 0.45
    is_noisy = y_change_volatility_ratio >= 0.80
    is_somewhat_noisy = 0.45 <= y_change_volatility_ratio < 0.80
    is_shock_driven = shock_sensitivity >= 0.50
    is_shock_sensitive = 0.25 <= shock_sensitivity < 0.50
    is_fast = change_speed == "FAST"
    is_volatile_direction = change_direction == "VOLATILE"

    # HIGH: structural failure.
    if is_volatile_direction:
        return "HIGH"

    if is_shock_driven and (is_noisy or is_somewhat_noisy):
        return "HIGH"

    if has_reversal and is_noisy:
        return "HIGH"

    if has_cagr_divergence and (is_noisy or is_shock_driven):
        return "HIGH"

    if has_fallback_slope_divergence and (is_noisy or is_shock_driven):
        return "HIGH"

    # MEDIUM: one clear alarm or two moderate signals converging.
    if is_noisy:
        return "MEDIUM"

    if has_reversal:
        return "MEDIUM"

    if is_shock_driven:
        return "MEDIUM"

    if has_cagr_divergence:
        return "MEDIUM"

    if has_deceleration:
        return "MEDIUM"

    if is_fast and is_weak_but_usable_trend:
        return "MEDIUM"

    mod_count = sum([is_weak_but_usable_trend, is_somewhat_noisy, is_shock_sensitive])
    if mod_count >= 2:
        return "MEDIUM"

    return "LOW"


def compute_series_diagnostics(
    modeling_df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Compute statistical diagnostics per `proxy_id`
    """
    records = []
    for proxy_id, g in modeling_df.groupby("proxy_id", sort=False):
        g = g.sort_values("year").dropna(subset=["value", "y"])
        n = len(g)
        if n < 5:
            continue

        years = g["year"].to_numpy(dtype=float)
        values = g["value"].to_numpy(dtype=float)
        y = g["y"].to_numpy(dtype=float)
        t = years - years.min()

        if n >= 2 and np.ptp(t) > 0:
            slope, intercept = np.polyfit(t, y, 1)
            yhat = intercept + slope * t
            trend_r2_y = _safe_r2(y, yhat)
            residual_std = float(np.std(y - yhat, ddof=1)) if n > 2 else 0.0
        else:
            slope, intercept, trend_r2_y, residual_std = 0.0, y[0], 1.0, 0.0

        value_range = None
        lower = g["lower_bound"].iloc[0]
        upper = g["upper_bound"].iloc[0]
        if pd.notna(lower) and pd.notna(upper) and upper > lower:
            value_range = float(upper - lower)

        if value_range:
            denom = value_range
        else:
            median_abs = float(np.nanmedian(np.abs(values)))
            denom = median_abs if median_abs > 1e-9 else 1.0

        raw_slope, raw_intercept, raw_yhat = _ols_fit(years, values)
        if raw_yhat is not None:
            trend_r2_raw = _safe_r2(values, raw_yhat)
            slope_full = float(raw_slope / denom)
        else:
            trend_r2_raw = 1.0
            slope_full = np.nan
        normalized_slope = 0.0 if pd.isna(slope_full) else slope_full

        abs_norm_slope = abs(normalized_slope)
        change_speed = _speed_from_normalized_slope(abs_norm_slope)

        if abs_norm_slope < 0.005:
            change_direction = "STABLE"
        elif trend_r2_raw < 0.2:
            change_direction = "VOLATILE"
        elif normalized_slope > 0:
            change_direction = "INCREASING"
        else:
            change_direction = "DECREASING"

        y_change_volatility = float(np.std(np.diff(y), ddof=1)) if n >= 3 else 0.0

        # Shock sensitivity: how much observations in shock years change the fit.
        shock_sensitivity = 0.0
        if n >= 5 and g["is_shock_year"].any():
            no_shock = g[~g["is_shock_year"]]
            if len(no_shock) >= 3:
                tt = no_shock["year"].to_numpy(dtype=float) - years.min()
                yy = no_shock["y"].to_numpy(dtype=float)
                slope_ns, intercept_ns = np.polyfit(tt, yy, 1)
                yhat_ns_all = intercept_ns + slope_ns * t
                shock_sensitivity = min(
                    1.0,
                    float(np.mean(np.abs(yhat - yhat_ns_all)) / (np.std(y) + 1e-9)),
                )

        y_change_volatility_ratio = (
            min(1.0, y_change_volatility / (np.std(y) + 1e-9))
            if n >= 3 else 0.5
        )

        first_year = int(g["year"].iloc[0])
        last_year = int(g["year"].iloc[-1])
        full_years = max(1, last_year - first_year)
        last_value = float(values[-1])
        first_value = float(values[0])
        value_by_year = dict(zip(g["year"].astype(int), values))

        cagr_1y = _safe_cagr(value_by_year.get(last_year - 1), last_value, 1)
        cagr_3y = _safe_cagr(value_by_year.get(last_year - 3), last_value, 3)
        cagr_full = _safe_cagr(first_value, last_value, full_years)
        slope_p1y = _period_ols_slope(years, values, last_year - 1, last_year, denom)
        slope_p3y = _period_ols_slope(years, values, last_year - 3, last_year, denom)

        uncertainty_level = _classify_uncertainty(
            slope_p1y=slope_p1y,
            slope_p3y=slope_p3y,
            cagr_1y=cagr_1y,
            cagr_3y=cagr_3y,
            trend_r2_raw=trend_r2_raw,
            y_change_volatility_ratio=y_change_volatility_ratio,
            shock_sensitivity=shock_sensitivity,
            change_direction=change_direction,
            change_speed=change_speed,
        )

        records.append({
            "id": g["id"].iloc[0],
            "proxy_id": g["proxy_id"].iloc[0],
            "market": g["market"].iloc[0],
            "n_obs": n,
            "first_year": first_year,
            "latest_year": last_year,
            "latest_value": last_value,
            "latest_y": float(y[-1]),
            "slope_p1y": slope_p1y,
            "slope_p3y": slope_p3y,
            "slope_full": slope_full,
            "cagr_p1y": cagr_1y,
            "cagr_p3y": cagr_3y,
            "cagr_full": cagr_full,
            "trend_r2_raw": trend_r2_raw,
            "trend_r2_y": trend_r2_y,
            "residual_std": residual_std,
            "y_change_volatility": y_change_volatility,
            "y_change_volatility_ratio": y_change_volatility_ratio,
            "shock_sensitivity": shock_sensitivity,
            "change_direction": change_direction,
            "change_speed": change_speed,
            "uncertainty_level": uncertainty_level,
        })

    return pd.DataFrame(records)
