"""Share-of-world analysis functions.

This analysis converts selected proxy values from one already-filtered analysis
slice into each market's share of the configured market universe, then ranks
markets by their average proxy share.
"""

import warnings

import numpy as np
import pandas as pd


REQUIRED_COLUMNS = {"id", "market", "value"}
RANKING_COLUMNS = ["market", "average_share", "rank"]
HHI_COLUMNS = ["id", "hhi", "effective_markets"]
EPS = 1e-9


def _prepare_input(
    forecast_df: pd.DataFrame,
    proxy_ids: list[str],
) -> pd.DataFrame:
    missing_cols = REQUIRED_COLUMNS - set(forecast_df.columns)
    if missing_cols:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing_cols)}")
    if not proxy_ids:
        raise ValueError("proxy_ids must contain at least one proxy id.")

    df = forecast_df[["id", "market", "value"]].copy()
    df["id"] = df["id"].astype(str).str.strip()
    df["market"] = df["market"].astype(str).str.strip()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")

    requested_ids = [str(proxy_id).strip() for proxy_id in proxy_ids]
    df = df[df["id"].isin(requested_ids)].dropna(subset=["id", "market", "value"])
    if df.empty:
        raise ValueError(f"No usable rows found for proxy_ids={requested_ids}.")

    available_ids = sorted(set(df["id"]) & set(requested_ids))
    missing_ids = sorted(set(requested_ids) - set(available_ids))
    if missing_ids:
        warnings.warn(
            f"Skipping proxies not found in forecast_df: {missing_ids}",
            stacklevel=2,
        )

    negative_ids = sorted(df.loc[df["value"] < 0, "id"].unique())
    if negative_ids:
        raise ValueError(
            "Share-of-world requires non-negative values. "
            f"Found negative values for proxies: {negative_ids}."
        )
    return df


def _share_table(df: pd.DataFrame) -> pd.DataFrame:
    totals = df.groupby("id")["value"].transform("sum")
    df = df.copy()
    df["share"] = np.where(totals > EPS, df["value"] / totals * 100, np.nan)
    df = df.dropna(subset=["share"])
    if df.empty:
        raise ValueError("All selected proxies have zero or missing totals.")
    return df


def _rank_from_shares(share_df: pd.DataFrame) -> pd.DataFrame:
    share_wide = (
        share_df.pivot_table(index="market", columns="id", values="share", aggfunc="mean")
        .sort_index()
    )
    out = pd.DataFrame(
        {
            "market": share_wide.index,
            "average_share": share_wide.mean(axis=1, skipna=True).to_numpy(dtype=float),
        }
    )
    out["rank"] = out["average_share"].rank(method="min", ascending=False, na_option="bottom")
    out["rank"] = out["rank"].astype(int)
    return out[RANKING_COLUMNS].sort_values(["rank", "market"]).reset_index(drop=True)


def _hhi_from_shares(share_df: pd.DataFrame) -> pd.DataFrame:
    hhi = share_df.groupby("id")["share"].apply(lambda s: float(np.square(s).sum()))
    out = hhi.rename("hhi").reset_index()
    out["effective_markets"] = np.where(out["hhi"] > EPS, 10000 / out["hhi"], np.nan)
    return out[HHI_COLUMNS].sort_values("id").reset_index(drop=True)


def analyze_share_of_world(
    forecast_df: pd.DataFrame,
    proxy_ids: list[str],
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Return market ranking, proxy HHI, and per-proxy market shares.

    The main ranking uses each market's equal-weighted average share across the
    selected proxies. HHI is returned as a proxy-level concentration diagnostic.
    """
    df = _prepare_input(forecast_df, proxy_ids)
    share_df = _share_table(df)
    ranking_df = _rank_from_shares(share_df)
    hhi_df = _hhi_from_shares(share_df)
    share_detail_df = share_df[["id", "market", "share"]].copy()
    share_detail_df["rank"] = share_detail_df.groupby("id")["share"].rank(
        method="min",
        ascending=False,
    )
    share_detail_df["rank"] = share_detail_df["rank"].astype(int)
    share_detail_df = share_detail_df.sort_values(
        ["rank", "id", "market"],
        ascending=[True, True, True],
    )
    return (
        ranking_df,
        hhi_df,
        share_detail_df.reset_index(drop=True),
    )
