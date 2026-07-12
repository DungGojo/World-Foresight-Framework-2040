"""
Transform Function — D12: UN Peacekeeping Contribution
Source: UN Peace & Security Data Hub — DPO-UCHISTORICAL.csv
Proxy ID: D12

Value = total peacekeeping personnel-months deployed per year
        (sum of all monthly headcounts across all active missions).
Unit: personnel (annual sum of monthly snapshots)

Includes a GLO row = sum across all 35 countries per year.
Countries with no contributions are filled with 0.
"""

import pandas as pd

MARKETS_35 = [
    "USA", "CAN", "MEX", "BRA", "ARG", "DEU", "FRA", "GBR", "ITA", "RUS",
    "TUR", "POL", "NLD", "UKR", "CHN", "JPN", "KOR", "IDN", "AUS",
    "VNM", "IND", "PAK", "BGD", "SAU", "ARE", "IRN", "ISR", "EGY", "NGA",
    "ZAF", "ETH", "KEN", "COD", "KAZ",
]


def extract_transform(raw_file_path: str, start_year: int = 2010, end_year: int = 2025) -> pd.DataFrame:
    """
    Load DPO-UCHISTORICAL.csv and compute annual sum of monthly peacekeeping
    personnel per country, plus a GLO aggregate across all 35 countries.
    """
    # ── 1. Load & filter ──────────────────────────────────────────────────────
    df = pd.read_csv(raw_file_path)
    df["last_reporting_date"] = pd.to_datetime(df["last_reporting_date"])
    df["year"] = df["last_reporting_date"].dt.year

    df = df[(df["year"] >= start_year) & (df["year"] <= end_year)]
    df = df[df["isocode3"].isin(MARKETS_35)]
    df["personnel"] = df["male_personnel"].fillna(0) + df["female_personnel"].fillna(0)

    # ── 2. Sum all monthly snapshots per country-year ─────────────────────────
    annual = (
        df.groupby(["isocode3", "year"])["personnel"]
        .sum()
        .reset_index()
        .rename(columns={"isocode3": "market", "personnel": "value"})
    )

    # ── 3. Zero-fill missing country-year combos ──────────────────────────────
    full_index = pd.MultiIndex.from_product(
        [MARKETS_35, list(range(start_year, end_year + 1))],
        names=["market", "year"]
    )
    existing = pd.MultiIndex.from_frame(annual[["market", "year"]])
    gaps = full_index.difference(existing)
    if len(gaps) > 0:
        gap_df = pd.DataFrame(list(gaps), columns=["market", "year"])
        gap_df["value"] = 0.0
        annual = pd.concat([annual, gap_df], ignore_index=True)

    # ── 4. GLO row = sum across all 35 countries per year ─────────────────────
    glo = (
        annual.groupby("year")["value"]
        .sum()
        .reset_index()
    )
    glo["market"] = "GLO"

    annual = pd.concat([annual, glo], ignore_index=True)

    # ── 5. Build output ───────────────────────────────────────────────────────
    annual["proxy_id"] = "D12_" + annual["market"]
    annual["value"]    = annual["value"].round(0)
    annual["labels"]   = "No. of people"
    annual["metric"]   = None

    result = annual[["proxy_id", "market", "year", "value", "labels", "metric"]]
    result = result.sort_values(["market", "year"]).reset_index(drop=True)
    return result
