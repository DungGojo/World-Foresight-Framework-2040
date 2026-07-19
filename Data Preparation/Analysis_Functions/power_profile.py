"""Power-type analysis for additive, world-total indicators.

These helpers are used for Q4-style questions where one analytical "lever"
can contain one proxy or a group of proxies. For grouped money indicators, rows
are converted back to base units before summing, so USD millions and USD
billions are compared correctly.
"""

import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "value"}
EPS = 1e-9
UNIT_MULTIPLIERS = {
    "THOUSANDS": 1_000,
    "MILLIONS": 1_000_000,
    "BILLIONS": 1_000_000_000,
    "TRILLIONS": 1_000_000_000_000,
}


def _prepare(forecast_df: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(forecast_df.columns)
    if missing:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing)}")

    keep_cols = ["id", "market", "value"]
    for optional_col in ["metric", "labels"]:
        if optional_col in forecast_df.columns:
            keep_cols.append(optional_col)

    df = forecast_df[keep_cols].copy()
    df["id"] = df["id"].astype(str).str.strip()
    df["market"] = df["market"].astype(str).str.strip()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna(subset=["id", "market", "value"])


def _as_list(value) -> list:
    return [value] if isinstance(value, str) else list(value)


def _value_multiplier(row) -> int:
    metric = str(row.get("metric", "")).strip().upper()
    if metric in UNIT_MULTIPLIERS:
        return UNIT_MULTIPLIERS[metric]

    labels = str(row.get("labels", "")).strip().lower()
    for word, multiplier in [
        ("thousand", 1_000),
        ("million", 1_000_000),
        ("billion", 1_000_000_000),
        ("trillion", 1_000_000_000_000),
    ]:
        if word in labels:
            return multiplier
    return 1


def _with_base_value(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["base_value"] = out["value"] * out.apply(_value_multiplier, axis=1)
    return out


def power_type_growth(
    start_data: pd.DataFrame,
    end_data: pd.DataFrame,
    power_levers: dict,
) -> pd.DataFrame:
    """Calculate world-total growth for each power lever.

    power_levers is {power_type: proxy_id_or_list}. Each proxy group is summed
    after converting values to base units.
    """
    start = _with_base_value(_prepare(start_data))
    end = _with_base_value(_prepare(end_data))

    rows = []
    for power_type, proxy_ids in power_levers.items():
        proxy_ids = _as_list(proxy_ids)
        start_total = float(start.loc[start["id"].isin(proxy_ids), "base_value"].sum())
        end_total = float(end.loc[end["id"].isin(proxy_ids), "base_value"].sum())
        growth_pct = ((end_total / start_total) - 1) * 100 if start_total else pd.NA
        rows.append({
            "power_type": power_type,
            "proxy_ids": ", ".join(proxy_ids),
            "world_total_start": start_total,
            "world_total_end": end_total,
            "growth_pct": growth_pct,
        })

    return pd.DataFrame(rows).sort_values("growth_pct", ascending=False).reset_index(drop=True)


def power_profile(forecast_df: pd.DataFrame, power_levers: dict) -> pd.DataFrame:
    """Calculate each market's share and signature power lever.

    power_levers is {lever: proxy_id_or_list}. A lever's market share is based
    on the sum of its base-unit proxy values, not the mean of proxy shares.
    """
    df = _with_base_value(_prepare(forecast_df))
    shares = []
    for lever, proxy_ids in power_levers.items():
        proxy_ids = _as_list(proxy_ids)
        market_total = df.loc[df["id"].isin(proxy_ids)].groupby("market")["base_value"].sum()
        world_total = market_total.sum()
        if world_total:
            shares.append((market_total / world_total * 100).rename(f"{lever}_share"))

    if not shares:
        return pd.DataFrame(columns=["market"])

    out = pd.concat(shares, axis=1).reset_index().rename(columns={"index": "market"})
    share_cols = [col for col in out.columns if col.endswith("_share")]
    out[share_cols] = out[share_cols].fillna(0)
    out["average_share"] = out[share_cols].mean(axis=1)

    specialisation = out[share_cols].div(out["average_share"].replace(0, pd.NA) + EPS, axis=0)
    out["signature"] = specialisation.idxmax(axis=1).str.replace("_share", "", regex=False)
    out["specialisation"] = specialisation.max(axis=1)

    round_cols = share_cols + ["average_share", "specialisation"]
    out[round_cols] = out[round_cols].round(2)
    return out.sort_values("average_share", ascending=False).reset_index(drop=True)
