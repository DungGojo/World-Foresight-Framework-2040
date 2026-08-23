"""Cross the pressure a country faces with the capacity it has to absorb it.

The central distributional question in Planet, People and Economy is the same
shape: who is most exposed, and do the exposed countries have the means to cope?
This builds two 0-100 composite indices from the same slice and crosses them, so
"high exposure, low capacity" falls out as a named quadrant rather than a
hand-assembled list.

Both axes reuse `rank_market_relevance`, so direction handling and the 0-100
standardisation are identical to every other composite in the project.
"""

import pandas as pd

from .market_relevance import rank_market_relevance

EPS = 1e-9


def quadrant_map(
    forecast_df: pd.DataFrame,
    x_config: list[dict],
    y_config: list[dict],
    x_label: str = "x",
    y_label: str = "y",
    split: float = 50.0,
    quadrant_names: dict | None = None,
) -> pd.DataFrame:
    """Score every market on two composites and label its quadrant.

    x_config / y_config are proxy_direction_config lists, exactly as
    `rank_market_relevance` expects: [{"id": ..., "direction": "positive"|"negative"}].
    Score both axes so that a HIGH value means MORE of the thing the label names.

    quadrant_names maps (x_high, y_high) booleans to a label, e.g.
        {(True, False): "Exposed and unable", (True, True): "Exposed but capable"}
    """
    x = rank_market_relevance(forecast_df, x_config).set_index("market")["final_score"]
    y = rank_market_relevance(forecast_df, y_config).set_index("market")["final_score"]

    out = pd.DataFrame({x_label: x, y_label: y}).dropna()
    out["x_high"] = out[x_label] >= split
    out["y_high"] = out[y_label] >= split

    if quadrant_names is None:
        quadrant_names = {
            (True, True): f"high {x_label} / high {y_label}",
            (True, False): f"high {x_label} / low {y_label}",
            (False, True): f"low {x_label} / high {y_label}",
            (False, False): f"low {x_label} / low {y_label}",
        }
    out["quadrant"] = [
        quadrant_names.get((xh, yh), "") for xh, yh in zip(out["x_high"], out["y_high"])
    ]
    out["gap"] = (out[x_label] - out[y_label]).round(1)

    out[[x_label, y_label]] = out[[x_label, y_label]].round(1)
    return (
        out.drop(columns=["x_high", "y_high"])
        .sort_values("gap", ascending=False)
        .reset_index()
    )


def alignment_score(quadrant_df: pd.DataFrame, x_label: str, y_label: str) -> float:
    """Correlation between the two axes.

    Strongly negative means the countries facing the most pressure are the least
    equipped — the 'divide' result. Near zero means exposure and capacity are
    unrelated, which is a different and less fatalistic story.
    """
    return float(quadrant_df[x_label].corr(quadrant_df[y_label]))
