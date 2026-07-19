#!/usr/bin/env python3
"""
Build-time data pipeline: Final Data.xlsx  ->  src/data/*.json

Emits three files consumed by the React app (no runtime XLSX parsing, no backend):

  1. power-timeseries.json  — the Level-3 explorer feed. Nested
     proxy -> market -> scenario -> [[year, value, lower_ci, upper_ci], ...]
     (nesting instead of tidy rows keeps it small — no repeated keys).
     Plus proxy metadata, per-country statistical summaries and a market
     catalog (code -> country name) for the pickers.

  2. power-figures.json     — the exact series for the 11 Level-2 charts.
     share-of-world / bloc composites are COMPUTED from the sheet here
     (mirrors Analysis_Functions/share_of_world.analyze_share_of_world:
     per proxy per year, value / world-total, averaged across D1/D2/D4/D5).
     Values that are editorial/external or come from heavier notebook logic
     (orbit clusters, radar, signatures, institutions) are the notebook-
     validated numbers from the build spec §11, tagged {"source":"spec-11"}.
     The script prints computed-vs-spec anchor checks so drift is visible.

Run:  python3 scripts/build_data.py
Uses openpyxl only (the repo's base pandas has a numpy2 conflict).
"""
import json, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
APP  = os.path.dirname(HERE)
# Final Data.xlsx sits two levels up from Website/app
XLSX = os.path.normpath(os.path.join(APP, "..", "..", "Final Data.xlsx"))
OUT  = os.path.join(APP, "src", "data")
os.makedirs(OUT, exist_ok=True)

MARKET_NAMES = {
    "ARE":"United Arab Emirates","ARG":"Argentina","AUS":"Australia","BGD":"Bangladesh",
    "BRA":"Brazil","CAN":"Canada","CHN":"China","COD":"DR Congo","DEU":"Germany",
    "EGY":"Egypt","ETH":"Ethiopia","FRA":"France","GBR":"United Kingdom","GLO":"World",
    "IDN":"Indonesia","IND":"India","IRN":"Iran","ISR":"Israel","ITA":"Italy","JPN":"Japan",
    "KAZ":"Kazakhstan","KEN":"Kenya","KOR":"South Korea","MEX":"Mexico","NGA":"Nigeria",
    "NLD":"Netherlands","PAK":"Pakistan","POL":"Poland","RUS":"Russia","SAU":"Saudi Arabia",
    "TUR":"Turkey","UKR":"Ukraine","USA":"United States","VNM":"Vietnam","ZAF":"South Africa",
}

def rnd(v, n=4):
    if v is None: return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    if f != f:  # NaN
        return None
    r = round(f, n)
    return int(r) if r == int(r) else r

def die(msg):
    print("ERROR:", msg); sys.exit(1)

# ---------------------------------------------------------------- load sheet
try:
    import openpyxl
except ImportError:
    die("openpyxl not installed (pip install openpyxl)")
if not os.path.exists(XLSX):
    die(f"Final Data.xlsx not found at {XLSX}")

print(f"reading {XLSX}")
wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)

# proxy catalog from 'Proxy Information'
proxy_meta = {}
if "Proxy Information" in wb.sheetnames:
    ws = wb["Proxy Information"]
    it = ws.iter_rows(values_only=True)
    header = next(it)
    hi = {h: i for i, h in enumerate(header)}
    for r in it:
        if not r or r[hi.get("id")] is None:
            continue
        pid = str(r[hi["id"]]).strip()
        proxy_meta[pid] = {
            "id": pid,
            "name": r[hi.get("proxy_name")] if "proxy_name" in hi else pid,
            "description": r[hi.get("proxy_description")] if "proxy_description" in hi else "",
            "source": r[hi.get("data_source")] if "data_source" in hi else "",
        }

# main data
ws = wb["Final Full Data"]
it = ws.iter_rows(values_only=True)
header = next(it)
hi = {h: i for i, h in enumerate(header)}
for req in ("proxy_id","id","market","year","value","labels","scenario","lower_ci","upper_ci"):
    if req not in hi:
        die(f"column '{req}' missing from Final Full Data")

# nested[proxy_id][market][scenario] = list of [year,value,lo,hi]
nested = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
proxy_unit = {}            # base id (D1) -> unit label
proxy_topic = {}           # base id -> force/topic slug
proxy_ids_present = set()   # base ids
rows = 0
# raw[(base_id, market, year, scenario)] = value   (for share computations)
raw = {}

