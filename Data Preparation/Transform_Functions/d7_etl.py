"""
Extract/transform — D7: Arms-transfer alignment (three sub-proxies, one transform).

Source: SIPRI Arms Transfers Database (trade-register.csv).

A single call produces three sub-proxies per country-year, all on a 0-100 scale
(so they share the parent 'D7' BOUNDED[0,100] config, like D8_1-4 / D9_1-3):

    D7_1 = Supplier concentration, HHI x 100   (high = locked into few suppliers
           / aligned;  low = diversified / hedging / "refuses to choose")
    D7_2 = Western supplier share, %           (imports sourced from Western/allied
           suppliers)
    D7_3 = Eastern supplier share, %           (imports sourced from the Russia/
           China revisionist bloc)

Everything is computed on a **5-year rolling window** of delivered SIPRI TIV,
because arms deliveries are lumpy and annual values are spiky/undefined.

HHI (per recipient, per window):
    share_s = TIV_s / sum_s TIV_s        (over ALL suppliers)
    HHI     = sum_s share_s ** 2         in [0, 1]  ->  x100 for the 0-100 scale

Western / Eastern share = (TIV from that bloc) / (total TIV) * 100. Suppliers
outside both blocs (India, Brazil, UAE, Serbia, ... and unknown suppliers) count
toward the denominator but neither bloc share, so West% + East% + Other% = 100.
"""

import pandas as pd

OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

WINDOW = 5                 # rolling window length in years
MIN_WINDOW_TIV = 1.0       # skip country-windows with negligible total imports
SUB_INDEX = {"HHI": 1, "WEST": 2, "EAST": 3}

# SIPRI recipient name -> ISO3 for our project countries.
RECIPIENT_MAP = {
    "United States": "USA", "Canada": "CAN", "Mexico": "MEX", "Brazil": "BRA",
    "Argentina": "ARG", "Germany": "DEU", "France": "FRA", "United Kingdom": "GBR",
    "Italy": "ITA", "Russia": "RUS", "Turkiye": "TUR", "Poland": "POL",
    "Netherlands": "NLD", "Ukraine": "UKR", "China": "CHN", "Japan": "JPN",
    "South Korea": "KOR", "Indonesia": "IDN", "Australia": "AUS",
    "Viet Nam": "VNM", "India": "IND", "Pakistan": "PAK", "Bangladesh": "BGD",
    "Saudi Arabia": "SAU", "United Arab Emirates": "ARE", "Iran": "IRN",
    "Israel": "ISR", "Egypt": "EGY", "Nigeria": "NGA", "South Africa": "ZAF",
    "Ethiopia": "ETH", "Kenya": "KEN", "DR Congo": "COD", "Kazakhstan": "KAZ",
}

# Eastern / revisionist bloc suppliers (per the D6/D7 framing).
EASTERN_SUPPLIERS = {"Russia", "China", "North Korea", "Iran", "Belarus"}

# Western / allied suppliers: NATO + EU + close Pacific/other allies, using the
# exact SIPRI supplier names. Editable — anything not in EAST or WEST is treated
# as non-aligned "Other".
WESTERN_SUPPLIERS = {
    "United States", "United Kingdom", "France", "Germany", "Italy",
    "Netherlands", "Spain", "Sweden", "Canada", "Norway", "Switzerland",
    "Poland", "Australia", "Czechia", "Denmark", "Belgium", "Finland",
    "Portugal", "Bulgaria", "Slovakia", "Romania", "Ireland", "Austria",
    "Croatia", "Lithuania", "Latvia", "Estonia", "Slovenia", "Greece",
    "Hungary", "Cyprus", "Malta", "North Macedonia", "Montenegro",
    "Bosnia-Herzegovina", "Turkiye", "Japan", "South Korea", "New Zealand",
    "Israel",
}


