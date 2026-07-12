"""Market relevance ranking functions.

This analysis converts selected proxy values into comparable 0-100 scores and
ranks markets for one already-filtered analysis slice. The caller should filter
the desired year/scenario before calling this module.
"""

import warnings

import numpy as np
import pandas as pd


REQUIRED_FORECAST_COLUMNS = {"id", "market", "value"}
REQUIRED_CONFIG_COLUMNS = {"id", "direction"}
ALLOWED_DIRECTIONS = {"positive", "negative"}
OUTPUT_COLUMNS = ["market", "final_score", "rank"]
EPS = 1e-9


def standardize_to_100(values: np.ndarray) -> np.ndarray:
    """Z-score normalize values to a clipped 0-100 scale."""
    arr = np.asarray(values, dtype=float)
    out = np.full(arr.shape, np.nan, dtype=float)
    valid = ~np.isnan(arr)
    if valid.sum() == 0:
        return out
    if valid.sum() < 2:
        out[valid] = 50.0
        return out

    mean = float(np.nanmean(arr))
    std = float(np.nanstd(arr, ddof=1))
    if std < EPS:
        out[valid] = 50.0
        return out

    z = (arr[valid] - mean) / std
    out[valid] = np.clip((z + 2) / 4 * 100, 0, 100)
    return out


def _prepare_config(proxy_direction_config: list[dict] | pd.DataFrame) -> pd.DataFrame:
    cfg = pd.DataFrame(proxy_direction_config).copy()
    missing_cols = REQUIRED_CONFIG_COLUMNS - set(cfg.columns)
    if missing_cols:
        raise ValueError(f"proxy_direction_config is missing columns: {sorted(missing_cols)}")

    cfg = cfg[["id", "direction"]].copy()
    cfg["id"] = cfg["id"].astype(str).str.strip()
    cfg["direction"] = cfg["direction"].astype(str).str.lower().str.strip()

    invalid_direction = sorted(set(cfg["direction"]) - ALLOWED_DIRECTIONS)
    if invalid_direction:
        raise ValueError(
            "Invalid direction values. Expected 'positive' or 'negative'; "
            f"got {invalid_direction}."
        )
    if cfg["id"].duplicated().any():
        duplicated = sorted(cfg.loc[cfg["id"].duplicated(), "id"].unique())
        raise ValueError(f"Duplicate proxy ids in proxy_direction_config: {duplicated}")
    return cfg


def _prepare_forecast(forecast_df: pd.DataFrame) -> pd.DataFrame:
    missing_cols = REQUIRED_FORECAST_COLUMNS - set(forecast_df.columns)
    if missing_cols:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing_cols)}")

    df = forecast_df[["id", "market", "value"]].copy()
    df["id"] = df["id"].astype(str).str.strip()
    df["market"] = df["market"].astype(str).str.strip()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df.dropna(subset=["id", "market", "value"])
    if df.empty:
        raise ValueError("No usable rows found in forecast_df.")
    return df


def rank_market_relevance(
    forecast_df: pd.DataFrame,
    proxy_direction_config: list[dict] | pd.DataFrame,
) -> pd.DataFrame:
    """Rank markets using equal-weighted configured proxies for one input slice."""
    cfg = _prepare_config(proxy_direction_config)
    year_df = _prepare_forecast(forecast_df)

    requested_ids = cfg["id"].tolist()
    available_ids = sorted(set(year_df["id"]) & set(requested_ids))
    missing_ids = sorted(set(requested_ids) - set(available_ids))
    if missing_ids:
        warnings.warn(
            f"Skipping proxies not found in forecast_df: {missing_ids}",
            stacklevel=2,
        )
    if not available_ids:
        raise ValueError("No configured proxies were found in forecast_df.")

    cfg = cfg[cfg["id"].isin(available_ids)].copy()
    raw_wide = (
        year_df[year_df["id"].isin(available_ids)]
        .pivot_table(index="market", columns="id", values="value", aggfunc="mean")
        .reindex(columns=available_ids)
        .sort_index()
    )

    config_by_id = cfg.set_index("id")
    score_wide = pd.DataFrame(index=raw_wide.index)
    for proxy_id in raw_wide.columns:
        values = raw_wide[proxy_id].to_numpy(dtype=float)
        if config_by_id.loc[proxy_id, "direction"] == "negative":
            values = -values
        score_wide[proxy_id] = standardize_to_100(values)

    aggregated_score = score_wide.mean(axis=1, skipna=True).to_numpy(dtype=float)
    final_score = standardize_to_100(aggregated_score)

    out = pd.DataFrame({"market": raw_wide.index, "final_score": final_score})
    out["rank"] = out["final_score"].rank(method="min", ascending=False, na_option="bottom")
    out["rank"] = out["rank"].astype(int)
    return out[OUTPUT_COLUMNS].sort_values(["rank", "market"]).reset_index(drop=True)
