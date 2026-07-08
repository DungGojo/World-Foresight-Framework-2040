"""
Scrape UN Treaty Collection participant tables for the D11 treaty basket.

Each ViewDetails.aspx page server-renders a participant grid
(id ...tblgrid): Participant | Signature | Ratification/Acceptance/Approval/Accession
(column order/labels vary per treaty). We keep countries that became a FULL PARTY
(a date in the ratification/accession column); signatory-only rows are dropped.

Column pick: skip any column whose header mentions "signature" (some treaties label
their signature column "Signature, Succession to signature(d)" — that 'succession'
must NOT be mistaken for the binding column), then take the first remaining column
that mentions ratification/accession/acceptance/approval/formal confirmation.

Output: one CSV per treaty -> d11_{idx}_{slug}.csv  (country, party_date, action).
Prints a verification report incl. each page's resolved treaty title (from tcTreaty).

NOTE — codes corrected vs. the original task after verifying against the
UNTC Chapter XXVI index:
  * CWC is XXVI-3 (task said XXVI-14, which does not exist).
  * NPT (#6) and Geneva Protocols (#12) are multi-depositary treaties NOT on the
    UNTC MTDSG — left as PENDING (see PENDING below), need an alternative source.
"""

import os
import re
import csv
import time

import requests
from bs4 import BeautifulSoup

# This script lives in Code/Transform_Functions/; CSVs go to <repo>/Raw Data/UN_Treaties/.
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(_REPO_ROOT, "Raw Data", "UN_Treaties")
os.makedirs(OUT_DIR, exist_ok=True)
URL = ("https://treaties.un.org/Pages/ViewDetails.aspx"
       "?src=TREATY&mtdsg_no={mtdsg}&chapter={chapter}&clang=_en")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

# (index, display name, slug, mtdsg_no, chapter) — verified against UNTC indexes.
TREATIES = [
    (1,  "Paris Agreement",   "paris",  "XXVII-7-d", 27),
    (2,  "CBD (Biodiversity)", "cbd",   "XXVII-8",   27),   # was XXVII-8-b (= Nagoya Protocol)
    (3,  "UNCLOS",            "unclos", "XXI-6",     21),
    (4,  "Rome Statute (ICC)", "rome",  "XVIII-10",  18),
    (5,  "ICCPR",             "iccpr",  "IV-4",       4),
    (7,  "CWC",               "cwc",    "XXVI-3",    26),   # corrected from XXVI-14
    (8,  "CTBT",              "ctbt",   "XXVI-4",    26),
    (9,  "ATT",               "att",    "XXVI-8",    26),
    (10, "UNTOC",             "untoc",  "XVIII-12",  18),
    (11, "UNCAC",             "uncac",  "XVIII-14",  18),
]
# Not on UNTC MTDSG (multi-depositary) — need an alternative source / user decision:
#   6  NPT               (task code XXVI-3 is actually CWC)
#   12 Geneva Protocols  (task code XXVI-1 is actually ENMOD)

MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 1)}
DATE_RE = re.compile(r"(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})")
ACTION = {"": "ratification", "A": "acceptance", "AA": "approval",
          "a": "accession", "d": "succession", "c": "formal confirmation"}
PARTY_KWS = ("ratification", "accession", "acceptance", "approval",
             "succession", "formal confirmation")


def norm(s):
    return re.sub(r"\s+", " ", (s or "").replace("\t", " ")).strip()


def clean_country(raw):
    s = norm(raw)
    return re.sub(r"\s+\d+(\s*,\s*\d+)*$", "", s).strip()


def parse_date(raw):
    s = norm(raw)
    m = DATE_RE.search(s)
    if not m:
        return None, None
    d, mon, y = m.groups()
    month = MONTHS.get(mon[:3].title())
    if not month:
        return None, None
    iso = f"{int(y):04d}-{month:02d}-{int(d):02d}"
    rest = s[m.end():].replace("]", " ").strip()
    tok = re.sub(r"[^A-Za-z]", "", rest.split()[0]) if rest.split() else ""
    return iso, ACTION.get(tok, "ratification")


