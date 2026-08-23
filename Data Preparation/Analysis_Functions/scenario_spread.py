"""How much does a 2040 finding depend on the scenario we picked?

Every headline number should be checked against the optimistic and pessimistic
runs. A finding that survives all three is structural; one that flips is an
assumption, and should be reported as a range instead of a point.
"""

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "year", "value", "scenario"}
SCENARIOS = ("main_scenario", "optimistic_scenario", "pessimistic_scenario")
EPS = 1e-9


def scenario_spread(
    full_data: pd.DataFrame,
    proxy_ids,
    year: int = 2040,
    markets=None,
    robust_band: float = 0.10,
) -> pd.DataFrame:
    """Per id/market: value under each scenario, the spread, and a robustness flag.

    robust_band : spread as a share of the main value below which the finding
        counts as scenario-robust.
    """
    missing = REQUIRED_COLUMNS - set(full_data.columns)
    if missing:
        raise ValueError(f"full_data is missing columns: {sorted(missing)}")

    proxy_ids = [proxy_ids] if isinstance(proxy_ids, str) else list(proxy_ids)
    df = full_data[
        (full_data["year"] == year)
        & (full_data["scenario"].isin(SCENARIOS))
        & (full_data["id"].isin(proxy_ids))
    ].copy()
    if markets is not None:
        markets = [markets] if isinstance(markets, str) else list(markets)
        df = df[df["market"].isin(markets)]
    df["value"] = pd.to_numeric(df["value"], errors="coerce")

    wide = df.pivot_table(index=["id", "market"], columns="scenario", values="value")
    wide = wide.reindex(columns=list(SCENARIOS)).reset_index()
    wide.columns = ["id", "market", "main", "optimistic", "pessimistic"]

    wide["spread"] = wide[["optimistic", "pessimistic"]].max(axis=1) - wide[
        ["optimistic", "pessimistic"]
    ].min(axis=1)
    wide["spread_pct"] = np.where(
        wide["main"].abs() > EPS, wide["spread"] / wide["main"].abs() * 100, np.nan
    )
    wide["scenario_robust"] = wide["spread_pct"] <= robust_band * 100
    return wide.sort_values(["id", "spread_pct"], ascending=[True, False]).reset_index(drop=True)


def ranking_stability(
    full_data: pd.DataFrame,
    proxy_ids,
    year: int = 2040,
    top_n: int = 10,
) -> pd.DataFrame:
    """Does the leaderboard change between scenarios?

    Ranks markets by the equal-weighted mean of their world share across
    proxy_ids under each scenario, then reports each market's best/worst rank.
    Only meaningful for additive, non-negative proxies.
    """
    spread = scenario_spread(full_data, proxy_ids, year=year)
    ranks = {}
    for scen in ["main", "optimistic", "pessimistic"]:
        piv = spread.pivot_table(index="market", columns="id", values=scen)
        shares = piv.apply(lambda col: col / col.sum() * 100)
        ranks[scen] = shares.mean(axis=1).rank(method="min", ascending=False)

    out = pd.DataFrame(ranks)
    out["best_rank"] = out.min(axis=1).astype(int)
    out["worst_rank"] = out.max(axis=1).astype(int)
    out["rank_swing"] = out["worst_rank"] - out["best_rank"]
    out = out.sort_values("main").head(top_n)
    return out.reset_index().rename(columns={"index": "market"})