for r in it:
    if r is None or r[hi["proxy_id"]] is None:
        continue
    pid   = str(r[hi["proxy_id"]]).strip()      # e.g. D1_USA
    base  = str(r[hi["id"]]).strip()            # e.g. D1
    mkt   = str(r[hi["market"]]).strip()
    yr    = r[hi["year"]]
    val   = r[hi["value"]]
    unit  = r[hi["labels"]]
    scen  = str(r[hi["scenario"]]).strip()
    lo    = r[hi["lower_ci"]]
    hh    = r[hi["upper_ci"]]
    if yr is None or val is None:
        continue
    yr = int(yr)
    nested[base][mkt][scen].append([yr, rnd(val), rnd(lo), rnd(hh)])
    if base not in proxy_unit and unit:
        proxy_unit[base] = str(unit)
    if base not in proxy_topic:
        topic = r[hi["topic"]] if "topic" in hi else None
        proxy_topic[base] = str(topic).strip().lower() if topic else "power"
    proxy_ids_present.add(base)
    raw[(base, mkt, yr, scen)] = float(val)
    rows += 1

print(f"  {rows} rows · {len(proxy_ids_present)} base proxies · {len(nested)} series groups")

# sort each series by year
for base in nested:
    for mkt in nested[base]:
        for scen in nested[base][mkt]:
            nested[base][mkt][scen].sort(key=lambda x: x[0])

# Requested single-country context from the workbook's Statistical Data sheet.
STAT_FIELDS = ("change_direction", "change_speed", "uncertainty_level", "cagr_p1y", "cagr_p3y", "cagr_full")
statistics = defaultdict(dict)
if "Statistical Data" in wb.sheetnames:
    ws_stats = wb["Statistical Data"]
    stat_rows = ws_stats.iter_rows(values_only=True)
    stat_header = next(stat_rows)
    si = {h: i for i, h in enumerate(stat_header)}
    if all(key in si for key in ("id", "market", *STAT_FIELDS)):
        for r in stat_rows:
            if not r or r[si["id"]] in (None, "id") or r[si["market"]] in (None, "market"):
                continue
            base = str(r[si["id"]]).strip()
            market = str(r[si["market"]]).strip()
            statistics[base][market] = {
                field: (rnd(r[si[field]]) if field.startswith("cagr_") else r[si[field]])
                for field in STAT_FIELDS
            }

# ---------------------------------------------------------------- proxy catalog
def group_of(base):
    return base.split("_")[0]

catalog = []
for base in sorted(proxy_ids_present, key=lambda b: (b.split("_")[0], b)):
    meta = proxy_meta.get(base, {})
    catalog.append({
        "id": base,
        "group": group_of(base),
        "name": meta.get("name") or base,
        "topic": proxy_topic.get(base, "power"),
        "unit": proxy_unit.get(base, ""),
        "description": meta.get("description", ""),
        "source": meta.get("source", ""),
    })

markets_present = sorted({m for base in nested for m in nested[base] if m != "GLO"})
# GLO (World) is excluded from share math but IS selectable in the explorer
# (some series — ICJ, treaty ratification, world peacekeeping — are global-only).
has_glo = any("GLO" in nested[base] for base in nested)
market_catalog = ([{"code": "GLO", "name": "World"}] if has_glo else []) + \
    [{"code": m, "name": MARKET_NAMES.get(m, m)} for m in markets_present]

timeseries = {
    "meta": {"topic": "power", "years": [2000, 2040],
             "scenarios": ["historical","main_scenario","optimistic_scenario","pessimistic_scenario"]},
    "proxies": catalog,
    "markets": market_catalog,
    "statistics": {b: dict(statistics[b]) for b in statistics},
    # series[base][market][scenario] = [[year,value,lo,hi]]
    "series": {b: {m: dict(nested[b][m]) for m in nested[b]} for b in nested},
}
with open(os.path.join(OUT, "power-timeseries.json"), "w") as f:
    json.dump(timeseries, f, separators=(",", ":"))
sz = os.path.getsize(os.path.join(OUT, "power-timeseries.json"))/1024
print(f"  wrote power-timeseries.json ({sz:.0f} KB)")

# ---------------------------------------------------------------- share of world
# analyze_share_of_world: per proxy, per (year,scenario): share = value / world-total
# (world-total = sum across the 35 country markets, GLO excluded).
# Composite "power share" = mean of shares across D1,D2,D4,D5.
POWER_PROXIES = ["D1", "D2", "D4", "D5"]
COUNTRY_MARKETS = [m for m in markets_present]  # excludes GLO already

