"""
    value(year) = % of the ~193 UN member states that are PARTY, cumulatively by year.
"""

import glob
import os
import re

import pandas as pd

OUTPUT_COLUMNS = ["proxy_id", "market", "date", "value", "labels", "metric"]

UN_MEMBERS = 193           # denominator: current UN member states
MARKET = "GLO"             # single global series per treaty

TREATY_NAMES = {
    1: "Paris Agreement",        2: "Convention on Biological Diversity",
    3: "UNCLOS",                 4: "Rome Statute (ICC)",
    5: "ICCPR",                  6: "NPT",
    7: "Chemical Weapons Convention", 8: "CTBT",
    9: "Arms Trade Treaty",      10: "UNTOC",
    11: "UNCAC",                 12: "Geneva Protocol I (1977)",
}

# Parties that are NOT UN member states -> excluded from the numerator.
NON_UN = {
    "european union", "eu", "holy see", "holy see (vatican city state)",
    "vatican city", "vatican", "state of palestine", "palestine",
    "cook islands", "niue",
}


def _norm(s):
    s = re.sub(r"\[[^\]]*\]", "", str(s))           # drop [refs]
    s = s.replace("†", "").replace("*", "")          # drop depositary/footnote glyphs
    return re.sub(r"\s+", " ", s).strip().lower()


def extract_transform(raw_dir, start_year: int = 2000, end_year: int = 2025,
                      un_members: int = UN_MEMBERS,
                      drop_pre_start_zeros: bool = True) -> pd.DataFrame:
    """
    Build the D11 global long format: 1 row per (treaty, year), value = % of UN
    member states party by that year.

    Parameters
    ----------
    raw_dir : str   Folder holding d11_{n}_{slug}.csv (Raw Data/UN_Treaties)
    """
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")

    raw_dir = os.path.expanduser(str(raw_dir))
    files = sorted(
        glob.glob(os.path.join(raw_dir, "d11_*.csv")),
        key=lambda p: int(re.search(r"d11_(\d+)_", os.path.basename(p)).group(1)),
    )
    if not files:
        raise FileNotFoundError(f"No d11_*.csv files found in {raw_dir}")

    records = []
    for f in files:
        idx = int(re.search(r"d11_(\d+)_", os.path.basename(f)).group(1))
        df = pd.read_csv(f)

        # earliest party-year for each UN-member party (non-UN entities dropped)
        years = []
        for _, r in df.iterrows():
            if _norm(r["country"]) in NON_UN:
                continue
            try:
                years.append(int(str(r["party_date"])[:4]))
            except (ValueError, TypeError):
                continue

        for year in range(start_year, end_year + 1):
            n_party = sum(1 for y in years if y <= year)
            # A cumulative ratification series is 0 only BEFORE the treaty opened
            # / had any party. Those pre-start zeros are meaningless (the treaty
            # didn't exist yet) and would fake a long flat baseline, so skip them.
            if drop_pre_start_zeros and n_party == 0:
                continue
            records.append({
                "proxy_id": f"D11_{idx}",
                "market":   MARKET,
                "date":     year,
                "value":    round(n_party / un_members * 100, 2),
                "labels":   TREATY_NAMES.get(idx, os.path.basename(f)),
                "metric":   None,
                "_idx":     idx,
            })

    result = pd.DataFrame(records).sort_values(["_idx", "date"]).drop(columns="_idx")
    return result[OUTPUT_COLUMNS].reset_index(drop=True)
