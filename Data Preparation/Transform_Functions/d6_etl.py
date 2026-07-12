"""
Extract/transform — D6: Geopolitical Alignment Score.

Higher (more positive) values lean toward the Western liberal order; lower (negative)
values lean non-Western / revisionist (clustering with Russia, China, Iran).

"""

from pathlib import Path

import pandas as pd


OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

# Our 35-country universe (ISO3). The Voeten file is already keyed by ISO3
# (`iso3c`), so membership is a direct filter — no code translation needed.
MARKETS = [
    "USA", "CAN", "MEX", "BRA", "ARG", "DEU", "FRA", "GBR", "ITA", "RUS",
    "TUR", "POL", "NLD", "UKR", "CHN", "JPN", "KOR", "IDN", "AUS",
    "VNM", "IND", "PAK", "BGD", "SAU", "ARE", "IRN", "ISR", "EGY", "NGA",
    "ZAF", "ETH", "KEN", "COD", "KAZ",
]

# Point-estimate column in the Voeten "FP" release.
IDEALPOINT_COL = "IdealPointFP"


def extract_transform(
    raw_file_path,
    start_year: int = 2000,
    end_year: int = 2025,
    decimals: int = 6,
    markets: list = None,
) -> pd.DataFrame:
    """
    Extract D6 ideal-point estimates and return the standard project long format.
    """
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")
    mkts = markets or MARKETS

    csv_path = Path(raw_file_path).expanduser()
    if not csv_path.is_file():
        raise FileNotFoundError(f"Ideal point CSV not found: {csv_path}")

    raw = pd.read_csv(csv_path)

    required = {"iso3c", "year", IDEALPOINT_COL}
    missing_columns = required - set(raw.columns)
    if missing_columns:
        raise ValueError(
            f"Ideal point file is missing required columns: {sorted(missing_columns)}"
        )

    df = raw[["iso3c", "year", IDEALPOINT_COL]].copy()
    df["iso3c"] = df["iso3c"].astype("string").str.strip()
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["value"] = pd.to_numeric(df[IDEALPOINT_COL], errors="coerce")

    df = df[df["iso3c"].isin(mkts) & df["year"].between(start_year, end_year)].copy()
    df = df.dropna(subset=["iso3c", "year", "value"])

    df["market"] = df["iso3c"]
    df["year"] = df["year"].astype(int)

    duplicated = df.duplicated(["market", "year"], keep=False)
    if duplicated.any():
        examples = df.loc[duplicated, ["market", "year"]].head().to_dict("records")
        raise ValueError(f"Duplicate country-year rows found: {examples}")

    df["proxy_id"] = "D6_" + df["market"]
    df["value"] = df["value"].round(decimals)
    df["labels"] = "Index"
    df["metric"] = None

    result = df[OUTPUT_COLUMNS].sort_values(["market", "year"])
    return result.reset_index(drop=True)
