"""
Extract/transform — D8: UN Voting Bloc Agreement (vs USA / China / Russia / India).

For each country we compute its UN General Assembly voting agreement score with
each of four major-power blocs - the share of votes cast the same way. 
Each bloc is a sub-proxy:

    D8_1 = agreement w/ USA      D8_3 = agreement w/ Russia
    D8_2 = agreement w/ China    D8_4 = agreement w/ India
"""

from pathlib import Path

import pandas as pd


OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

# COW numeric code -> project ISO3, for our 35-country universe. Verified against
# the Voeten ideal-point file (same COW coding family). Germany has two historical
# codes (255 unified / 260 West Germany); only 255 appears in 2015+. TWN has a code
# (713) but no UN voting data in-window.
CCODE_TO_ISO3 = {
    2: "USA", 20: "CAN", 70: "MEX", 140: "BRA", 160: "ARG",
    255: "DEU", 260: "DEU", 220: "FRA", 200: "GBR", 325: "ITA",
    365: "RUS", 640: "TUR", 290: "POL", 210: "NLD", 369: "UKR",
    710: "CHN", 740: "JPN", 732: "KOR", 850: "IDN", 900: "AUS",
    713: "TWN", 816: "VNM", 750: "IND", 770: "PAK", 771: "BGD",
    670: "SAU", 696: "ARE", 630: "IRN", 666: "ISR", 651: "EGY",
    475: "NGA", 560: "ZAF", 530: "ETH", 501: "KEN", 490: "COD",
    705: "KAZ",
}

# Major-power blocs -> sub-proxy index (the D8_1..D8_4 the value is measured against).
MAJOR_BLOCS = {"USA": 1, "CHN": 2, "RUS": 3, "IND": 4}

# Per-bloc display label (proxy_id encodes the index; this names the bloc).
BLOC_LABELS = {
    1: "%",
    2: "%",
    3: "%",
    4: "%",
}


def extract_transform(
    raw_file_path,
    start_year: int = 2000,
    end_year: int = 2025,
    decimals: int = 6,
    markets: list = None,
) -> pd.DataFrame:
    """
    Build the D8 long format: one row per (bloc, country, year) agreement score.
    """
    
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")

    csv_path = Path(raw_file_path).expanduser()
    if not csv_path.is_file():
        raise FileNotFoundError(f"Agreement scores CSV not found: {csv_path}")

    iso_to_ccode = {}
    for cc, iso in CCODE_TO_ISO3.items():
        iso_to_ccode.setdefault(iso, cc)  # first wins; the four majors are unambiguous
    universe = set(markets) if markets is not None else set(CCODE_TO_ISO3.values())

    raw = pd.read_csv(csv_path, usecols=["ccode1", "ccode2", "agree", "year"])
    raw["year"] = pd.to_numeric(raw["year"], errors="coerce")
    raw["agree"] = pd.to_numeric(raw["agree"], errors="coerce")
    raw = raw[raw["year"].between(start_year, end_year)].dropna(subset=["agree"])

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)

    frames = []
    for bloc_iso, idx in MAJOR_BLOCS.items():
        c_major = iso_to_ccode.get(bloc_iso)
        if c_major is None:
            continue
        # The major can sit on either side of the dyad; the partner is the other side.
        s1 = raw[raw["ccode1"] == c_major].copy()
        s1["market"] = s1["ccode2"].map(CCODE_TO_ISO3)
        s2 = raw[raw["ccode2"] == c_major].copy()
        s2["market"] = s2["ccode1"].map(CCODE_TO_ISO3)
        part = pd.concat([s1, s2], ignore_index=True)
        # Keep partners in our universe; a major has no self-agreement row.
        part = part[part["market"].isin(universe) & (part["market"] != bloc_iso)]
        if part.empty:
            continue
        part["idx"] = idx
        frames.append(part[["market", "year", "agree", "idx"]])

    if not frames:
        return empty
    df = pd.concat(frames, ignore_index=True)
    if df.empty:
        return empty

    # AgreementScores stores both directed orderings -> identical symmetric rows.
    df = df.drop_duplicates(["idx", "market", "year"])

    df = df.rename(columns={"agree": "value"})
    df["year"] = df["year"].astype(int)
    df["proxy_id"] = "D8_" + df["idx"].astype(str) + "_" + df["market"]
    df["value"] = df["value"]*100
    df["value"] = df["value"].round(decimals)
    df["labels"] = "%"
    df["metric"] = None

    duplicated = df.duplicated(["proxy_id", "year"], keep=False)
    if duplicated.any():
        examples = df.loc[duplicated, ["proxy_id", "year"]].head().to_dict("records")
        raise ValueError(f"Duplicate (proxy_id, year) rows found: {examples}")

    result = df[OUTPUT_COLUMNS].sort_values(["market", "proxy_id", "year"])
    return result.reset_index(drop=True)
