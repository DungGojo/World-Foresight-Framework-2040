"""
Scenario and uncertainty range generation.

Scenarios are statistical upper/lower views around the main forecast.
"""

import numpy as np
import pandas as pd

from .transforms import cap_value, inverse_transform_value


UNCERTAINTY_SPREAD = {
    "LOW": 0.10,
    "MEDIUM": 0.20,
    "HIGH": 0.35,
}

CI_MULTIPLIER = {
    "LOW": 1.28,      # roughly 80% interval
    "MEDIUM": 1.64,   # roughly 90% interval
    "HIGH": 1.96,     # roughly 95% interval
}


def _shift_ci(lower_ci: float, upper_ci: float, value_delta: float, row) -> tuple[float, float]:
    """Shift a value-scale CI by a scenario delta and reapply proxy bounds."""
    if pd.isna(lower_ci) or pd.isna(upper_ci):
        return np.nan, np.nan
    shifted_lower = cap_value(float(lower_ci) + float(value_delta), row)
    shifted_upper = cap_value(float(upper_ci) + float(value_delta), row)
    if shifted_lower > shifted_upper:
        shifted_lower, shifted_upper = shifted_upper, shifted_lower
    return shifted_lower, shifted_upper


def build_scenario_rows(
    transformed_predictions: pd.DataFrame,
    series_meta: pd.DataFrame,
    diagnostics: pd.DataFrame,
    decimals: int = 6,
) -> pd.DataFrame:
    """
    Convert transformed-scale predictions into main/optimistic/pessimistic scenario rows.
    """
    meta_cols = [
        "proxy_id", "id", "market", "labels", "metric",
        "proxy_type", "lower_bound", "upper_bound", "allow_negative",
        "shock_year_policy",
    ]
    meta = series_meta[meta_cols].drop_duplicates("proxy_id")
    diag_cols = [
        "proxy_id", "latest_value", "latest_y", "residual_std",
        "change_direction", "change_speed", "uncertainty_level",
        "slope_p1y", "slope_p3y", "slope_full",
        "y_change_volatility", "y_change_volatility_ratio",
        "trend_r2_raw", "trend_r2_y", "cagr_p1y", "cagr_p3y", "cagr_full",
    ]
    diag_cols = [col for col in diag_cols if col in diagnostics.columns]
    df = (
        transformed_predictions
        .merge(meta, on="proxy_id", how="left")
        .merge(diagnostics[diag_cols], on="proxy_id", how="left")
    )
    min_date_by_proxy = df.groupby("proxy_id")["date"].min()

    rows = []
    for _, row in df.iterrows():
        main_value = inverse_transform_value(row["yhat"], row)
        spread = UNCERTAINTY_SPREAD.get(row.get("uncertainty_level"), 0.20)
        ci_mult = CI_MULTIPLIER.get(row.get("uncertainty_level"), 1.64)

        latest_value = row.get("latest_value")
        if pd.isna(latest_value):
            latest_value = main_value
        scenario_delta = abs(main_value - latest_value) * spread
        optimistic_value = cap_value(main_value + scenario_delta, row)
        pessimistic_value = cap_value(main_value - scenario_delta, row)
        optimistic_delta = optimistic_value - main_value
        pessimistic_delta = pessimistic_value - main_value

        horizon = max(1, int(row["date"]) - int(min_date_by_proxy[row["proxy_id"]]) + 1)
        residual_std = row.get("residual_std")
        residual_std = 0.0 if pd.isna(residual_std) else float(residual_std)
        ci_y_delta = ci_mult * residual_std * np.sqrt(horizon)
        lower_ci = inverse_transform_value(row["yhat"] - ci_y_delta, row)
        upper_ci = inverse_transform_value(row["yhat"] + ci_y_delta, row)
        if lower_ci > upper_ci:
            lower_ci, upper_ci = upper_ci, lower_ci
        optimistic_lower_ci, optimistic_upper_ci = _shift_ci(
            lower_ci, upper_ci, optimistic_delta, row
        )
        pessimistic_lower_ci, pessimistic_upper_ci = _shift_ci(
            lower_ci, upper_ci, pessimistic_delta, row
        )

        common = {
            "id": row["id"],
            "proxy_id": row["proxy_id"],
            "market": row["market"],
            "date": int(row["date"]),
            "labels": row.get("labels"),
            "metric": row.get("metric"),
        }

        rows.append({
            **common,
            "scenario": "main_scenario",
            "value": round(main_value, decimals),
            "lower_ci": round(lower_ci, decimals),
            "upper_ci": round(upper_ci, decimals),
        })
        rows.append({
            **common,
            "scenario": "optimistic_scenario",
            "value": round(optimistic_value, decimals),
            "lower_ci": round(optimistic_lower_ci, decimals),
            "upper_ci": round(optimistic_upper_ci, decimals),
        })
        rows.append({
            **common,
            "scenario": "pessimistic_scenario",
            "value": round(pessimistic_value, decimals),
            "lower_ci": round(pessimistic_lower_ci, decimals),
            "upper_ci": round(pessimistic_upper_ci, decimals),
        })

    columns = [
        "id", "proxy_id", "market", "date", "value", "labels", "metric",
        "scenario", "lower_ci", "upper_ci",
    ]
    return pd.DataFrame(rows, columns=columns).sort_values(
        ["id", "market", "date", "scenario"]
    ).reset_index(drop=True)
