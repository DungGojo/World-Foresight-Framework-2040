"""
Data preparation for forecasting.
"""

import pandas as pd

from .proxy_config import (
    MIN_DATAPOINTS_PER_PROXY,
    normalize_timeseries_keys,
    validate_proxy_config,
)
from .transforms import add_transformed_target

# 2001: dot-com bust + 9/11
# 2008-2009: Global Financial Crisis (2008 financial, 2009 real-economy trough)
# 2020: COVID; 2021: post-COVID rebound; 2022: Ukraine war; 2025: tariff shock
DEFAULT_SHOCK_YEARS = (2001, 2008, 2009, 2020, 2021, 2022, 2025)


def _filter_min_datapoints(df: pd.DataFrame, min_datapoints: int) -> pd.DataFrame:
    """Keep country-proxy series with enough unique observed years."""
    if min_datapoints <= 0:
        return df
    count_frame = df[["proxy_id", "year", "value"]].copy()
    count_frame["year"] = pd.to_numeric(count_frame["year"], errors="coerce")
    count_frame["value"] = pd.to_numeric(count_frame["value"], errors="coerce")
    counts = (
        count_frame.dropna(subset=["proxy_id", "year", "value"])
        .groupby("proxy_id")["year"]
        .nunique()
    )
    keep_proxy_ids = set(counts[counts >= min_datapoints].index)
    return df[df["proxy_id"].isin(keep_proxy_ids)].copy()


def _clean_timeseries_rows(timeseries_df: pd.DataFrame) -> pd.DataFrame:
    """Normalize modeling keys and discard rows that cannot be modeled."""
    required = {"id", "proxy_id", "market", "year", "value"}
    missing = required - set(timeseries_df.columns)
    if missing:
        raise ValueError(f"timeseries_df is missing required columns: {sorted(missing)}")

    df = normalize_timeseries_keys(timeseries_df)
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df.dropna(subset=["id", "proxy_id", "market", "year", "value"])

    fractional_year = (df["year"] % 1).abs() > 1e-9
    if fractional_year.any():
        examples = sorted(df.loc[fractional_year, "year"].unique())[:20]
        raise ValueError(
            f"timeseries_df contains non-integer calendar years: {examples}"
        )
    df["year"] = df["year"].astype(int)
    return df


def _interpolate_annual_values(df: pd.DataFrame) -> pd.DataFrame:
    """Linearly fill every interior missing year on the raw value scale."""
    if df.empty:
        return df.copy()

    invariant_columns = [
        "id", "proxy_id", "market", "proxy_type", "lower_bound",
        "upper_bound", "allow_negative", "shock_year_policy",
    ]
    annual_series = []
    for proxy_id, group in df.groupby("proxy_id", sort=False):
        group = group.sort_values("year").copy()
        for column in invariant_columns:
            if column not in group.columns:
                continue
            if group[column].dropna().nunique() > 1:
                raise ValueError(
                    f"{proxy_id} has inconsistent {column!r} values across years"
                )

        first_year = int(group["year"].min())
        latest_year = int(group["year"].max())
        annual = group.set_index("year").reindex(
            range(first_year, latest_year + 1)
        )
        annual.index.name = "year"
        annual["value"] = annual["value"].interpolate(
            method="index",
            limit_area="inside",
        )
        with pd.option_context("future.no_silent_downcasting", True):
            for column in annual.columns:
                if column != "value":
                    annual[column] = annual[column].ffill().bfill()
        annual = annual.reset_index()
        annual_series.append(annual[group.columns])

    return pd.concat(annual_series, ignore_index=True)


def attach_proxy_config(
    timeseries_df: pd.DataFrame,
    proxy_config: pd.DataFrame,
    min_datapoints: int = MIN_DATAPOINTS_PER_PROXY,
) -> pd.DataFrame:
    """Merge config after removing only under-observed country series.

    The minimum-history rule is evaluated per ``proxy_id`` (the combination
    of parent ``id`` and market). A weak country series is removed without
    deleting the parent configuration or better-covered countries.
    """
    df = _clean_timeseries_rows(timeseries_df)

    cfg = validate_proxy_config(
        proxy_config,
        timeseries_df=df,
        min_datapoints=min_datapoints,
    )
    config_ids = set(
        proxy_config["id"].dropna().astype(str).str.strip()
    )

    missing_config = sorted(set(df["id"].dropna()) - config_ids)
    if missing_config:
        raise ValueError(f"Missing proxy_config rows for ids: {missing_config}")

    df = df[df["id"].isin(set(cfg["id"]))].copy()
    df = _filter_min_datapoints(df, min_datapoints)
    df = df.merge(cfg, on="id", how="inner", validate="many_to_one")

    return df

def prepare_modeling_frame(
    timeseries_df: pd.DataFrame,
    proxy_config: pd.DataFrame,
    shock_years=DEFAULT_SHOCK_YEARS,
    min_datapoints: int = MIN_DATAPOINTS_PER_PROXY,
) -> pd.DataFrame:
    """
    Validate, annualize, mark shock years, and add transformed target ``y``.

    Eligibility is based on unique observed years before interpolation. For
    each eligible ``proxy_id``, every missing calendar year between its first
    and latest observation is filled by raw-scale linear interpolation. These
    estimated values then participate in diagnostics and modeling exactly like
    observed historical values.
    """
    df = attach_proxy_config(timeseries_df, proxy_config, min_datapoints=min_datapoints)
    df = _interpolate_annual_values(df)
    df = df.copy()
    df["year"] = df["year"].astype(int)
    df["proxy_id"] = df["proxy_id"].astype(str)
    df["is_shock_year"] = df["year"].isin(set(shock_years))

    # Shock-year rows stay in the data, but DOWNWEIGHT proxies give those years
    # half influence when fitting the local trend.
    df["sample_weight"] = 1.0
    downweight_mask = df["is_shock_year"] & (df["shock_year_policy"] == "DOWNWEIGHT")
    df.loc[downweight_mask, "sample_weight"] = 0.5

    df = add_transformed_target(df)
    df = df.sort_values(["id", "market", "year"]).reset_index(drop=True)
    return df
