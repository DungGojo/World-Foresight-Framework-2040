"""
World Bank extractor — shared across every World-Bank-sourced proxy
(D2 trade, D4 GDP, D13 resource exports, D15 outward FDI, D16 R&D, ...).

Backend: the World Bank **Data360** REST API (https://data360api.worldbank.org).
Data360 returns clean JSON on simple per-country requests, which avoids the 502
gateway errors the classic api.worldbank.org endpoint (wbgapi) throws when a
single request asks for many economies x years at once.

    GET https://data360api.worldbank.org/data360/data
        ?DATABASE_ID=WB_WDI&INDICATOR=<id>&REF_AREA=<ISO3>
        &timePeriodFrom=<Y1>&timePeriodTo=<Y2>&skip=<n>

Callers keep passing *classic* WDI codes (e.g. "NE.EXP.GNFS.CD"); this module
converts them to Data360 indicator ids internally:

    NE.EXP.GNFS.CD  ->  WB_WDI_NE_EXP_GNFS_CD    (prefix DB id, dots -> underscores)

Design notes
------------
* Country codes are ISO3. The World Bank excludes Taiwan (TWN), which never
  returns data, so it is intentionally absent from MARKETS.
* One request per economy keeps every call small and reliable; transient errors
  (429/5xx, timeouts) are retried with exponential backoff. A non-transient HTTP
  error (e.g. a bad indicator id -> 400) is raised so real mistakes aren't
  hidden; an economy that still fails after all retries is skipped with a
  warning so one flaky country cannot abort the whole extraction.
* Rows carry SDMX disaggregation dimensions; we keep only the undisaggregated
  total series (SEX/AGE/URBANISATION in {_T,_Z}) and apply UNIT_MULT
  (actual value = OBS_VALUE * 10**UNIT_MULT).
* Default window starts in 2000; callers may override start_year / end_year.
* `_fetch` and `MARKETS` are imported directly by some proxy ETLs (D13, D16),
  so their names and signatures are kept stable.

Output schema of `extract_transform`:
    [proxy_id, market, year, value, labels, metric]
(The notebook's loader derives the `id` column from `proxy_id`.)
"""

import time
import warnings

import pandas as pd
import requests

from Transform_Functions.metric_scaling import choose_metric, scale_values

# Canonical 34-country universe (ISO3).
MARKETS = [
    "USA", "CAN", "MEX", "BRA", "ARG", "DEU", "FRA", "GBR", "ITA", "RUS",
    "TUR", "POL", "NLD", "UKR", "CHN", "JPN", "KOR", "IDN", "AUS",
    "VNM", "IND", "PAK", "BGD", "SAU", "ARE", "IRN", "ISR", "EGY", "NGA",
    "ZAF", "ETH", "KEN", "COD", "KAZ",
]

OUTPUT_COLUMNS = ["proxy_id", "market", "year", "value", "labels", "metric"]

# --- Data360 API config ----------------------------------------------------
DATA360_URL = "https://data360api.worldbank.org/data360/data"
DEFAULT_DATABASE = "WB_WDI"
PAGE = 1000                       # Data360 returns at most 1000 rows per call
TOTAL_CODES = (None, "_T", "_Z")  # SDMX 'total' / 'not-applicable' markers

# --- resilience tuning -----------------------------------------------------
REQUEST_TIMEOUT = 60
MAX_RETRIES = 5
BACKOFF_BASE = 2.0
TRANSIENT_CODES = {429, 500, 502, 503, 504}


def to_data360_id(wdi_code: str, database: str = DEFAULT_DATABASE) -> str:
    """Convert a classic WDI code to a Data360 indicator id.

    'NE.EXP.GNFS.CD' -> 'WB_WDI_NE_EXP_GNFS_CD'
    """
    return "{}_{}".format(database, wdi_code.replace(".", "_"))


def _get_json(params: dict):
    """GET the Data360 data endpoint with retry/backoff on transient errors.

    Non-transient HTTP errors (e.g. 400/404) are raised immediately.
    """
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(DATA360_URL, params=params, timeout=REQUEST_TIMEOUT)
        except requests.RequestException as exc:      # network / timeout -> transient
            last_error = exc
        else:
            if resp.status_code in TRANSIENT_CODES:
                last_error = requests.HTTPError(f"transient HTTP {resp.status_code}")
            elif not resp.ok:
                resp.raise_for_status()                # non-transient -> fail loud
            else:
                return resp.json()
        if attempt < MAX_RETRIES - 1:
            time.sleep(BACKOFF_BASE * (2 ** attempt))
    raise RuntimeError(
        f"Data360 request failed after {MAX_RETRIES} attempts "
        f"(params={params}): {last_error}"
    )


