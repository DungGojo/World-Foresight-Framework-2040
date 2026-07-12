"""
Extract/transform - D5: Composite National Power Index (CINC).

The source already provides the CINC score. It is the equal-weight average of
a state's share of the world-system total for six material-capability
components: military expenditure, military personnel, iron and steel
production, primary energy consumption, total population, and urban
population. CINC ranges from 0 to 1.
"""

from pathlib import Path

import pandas as pd


OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

# Correlates of War state abbreviations -> project ISO3 market codes.
# Several COW abbreviations are not ISO3 (e.g. AUL=Australia, AUS=Austria).
COW_TO_ISO3 = {
    "USA": "USA", "CAN": "CAN", "MEX": "MEX", "BRA": "BRA", "ARG": "ARG",
    "GMY": "DEU", "FRN": "FRA", "UKG": "GBR", "ITA": "ITA", "RUS": "RUS",
    "TUR": "TUR", "POL": "POL", "NTH": "NLD", "UKR": "UKR", "CHN": "CHN",
    "JPN": "JPN", "ROK": "KOR", "INS": "IDN", "AUL": "AUS",
    "DRV": "VNM", "IND": "IND", "PAK": "PAK", "BNG": "BGD", "SAU": "SAU",
    "UAE": "ARE", "IRN": "IRN", "ISR": "ISR", "EGY": "EGY", "NIG": "NGA",
    "SAF": "ZAF", "ETH": "ETH", "KEN": "KEN", "DRC": "COD", "KZK": "KAZ",
}


def _resolve_csv(raw_path) -> Path:
    """Resolve either an explicit CSV or an NMCv7 directory to the abridged CSV."""
    path = Path(raw_path).expanduser()
    if path.is_file():
        return path
    if path.is_dir():
        direct = path / "NMC-70-abridged.csv"
        if direct.is_file():
            return direct
        matches = list(path.glob("**/NMC-70-abridged.csv"))
        if len(matches) == 1:
            return matches[0]
        if len(matches) > 1:
            raise ValueError(f"Multiple NMC abridged CSV files found under {path}")
    raise FileNotFoundError(
        f"Could not find NMC-70-abridged.csv from path: {path}"
    )


def extract_transform(
    raw_path,
    start_year: int = 2000,
    end_year: int = 2025,
    decimals: int = 6,
) -> pd.DataFrame:
    """
    Extract D5 CINC values and return the standard project long format.
    """
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")

    csv_path = _resolve_csv(raw_path)
    raw = pd.read_csv(csv_path, na_values=[-9, "-9"])

    required = {"stateabb", "year", "cinc"}
    missing_columns = required - set(raw.columns)
    if missing_columns:
        raise ValueError(
            f"NMC file is missing required columns: {sorted(missing_columns)}"
        )

    df = raw[["stateabb", "year", "cinc"]].copy()
    df["stateabb"] = df["stateabb"].astype("string").str.strip()
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["cinc"] = pd.to_numeric(df["cinc"], errors="coerce")

    df = df[
        df["stateabb"].isin(COW_TO_ISO3)
        & df["year"].between(start_year, end_year)
    ].copy()
    df["market"] = df["stateabb"].map(COW_TO_ISO3)

    # COW documents -9 as missing; valid CINC scores are bounded [0, 1].
    df = df.dropna(subset=["year", "cinc", "market"])
    df = df[df["cinc"].between(0, 1, inclusive="both")].copy()
    df["year"] = df["year"].astype(int)

    duplicated = df.duplicated(["market", "year"], keep=False)
    if duplicated.any():
        examples = df.loc[duplicated, ["market", "year"]].head().to_dict("records")
        raise ValueError(f"Duplicate NMC country-year rows found: {examples}")

    df["proxy_id"] = "D5_" + df["market"]
    df["value"] = df["cinc"].round(decimals)
    df["labels"] = "CINC score"
    df["metric"] = None

    result = df[OUTPUT_COLUMNS].sort_values(["market", "year"])
    return result.reset_index(drop=True)
