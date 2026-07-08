"""
Extract/transform — D9: Trade Bloc Concentration (share of trade with major powers).

For each country-year we compute what share of its TOTAL trade (imports + exports)
flows to each anchor power, plus the residual "Others". Anchors mirror D8 so the
two proxies are directly comparable (votes-with-X vs trades-with-X):

    D9_1 = share of trade with the USA
    D9_2 = share of trade with China
    D9_3 = share of trade with Russia
    D9_4 = share of trade with India
    D9_5 = share of trade with all Others (rest of world) = 100 - sum(anchors)

Total trade with a partner = imports (M) + exports (X); World total uses partner
code W00. share = partner_trade / world_trade * 100.

Robust to which anchors are present: an anchor absent from the file simply isn't
emitted, and "Others" is computed from whatever anchors ARE present (so it stays
a correct residual). E.g. before India is pulled, only D9_1/2/3 + D9_5 appear.
"""

from pathlib import Path

import pandas as pd


OUTPUT_COLUMNS = ["proxy_id", "market", "date", "value", "labels", "metric"]

# Our 35-country universe (ISO3) — used to filter the reporter side.
PROJECT_MARKETS = [
    "USA", "CAN", "MEX", "BRA", "ARG", "DEU", "FRA", "GBR", "ITA", "RUS",
    "TUR", "POL", "NLD", "UKR", "CHN", "JPN", "KOR", "IDN", "AUS", "TWN",
    "VNM", "IND", "PAK", "BGD", "SAU", "ARE", "IRN", "ISR", "EGY", "NGA",
    "ZAF", "ETH", "KEN", "COD", "KAZ",
]

WORLD_CODE = "W00"                                   # partner code for World total
ANCHOR_INDEX = {"USA": 1, "CHN": 2, "RUS": 3, "IND": 4}   # indices mirror D8
ANCHORS = list(ANCHOR_INDEX)
OTHERS_INDEX = 5                                     # D9_5 = rest of world

# Source column (shifted header) -> the role it actually holds.
COLUMN_ROLES = {
    "reporterCode": "reporter",
    "refPeriodId": "year",
    "reporterDesc": "flow",
    "partnerCode": "partner",
    "fobvalue": "value",
}


def extract_transform(raw_file_path, start_year: int = 2000, end_year: int = 2025) -> pd.DataFrame:
    """
    Build the D9 long format: trade share with each present anchor + Others,
    one row per (sub-proxy, country, year).
    """
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")

    # Accept a single path or a list of paths (Comtrade caps rows per query, so
    # large pulls are downloaded in year-chunks — pass them all and we concat).
    paths = raw_file_path if isinstance(raw_file_path, (list, tuple)) else [raw_file_path]
    parts = []
    for p in paths:
        csv_path = Path(p).expanduser()
        if not csv_path.is_file():
            raise FileNotFoundError(f"Comtrade CSV not found: {csv_path}")
        parts.append(pd.read_csv(csv_path, encoding="latin1", low_memory=False))
    raw = pd.concat(parts, ignore_index=True)
    missing_columns = set(COLUMN_ROLES) - set(raw.columns)
    if missing_columns:
        raise ValueError(f"Comtrade file is missing expected columns: {sorted(missing_columns)}")

    df = raw[list(COLUMN_ROLES)].rename(columns=COLUMN_ROLES)
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df = df.dropna(subset=["value"])
    df = df[df["reporter"].isin(PROJECT_MARKETS)]
    df = df[df["year"].between(start_year, end_year)]
    df = df[df["partner"].isin([WORLD_CODE] + ANCHORS)]

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)
    if df.empty:
        return empty

    # anchors actually present in this file (India may not be pulled yet)
    present_anchors = [a for a in ANCHORS if a in set(df["partner"].unique())]

    # sum across both flows (M + X) per reporter-year-partner, then widen
    wide = df.pivot_table(index=["reporter", "year"], columns="partner",
                          values="value", aggfunc="sum")
    for code in [WORLD_CODE] + present_anchors:
        if code not in wide.columns:
            wide[code] = pd.NA
    wide = wide.reset_index()

    # drop country-years with no / zero World total
    wide["_world"] = pd.to_numeric(wide[WORLD_CODE], errors="coerce")
    wide = wide[wide["_world"].notna() & (wide["_world"] != 0)]
    if wide.empty:
        return empty
    for a in present_anchors:
        wide[a] = pd.to_numeric(wide[a], errors="coerce").fillna(0.0)

    # --- anchor shares (% of total trade) ---
    long = wide.melt(id_vars=["reporter", "year", "_world"], value_vars=present_anchors,
                     var_name="anchor", value_name="atrade")
    long["idx"] = long["anchor"].map(ANCHOR_INDEX)
    long["value"] = (long["atrade"] / long["_world"] * 100).round(2)

    # --- Others = World - sum(present anchors), as its own residual sub-proxy ---
    others = wide[["reporter", "year", "_world"]].copy()
    others["atrade"] = wide["_world"] - wide[present_anchors].sum(axis=1)
    others["idx"] = OTHERS_INDEX
    others["value"] = (others["atrade"] / others["_world"] * 100).clip(lower=0, upper=100).round(2)

    both = pd.concat([long[["reporter", "year", "idx", "value"]],
                      others[["reporter", "year", "idx", "value"]]], ignore_index=True)

    both["proxy_id"] = "D9_" + both["idx"].astype(str) + "_" + both["reporter"]
    both["market"] = both["reporter"]
    both["date"] = both["year"].astype(int)
    both["labels"] = "%"
    both["metric"] = None

    return both[OUTPUT_COLUMNS].sort_values(["market", "proxy_id", "date"]).reset_index(drop=True)
