"""Shared building blocks for the extract + transform notebook.

Only helpers that earn their place live here: each one is used by more than a
handful of proxies. Anything a single proxy needs stays inline in that proxy's
notebook cell, where you can read it next to the data it produces.

The project contract is six columns:

    proxy_id, market, year, value, labels, metric

`market` is an ISO3 code from MARKETS, or "GLO" for a single global series.
`labels` is the display unit shown in the UI. `metric` is the scale the value
has already been divided by (None when the value is unscaled).
"""

from __future__ import annotations

import re
from pathlib import Path

import pandas as pd

# The notebook lives in "Data Preparation"; raw files sit next to it.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "Raw Data"
PREPARED_DIR = RAW_DIR / "Topic 3-5" / "Prepared"

OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

# Every proxy is clipped to this window. Sources that stop earlier simply end
# earlier -- we never pad or interpolate to fill the range.
START_YEAR = 2000
END_YEAR = 2025

# Canonical 34-country universe: ISO3 -> display name.
MARKETS = {
    "USA": "United States",      "CAN": "Canada",          "MEX": "Mexico",
    "BRA": "Brazil",             "ARG": "Argentina",       "DEU": "Germany",
    "FRA": "France",             "GBR": "United Kingdom",  "ITA": "Italy",
    "RUS": "Russia",             "TUR": "Turkey",          "POL": "Poland",
    "NLD": "Netherlands",        "UKR": "Ukraine",         "CHN": "China",
    "JPN": "Japan",              "KOR": "South Korea",     "IDN": "Indonesia",
    "AUS": "Australia",          "VNM": "Vietnam",         "KAZ": "Kazakhstan",
    "IND": "India",              "PAK": "Pakistan",        "BGD": "Bangladesh",
    "SAU": "Saudi Arabia",       "ARE": "United Arab Emirates",
    "IRN": "Iran",               "ISR": "Israel",          "EGY": "Egypt",
    "NGA": "Nigeria",            "ZAF": "South Africa",    "ETH": "Ethiopia",
    "KEN": "Kenya",              "COD": "DR Congo",
}

# "GLO" is a real market for the global single-series proxies (D10, D17-D20,
# D57-D61, ...), so it is allowed alongside the 34 countries.
GLOBAL = "GLO"
VALID_MARKETS = set(MARKETS) | {GLOBAL}

# Scale factors for the `metric` column. Note THOUSAND/THOUSANDS both appear in
# the published sheet; the spelling is carried through verbatim so the workbook
# does not churn.
METRIC_SCALES = {
    "THOUSAND": 1e3,
    "THOUSANDS": 1e3,
    "MILLIONS": 1e6,
    "BILLIONS": 1e9,
    "TRILLIONS": 1e12,
    "QUADRILLION": 1e15,
}


# --------------------------------------------------------------------------
# Country naming
# --------------------------------------------------------------------------

# Publishers spell the same country a dozen ways. One alias table beats one
# ad-hoc dict per proxy. Keys are lowercased and stripped of punctuation.
_ALIASES = {
    "united states": "USA", "united states of america": "USA", "us": "USA",
    "usa": "USA", "america": "USA",
    "canada": "CAN", "mexico": "MEX", "brazil": "BRA", "argentina": "ARG",
    "germany": "DEU", "france": "FRA",
    "united kingdom": "GBR", "united kingdom of great britain and northern ireland": "GBR",
    "great britain": "GBR", "uk": "GBR",
    "italy": "ITA",
    "russia": "RUS", "russian federation": "RUS",
    "turkey": "TUR", "turkiye": "TUR", "türkiye": "TUR",
    "poland": "POL",
    "netherlands": "NLD", "netherlands kingdom of the": "NLD", "holland": "NLD",
    "ukraine": "UKR",
    "china": "CHN", "china peoples republic of": "CHN", "peoples republic of china": "CHN",
    "china mainland": "CHN",
    "japan": "JPN",
    "south korea": "KOR", "korea south": "KOR", "korea rep": "KOR",
    "republic of korea": "KOR", "korea republic of": "KOR",
    "indonesia": "IDN",
    "australia": "AUS",
    "vietnam": "VNM", "viet nam": "VNM",
    "kazakhstan": "KAZ",
    "india": "IND", "pakistan": "PAK", "bangladesh": "BGD",
    "saudi arabia": "SAU", "saudi arabia kingdom of": "SAU",
    "united arab emirates": "ARE", "uae": "ARE",
    "iran": "IRN", "iran islamic republic of": "IRN", "iran islamic rep": "IRN",
    "israel": "ISR",
    "egypt": "EGY", "egypt arab rep": "EGY", "egypt arab republic of": "EGY",
    "nigeria": "NGA", "south africa": "ZAF", "ethiopia": "ETH", "kenya": "KEN",
    "dr congo": "COD", "democratic republic of the congo": "COD",
    "congo dem rep": "COD", "congo democratic republic of": "COD",
    "congo dr": "COD", "drc": "COD",
}


def _key(name) -> str:
    """Normalise a country label so aliases match regardless of punctuation."""
    text = re.sub(r"\[[^\]]*\]", "", str(name))          # drop footnote refs
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip().lower()


def to_iso3(names: pd.Series) -> pd.Series:
    """Map a column of country names (or ISO3 codes) to project ISO3 codes.

    Anything outside the 34-country universe becomes NaN, so the caller can
    drop it with a plain `dropna` instead of maintaining an exclusion list.
    """
    raw = names.astype(str).str.strip()
    # Already-ISO3 values pass through untouched.
    direct = raw.str.upper().where(raw.str.upper().isin(MARKETS))
    return direct.fillna(raw.map(lambda n: _ALIASES.get(_key(n))))


