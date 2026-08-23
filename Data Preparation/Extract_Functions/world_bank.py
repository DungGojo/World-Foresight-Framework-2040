"""World Bank Data360 API extractor, with an on-disk snapshot.

Backend: https://data360api.worldbank.org. Callers pass ordinary WDI codes
("NY.GDP.MKTP.CD"); this module converts them to Data360 indicator ids
internally.

The first call for an indicator hits the API and writes the result to
`Raw Data/World Bank Data360/`. Every later call reads that snapshot, so the
notebook reproduces the same numbers no matter when it is re-run. Pass
`refresh=True` to pull fresh data and overwrite the snapshot.

This is the only live API left in the pipeline; roughly fifteen proxies across
Topics 1 and 2 depend on it. Topics 3-5 read prepared files instead.
"""

from __future__ import annotations

import json
import ssl
import time
import warnings
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import certifi
import pandas as pd

from Transform_Functions.common import END_YEAR, MARKETS, RAW_DIR, START_YEAR

SNAPSHOT_DIR = RAW_DIR / "World Bank Data360"

API_URL = "https://data360api.worldbank.org/data360/data"
DATABASE = "WB_WDI"
PAGE_SIZE = 1000                   # Data360 returns at most 1000 rows per call
TOTAL_CODES = (None, "_T", "_Z")   # SDMX "total" / "not applicable" markers

# macOS ships an OpenSSL whose trust store is often empty, which shows up as
# CERTIFICATE_VERIFY_FAILED. Pinning certifi keeps this off the host's setup.
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())

REQUEST_TIMEOUT = 60
MAX_RETRIES = 5
BACKOFF_BASE = 2.0
TRANSIENT_CODES = {429, 500, 502, 503, 504}


def indicator_id(wdi_code: str) -> str:
    """'NY.GDP.MKTP.CD' -> 'WB_WDI_NY_GDP_MKTP_CD'."""
    return f"{DATABASE}_{wdi_code.replace('.', '_')}"


def _get(params: dict) -> dict:
    """GET the data endpoint, retrying only on transient failures.

    A 400 means a bad indicator code and is raised immediately -- retrying it
    would just hide the mistake behind a five-attempt delay.
    """
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            request = Request(
                f"{API_URL}?{urlencode(params)}",
                headers={"Accept": "application/json",
                         "User-Agent": "World-Foresight-Framework/1.0"},
            )
            with urlopen(request, timeout=REQUEST_TIMEOUT, context=SSL_CONTEXT) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            if error.code not in TRANSIENT_CODES:
                raise
            last_error = error
        except (URLError, TimeoutError, OSError, ValueError) as error:
            last_error = error
        if attempt < MAX_RETRIES - 1:
            time.sleep(BACKOFF_BASE * (2 ** attempt))
    raise RuntimeError(f"Data360 request failed after {MAX_RETRIES} attempts "
                       f"({params}): {last_error}")


def _country_rows(code: str, market: str, start_year: int, end_year: int) -> list:
    """All raw rows for one indicator and one economy, following pagination.

    One request per economy keeps each call small. Asking for 34 economies at
    once is what makes the classic api.worldbank.org endpoint return 502s.
    """
    rows, skip = [], 0
    while True:
        payload = _get({
            "DATABASE_ID": DATABASE,
            "INDICATOR": code,
            "REF_AREA": market,
            "timePeriodFrom": int(start_year),
            "timePeriodTo": int(end_year),
            "skip": skip,
        })
        batch = payload.get("value") or []
        rows.extend(batch)
        total = payload.get("count", len(rows))
        if len(batch) < PAGE_SIZE or skip + len(batch) >= total:
            return rows
        skip += PAGE_SIZE


def _download(wdi_code: str, start_year: int, end_year: int, markets: list,
              keep_sex: bool) -> pd.DataFrame:
    code = indicator_id(wdi_code)
    is_currency = ".CD" in wdi_code
    records = []

    for market in markets:
        try:
            rows = _country_rows(code, market, start_year, end_year)
        except RuntimeError as error:
            # One flaky economy should not abort a 34-country extraction.
            warnings.warn(f"{wdi_code}/{market} failed after {MAX_RETRIES} "
                          f"retries ({error}); skipping this economy.")
            continue

        for row in rows:
            if not keep_sex and row.get("SEX") not in TOTAL_CODES:
                continue
            if row.get("AGE") not in TOTAL_CODES:
                continue
            if row.get("URBANISATION") not in TOTAL_CODES:
                continue
            observation = row.get("OBS_VALUE")
            if observation in (None, ""):
                continue
            try:
                year = int(row["TIME_PERIOD"])
                value = float(observation)
            except (TypeError, ValueError, KeyError):
                continue
            # UNIT_MULT carries currency magnitude on .CD indicators, but on
            # rates it describes the denominator ("per million people").
            # Applying it to SP.POP.SCIE.RD.P6 would turn 4,937 researchers
            # per million into 4.9 billion.
            if is_currency:
                value *= 10 ** int(row.get("UNIT_MULT") or 0)
            records.append({"market": row.get("REF_AREA") or market,
                            "year": year, "value": value})

    if not records:
        return pd.DataFrame(columns=["market", "year", "value"])
    return (pd.DataFrame(records)
            .drop_duplicates(subset=["market", "year"])
            .sort_values(["market", "year"])
            .reset_index(drop=True))


def fetch(wdi_code: str, start_year: int = START_YEAR, end_year: int = END_YEAR,
          markets: list | None = None, *, keep_sex: bool = False,
          refresh: bool = False) -> pd.DataFrame:
    """Return [market, year, value] for one WDI indicator.

    Reads the local snapshot when there is one. `keep_sex` retains the
    sex-disaggregated series, which the internet-use gender gap (D46) needs.
    """
    markets = markets or list(MARKETS)
    suffix = "_by_sex" if keep_sex else ""
    snapshot = SNAPSHOT_DIR / f"{wdi_code}_{start_year}_{end_year}{suffix}.csv"

    if snapshot.is_file() and not refresh:
        return pd.read_csv(snapshot)

    frame = _download(wdi_code, start_year, end_year, markets, keep_sex)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    frame.to_csv(snapshot, index=False)
    print(f"  Snapshot written: {snapshot.name} ({len(frame)} rows)")
    return frame


def fetch_many(wdi_codes, start_year: int = START_YEAR, end_year: int = END_YEAR,
               markets: list | None = None, *, keep_sex: bool = False,
               refresh: bool = False) -> pd.DataFrame:
    """Fetch several indicators and join them on (market, year).

    Each indicator becomes a column named after its WDI code, which is what
    the derived proxies (trade balances, shares of GDP) need in order to do
    arithmetic across series.
    """
    merged = None
    for code in wdi_codes:
        frame = fetch(code, start_year, end_year, markets, keep_sex=keep_sex,
                      refresh=refresh).rename(columns={"value": code})
        merged = frame if merged is None else merged.merge(
            frame, on=["market", "year"], how="outer")
    if merged is None:
        return pd.DataFrame(columns=["market", "year"])
    return merged.sort_values(["market", "year"]).reset_index(drop=True)


def fetch_many_by_sex(wdi_codes, start_year: int = START_YEAR,
                      end_year: int = END_YEAR, markets: list | None = None,
                      *, refresh: bool = False) -> pd.DataFrame:
    """fetch_many for indicators that are only published split by sex."""
    return fetch_many(wdi_codes, start_year, end_year, markets,
                      keep_sex=True, refresh=refresh)
