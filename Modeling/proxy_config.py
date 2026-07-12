"""
Proxy configuration validation for the forecasting pipeline.
"""

import pandas as pd


REQUIRED_CONFIG_COLUMNS = [
    "id",
    "proxy_type",
    "lower_bound",
    "upper_bound",
    "allow_negative",
    "shock_year_policy",
]

ALLOWED_PROXY_TYPES = {
    "BOUNDED",
    "UNBOUNDED",
    "SEM_BOUNDED",
}

ALLOWED_SHOCK_POLICIES = {"IGNORE", "DOWNWEIGHT"}

MIN_DATAPOINTS_PER_PROXY = 5


def _normalize_token(value) -> str:
    return str(value).strip().upper()


def _to_bool(value) -> bool:
    """Accept spreadsheet-friendly booleans like TRUE/FALSE/yes/no/1/0."""
    if isinstance(value, bool):
        return value
    if pd.isna(value):
        return False
    text = str(value).strip().lower()
    if text in {"true", "t", "yes", "y", "1"}:
        return True
    if text in {"false", "f", "no", "n", "0"}:
        return False
    raise ValueError(f"Cannot parse allow_negative value as boolean: {value!r}")


def validate_proxy_config(
    proxy_config: pd.DataFrame,
    timeseries_df: pd.DataFrame | None = None,
    min_datapoints: int = MIN_DATAPOINTS_PER_PROXY,
) -> pd.DataFrame:
    """
    Validate and normalize the proxy configuration table.

    Required columns:
        id, proxy_type, lower_bound, upper_bound, allow_negative, shock_year_policy
    """
    missing = set(REQUIRED_CONFIG_COLUMNS) - set(proxy_config.columns)
    if missing:
        raise ValueError(f"proxy_config is missing required columns: {sorted(missing)}")

    cfg = proxy_config[REQUIRED_CONFIG_COLUMNS].copy()
    cfg["id"] = cfg["id"].astype(str).str.strip()
    cfg["proxy_type"] = cfg["proxy_type"].map(_normalize_token)
    cfg["shock_year_policy"] = cfg["shock_year_policy"].map(_normalize_token)
    cfg["lower_bound"] = pd.to_numeric(cfg["lower_bound"], errors="coerce")
    cfg["upper_bound"] = pd.to_numeric(cfg["upper_bound"], errors="coerce")
    cfg["allow_negative"] = cfg["allow_negative"].map(_to_bool)

    if cfg["id"].duplicated().any():
        duplicates = sorted(cfg.loc[cfg["id"].duplicated(), "id"].unique())
        raise ValueError(f"proxy_config contains duplicate ids: {duplicates}")

    invalid_types = sorted(set(cfg["proxy_type"]) - ALLOWED_PROXY_TYPES)
    if invalid_types:
        raise ValueError(
            "Invalid proxy_type values. "
            f"Allowed: {sorted(ALLOWED_PROXY_TYPES)}. Found: {invalid_types}"
        )

    invalid_policies = sorted(set(cfg["shock_year_policy"]) - ALLOWED_SHOCK_POLICIES)
    if invalid_policies:
        raise ValueError(
            "Invalid shock_year_policy values. "
            f"Allowed: {sorted(ALLOWED_SHOCK_POLICIES)}. Found: {invalid_policies}"
        )

    bounded = cfg["upper_bound"].notna() & cfg["lower_bound"].notna()
    bad_bounds = bounded & (cfg["upper_bound"] <= cfg["lower_bound"])
    if bad_bounds.any():
        examples = cfg.loc[bad_bounds, ["id", "lower_bound", "upper_bound"]].to_dict("records")
        raise ValueError(f"upper_bound must be greater than lower_bound: {examples}")

    bounded_missing = (cfg["proxy_type"] == "BOUNDED") & ~bounded
    if bounded_missing.any():
        examples = cfg.loc[bounded_missing, ["id", "lower_bound", "upper_bound"]].to_dict("records")
        raise ValueError(f"BOUNDED proxy_type requires both lower_bound and upper_bound: {examples}")

    one_sided = cfg["lower_bound"].notna() ^ cfg["upper_bound"].notna()
    sem_bounded_bad = (cfg["proxy_type"] == "SEM_BOUNDED") & ~one_sided
    if sem_bounded_bad.any():
        examples = cfg.loc[sem_bounded_bad, ["id", "lower_bound", "upper_bound"]].to_dict("records")
        raise ValueError(f"SEM_BOUNDED proxy_type requires exactly one finite bound: {examples}")

    unbounded_with_bounds = (cfg["proxy_type"] == "UNBOUNDED") & (
        cfg["lower_bound"].notna() | cfg["upper_bound"].notna()
    )
    if unbounded_with_bounds.any():
        examples = cfg.loc[unbounded_with_bounds, ["id", "lower_bound", "upper_bound"]].to_dict("records")
        raise ValueError(f"UNBOUNDED proxy_type should not define lower_bound or upper_bound: {examples}")

    if timeseries_df is not None and min_datapoints > 0:
        required_timeseries_cols = {"id", "year", "value"}
        missing_timeseries_cols = required_timeseries_cols - set(timeseries_df.columns)
        if missing_timeseries_cols:
            raise ValueError(
                "timeseries_df is missing required columns for datapoint validation: "
                f"{sorted(missing_timeseries_cols)}"
            )

        ts = timeseries_df[["id", "year", "value"]].copy()
        ts["id"] = ts["id"].astype(str).str.strip()
        ts["year"] = pd.to_numeric(ts["year"], errors="coerce")
        ts["value"] = pd.to_numeric(ts["value"], errors="coerce")
        datapoint_counts = (
            ts.dropna(subset=["id", "year", "value"])
            .groupby("id")
            .size()
        )
        keep_ids = set(datapoint_counts[datapoint_counts >= min_datapoints].index)
        cfg = cfg[cfg["id"].isin(keep_ids)].copy()

    return cfg.reset_index(drop=True)
