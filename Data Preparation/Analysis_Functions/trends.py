"""Trend classification for global (GLO) institutional-health series.

Given a set of proxy ids on one slice (e.g. the GLO series), returns each
series' value at the anchor years and labels its 2025->2040 direction:

    rising / flat / declining   (by relative change vs a flat band)

Used for Q3: are treaty ratification (D11), ICJ acceptance (D10) and
peacekeeping (D12) strengthening, holding, or eroding to 2040?
"""

import warnings
import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "proxy_id", "year", "value", "scenario"}


def classify_trends(
    full_data: pd.DataFrame,
    proxy_ids: list[str],
    years=(2025, 2030, 2040),
    flat_band: float = 0.05,
    scenarios=("historical", "main_scenario"),
) -> pd.DataFrame:
    """Return per-series values at each anchor year + direction label.

    flat_band : relative-change magnitude (e.g. 0.05 = 5%) inside which a series
        counts as 'flat'. Above -> 'rising', below -> 'declining'.
    """
    missing = REQUIRED_COLUMNS - set(full_data.columns)
    if missing:
        raise ValueError(f"full_data is missing columns: {sorted(missing)}")
    df = full_data[full_data["scenario"].isin(scenarios)].copy()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce").astype("Int64")

    y0, ylast = years[0], years[-1]
    rows = []
    for pid in proxy_ids:
        sub = df[df["proxy_id"] == pid]
        vals = {}
        for y in years:
            r = sub[sub["year"] == y]["value"]
            vals[y] = float(r.iloc[0]) if len(r) else np.nan
        if pd.isna(vals[y0]) or pd.isna(vals[ylast]):
            warnings.warn(f"classify_trends: {pid} missing anchor years; skipped", stacklevel=2)
            continue
        change = vals[ylast] - vals[y0]
        pct = change / vals[y0] if abs(vals[y0]) > 1e-9 else np.nan
        direction = "rising" if pct > flat_band else ("declining" if pct < -flat_band else "flat")
        rec = {"proxy_id": pid}
        rec.update({f"y{y}": round(vals[y], 2) for y in years})
        rec["change"] = round(change, 2)
        rec["pct_change"] = round(pct * 100, 1)
        rec["direction"] = direction
        rows.append(rec)
    return pd.DataFrame(rows)


def growth_profile(
    full_data: pd.DataFrame,
    proxy_ids: list[str],
    market: str = "GLO",
    years=(2025, 2040),
    scenarios=("historical", "main_scenario"),
    history_start: int | None = 2010,
) -> pd.DataFrame:
    """CAGR and doubling time for exponential-ish series (frontier compute, emissions, GDP).

    Reports the historical growth rate alongside the forecast one, because the
    interesting question for a frontier series is usually whether the model
    expects the past rate to continue or to bend.
    """
    df = full_data[full_data["scenario"].isin(scenarios)].copy()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df = df[df["market"] == market].dropna(subset=["value", "year"])

    def _cagr(sub, y0, y1):
        a = sub.loc[sub["year"] == y0, "value"]
        b = sub.loc[sub["year"] == y1, "value"]
        if not len(a) or not len(b) or float(a.iloc[0]) <= 0 or float(b.iloc[0]) <= 0:
            return np.nan
        return ((float(b.iloc[0]) / float(a.iloc[0])) ** (1 / (y1 - y0)) - 1) * 100

    y0, y1 = years[0], years[-1]
    rows = []
    for pid in proxy_ids:
        sub = df[df["id"] == pid]
        if sub.empty:
            warnings.warn(f"growth_profile: {pid} not found for {market}; skipped", stacklevel=2)
            continue
        fwd = _cagr(sub, y0, y1)
        hist = _cagr(sub, history_start, y0) if history_start else np.nan
        with np.errstate(divide="ignore", invalid="ignore"):
            doubling = np.log(2) / np.log(1 + fwd / 100) if fwd and fwd > 0 else np.nan
        rows.append(
            {
                "proxy_id": pid,
                f"v{y0}": round(float(sub.loc[sub['year'] == y0, 'value'].iloc[0]), 4)
                if len(sub.loc[sub["year"] == y0]) else np.nan,
                f"v{y1}": round(float(sub.loc[sub['year'] == y1, 'value'].iloc[0]), 4)
                if len(sub.loc[sub["year"] == y1]) else np.nan,
                "hist_cagr_pct": round(hist, 1) if pd.notna(hist) else np.nan,
                "fwd_cagr_pct": round(fwd, 1) if pd.notna(fwd) else np.nan,
                "doubling_years": round(doubling, 1) if pd.notna(doubling) else np.nan,
                "multiple": round(
                    float(sub.loc[sub["year"] == y1, "value"].iloc[0])
                    / float(sub.loc[sub["year"] == y0, "value"].iloc[0]), 1
                ) if len(sub.loc[sub["year"] == y0]) and len(sub.loc[sub["year"] == y1])
                and float(sub.loc[sub["year"] == y0, "value"].iloc[0]) != 0 else np.nan,
            }
        )
    return pd.DataFrame(rows)
