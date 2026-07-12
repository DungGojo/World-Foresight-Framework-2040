"""Shared value scaling helpers for transform outputs."""

import numpy as np
import pandas as pd


ALLOWED_METRICS = (None, "THOUSANDS", "MILLIONS", "BILLIONS")

METRIC_DIVISORS = {
    None: 1.0,
    "THOUSANDS": 1_000.0,
    "MILLIONS": 1_000_000.0,
    "BILLIONS": 1_000_000_000.0,
}


def choose_metric(values, min_positive_value: float = 0.1):
    """
    Pick the largest metric where every positive scaled value stays above a threshold.

    True zero values cannot be made positive by unit scaling, so the threshold is
    evaluated on positive values only.
    """
    arr = pd.to_numeric(pd.Series(values), errors="coerce").to_numpy(dtype=float)
    positive = arr[np.isfinite(arr) & (arr > 0)]
    if len(positive) == 0:
        return None

    min_positive = float(np.nanmin(positive))
    for metric in ("BILLIONS", "MILLIONS", "THOUSANDS", None):
        if min_positive / METRIC_DIVISORS[metric] > min_positive_value:
            return metric
    return None


def scale_values(values, metric):
    """Scale raw values according to the selected metric."""
    if metric not in METRIC_DIVISORS:
        raise ValueError(f"metric must be one of {ALLOWED_METRICS}; got {metric!r}")
    return pd.to_numeric(values, errors="coerce") / METRIC_DIVISORS[metric]