def find_grid(soup):
    for t in soup.find_all("table"):
        if (t.get("id") or "").endswith("tblgrid"):
            return t
    for t in soup.find_all("table"):
        first = t.find("tr")
        if first and any("participant" in norm(c.get_text()).lower()
                         for c in first.find_all(["td", "th"])):
            return t
    return None


def col_indices(header_cells):
    headers = [norm(c.get_text()).lower() for c in header_cells]
    part = next((i for i, h in enumerate(headers) if "participant" in h), 0)
    # the binding column: NOT a signature column, AND mentions a party keyword
    cand = [i for i, h in enumerate(headers)
            if i != part and "signature" not in h and any(k in h for k in PARTY_KWS)]
    party = cand[0] if cand else (len(headers) - 1)
    return part, party, header_cells[party].get_text(" ", strip=True)


def get_title(soup):
    tc = soup.find(id=re.compile("tcTreaty$"))
    if tc:
        return norm(tc.get_text(" "))
    return norm(soup.title.get_text()) if soup.title else ""


def scrape_one(sess, mtdsg, chapter):
    url = URL.format(mtdsg=mtdsg, chapter=chapter)
    last = None
    for attempt in range(3):
        try:
            r = sess.get(url, timeout=45)
            r.raise_for_status()
            return r.text
        except Exception as e:                              # noqa: BLE001
            last = e
            time.sleep(2 * (attempt + 1))
    raise last


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    sess = requests.Session()
    sess.headers.update({"User-Agent": UA})
    report = []

    for idx, name, slug, mtdsg, chapter in TREATIES:
        row = {"idx": idx, "name": name, "title": "", "party_col": "",
               "parties": 0, "sig_only": 0, "no_date": 0, "status": ""}
        try:
            soup = BeautifulSoup(scrape_one(sess, mtdsg, chapter), "html.parser")
            row["title"] = get_title(soup)
            grid = find_grid(soup)
            if grid is None:
                row["status"] = "NO GRID"
                report.append(row)
                print(f"[{idx:>2}] {name:<20} !! NO GRID ({mtdsg})")
                continue

            trs = grid.find_all("tr")
            part_i, party_i, party_hdr = col_indices(trs[0].find_all(["td", "th"]))
            row["party_col"] = party_hdr

            out = []
            for tr in trs[1:]:
                cells = tr.find_all(["td", "th"])
                if len(cells) <= party_i:
                    continue
                country = clean_country(cells[part_i].get_text(" ", strip=True))
                if not country:
                    continue
                date_raw = cells[party_i].get_text(" ", strip=True)
                if not norm(date_raw):
                    row["sig_only"] += 1
                    continue
                iso, action = parse_date(date_raw)
                if iso is None:
                    row["no_date"] += 1
                    continue
                out.append((country, iso, action))

            out.sort(key=lambda x: x[0])
            with open(os.path.join(OUT_DIR, f"d11_{idx}_{slug}.csv"),
                      "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["country", "party_date", "action"])
                w.writerows(out)
            row["parties"] = len(out)
            row["status"] = "ok"
            print(f"[{idx:>2}] {name:<20} {len(out):>3} parties "
                  f"(sig-only {row['sig_only']}) -> d11_{idx}_{slug}.csv")
        except Exception as e:                              # noqa: BLE001
            row["status"] = f"ERROR {type(e).__name__}: {str(e)[:90]}"
            print(f"[{idx:>2}] {name:<20} !! {row['status']}")
        report.append(row)
        time.sleep(1.0)

    print("\n================ VERIFICATION (resolved title must match name) ====")
    for r in report:
        flag = "" if r["name"].split()[0].lower() in r["title"].lower() else "  <-- CHECK"
        print(f"#{r['idx']:>2} {r['name']:<20} title={r['title'][:55]!r}{flag}")
        print(f"     parties={r['parties']} sig-only={r['sig_only']} "
              f"col={r['party_col'][:45]!r} status={r['status']}")


if __name__ == "__main__":
    main()
