"""Is the gap between countries widening or closing by 2040?

Nearly every topic has a "two-speed world" question — a technology divide, an
adaptation divide, a prosperity divide. This measures the cross-country spread
of a proxy at two anchor years and reports whether it converges or diverges.

Dispersion is reported three ways because they disagree usefully:
    cv          — spread relative to the mean (scale-free)
    p90_p10     — how far the top decile sits above the bottom decile (ratio)
    top_bot_gap — absolute gap between the top-5 and bottom-5 means
"""

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "year", "value", "scenario"}
EPS = 1e-9


def _slice(full_data: pd.DataFrame, year: int, scenario: str) -> pd.DataFrame:
    scenarios = ["historical", scenario] if year <= 2025 else [scenario]
    df = full_data[
        (full_data["year"] == year) & (full_data["scenario"].isin(scenarios))
    ].copy()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna(subset=["value"])


def _dispersion(values: pd.Series) -> dict:
    v = values.dropna()
    if len(v) < 4:
        return {"n": len(v), "mean": np.nan, "cv": np.nan, "p90_p10": np.nan, "top_bot_gap": np.nan}
    mean = float(v.mean())
    p90, p10 = float(v.quantile(0.9)), float(v.quantile(0.1))
    return {
        "n": len(v),
        "mean": mean,
        "cv": float(v.std(ddof=1) / (abs(mean) + EPS)),
        "p90_p10": p90 / p10 if abs(p10) > EPS else np.nan,
        "top_bot_gap": float(v.nlargest(5).mean() - v.nsmallest(5).mean()),
    }


def divergence(
    full_data: pd.DataFrame,
    proxy_ids,
    years=(2025, 2040),
    scenario: str = "main_scenario",
    exclude_markets=("GLO",),
    flat_band: float = 0.05,
) -> pd.DataFrame:
    """Per proxy: dispersion at each anchor year and a converging/diverging verdict.

    The verdict uses the coefficient of variation, so it is unaffected by the
    level of the indicator; flat_band is the relative change inside which the
    spread counts as unchanged.
    """
    missing = REQUIRED_COLUMNS - set(full_data.columns)
    if missing:
        raise ValueError(f"full_data is missing columns: {sorted(missing)}")

    proxy_ids = [proxy_ids] if isinstance(proxy_ids, str) else list(proxy_ids)
    y0, y1 = years[0], years[-1]
    slices = {y: _slice(full_data, y, scenario) for y in (y0, y1)}

    rows = []
    for pid in proxy_ids:
        rec = {"id": pid}
        stats = {}
        for y in (y0, y1):
            sub = slices[y]
            sub = sub[(sub["id"] == pid) & (~sub["market"].isin(exclude_markets))]
            stats[y] = _dispersion(sub.set_index("market")["value"])
            for k, v in stats[y].items():
                rec[f"{k}_{y}"] = v
        cv0, cv1 = stats[y0]["cv"], stats[y1]["cv"]
        rec["cv_change_pct"] = (cv1 / cv0 - 1) * 100 if cv0 and not np.isnan(cv0) else np.nan
        if np.isnan(rec["cv_change_pct"]):
            rec["verdict"] = "n/a"
        elif rec["cv_change_pct"] > flat_band * 100:
            rec["verdict"] = "diverging"
        elif rec["cv_change_pct"] < -flat_band * 100:
            rec["verdict"] = "converging"
        else:
            rec["verdict"] = "stable"
        rows.append(rec)

    out = pd.DataFrame(rows)
    num = out.select_dtypes(include=[float]).columns
    out[num] = out[num].round(3)
    return out


def gap_movers(
    full_data: pd.DataFrame,
    proxy_id: str,
    years=(2025, 2040),
    scenario: str = "main_scenario",
    exclude_markets=("GLO",),
) -> pd.DataFrame:
    """Each market's position relative to the world mean at both anchor years.

    Positive `rel_change` means the market pulled away from the pack; negative
    means it caught up (or fell back) toward it.
    """
    y0, y1 = years[0], years[-1]
    frames = {}
    for y in (y0, y1):
        sub = _slice(full_data, y, scenario)
        sub = sub[(sub["id"] == proxy_id) & (~sub["market"].isin(exclude_markets))]
        s = sub.set_index("market")["value"]
        frames[y] = s / (s.mean() + EPS)

    out = pd.DataFrame({f"rel_{y0}": frames[y0], f"rel_{y1}": frames[y1]})
    out["rel_change"] = out[f"rel_{y1}"] - out[f"rel_{y0}"]
    return out.round(3).sort_values("rel_change", ascending=False).reset_index()