def proxy_share_by_year(base, scen_chain=("historical","main_scenario")):
    """Return {year: {market: share_pct}} stitching historical then main."""
    out = defaultdict(dict)
    # gather all years available per scenario
    years = set()
    for (b, m, y, s) in raw:
        if b == base and m in COUNTRY_MARKETS and s in scen_chain:
            years.add((y, s))
    # at the historical/projection seam (e.g. 2025) prefer the ACTUAL
    # (historical) value; use main_scenario only where history runs out.
    year_scen = {}
    for (y, s) in years:
        if y not in year_scen or (s == "historical"):
            year_scen[y] = s
    for y, s in year_scen.items():
        total = 0.0
        vals = {}
        for m in COUNTRY_MARKETS:
            v = raw.get((base, m, y, s))
            if v is not None:
                vals[m] = v
                total += v
        if total > 0:
            for m, v in vals.items():
                out[y][m] = 100.0 * v / total
    return out

def composite_share():
    per = {p: proxy_share_by_year(p) for p in POWER_PROXIES}
    years = sorted(set().union(*[set(per[p].keys()) for p in POWER_PROXIES]))
    comp = {}
    for y in years:
        comp[y] = {}
        for m in COUNTRY_MARKETS:
            shares = [per[p][y][m] for p in POWER_PROXIES if y in per[p] and m in per[p][y]]
            if shares:
                comp[y][m] = sum(shares) / len(shares)
    return comp

comp = composite_share()
def anchor(m, y):
    return round(comp.get(y, {}).get(m, float("nan")), 1)
print("  share-of-world composite (computed):")
for y in (2025, 2030, 2040):
    print(f"    {y}: US={anchor('USA',y)}  CN={anchor('CHN',y)}")

# Build ShareLines from computed composite (real per-year lines), main path.
def line_for(m):
    ys = sorted(comp.keys())
    return [[y, round(comp[y].get(m, 0), 2)] for y in ys if m in comp.get(y, {})]

# faint background = a few other large players
BACKGROUND = ["IND","DEU","JPN","RUS","GBR"]
share_lines = {
    "focus": [
        {"market": "USA", "name": "United States", "values": line_for("USA")},
        {"market": "CHN", "name": "China", "values": line_for("CHN")},
    ],
    "background": [{"market": m, "name": MARKET_NAMES.get(m, m), "values": line_for(m)} for m in BACKGROUND],
    "anchors": [2025, 2030, 2040],
    "note": "Composite share of world power = mean of D1/D2/D4/D5 shares.",
}

