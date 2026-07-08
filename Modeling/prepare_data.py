"""
Data preparation for forecasting.
"""

import pandas as pd

from .proxy_config import MIN_DATAPOINTS_PER_PROXY, validate_proxy_config
from .transforms import add_transformed_target

# 2020: COVID shock
# 2022: Ukraine war shock
# 2025: tariff shock
DEFAULT_SHOCK_YEARS = (2020, 2022, 2025)


def _filter_min_datapoints(df: pd.DataFrame, min_datapoints: int) -> pd.DataFrame:
    if min_datapoints <= 0:
        return df
    count_frame = df[["proxy_id", "date", "value"]].copy()
    count_frame["date"] = pd.to_numeric(count_frame["date"], errors="coerce")
    count_frame["value"] = pd.to_numeric(count_frame["value"], errors="coerce")
    counts = (
        count_frame.dropna(subset=["proxy_id", "date", "value"])
        .groupby("proxy_id")
        .size()
    )
    keep_proxy_ids = set(counts[counts >= min_datapoints].index)
    return df[df["proxy_id"].isin(keep_proxy_ids)].copy()


def attach_proxy_config(
    timeseries_df: pd.DataFrame,
    proxy_config: pd.DataFrame,
    min_datapoints: int = MIN_DATAPOINTS_PER_PROXY,
) -> pd.DataFrame:
    """Merge validated proxy config onto a long-format timeseries dataframe."""
    required = {"id", "proxy_id", "market", "date", "value"}
    missing = required - set(timeseries_df.columns)
    if missing:
        raise ValueError(f"timeseries_df is missing required columns: {sorted(missing)}")

    cfg = validate_proxy_config(
        proxy_config,
        timeseries_df=timeseries_df,
        min_datapoints=min_datapoints,
    )
    config_ids = set(proxy_config["id"].astype(str).str.strip())

    df = timeseries_df.copy()
    df["id"] = df["id"].astype(str).str.strip()

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
    Validate, merge config, mark shock years, and add transformed target `y`.
    """
    df = attach_proxy_config(timeseries_df, proxy_config, min_datapoints=min_datapoints)
    df = df.copy()
    df["date"] = pd.to_numeric(df["date"], errors="coerce").astype("Int64")
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df.dropna(subset=["id", "proxy_id", "market", "date", "value"])
    df["date"] = df["date"].astype(int)
    df["proxy_id"] = df["proxy_id"].astype(str)
    df["is_shock_year"] = df["date"].isin(set(shock_years))

    # Shock-year rows stay in the data, but DOWNWEIGHT proxies give those years
    # half influence when fitting the local trend.
    df["sample_weight"] = 1.0
    downweight_mask = df["is_shock_year"] & (df["shock_year_policy"] == "DOWNWEIGHT")
    df.loc[downweight_mask, "sample_weight"] = 0.5

    df = add_transformed_target(df)
    df = df.sort_values(["id", "market", "date"]).reset_index(drop=True)
    return df
