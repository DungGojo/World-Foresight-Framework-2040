"""
Target transforms and inverse transforms.

Bounded proxies are modelled on a logit scale so forecasts can be safely
converted back into valid ranges. Unbounded proxies stay on their original
scale; ``allow_negative`` independently controls whether final values may fall
below zero.
"""

import numpy as np
import pandas as pd


EPS = 1e-6


def _has_finite_bounds(row) -> bool:
    return pd.notna(row.get("lower_bound")) and pd.notna(row.get("upper_bound"))


def transform_value(value: float, row) -> float:
    """Transform one observed value according to its proxy config."""
    lower = row.get("lower_bound")
    upper = row.get("upper_bound")
    proxy_type = row.get("proxy_type")

    if pd.isna(value):
        return np.nan

    if proxy_type == "BOUNDED" and _has_finite_bounds(row):
        width = upper - lower
        clipped = min(max(float(value), lower + EPS * width), upper - EPS * width)
        scaled = (clipped - lower) / width
        return float(np.log(scaled / (1 - scaled)))

    return float(value)


def inverse_transform_value(transformed_value: float, row) -> float:
    """Convert one transformed forecast back to the original scale and cap."""
    lower = row.get("lower_bound")
    upper = row.get("upper_bound")
    proxy_type = row.get("proxy_type")

    if pd.isna(transformed_value):
        return np.nan

    if proxy_type == "BOUNDED" and _has_finite_bounds(row):
        width = upper - lower
        scaled = 1 / (1 + np.exp(-float(transformed_value)))
        value = lower + width * scaled
    else:
        value = float(transformed_value)

    return cap_value(value, row)


def cap_value(value: float, row) -> float:
    """Apply configured lower/upper bounds to one forecast value."""
    if pd.isna(value):
        return np.nan
    result = float(value)
    lower = row.get("lower_bound")
    upper = row.get("upper_bound")
    allow_negative = bool(row.get("allow_negative"))

    if not allow_negative and result < 0:
        result = 0.0
    if pd.notna(lower):
        result = max(result, float(lower))
    if pd.notna(upper):
        result = min(result, float(upper))
    return result


def add_transformed_target(df: pd.DataFrame, value_col: str = "value") -> pd.DataFrame:
    """Add a `y` column on the modelling scale."""
    out = df.copy()
    out["y"] = [transform_value(v, row) for v, (_, row) in zip(out[value_col], out.iterrows())]
    return out