# ---------------------------------------------------------------- figures (spec §11)
# Editorial / notebook-validated series. See build spec §11. These are the
# authoritative published numbers; charts render them verbatim.
S = "spec-11"
figures = {
    "shareLines": {
        "source": "analyze_share_of_world · D1/D2/D4/D5", "computed": True,
        **share_lines,
        # spec §11 anchor values (US #1 all three years; gap 5->4 pts):
        "specAnchors": {"USA": [25.2, 24.9, 24.7], "CHN": [19.9, 20.5, 20.8]},
    },
    "blocStack": {
        "source": "bloc-share cell", "src": S,
        "years": [2025, 2030, 2035, 2040],
        "blocs": [
            {"key": "west",  "label": "West (US + NATO/EU + Pacific allies)", "values": [51.8, 51.4, 51.0, 50.6]},
            {"key": "cnrus", "label": "China + Russia", "values": [24.0, 25.3, 26.7, 28.0]},
            {"key": "india", "label": "India", "values": [6.0, 6.1, 6.2, 6.3]},
            {"key": "rest",  "label": "Rest of world", "values": [18.2, 17.2, 16.1, 15.1]},
        ],
        "majorityRef": 50,
    },
    "orbitMap": {
        "source": "cluster_to_anchor · D8_1-4 + D9_1-4", "src": S,
        "poles": [
            {"key": "usa", "label": "United States", "count": 14},
            {"key": "nonaligned", "label": "Non-aligned (around India)", "count": 7},
            {"key": "china", "label": "China", "count": 6},
            {"key": "russia", "label": "Russia", "count": 3},
        ],
        "note": "34 states positioned by nearest pole; a large non-aligned cluster floats between the giants. Stable across 2025/2030/2040.",
    },
    "issueDials": {
        "source": "world_direction · D6/D7", "src": S,
        "security": {"needle": "West", "value": 72, "label": "≈72% of arms Western-supplied"},
        "economy": {"needle": "China", "value": 68, "label": "China = top trade partner for most of the Global South"},
        "netAlignment": {"from": 1.10, "to": 1.08, "label": "Power-weighted world alignment stays net-West"},
    },
    "powerRadar": {
        "source": "power_profile / share_detail", "src": S,
        "axes": ["Military", "Technology", "Industry (CINC)", "Trade", "GDP"],
        "series": [
            {"market": "USA", "name": "United States", "values": [37, 42, 14, 24, 25]},
            {"market": "CHN", "name": "China", "values": [18, 22, 31, 23, 21]},
        ],
        "note": "US leads Military & Technology; China leads industrial capacity; Trade/GDP near parity.",
    },
    "consensusBar": {
        "source": "D14", "src": S,
        "bars": [
            {"key": "gs", "label": "Global South (avg)", "value": 83},
            {"key": "ind", "label": "India", "value": 78},
            {"key": "chn", "label": "China", "value": 71},
            {"key": "eu", "label": "EU allies (avg)", "value": 63},
            {"key": "jpn", "label": "Japan", "value": 58},
            {"key": "usa", "label": "United States", "value": 48},
        ],
        "note": "Votes with the global majority (D14). US is among the biggest outliers.",
    },
    "twoSpeed": {
        "source": "classify_trends · D10/D11/D12", "src": S,
        "onPaper": {"rising": 3, "flat": 10, "declining": 0, "label": "Treaty ratification (13 series)"},
        "inPractice": [
            {"key": "pko", "label": "UN peacekeeping", "change": -47, "unit": "% 2025→2040"},
            {"key": "icj", "label": "ICJ compulsory jurisdiction", "level": 42, "unit": "% of members"},
        ],
    },
    "institutionsBars": {
        "source": "external (flagged data gap)", "src": "external",
        "external": True,
        "incumbent": [
            {"key": "wb",  "label": "World Bank (annual lending)", "value": 100},
            {"key": "imf", "label": "IMF (lending capacity)", "value": 150},
        ],
        "parallel": [
            {"key": "ndb2024", "label": "NDB + AIIB (2024)", "value": 120},
            {"key": "ndb2025", "label": "NDB + AIIB (2025)", "value": 200},
        ],
        "unit": "USD billions (approx.)",
        "note": "Junior parallel system grows (~$120B→$200B) but stays smaller than incumbents. External estimates — not in the sheet.",
    },
    "leverSlope": {
        "source": "base-unit world totals · D1/D2/D4/D13/D16", "src": S,
        "levers": [
            {"key": "military",  "label": "Military",   "change": 11},
            {"key": "economic",  "label": "Economic",   "change": 12},
            {"key": "resource",  "label": "Resource",   "change": 12},
            {"key": "technology","label": "Technology", "change": 11},
            {"key": "rules",     "label": "Rules",      "change": -47, "highlight": True},
        ],
        "span": [2025, 2040],
        "note": "Material levers grow evenly; the rules lever alone declines.",
    },
    "techDominanceBar": {
        "source": "power_profile · D16", "src": S,
        "year": 2040,
        "bars": [
            {"market": "USA", "name": "United States", "value": 42},
            {"market": "CHN", "name": "China", "value": 22},
            {"market": "JPN", "name": "Japan", "value": 8},
            {"market": "DEU", "name": "Germany", "value": 6},
            {"market": "KOR", "name": "South Korea", "value": 5},
            {"market": "IND", "name": "India", "value": 4},
            {"market": "ROW", "name": "Rest of world", "value": 13},
        ],
        "annotation": "US + China ≈ 64% of world R&D",
    },
    "signatureMap": {
        "source": "power_profile signatures", "src": S,
        "groups": [
            {"key": "tech", "label": "Technology elite", "count": 5,
             "members": ["USA","CHN","DEU","JPN","KOR"]},
            {"key": "force", "label": "Force fringe", "count": 4,
             "members": ["RUS","ISR","PAK","UKR"]},
            {"key": "resource", "label": "Resource / commodity bloc", "count": 15,
             "members": ["SAU","ARE","AUS","CAN","BRA","IDN","KAZ","NGA","IRN","COD","ETH","KEN","ZAF","ARG","EGY"]},
            {"key": "economic", "label": "Economic middle", "count": 10,
             "members": ["FRA","GBR","IND","MEX","TUR","ITA","NLD","POL","BGD","VNM"]},
        ],
    },
}

with open(os.path.join(OUT, "power-figures.json"), "w") as f:
    json.dump(figures, f, separators=(",", ":"))
print(f"  wrote power-figures.json ({os.path.getsize(os.path.join(OUT,'power-figures.json'))/1024:.0f} KB)")
print("done.")