def _parse_years(year_str):
    """Parse a SIPRI delivery-year string into a list of ints.

    "2018" -> [2018]; "2018; 2019" -> [2018, 2019]; "2017; ?" -> [2017]; "?" -> [].
    """
    years = []
    if not isinstance(year_str, str):
        return years
    for part in year_str.split(";"):
        part = part.strip().lstrip("?").strip()
        if part.isdigit() and len(part) == 4:
            years.append(int(part))
    return years


def extract_transform(raw_file_path, start_year=2000, end_year=2025,
                      window=WINDOW, decimals=6, markets=None):
    """
    Read trade-register.csv and return D7_1 (HHI x100), D7_2 (Western %),
    D7_3 (Eastern %) per country-year on a rolling `window`-year basis.
    """
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")
    keep_markets = set(markets) if markets else set(RECIPIENT_MAP.values())

    # --- load & clean ---
    df = pd.read_csv(raw_file_path, encoding="latin1", skiprows=11, on_bad_lines="skip")
    df.columns = df.columns.str.strip()
    df = df[["Recipient", "Supplier", "Year(s) of delivery",
             "SIPRI TIV of delivered weapons"]].copy()
    df.columns = ["recipient", "supplier", "delivery_years", "tiv"]
    df["tiv"] = pd.to_numeric(df["tiv"], errors="coerce")
    df = df.dropna(subset=["tiv", "recipient", "supplier"])
    df = df[df["recipient"].isin(RECIPIENT_MAP)].copy()
    df["market"] = df["recipient"].map(RECIPIENT_MAP)
    df = df[df["market"].isin(keep_markets)]

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)
    if df.empty:
        return empty

    # --- explode multi-year deliveries, distributing TIV evenly across years ---
    records = []
    for _, row in df.iterrows():
        years = _parse_years(row["delivery_years"] if pd.notna(row["delivery_years"]) else "")
        if not years:
            continue
        tiv_per_year = row["tiv"] / len(years)
        for y in years:
            records.append({"market": row["market"], "supplier": row["supplier"],
                            "year": y, "tiv": tiv_per_year})
    if not records:
        return empty
    exploded = pd.DataFrame(records)

    # TIV per market x supplier x year (all years, for window look-back)
    grid = exploded.groupby(["market", "supplier", "year"], as_index=False)["tiv"].sum()

    # --- rolling window per output year ---
    out = []
    for market, g in grid.groupby("market"):
        for t in range(start_year, end_year + 1):
            win = g[(g["year"] >= t - window + 1) & (g["year"] <= t)]
            total = win["tiv"].sum()
            if total < MIN_WINDOW_TIV:
                continue
            by_sup = win.groupby("supplier")["tiv"].sum()
            shares = by_sup / total
            hhi = float((shares ** 2).sum())
            west = float(by_sup[by_sup.index.isin(WESTERN_SUPPLIERS)].sum() / total)
            east = float(by_sup[by_sup.index.isin(EASTERN_SUPPLIERS)].sum() / total)
            other = max(0.0, 1.0 - west - east)   # non-aligned suppliers (residual)
            out.append({"market": market, "year": t,
                        "D7_1": round(hhi * 100, decimals),
                        "D7_2": round(west * 100, decimals),
                        "D7_3": round(east * 100, decimals),
                        "D7_4": round(other * 100, decimals)})

    if not out:
        return empty
    wide = pd.DataFrame(out)

    # --- reshape to long: one row per (sub-proxy, market, year) ---
    frames = []
    meta = {"D7_1": ("HHI Index", 1), "D7_2": ("%", 2), "D7_3": ("%", 3), "D7_4": ("%", 4)}
    for col, (label, idx) in meta.items():
        part = wide[["market", "year", col]].rename(columns={col: "value"})
        part["proxy_id"] = f"D7_{idx}_" + part["market"]
        part["labels"] = label
        part["metric"] = None
        frames.append(part[OUTPUT_COLUMNS])

    result = pd.concat(frames, ignore_index=True)
    return result.sort_values(["market", "proxy_id", "year"]).reset_index(drop=True)