def _fetch_country_rows(indicator_id: str, ref_area: str, start_year: int,
                        end_year: int, database: str) -> list:
    """Return all raw Data360 rows for one indicator + one economy (paginated)."""
    rows, skip = [], 0
    while True:
        payload = _get_json({
            "DATABASE_ID": database,
            "INDICATOR": indicator_id,
            "REF_AREA": ref_area,
            "timePeriodFrom": int(start_year),
            "timePeriodTo": int(end_year),
            "skip": skip,
        })
        batch = payload.get("value", []) or []
        rows.extend(batch)
        total = payload.get("count", len(rows))
        if len(batch) < PAGE or skip + len(batch) >= total:
            break
        skip += PAGE
    return rows


def _fetch(indicator: str, start_year: int, end_year: int, markets: list,
           database: str = DEFAULT_DATABASE) -> pd.DataFrame:
    """Fetch one (classic WDI) indicator for the given markets/years via Data360.

    Returns df with columns [market, year, <indicator>]; empty df if no data.
    """
    indicator_id = to_data360_id(indicator, database)
    records = []
    for area in markets:
        try:
            rows = _fetch_country_rows(indicator_id, area, start_year, end_year, database)
        except RuntimeError as exc:                    # persistent transient failure
            warnings.warn(
                f"Data360 fetch for {indicator} / {area} failed after "
                f"{MAX_RETRIES} retries ({exc}); skipping this economy."
            )
            continue

        for x in rows:
            # keep the undisaggregated total series only
            if x.get("SEX") not in TOTAL_CODES:
                continue
            if x.get("AGE") not in TOTAL_CODES:
                continue
            if x.get("URBANISATION") not in TOTAL_CODES:
                continue
            raw = x.get("OBS_VALUE")
            if raw in (None, ""):
                continue
            try:
                year = int(x["TIME_PERIOD"])
                value = float(raw) * (10 ** int(x.get("UNIT_MULT") or 0))
            except (TypeError, ValueError, KeyError):
                continue
            records.append({"market": x.get("REF_AREA") or area, "year": year, indicator: value})

    cols = ["market", "year", indicator]
    if not records:
        return pd.DataFrame(columns=cols)
    return (
        pd.DataFrame(records)
        .drop_duplicates(subset=["market", "year"])
        .sort_values(["market", "year"])
        .reset_index(drop=True)
    )


def extract_transform(
    proxy_id: str,
    indicators,
    labels: str,
    metric=None,
    agg: str = "SUM",
    start_year: int = 2000,
    end_year: int = 2024,
    drop_nonpositive: bool = False,
    decimals: int = 6,
    markets: list = None,
    database: str = DEFAULT_DATABASE,
) -> pd.DataFrame:
    """
    Fetch one or more (classic WDI) indicators via Data360 and reshape into the
    standard long format for the Historical Data sheet.

    See module docstring for backend/resilience behaviour.

    Returns
    -------
    pd.DataFrame with columns [proxy_id, market, year, value, labels, metric].
    """
    if isinstance(indicators, str):
        indicators = [indicators]
    agg = agg.upper()
    if agg not in ("SUM", "AVG"):
        raise ValueError("agg must be 'SUM' or 'AVG'")
    mkts = markets or MARKETS

    empty = pd.DataFrame(columns=OUTPUT_COLUMNS)

    merged = None
    for ind in indicators:
        d = _fetch(ind, start_year, end_year, mkts, database=database)
        merged = d if merged is None else merged.merge(d, on=["market", "year"], how="outer")
    if merged is None or merged.empty:
        return empty

    cols = [c for c in indicators if c in merged.columns]
    if not cols:
        return empty

    if len(cols) == 1:
        merged["value"] = merged[cols[0]]
    else:
        merged = merged.dropna(subset=cols, how="all")
        merged["value"] = merged[cols].sum(axis=1) if agg == "SUM" else merged[cols].mean(axis=1)

    merged = merged.dropna(subset=["value"])
    if drop_nonpositive:
        merged = merged[merged["value"] > 0]
    if merged.empty:
        return empty

    if isinstance(metric, str) and metric.upper() == "AUTO":
        chosen = choose_metric(merged["value"])
        merged["value"] = scale_values(merged["value"], chosen)
        metric_out = chosen
    elif metric in (None, "THOUSANDS", "MILLIONS", "BILLIONS"):
        if metric is not None:
            merged["value"] = scale_values(merged["value"], metric)
        metric_out = metric
    else:
        raise ValueError(
            "metric must be None, 'AUTO', 'THOUSANDS', 'MILLIONS', or 'BILLIONS'; "
            f"got {metric!r}"
        )

    merged["value"] = merged["value"].round(decimals)
    merged["proxy_id"] = proxy_id + "_" + merged["market"]
    merged["labels"] = labels
    merged["metric"] = metric_out

    return (
        merged[OUTPUT_COLUMNS]
        .sort_values(["market", "year"])
        .reset_index(drop=True)
    )
