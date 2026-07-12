"""
Scrape NPT (#6) and Geneva Additional Protocol I (#12) — the two D11 treaties that
are NOT on the UN Treaty Collection (both multi-depositary).

Sources (best available that are server-rendered / scrapeable):
  * NPT      -> Wikipedia "List of parties to the Treaty on the Non-Proliferation
                of Nuclear Weapons". Columns: State | Signed | Deposited | Method.
                The 'Deposited' cell carries up to 3 dates (London/Moscow/Washington
                depositaries); we take the EARLIEST as the year the state became a
                party. FULL dates (YYYY-MM-DD).
  * AP-I     -> Wikipedia "List of parties to the Geneva Conventions". The Additional
                Protocol I column gives the YEAR of ratification/accession only
                (the ICRC IHL database has exact dates but is a JS SPA). So party_date
                here is YEAR-precision -> emitted as "YYYY-01-01" (see PRECISION note).

Output: d11_6_npt.csv and d11_12_geneva.csv with columns country, party_date, action
(plus a `precision` column so downstream code knows day vs year granularity).

NOTE: run this on a normal network (Wikipedia must be reachable). Same output dir
and schema spirit as scrape_un_treaties.py so the 12 files sit together.
"""

import os
import re
import csv

import requests
from bs4 import BeautifulSoup

# This script lives in Data Preparation/Extract_Functions/; CSVs go to <repo>/Raw Data/UN_Treaties/.
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(_REPO_ROOT, "Raw Data", "UN_Treaties")
os.makedirs(OUT_DIR, exist_ok=True)
UA = {"User-Agent": "WFF-research/1.0 (academic data project; contact dung@synthesis.partners)"}

MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun",
     "jul", "aug", "sep", "oct", "nov", "dec"], 1)}
DATE_RE = re.compile(r"(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})")
YEAR_RE = re.compile(r"\b(19|20)\d{2}\b")


def _get_soup(url):
    r = requests.get(url, headers=UA, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


def _clean(txt):
    txt = re.sub(r"\[[^\]]*\]", "", txt)          # drop [1] footnote refs
    return re.sub(r"\s+", " ", txt).strip()


def _cells(tr):
    return [_clean(c.get_text(" ", strip=True)) for c in tr.find_all(["td", "th"])]


def _iso_dates(text):
    out = []
    for d, mon, y in DATE_RE.findall(text):
        mi = MONTHS.get(mon[:3].lower())
        if mi:
            out.append(f"{int(y):04d}-{mi:02d}-{int(d):02d}")
    return sorted(out)


def _find_parties_table(soup, min_rows=120):
    """First sortable wikitable that looks like the parties list."""
    best = None
    for t in soup.find_all("table"):
        cls = " ".join(t.get("class") or [])
        if "wikitable" not in cls:
            continue
        rows = t.find_all("tr")
        if len(rows) >= min_rows and "Afghanistan" in t.get_text():
            if best is None or len(rows) > len(best.find_all("tr")):
                best = t
    return best


def scrape_npt(out_dir=OUT_DIR):
    """NPT parties with full deposit dates (earliest of the 3 depositaries)."""
    url = ("https://en.wikipedia.org/wiki/"
           "List_of_parties_to_the_Treaty_on_the_Non-Proliferation_of_Nuclear_Weapons")
    soup = _get_soup(url)
    table = _find_parties_table(soup)
    if table is None:
        raise RuntimeError("NPT: parties table not found")

    rows = []
    for tr in table.find_all("tr"):
        c = _cells(tr)
        if len(c) < 4 or not c[0] or c[0].lower() == "state":
            continue
        country = c[0]
        dates = _iso_dates(c[2])               # 'Deposited' column
        if not dates:
            continue
        m = c[3].lower()                       # 'Method' cell may carry footnote text
        action = next((k for k in ("ratification", "accession", "succession", "signature")
                       if k in m), "ratification")
        rows.append((country, dates[0], action, "day"))

    rows.sort(key=lambda x: x[0])
    path = os.path.join(out_dir, "d11_6_npt.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["country", "party_date", "action", "precision"])
        w.writerows(rows)
    print(f"NPT     -> {len(rows):>3} parties -> d11_6_npt.csv  (full dates)")
    return rows


def scrape_geneva_ap1(out_dir=OUT_DIR, ap1_col=2):
    """
    Geneva Additional Protocol I parties (YEAR precision).
    Wikipedia 'List of parties to the Geneva Conventions': columns are
      State | GC | AP I | AP II | AP III | (AP-I art.90 decl.) | Notes
    so AP-I is column index 2. party_date is emitted as 'YYYY-01-01'.
    """
    url = "https://en.wikipedia.org/wiki/List_of_parties_to_the_Geneva_Conventions"
    soup = _get_soup(url)
    table = _find_parties_table(soup, min_rows=150)
    if table is None:
        raise RuntimeError("Geneva: parties table not found")

    rows = []
    for tr in table.find_all("tr"):
        c = _cells(tr)
        if len(c) <= ap1_col or not c[0] or c[0].lower() == "state":
            continue
        country = c[0]
        m = YEAR_RE.search(c[ap1_col])         # AP-I column -> year only
        if not m:
            continue                            # '—' / blank = not a party to AP-I
        year = m.group(0)
        rows.append((country, f"{year}-01-01", "party", "year"))

    rows.sort(key=lambda x: x[0])
    path = os.path.join(out_dir, "d11_12_geneva.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["country", "party_date", "action", "precision"])
        w.writerows(rows)
    print(f"AP-I    -> {len(rows):>3} parties -> d11_12_geneva.csv (YEAR precision)")
    return rows


if __name__ == "__main__":
    scrape_npt()
    scrape_geneva_ap1()
