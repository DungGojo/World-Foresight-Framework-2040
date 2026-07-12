"""
Main forecasting entry point.

Simplified pipeline:

    raw value
    -> transformed y
    -> damped blended-trend forecast (local trend shrunk toward same-id pooled trend)
    -> inverse transform + cap
    -> main / optimistic / pessimistic scenarios + confidence intervals

The previous ElasticNet + HistGradientBoosting stacking ensemble was removed
because it was trained only on one-step-ahead rows and produced unrealistic
long-horizon paths (runaway growth or collapse to bounds). See
`simple_forecaster.py` for the replacement model and `backtest.py` for the
multi-horizon accuracy check that now populates the model-metrics output.
"""

import pandas as pd

from .backtest import DEFAULT_HORIZONS, run_backtest
from .diagnostics import compute_series_diagnostics
from .scenarios import build_scenario_rows
from .simple_forecaster import forecast_transformed, model_components


def _latest_series_meta(modeling_df: pd.DataFrame) -> pd.DataFrame:
    meta_cols = [
        "proxy_id", "id", "market", "labels", "metric",
        "proxy_type", "lower_bound", "upper_bound", "allow_negative",
        "shock_year_policy",
    ]
    meta_cols = [c for c in meta_cols if c in modeling_df.columns]
    return (
        modeling_df.sort_values("year")
        .groupby("proxy_id", as_index=False)
        .tail(1)[meta_cols]
        .reset_index(drop=True)
    )


def run_forecast(
    modeling_df: pd.DataFrame,
    diagnostics_df: pd.DataFrame | None = None,
    horizon_year: int = 2040,
    start_forecast_year: int | None = None,
    min_train_years: int = 5,
    backtest_horizons=DEFAULT_HORIZONS,
    decimals: int = 6,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Forecast annual proxy values through `horizon_year`.

    Returns
    -------
    (forecast_df, diagnostics_df, model_components_df, model_metrics_df)
    """
    if diagnostics_df is None:
        diagnostics_df = compute_series_diagnostics(modeling_df)

    latest_year_by_proxy = modeling_df.groupby("proxy_id")["year"].max()
    if start_forecast_year is None:
        start_forecast_year = int(latest_year_by_proxy.min()) + 1
    if horizon_year < start_forecast_year:
        raise ValueError("horizon_year must be >= start_forecast_year")

    future_years = list(range(int(start_forecast_year), int(horizon_year) + 1))

    transformed = forecast_transformed(modeling_df, diagnostics_df, future_years)
    forecast = build_scenario_rows(
        transformed,
        series_meta=_latest_series_meta(modeling_df),
        diagnostics=diagnostics_df,
        decimals=decimals,
    )

    components_df = model_components(modeling_df, diagnostics_df)
    model_metrics_df = run_backtest(
        modeling_df,
        horizons=backtest_horizons,
        min_train_years=min_train_years,
    )

    return forecast, diagnostics_df, components_df, model_metrics_df
