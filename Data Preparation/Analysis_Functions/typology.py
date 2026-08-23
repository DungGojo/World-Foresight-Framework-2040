"""Group the 34 countries into archetypes on a set of indicators.

Used wherever the answer is "there is no single world, there are N kinds of
country": technology producers vs consumers, ageing vs youth-bulge societies,
adapters vs exposed. K-means is implemented directly on z-scores (fixed seed,
k-means++ start) so the project keeps its pandas/numpy-only dependency set.

The profile table is the point of the output — it says what each cluster IS,
in standard deviations from the world average.
"""

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"id", "market", "value"}
EPS = 1e-9


def _feature_table(forecast_df: pd.DataFrame, indicator_ids: list[str], exclude) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(forecast_df.columns)
    if missing:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing)}")
    df = forecast_df[["id", "market", "value"]].copy()
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df[df["id"].isin(indicator_ids) & ~df["market"].isin(exclude)]
    wide = df.pivot_table(index="market", columns="id", values="value", aggfunc="mean")
    wide = wide.reindex(columns=[c for c in indicator_ids if c in wide.columns])
    # a market missing an indicator is filled at the world average, i.e. z = 0
    return wide.apply(lambda c: c.fillna(c.mean()))


def _kmeans(x: np.ndarray, k: int, seed: int = 0, n_init: int = 10, max_iter: int = 300):
    rng = np.random.default_rng(seed)
    best_labels, best_centres, best_inertia = None, None, np.inf
    for _ in range(n_init):
        # k-means++ seeding
        centres = [x[rng.integers(len(x))]]
        for _ in range(1, k):
            d2 = np.min(((x[:, None, :] - np.array(centres)[None]) ** 2).sum(-1), axis=1)
            probs = d2 / (d2.sum() + EPS)
            centres.append(x[rng.choice(len(x), p=probs)])
        centres = np.array(centres)

        labels = np.zeros(len(x), dtype=int)
        for _ in range(max_iter):
            dist = ((x[:, None, :] - centres[None]) ** 2).sum(-1)
            new_labels = dist.argmin(axis=1)
            if (new_labels == labels).all():
                break
            labels = new_labels
            for j in range(k):
                if (labels == j).any():
                    centres[j] = x[labels == j].mean(axis=0)
        inertia = ((x - centres[labels]) ** 2).sum()
        if inertia < best_inertia:
            best_labels, best_centres, best_inertia = labels, centres, inertia
    return best_labels, best_centres


def typology(
    forecast_df: pd.DataFrame,
    indicator_ids: list[str],
    k: int = 4,
    invert_ids=(),
    exclude_markets=("GLO",),
    seed: int = 0,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Return (market -> cluster assignment, cluster profile in z-scores).

    invert_ids : proxies where a higher raw value is the adverse direction; they
        are sign-flipped so every feature reads "more is better".
    Clusters are numbered by size, largest first, so labels are stable to re-runs.
    """
    wide = _feature_table(forecast_df, list(indicator_ids), set(exclude_markets))
    if wide.empty:
        raise ValueError("No usable rows for the requested indicator_ids.")

    z = wide.apply(lambda c: (c - c.mean()) / (c.std(ddof=1) + EPS))
    for pid in invert_ids:
        if pid in z.columns:
            z[pid] = -z[pid]

    labels, _ = _kmeans(z.to_numpy(dtype=float), k=k, seed=seed)
    assign = pd.DataFrame({"market": z.index, "_raw": labels})

    order = assign["_raw"].value_counts().index.tolist()
    remap = {old: new for new, old in enumerate(order)}
    assign["cluster"] = assign["_raw"].map(remap)
    assign = assign.drop(columns="_raw")

    profile = (
        z.join(assign.set_index("market")["cluster"])
        .groupby("cluster")
        .mean()
        .round(2)
    )
    profile.insert(0, "n", assign["cluster"].value_counts().sort_index())
    profile["members"] = (
        assign.groupby("cluster")["market"].apply(lambda s: ", ".join(sorted(s)))
    )
    return assign.sort_values(["cluster", "market"]).reset_index(drop=True), profile
