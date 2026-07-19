"""Alignment tilt & hedging analysis.

For a set of two-sided "domains" — each a West-side vs East-side proxy pair
(e.g. UN-vote agreement with the USA vs China, or trade share with the USA vs
China) — this computes, per market:

    domain tilt    = west_value - east_value          (>0 leans West, <0 leans East)
    domain balance = 2 * min(west, east) / (west + east)   (0 = one-sided ... 1 = evenly split)

then the equal-weighted composite tilt and balance across domains, and labels
each market's lean (West / East / Neutral) and posture:

    Aligned-West / Aligned-East : |composite tilt| >= align_threshold
    Hedging                     : near-neutral tilt AND high balance (engages both)
    Autonomous                  : near-neutral tilt AND low balance (engages neither)

Input contract: an already year/scenario-filtered long dataframe with columns
{id, market, value} (same slice style as market_relevance / share_of_world).
Anchor markets that lack a side (e.g. the USA has no "agreement with the USA")
get NaN tilt and posture "n/a".
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

def cluster_to_anchor(
    forecast_df: pd.DataFrame,
    anchors: dict | None = None,
    exclude_anchor_markets: bool = True,
) -> pd.DataFrame:
    """
    Assign each market to the anchor power it is *disproportionately* closest to,
    using UN-vote agreement (D8) and trade share (D9).

    Method (nearest-anchor / nearest-centroid, not k-means):
      1. build the feature table: for each anchor A, votes_A (D8) and trade_A (D9);
      2. z-score every feature across markets (so % agreement and % trade are
         comparable, and "closeness" is measured relative to the average country);
      3. proximity(market, A) = mean(z_votes_A, z_trade_A);
      4. self-anchor proximity is set to missing (e.g. CHN vs CHN is not meaningful);
      5. cluster = argmax_A proximity; margin = top1 - top2 (assignment confidence).

    Parameters
    ----------
    anchors : {label: (votes_id, trade_id)}; default US/CN/RU/IN.
    exclude_anchor_markets : drop the anchor countries themselves (they ARE the poles
        and their self-agreement/-trade is degenerate).
    """
    if anchors is None:
        anchors = {
            "USA": ("D8_1", "D9_1"),
            "CHN": ("D8_2", "D9_2"),
            "RUS": ("D8_3", "D9_3"),
            "IND": ("D8_4", "D9_4"),
        }
    anchor_market = {label: label for label in anchors}
    anchor_market.update({"USA": "USA", "CHN": "CHN", "RUS": "RUS", "IND": "IND"})

    needed = {pid for pair in anchors.values() for pid in pair}
    df = _prepare(forecast_df)
    wide = df[df["id"].isin(needed)].pivot_table(
        index="market", columns="id", values="value", aggfunc="mean"
    )

    # z-score each feature across markets
    z = wide.apply(lambda col: (col - col.mean()) / (col.std(ddof=1) + EPS))

    prox = pd.DataFrame(index=wide.index)
    for label, (votes_id, trade_id) in anchors.items():
        parts = [z[c] for c in (votes_id, trade_id) if c in z.columns]
        prox[label] = pd.concat(parts, axis=1).mean(axis=1) if parts else np.nan

    for label, market in anchor_market.items():
        if label in prox.columns and market in prox.index:
            prox.loc[market, label] = np.nan

    if exclude_anchor_markets:
        prox = prox.drop(index=[m for m in anchor_market.values() if m in prox.index], errors="ignore")

    rows = []
    for market, row in prox.iterrows():
        ranked = row.dropna().sort_values(ascending=False)
        if ranked.empty:
            continue
        cluster = ranked.index[0]
        margin = float(ranked.iloc[0] - ranked.iloc[1]) if len(ranked) > 1 else np.nan
        rec = {"market": market, "cluster": cluster, "proximity": round(float(ranked.iloc[0]), 3),
               "margin": round(margin, 3)}
        for label in anchors:
            value = row.get(label, np.nan)
            rec[f"prox_{label}"] = None if pd.isna(value) else round(float(value), 2)
        rows.append(rec)

    out = pd.DataFrame(rows)
    return out.sort_values(["cluster", "proximity"], ascending=[True, False]).reset_index(drop=True)
