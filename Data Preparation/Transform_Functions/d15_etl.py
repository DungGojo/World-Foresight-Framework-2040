"""Transform Function — D15: Raw Outward FDI."""

from Transform_Functions.world_bank_etl import extract_transform as wb_extract_transform


def extract_transform(start_year: int = 2000, end_year: int = 2024):
    """
    Foreign direct investment, net outflows, current USD.

    Nonpositive rows are omitted because this proxy is intended as raw outward
    FDI scale and the downstream metric rule requires positive transformed
    values.
    """
    return wb_extract_transform(
        proxy_id="D15",
        indicators="BM.KLT.DINV.CD.WD",
        labels="USD",
        metric="AUTO",
        start_year=start_year,
        end_year=end_year,
        drop_nonpositive=True,
    )
