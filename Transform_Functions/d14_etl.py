"""
Value = mean pairwise voting agreement with all other UN member states per year,
        expressed as a percentage (0–100).
        Higher = votes more consistently with the global majority.
        Lower  = more contrarian / revisionist posture.
"""

import pandas as pd

MARKETS_35 = [
    "USA", "CAN", "MEX", "BRA", "ARG", "DEU", "FRA", "GBR", "ITA", "RUS",
    "TUR", "POL", "NLD", "UKR", "CHN", "JPN", "KOR", "IDN", "AUS", "TWN",
    "VNM", "IND", "PAK", "BGD", "SAU", "ARE", "IRN", "ISR", "EGY", "NGA",
    "ZAF", "ETH", "KEN", "COD", "KAZ",
]


def extract_transform(raw_file_path: str, ideal_points_path: str,
                      start_year: int = 2000, end_year: int = 2025) -> pd.DataFrame:
    """
    Compute annual mean pairwise voting agreement for each of the 35 countries
    vs all other UN member states.
    """
    # ── 1. Build ccode → iso3c mapping ───────────────────────────────────────
    ip = pd.read_csv(ideal_points_path, usecols=["ccode", "iso3c"])
    ccode_map = ip.drop_duplicates().dropna()

    # ── 2. Load agreement scores, filter years ────────────────────────────────
    ag = pd.read_csv(raw_file_path)
    ag = ag[(ag["year"] >= start_year) & (ag["year"] <= end_year)]

    # Map ccodes to iso3c on both sides
    ag = ag.merge(
        ccode_map.rename(columns={"ccode": "ccode1", "iso3c": "iso3c_a"}),
        on="ccode1", how="left"
    )
    ag = ag.merge(
        ccode_map.rename(columns={"ccode": "ccode2", "iso3c": "iso3c_b"}),
        on="ccode2", how="left"
    )

    # ── 3. Flatten dyads: each country appears on both sides of its dyads ─────
    a_side = ag[["iso3c_a", "year", "agree"]].rename(columns={"iso3c_a": "iso3c"})
    b_side = ag[["iso3c_b", "year", "agree"]].rename(columns={"iso3c_b": "iso3c"})
    flat = pd.concat([a_side, b_side], ignore_index=True)
    flat = flat.dropna(subset=["iso3c", "agree"])

    # ── 4. Mean agreement per country-year, filter to our 35 ─────────────────
    annual = (
        flat[flat["iso3c"].isin(MARKETS_35)]
        .groupby(["iso3c", "year"])["agree"]
        .mean()
        .reset_index()
        .rename(columns={"iso3c": "market", "year": "date"})
    )
    annual["value"] = (annual["agree"] * 100).round(6)

    # ── 5. Build output ───────────────────────────────────────────────────────
    annual["proxy_id"] = "D14_" + annual["market"]
    annual["labels"]   = "%"
    annual["metric"]   = None

    result = annual[["proxy_id", "market", "date", "value", "labels", "metric"]]
    result = result.sort_values(["market", "date"]).reset_index(drop=True)
    return result
