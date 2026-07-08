"""Transform Function — D2: Raw Total Trade."""

from Transform_Functions.world_bank_etl import extract_transform as wb_extract_transform


def extract_transform(start_year: int = 2015, end_year: int = 2024):
    """
    Total trade = exports of goods/services + imports of goods/services, current USD.
    """
    return wb_extract_transform(
        proxy_id="D2",
        indicators=["NE.EXP.GNFS.CD", "NE.IMP.GNFS.CD"],
        labels="USD",
        metric="AUTO",
        agg="SUM",
        start_year=start_year,
        end_year=end_year,
        drop_nonpositive=True,
    )
