"""Transform Function — D16: Raw R&D Spending."""

import pandas as pd

from Transform_Functions.metric_scaling import choose_metric, scale_values
from Transform_Functions.world_bank_etl import MARKETS, _fetch


OUTPUT_COLUMNS = ["proxy_id", "market", "date", "value", "labels", "metric"]

RND_SHARE_OF_GDP = "GB.XPD.RSDV.GD.ZS"
GDP_CURRENT_USD = "NY.GDP.MKTP.CD"


def extract_transform(start_year: int = 2000, end_year: int = 2024, markets: list = None):
    """
    R&D spending in current USD.

    World Bank R&D coverage is commonly available as % of GDP, so:

        value = GDP_current_usd * R&D_%_of_GDP / 100
    """
    mkts = markets or MARKETS
    share = _fetch(RND_SHARE_OF_GDP, start_year, end_year, mkts)
    gdp = _fetch(GDP_CURRENT_USD, start_year, end_year, mkts)
    merged = share.merge(gdp, on=["market", "date"], how="inner")

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)
    if merged.empty:
        return empty

    merged["value"] = merged[GDP_CURRENT_USD] * merged[RND_SHARE_OF_GDP] / 100.0
    merged = merged.dropna(subset=["value"])
    merged = merged[merged["value"] > 0]
    if merged.empty:
        return empty

    metric = choose_metric(merged["value"])
    merged["value"] = scale_values(merged["value"], metric).round(6)
    merged["proxy_id"] = "D16_" + merged["market"]
    merged["labels"] = "USD"
    merged["metric"] = metric

    result = merged[OUTPUT_COLUMNS].sort_values(["market", "date"]).reset_index(drop=True)
    return result
