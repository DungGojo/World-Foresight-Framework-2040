"""
Transform Function — D1: Raw Military Budget
Source: SIPRI Military Expenditure Database (Current US$ sheet)
Proxy ID: D1

Default time range: last 10 years (2000–2025).
"""

import pandas as pd

# SIPRI country name → ISO3 mapping for our 35 countries
COUNTRY_MAP = {
    "United States of America": "USA",
    "Canada":                   "CAN",
    "Mexico":                   "MEX",
    "Brazil":                   "BRA",
    "Argentina":                "ARG",
    "Germany":                  "DEU",
    "France":                   "FRA",
    "United Kingdom":           "GBR",
    "Italy":                    "ITA",
    "Russia":                   "RUS",
    "Türkiye":                  "TUR",
    "Poland":                   "POL",
    "Netherlands":              "NLD",
    "Ukraine":                  "UKR",
    "China":                    "CHN",
    "Japan":                    "JPN",
    "Korea, South":             "KOR",
    "Indonesia":                "IDN",
    "Australia":                "AUS",
    "Viet Nam":                 "VNM",
    "India":                    "IND",
    "Pakistan":                 "PAK",
    "Bangladesh":               "BGD",
    "Saudi Arabia":             "SAU",
    "United Arab Emirates":     "ARE",
    "Iran":                     "IRN",
    "Israel":                   "ISR",
    "Egypt":                    "EGY",
    "Nigeria":                  "NGA",
    "South Africa":             "ZAF",
    "Ethiopia":                 "ETH",
    "Kenya":                    "KEN",
    "Congo, DR":                "COD",
    "Kazakhstan":               "KAZ",
}

MISSING_VALUES = {".", "..", "...", "xxx", "x", ""}


def extract_transform(raw_file_path: str, start_year: int = 2000, end_year: int = 2025) -> pd.DataFrame:
    """
    Read SIPRI Milex xlsx, extract 'Current US$' sheet, filter to our 35
    countries and selected year range, return long-format DataFrame ready
    for loading into the Timeseries Data sheet.

    Parameters
    ----------
    raw_file_path : str  Path to SIPRI-Milex-data-*.xlsx
    start_year    : int  First year to include (default 2015 — last 10 years)
    end_year      : int  Last year to include (default 2025)

    Returns
    -------
    pd.DataFrame with columns [proxy_id, market, year, value, labels, metric]
    """
    df_raw = pd.read_excel(raw_file_path, sheet_name="Current US$", header=None)

    # Row 5 contains column headers: "Country", "Notes", 1949, 1950, ...
    header_row = df_raw.iloc[5].tolist()

    # Identify year columns within range
    year_cols = {
        int(h): i
        for i, h in enumerate(header_row)
        if isinstance(h, (int, float)) and not pd.isna(h)
        and start_year <= int(h) <= end_year
    }

    records = []
    for row_idx in range(6, df_raw.shape[0]):
        country_name = df_raw.iloc[row_idx, 0]
        if not isinstance(country_name, str):
            continue
        iso3 = COUNTRY_MAP.get(country_name.strip())
        if iso3 is None:
            continue

        for year, col_idx in year_cols.items():
            raw_val = df_raw.iloc[row_idx, col_idx]

            # Skip missing / uncertain markers
            if pd.isna(raw_val):
                continue
            if isinstance(raw_val, str) and raw_val.strip() in MISSING_VALUES:
                continue

            try:
                value = round(float(raw_val), 6)  # SIPRI sheet is already US$ millions
            except (ValueError, TypeError):
                continue

            records.append({
                "proxy_id": f"D1_{iso3}",
                "market":   iso3,
                "year":     year,
                "value":    value,
                "labels":   "USD",
                "metric":   "MILLIONS",
            })

    result = pd.DataFrame(records, columns=["proxy_id", "market", "year", "value", "labels", "metric"])
    result = result.sort_values(["market", "year"]).reset_index(drop=True)
    return result
