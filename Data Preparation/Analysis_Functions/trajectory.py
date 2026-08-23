"""Series pulls used by every topic.

`get_series` splices historical years onto the forecast so one call returns a
continuous 2000->2040 line. `anchor_table` reduces that to the three anchor
years plus the change between them.
"""

import warnings

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "year", "value", "scenario"}
FORECAST_START = 2026


def _prepare(full_data: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(full_data.columns)
    if missing:
        raise ValueError(f"full_data is missing columns: {sorted(missing)}")
    df = full_data[["id", "market", "year", "value", "scenario"]].copy()
    df["id"] = df["id"].astype(str).str.strip()
    df["market"] = df["market"].astype(str).str.strip()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    return df.dropna(subset=["id", "market", "year", "value"]).astype({"year": int})


def get_series(
    full_data: pd.DataFrame,
    proxy_ids,
    markets=None,
    years=None,
    scenario: str = "main_scenario",
    include_history: bool = True,
) -> pd.DataFrame:
    """Return a tidy [id, market, year, value] frame for one scenario.

    History (<= 2025) is taken from the 'historical' rows so the output is a
    single continuous line rather than a forecast stub.
    """
    df = _prepare(full_data)
    proxy_ids = [proxy_ids] if isinstance(proxy_ids, str) else list(proxy_ids)
    df = df[df["id"].isin(proxy_ids)]
    if markets is not None:
        markets = [markets] if isinstance(markets, str) else list(markets)
        df = df[df["market"].isin(markets)]

    keep = df["scenario"] == scenario
    if include_history:
        keep |= (df["scenario"] == "historical") & (df["year"] < FORECAST_START)
    df = df[keep]

    if years is not None:
        df = df[df["year"].isin(list(years))]

    missing_ids = sorted(set(proxy_ids) - set(df["id"]))
    if missing_ids:
        warnings.warn(f"get_series: proxies not found: {missing_ids}", stacklevel=2)

    return (
        df.drop(columns="scenario")
        .drop_duplicates(["id", "market", "year"], keep="last")
        .sort_values(["id", "market", "year"])
        .reset_index(drop=True)
    )


def anchor_table(
    full_data: pd.DataFrame,
    proxy_ids,
    markets=None,
    years=(2025, 2030, 2040),
    scenario: str = "main_scenario",
) -> pd.DataFrame:
    """Value at each anchor year per id/market, plus change and % change."""
    years = list(years)
    series = get_series(full_data, proxy_ids, markets=markets, years=years, scenario=scenario)
    wide = series.pivot_table(index=["id", "market"], columns="year", values="value").reset_index()
    wide = wide.reindex(columns=["id", "market"] + years)

    first, last = years[0], years[-1]
    wide["change"] = wide[last] - wide[first]
    wide["pct_change"] = np.where(
        wide[first].abs() > 1e-9, wide["change"] / wide[first] * 100, np.nan
    )
    return wide.sort_values(["id", "market"]).reset_index(drop=True)
