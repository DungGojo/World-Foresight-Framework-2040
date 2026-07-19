"""World-level direction analysis.

Aggregates per-country proxy values into a single WORLD figure, power-weighted so
that great powers count more than micro-states (a plain average would let 34
countries drown out the US/China signal). Power weight = each market's composite
share across the weight proxies (default D1/D2/D4/D5, the additive power proxies).

Used for Q2 part 2: is the world's centre of gravity drifting West or East
(D6 alignment ideal point), and is the global arms trade shifting West vs East
(D7_2 / D7_3)?
"""

import warnings
import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "value"}
EPS = 1e-9


def _prepare(forecast_df: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(forecast_df.columns)
    if missing:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing)}")
    df = forecast_df[["id", "market", "value"]].copy()
    df["id"] = df["id"].astype(str).str.strip()
    df["market"] = df["market"].astype(str).str.strip()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna(subset=["id", "market", "value"])


def _power_weights(df: pd.DataFrame, weight_ids) -> pd.Series:
    w = df[df["id"].isin(weight_ids)].pivot_table(index="market", columns="id", values="value")
    shares = w.apply(lambda c: c / c.sum() * 100.0)   # each proxy's world share
    return shares.mean(axis=1)                          # composite power-share per market


def world_direction(
    forecast_df: pd.DataFrame,
    index_ids: list[str],
    weight_ids=("D1", "D2", "D4", "D5"),
) -> pd.DataFrame:
    """Return power-weighted and unweighted world means for each index proxy."""
    df = _prepare(forecast_df)
    weight = _power_weights(df, list(weight_ids))
    piv = df[df["id"].isin(index_ids)].pivot_table(index="market", columns="id", values="value")

    rows = []
    for iid in index_ids:
        if iid not in piv.columns:
            warnings.warn(f"world_direction: {iid} not found; skipped", stacklevel=2)
            continue
        v = piv[iid]
        w = weight.reindex(v.index)
        mask = v.notna() & w.notna() & (w > 0)
        wmean = float((v[mask] * w[mask]).sum() / (w[mask].sum() + EPS))
        rows.append({"id": iid, "weighted_mean": round(wmean, 3),
                     "unweighted_mean": round(float(v[mask].mean()), 3)})
    return pd.DataFrame(rows)
