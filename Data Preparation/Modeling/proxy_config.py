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
}

ALLOWED_SHOCK_POLICIES = {"IGNORE", "DOWNWEIGHT"}

# Counts unique observed years per country-proxy series before interpolation.
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


def normalize_timeseries_keys(timeseries_df: pd.DataFrame) -> pd.DataFrame:
    """Normalize and repair the ``id``/``proxy_id`` modeling keys.

    Historical Data occasionally contains visually grouped Excel rows where
    one of the two keys is blank. ``proxy_id`` follows ``{id}_{market}``, so
    the missing key can be reconstructed without changing the observation.
    Rows that still cannot be identified are left missing for the caller to
    reject or discard.
    """
    required = {"id", "proxy_id"}
    missing = required - set(timeseries_df.columns)
    if missing:
        raise ValueError(
            "timeseries_df is missing required key columns: "
            f"{sorted(missing)}"
        )

    df = timeseries_df.copy()
    for column in ("id", "proxy_id"):
        df[column] = df[column].astype("string").str.strip().replace("", pd.NA)

    if "market" in df.columns:
        df["market"] = (
            df["market"].astype("string").str.strip().replace("", pd.NA)
        )

        missing_proxy_id = (
            df["proxy_id"].isna() & df["id"].notna() & df["market"].notna()
        )
        df.loc[missing_proxy_id, "proxy_id"] = (
            df.loc[missing_proxy_id, "id"]
            + "_"
            + df.loc[missing_proxy_id, "market"]
        )

        missing_id = (
            df["id"].isna() & df["proxy_id"].notna() & df["market"].notna()
        )
        if missing_id.any():
            proxy_ids = df.loc[missing_id, "proxy_id"]
            markets = df.loc[missing_id, "market"]
            suffixes = "_" + markets
            suffix_matches = pd.Series(
                [proxy.endswith(suffix) for proxy, suffix in zip(proxy_ids, suffixes)],
                index=proxy_ids.index,
            )
            if suffix_matches.any():
                matching_index = suffix_matches.index[suffix_matches]
                df.loc[matching_index, "id"] = [
                    proxy[: -len(suffix)]
                    for proxy, suffix in zip(
                        proxy_ids.loc[matching_index], suffixes.loc[matching_index]
                    )
                ]
    else:
        missing_id = df["id"].isna() & df["proxy_id"].notna()
        df.loc[missing_id, "id"] = df.loc[missing_id, "proxy_id"].str.rsplit(
            "_", n=1
        ).str[0]

    return df


def validate_proxy_config(
    proxy_config: pd.DataFrame,
    timeseries_df: pd.DataFrame | None = None,
    min_datapoints: int = MIN_DATAPOINTS_PER_PROXY,
) -> pd.DataFrame:
    """
    Validate and normalize the proxy configuration table.

    Required columns:
        id, proxy_type, lower_bound, upper_bound, allow_negative, shock_year_policy

    When time-series data are supplied, normalize their keys and reject
    duplicate ``(proxy_id, year)`` observations. Minimum-history filtering is
    deliberately not applied to the configuration table: it belongs to the
    country-series level and is performed by ``prepare_data`` per
    ``proxy_id``. This preserves the parent ``id`` and its other countries.
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

    unbounded_with_bounds = (cfg["proxy_type"] == "UNBOUNDED") & (
        cfg["lower_bound"].notna() | cfg["upper_bound"].notna()
    )
    if unbounded_with_bounds.any():
        examples = cfg.loc[unbounded_with_bounds, ["id", "lower_bound", "upper_bound"]].to_dict("records")
        raise ValueError(f"UNBOUNDED proxy_type should not define lower_bound or upper_bound: {examples}")

    if timeseries_df is not None:
        required_timeseries_cols = {"id", "proxy_id", "year", "value"}
        missing_timeseries_cols = required_timeseries_cols - set(timeseries_df.columns)
        if missing_timeseries_cols:
            raise ValueError(
                "timeseries_df is missing required columns for series validation: "
                f"{sorted(missing_timeseries_cols)}"
            )

        validation_columns = ["id", "proxy_id", "year", "value"]
        if "market" in timeseries_df.columns:
            validation_columns.append("market")
        ts = normalize_timeseries_keys(timeseries_df[validation_columns])
        ts["year"] = pd.to_numeric(ts["year"], errors="coerce")
        ts["value"] = pd.to_numeric(ts["value"], errors="coerce")
        ts = ts.dropna(subset=["id", "proxy_id", "year", "value"])

        duplicate_mask = ts.duplicated(["proxy_id", "year"], keep=False)
        if duplicate_mask.any():
            examples = (
                ts.loc[duplicate_mask, ["id", "proxy_id", "year", "value"]]
                .sort_values(["proxy_id", "year"])
                .head(20)
                .to_dict("records")
            )
            raise ValueError(
                "timeseries_df contains duplicate (proxy_id, year) observations. "
                "Remove the duplicates at source before modeling. "
                f"Examples: {examples}"
            )

    return cfg.reset_index(drop=True)
