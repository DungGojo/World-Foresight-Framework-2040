"""Transform Function — D4: Raw GDP."""

from Transform_Functions.world_bank_etl import extract_transform as wb_extract_transform


def extract_transform(start_year: int = 2015, end_year: int = 2024):
    """GDP at current USD."""
    return wb_extract_transform(
        proxy_id="D4",
        indicators="NY.GDP.MKTP.CD",
        labels="USD",
        metric="AUTO",
        start_year=start_year,
        end_year=end_year,
        drop_nonpositive=True,
    )