# --------------------------------------------------------------------------
# Reshaping
# --------------------------------------------------------------------------

def melt_years(frame: pd.DataFrame, id_cols, start_year: int = START_YEAR,
               end_year: int = END_YEAR) -> pd.DataFrame:
    """Turn year-per-column tables into long [*id_cols, year, value] rows.

    Most statistical agencies publish wide. Column headers may be ints or
    strings ("2001", "Y2001"); anything that yields a four-digit year inside
    the window is melted, everything else is left behind.
    """
    id_cols = [id_cols] if isinstance(id_cols, str) else list(id_cols)
    year_of = {}
    for column in frame.columns:
        match = re.fullmatch(r"\D*(\d{4})(?:\.0)?", str(column).strip())
        if match and start_year <= int(match.group(1)) <= end_year:
            year_of[column] = int(match.group(1))

    if not year_of:
        raise ValueError(f"No year columns found between {start_year} and {end_year}")

    long = frame.melt(id_vars=id_cols, value_vars=list(year_of),
                      var_name="year", value_name="value")
    long["year"] = long["year"].map(year_of)
    return long


def to_contract(frame: pd.DataFrame, proxy_id: str, labels: str,
                metric: str | None = None, *, scale: float | None = None,
                market_col: str = "market", year_col: str = "year",
                value_col: str = "value", decimals: int | None = None,
                start_year: int = START_YEAR, end_year: int = END_YEAR,
                allow_missing_markets: bool = True) -> pd.DataFrame:
    """Coerce any transformed frame into the six-column project contract.

    This is the last step of every proxy: it clips the year window, drops
    unusable rows, applies the display scale and validates the result. Passing
    `scale` divides the value (e.g. 1e12 alongside metric="TRILLIONS"); the
    metric string itself is only a label, so proxies whose source is already
    scaled pass metric without scale.

    Source precision is preserved by default. Pass `decimals` only where the
    publisher's own figure is rounded (D9 and D11 report two places, D12 is a
    headcount) -- rounding elsewhere silently loses digits on small values.
    """
    columns = {market_col: "market", year_col: "year", value_col: "value"}
    df = frame.rename(columns=columns)[["market", "year", "value"]].copy()

    df["market"] = df["market"].astype(str).str.strip().str.upper()
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df.dropna(subset=["market", "year", "value"])
    df["year"] = df["year"].astype(int)
    df = df[df["year"].between(int(start_year), int(end_year))]

    unknown = sorted(set(df["market"]) - VALID_MARKETS)
    if unknown:
        raise ValueError(f"{proxy_id}: markets outside the universe: {unknown}")
    if not allow_missing_markets and set(df["market"]) != set(MARKETS):
        missing = sorted(set(MARKETS) - set(df["market"]))
        raise ValueError(f"{proxy_id}: missing required markets {missing}")

    if scale is not None:
        df["value"] = df["value"] / scale
    if decimals is not None:
        df["value"] = df["value"].round(decimals)

    df["proxy_id"] = f"{proxy_id}_" + df["market"]
    df["labels"] = labels
    df["metric"] = metric

    result = df[OUTPUT_COLUMNS].sort_values(["market", "year"]).reset_index(drop=True)
    duplicated = result.duplicated(["proxy_id", "year"])
    if duplicated.any():
        sample = result.loc[duplicated, ["proxy_id", "year"]].head().to_dict("records")
        raise ValueError(f"{proxy_id}: duplicate (proxy_id, year) rows: {sample}")
    return result


def proxy_dim(proxy_id: str) -> str:
    """'D7_1_USA' -> 'D7_1';  'D62_CHN' -> 'D62';  'D17_GLO' -> 'D17'.

    Only the trailing market code is stripped, so sub-proxy numbering (D7_1,
    D11_12) survives. Splitting on the first underscore would not.
    """
    return re.sub(r"_(?:[A-Z]{3})$", "", str(proxy_id))


# --------------------------------------------------------------------------
# Topic 3-5 prepared files
# --------------------------------------------------------------------------

# Rows describing a publisher's future trajectory rather than an observation.
_PROJECTED = {"projection", "forecast", "scenario"}


def read_prepared(proxy_id: str, keep_projections: bool = False) -> pd.DataFrame:
    """Read one audited Topic 3-5 file from Raw Data/Topic 3-5/Prepared.

    These files are the acquisition output for Topics 3, 4 and 5: already
    country-mapped and in long form, with `series_type` marking which rows are
    observations. Official projections are excluded by default so they cannot
    reach the Historical Data sheet by accident.
    """
    path = PREPARED_DIR / f"{proxy_id}.csv"
    if not path.is_file():
        raise FileNotFoundError(f"{proxy_id}: no prepared file at {path}")

    raw = pd.read_csv(path, encoding="utf-8-sig", keep_default_na=False)
    required = {"market", "year", "value", "series_type"}
    missing = sorted(required - set(raw.columns))
    if missing:
        raise ValueError(f"{proxy_id}: prepared file is missing columns {missing}")

    if not keep_projections:
        kind = raw["series_type"].astype(str).str.casefold()
        raw = raw[~kind.isin(_PROJECTED)]

    raw["year"] = pd.to_numeric(raw["year"], errors="coerce")
    raw["value"] = pd.to_numeric(raw["value"], errors="coerce")
    return raw.dropna(subset=["year", "value"]).reset_index(drop=True)
