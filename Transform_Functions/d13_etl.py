"""Transform Function — D13: Raw Total Exports of Fuel, Metals & Food."""

import pandas as pd

from Transform_Functions.metric_scaling import choose_metric, scale_values
from Transform_Functions.world_bank_etl import MARKETS, _fetch


OUTPUT_COLUMNS = ["proxy_id", "market", "date", "value", "labels", "metric"]

MERCHANDISE_EXPORTS = "TX.VAL.MRCH.CD.WT"
COMPONENT_SHARE_INDICATORS = [
    "TX.VAL.FUEL.ZS.UN",
    "TX.VAL.MMTL.ZS.UN",
    "TX.VAL.FOOD.ZS.UN",
]


def extract_transform(start_year: int = 2000, end_year: int = 2024, markets: list = None):
    """
    Estimate raw exports of fuel + ores/metals + food in current USD.

    World Bank provides these components as shares of merchandise exports, so:

        value = merchandise_exports_current_usd * (fuel_pct + metals_pct + food_pct) / 100
    """
    mkts = markets or MARKETS
    merged = _fetch(MERCHANDISE_EXPORTS, start_year, end_year, mkts)
    for indicator in COMPONENT_SHARE_INDICATORS:
        d = _fetch(indicator, start_year, end_year, mkts)
        merged = merged.merge(d, on=["market", "date"], how="outer")

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)
    if merged.empty:
        return empty

    required = [MERCHANDISE_EXPORTS] + COMPONENT_SHARE_INDICATORS
    missing_cols = [col for col in required if col not in merged.columns]
    if missing_cols:
        raise ValueError(f"D13 World Bank response is missing columns: {missing_cols}")

    merged = merged.dropna(subset=[MERCHANDISE_EXPORTS])
    merged = merged.dropna(subset=COMPONENT_SHARE_INDICATORS, how="all")
    if merged.empty:
        return empty

    merged["component_share"] = merged[COMPONENT_SHARE_INDICATORS].sum(axis=1, skipna=True)
    merged["value"] = merged[MERCHANDISE_EXPORTS] * merged["component_share"] / 100.0
    merged = merged.dropna(subset=["value"])
    merged = merged[merged["value"] > 0]
    if merged.empty:
        return empty

    metric = choose_metric(merged["value"])
    merged["value"] = scale_values(merged["value"], metric).round(6)
    merged["proxy_id"] = "D13_" + merged["market"]
    merged["labels"] = "USD"
    merged["metric"] = metric

    result = merged[OUTPUT_COLUMNS].sort_values(["market", "date"]).reset_index(drop=True)
    return result
