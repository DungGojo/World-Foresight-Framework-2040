"""How many countries cross a meaningful line by 2040 — and which ones.

Levels and averages hide the thing that actually changes behaviour: a country
passing 20% over-65, 100% debt-to-GDP, or 60 days a year above 35C. This counts
crossings at each anchor year and names the movers.
"""

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "year", "value", "scenario"}


def _slice(full_data: pd.DataFrame, year: int, scenario: str, proxy_id: str, exclude) -> pd.Series:
    scenarios = ["historical", scenario] if year <= 2025 else [scenario]
    df = full_data[
        (full_data["year"] == year)
        & (full_data["scenario"].isin(scenarios))
        & (full_data["id"] == proxy_id)
        & (~full_data["market"].isin(exclude))
    ].copy()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna(subset=["value"]).set_index("market")["value"]


def threshold_crossing(
    full_data: pd.DataFrame,
    proxy_id: str,
    threshold: float,
    years=(2025, 2030, 2040),
    direction: str = "above",
    scenario: str = "main_scenario",
    exclude_markets=("GLO",),
) -> tuple[pd.DataFrame, list[str]]:
    """Return (count per anchor year, markets that newly cross between first and last).

    direction : 'above' counts markets at or over the threshold, 'below' counts
        markets at or under it.
    """
    missing = REQUIRED_COLUMNS - set(full_data.columns)
    if missing:
        raise ValueError(f"full_data is missing columns: {sorted(missing)}")
    if direction not in {"above", "below"}:
        raise ValueError("direction must be 'above' or 'below'")

    years = list(years)
    members, rows = {}, []
    for y in years:
        s = _slice(full_data, y, scenario, proxy_id, exclude_markets)
        hit = s >= threshold if direction == "above" else s <= threshold
        members[y] = sorted(s.index[hit])
        rows.append(
            {
                "year": y,
                "n_markets": int(len(s)),
                f"n_{direction}": int(hit.sum()),
                f"pct_{direction}": round(float(hit.mean() * 100), 1) if len(s) else np.nan,
            }
        )

    newly = sorted(set(members[years[-1]]) - set(members[years[0]]))
    counts = pd.DataFrame(rows)
    counts.attrs["members"] = members
    return counts, newly


def threshold_matrix(
    full_data: pd.DataFrame,
    specs: dict,
    years=(2025, 2040),
    scenario: str = "main_scenario",
) -> pd.DataFrame:
    """Run several threshold tests at once.

    specs is {label: (proxy_id, threshold, direction)}.
    """
    rows = []
    for label, (pid, thr, direction) in specs.items():
        counts, newly = threshold_crossing(
            full_data, pid, thr, years=years, direction=direction, scenario=scenario
        )
        col = f"n_{direction}"
        rec = {"test": label, "proxy_id": pid, "threshold": thr, "direction": direction}
        rec.update({f"n_{y}": int(counts.loc[counts["year"] == y, col].iloc[0]) for y in years})
        rec["change"] = rec[f"n_{years[-1]}"] - rec[f"n_{years[0]}"]
        rec["newly_crossing"] = ", ".join(newly)
        rows.append(rec)
    return pd.DataFrame(rows)
