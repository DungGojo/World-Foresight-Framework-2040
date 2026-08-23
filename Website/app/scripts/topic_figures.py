"""Per-topic Level-2 figure specs.

One block per topic; `build_figures(C)` returns {topic_id: {dataKey: figure}}.
`C` is the analysis API assembled by build_data.py (see the `computed` dict there).

Every figure carries a `src` tag so the site can label provenance honestly:

  "computed" — recomputed from Final Data.xlsx on this run, mirroring the
               notebook's Analysis_Functions. Verified against the topic docx
               by the anchor checks in build_data.py.
  "spec"     — transcribed from the topic docx, where the finding rests on a
               judgment call (bloc membership, cluster naming, editorial counts)
               that the sheet cannot make on its own.
  "external" — from an outside authority (IPCC, IMF, ITU, IEA, IRENA, OECD,
               Freedom House...). Per MODEL_LIMITATIONS.md every absolute 2040
               level must come from here rather than from our damped forecast.
"""

BACKGROUND = ["IND", "DEU", "JPN", "RUS", "GBR"]


def _share_lines(C, comp, focus, background=BACKGROUND, boundary=None, anchors=(2025, 2030, 2040),
                 annotation=None, source="", decimals=2):
    fig = {
        "src": "computed", "source": source,
        "focus": C["lines_from"](comp, focus, decimals),
        "background": C["lines_from"](comp, background, decimals),
        "anchors": list(anchors),
    }
    if boundary:
        fig["boundary"] = boundary
    if annotation:
        fig["annotation"] = annotation
    return fig


def _dispersion_bars(series, source, note=None, src="spec", highlight=None, inverse=False,
                     title=None, unit=None, value_suffix="%"):
    """An index-of-spread figure as bars around the 2025 baseline.

    These were slope charts, but every series starts at exactly 100 by
    construction, so all the labels piled onto one point and the chart was
    unreadable. The only information is the endpoint, which is a signed change —
    bars around zero.

    Colouring is the site-wide one: + green, - red, never flipped. An inverted
    scale so that "converging" came out green looked like a bug next to every
    other chart; the left/right captions carry which direction is the good one.
    """
    rows = []
    for sr in series:
        rows.append({"market": sr["key"], "label": sr["label"],
                     "value": round(sr["to"] - sr["from"], 1),
                     **({"coverage": sr["coverage"]} if sr.get("coverage") else {})})
    rows.sort(key=lambda r: r["value"])
    fig = {
        "src": src, "source": source,
        "unit": unit or "Change in the gap between countries, 2025 to 2040.",
        "valueSuffix": value_suffix, "showUnit": True,
        "leftLabel": "Gap narrows as countries converge",
        "rightLabel": "Gap widens as countries pull apart",
        "tone": "inverse" if inverse else "sign", "highlight": highlight or [],
        "rows": rows, "note": note,
    }
    if title:
        fig["title"] = title
    return fig


def _slope(series, span, note=None, y_label=None, source="", src="spec", note_wide=False):
    fig = {"src": src, "source": source, "span": list(span),
           "series": series, "yLabel": y_label, "note": note}
    if note_wide:
        fig["noteWide"] = True
    return fig


def _counters(counters, note=None, source="", src="spec"):
    return {"src": src, "source": source, "counters": counters, "note": note}





SIGNATURE_GROUPS = [
    ("tech", "Technology elite", ["USA", "CHN", "DEU", "JPN", "KOR"]),
    ("force", "Force-first states", ["RUS", "UKR", "ISR", "PAK"]),
    ("resource", "Resource / commodity bloc",
     ["SAU", "ARE", "AUS", "CAN", "BRA", "IDN", "KAZ", "NGA", "IRN", "COD",
      "ETH", "KEN", "ZAF", "ARG", "EGY"]),
    ("economic", "Economic middle",
     ["FRA", "GBR", "IND", "MEX", "TUR", "ITA", "NLD", "POL", "BGD", "VNM"]),
]


def _signature_map(C):
    """Each country's dominant power lever. Members carry their names so the
    chart can badge them with flags and name them on hover, the same way the
    orbit map does, instead of showing bare ISO codes."""
    return {
        "src": "spec", "source": "power_profile signatures",
        "groups": [
            {"key": key, "label": label, "count": len(members),
             "members": [{"market": m, "name": C["market_names"].get(m, m)} for m in members]}
            for key, label, members in SIGNATURE_GROUPS
        ],
        "note": ("Hover or tap a flag for the country name. Each country is grouped by the "
                 "lever it is strongest on relative to the other 33, not by how powerful it "
                 "is overall."),
    }


def _soft_power(C):
    """The 2025 → 2040 soft-power move for the eight leaders.

    Eight near-parallel slopes in a twenty-point band were unreadable; as a
    dumbbell sorted by the 2040 score the convergence is the shape itself, and
    the gain per country is directly comparable.
    """
    scores = {y: C["at"]("D3", y) for y in (2025, 2040)}
    leaders = sorted(scores[2040], key=lambda m: -scores[2040][m])[:8]
    rows = [{"key": m, "market": m, "label": C["market_names"].get(m, m),
             "from": round(scores[2025][m], 1), "to": round(scores[2040][m], 1)}
            for m in sorted(C["markets"], key=lambda m: scores[2040].get(m, 0))
            if m in scores[2025] and m in scores[2040]]
    leaders = set(leaders)
    lo = min(r["from"] for r in rows)
    hi = max(r["to"] for r in rows)
    return {
        "src": "computed", "source": "anchor_table · D3 Brand Finance soft-power score",
        "rows": rows, "unit": "Brand Finance soft-power score (0–100)",
        "domain": [int((lo - 2) // 5 * 5), int(-(-(hi + 2) // 5) * 5)],
        "fromLabel": "2025", "toLabel": "2040",
        "valueMode": "delta", "neutral": True, "highlight": ["USA"],
        "pick": True, "maxSelected": 8,
        "defaults": [r["key"] for r in rows if r["key"] in leaders],
    }


def _two_speed(C):
    """Commitments vs capability, both as the real series behind the claim.

    The 'on paper' panel carries only the average of the thirteen participation
    measures — the individual treaty lines were detail the reader could not use.
    """
    treaties = [
        ("D11_1", "Paris Agreement"), ("D11_2", "Biological Diversity"), ("D11_3", "UNCLOS"),
        ("D11_4", "Rome Statute (ICC)"), ("D11_5", "ICCPR"), ("D11_6", "NPT"),
        ("D11_7", "Chemical Weapons"), ("D11_8", "CTBT"), ("D11_9", "Arms Trade Treaty"),
        ("D11_10", "UNTOC"), ("D11_11", "UNCAC"), ("D11_12", "Geneva Protocol I"),
        ("D10", "ICJ jurisdiction"),
    ]
    g = C["global"]
    span = list(range(2016, 2041))
    mean = []
    for y in span:
        got = [g(pid, y) for pid, _ in treaties if g(pid, y) is not None]
        if got:
            mean.append([y, round(sum(got) / len(got), 1)])
    rising = sum(1 for pid, _ in treaties
                 if g(pid, 2040) is not None and g(pid, 2040) > g(pid, span[0]))

    pk = [[y, round(g("D12", y) / 1000, 1)] for y in range(2010, 2041) if g("D12", y) is not None]
    by = dict(pk)

    return {
        "src": "computed", "source": "D11_1-12 ratification · D10 ICJ · D12 peacekeeping",
        "panels": [
            {"key": "paper", "label": "What countries sign up to",
             "sub": ("Average share of the 193 UN members bound by twelve major treaties and "
                     "accepting the ICJ's compulsory jurisdiction"),
             "unit": "% of UN members", "domain": [0, 100],
             "series": [{"key": "mean", "label": "Average of the 13 commitments",
                         "values": mean, "highlight": False}],
             "stats": [{"value": f"{rising} of {len(treaties)}",
                        "label": "commitment measures are higher in 2040 than in 2016",
                        "tone": "up"}]},
            {"key": "practice", "label": "What they actually field",
             "sub": ("Uniformed personnel deployed on UN peacekeeping missions worldwide, "
                     "in thousands"),
             "unit": "thousand personnel",
             "series": [{"key": "pko", "label": "UN peacekeepers", "values": pk, "highlight": True}],
             "stats": [
                 {"value": f"{round(100 * (by[2040] / by[2025] - 1))}%",
                  "label": "against 2025", "tone": "down"},
                 {"value": f"{round(100 * (by[2040] / by[2010] - 1))}%",
                  "label": "against 2010", "tone": "down"},
             ]},
        ],
    }


def _consensus_shift(C):
    """How often each country votes with the global majority, 2025 against 2040."""
    a, b = C["at"]("D14", 2025), C["at"]("D14", 2040)
    keys = sorted(set(a) & set(b), key=lambda m: b[m])
    rows = [{"key": m, "market": m, "label": C["market_names"].get(m, m),
             "from": round(a[m], 1), "to": round(b[m], 1)} for m in keys]
    lo = min(r["from"] for r in rows)
    hi = max(r["to"] for r in rows)
    return {
        "src": "computed", "source": "D14 · % of UN votes aligned with the global majority",
        "rows": rows, "unit": "% of UN votes cast with the global majority",
        "fromLabel": "2025", "toLabel": "2040",
        "domain": [int((lo - 3) // 5 * 5), int(-(-(hi + 3) // 5) * 5)],
        "valueMode": "delta", "neutral": True, "pick": True,
        "defaults": ["ISR", "USA", "CHN"], "maxSelected": 8,
        "rank": {"USA": keys.index("USA") + 1, "of": len(keys)},
    }


def _split_tracks(C):
    """Vote lean vs trade lean per country, at both anchor years.

    Both are the per-domain tilts out of alignment_tilt: +1 fully US-facing,
    -1 fully China-facing. A country whose two tracks land on opposite sides of
    zero votes with one giant and earns from the other. The row order is fixed
    once, on the 2040 vote lean, and reused for both panels so a country sits on
    the same line in each.
    """
    rows = {y: C["alignment_tilt"](y) for y in (2025, 2040)}
    markets = sorted(set(rows[2040]) & set(rows[2025]),
                     key=lambda m: -(rows[2040][m].get("votes") or 0))
    countries = []
    for m in markets:
        rec = {"market": m, "name": rows[2040][m]["name"], "votes": {}, "trade": {}, "split": {}}
        for y in (2025, 2040):
            r = rows[y][m]
            rec["votes"][str(y)] = r.get("votes")
            rec["trade"][str(y)] = r.get("trade")
            rec["split"][str(y)] = r["split"]
        countries.append(rec)
    return {
        "src": "computed", "source": "alignment_tilt · D8_1/D8_2 vs D9_1/D9_2",
        "years": [2025, 2040],
        "poles": {"west": "United States", "east": "China"},
        "trackLabels": {"votes": "Vote", "trade": "Trade"},
        "countries": countries,
        "splitCount": [sum(1 for r in rows[y].values() if r["split"]) for y in (2025, 2040)],
        "total": len(markets),
        # open on the states the argument names, plus the one that splits the
        # other way, so the default view already shows both directions
        "defaults": ["JPN", "KOR", "AUS", "DEU", "MEX", "ISR"],
        "maxSelected": 10,
    }


def _posture_shift(C):
    """The four alignment camps in 2040, with their members.

    Shown as flag clusters rather than bars: the finding is about how many
    countries sit in each camp and which ones, and 2025 carries the same four
    camp sizes, so only the 2040 picture is drawn."""
    counts, rows = C["posture_counts"](2040)
    meta = [("hedge", "Hedging"), ("east", "East-aligned"),
            ("auto", "Autonomous"), ("west", "West-aligned")]
    return {
        "src": "computed", "source": "alignment_tilt · D8_1/D8_2 vs D9_1/D9_2 · 2040",
        "year": 2040, "total": len(rows),
        "camps": [
            {"key": key, "label": label, "count": counts.get(key, 0),
             "members": [{"market": m, "name": rows[m]["name"], "tilt": rows[m]["tilt"]}
                         for m in sorted(rows, key=lambda m: -rows[m]["tilt"])
                         if rows[m]["posture"] == key]}
            for key, label in meta
        ],
    }


def _power_radar(C):
    """Five-lever world shares for every market, at the 2040 anchor.

    2025 and 2040 shapes are near-identical on every lever, so carrying both
    panels doubled the chart for no added reading; only 2040 is drawn."""
    axes = [label for label, _, _ in C["radar_axes"]]
    year = 2040
    values_by_axis = C["radar_axis_values"](year)
    countries = []
    for m in C["markets"]:
        row, missing = [], []
        for ax in axes:
            v = values_by_axis[ax].get(m)
            if v is None:
                missing.append(ax)
                row.append(0.0)
            else:
                row.append(round(v, 1))
        countries.append({"market": m, "name": C["market_names"].get(m, m),
                          "values": row, **({"missing": missing} if missing else {})})
    countries.sort(key=lambda c: -max(c["values"]))
    return {
        "src": "computed", "source": "share_of_world · D1/D16/D159/D2/D4 · 2040",
        "axes": axes, "year": year, "unit": "% of the 34-country world",
        "defaults": ["USA", "CHN"], "maxSelected": 6,
        "countries": countries,
    }



# ===================================================================== POWER
def power_figures(C):
    comp = C["power_comp"]
    gap40 = round(comp[2040]["USA"] - comp[2040]["CHN"], 1)

    # Argument 1, finding 2 — the two-method test.
    # The docx says China ranks first on the equal-weighted composite. That does
    # not survive checking: rank_market_relevance clips final scores to 100, so
    # the US and China BOTH hit the 100.0 ceiling and the "China first" ordering
    # is only pandas' alphabetical tie-break. On the pre-clip aggregate the US
    # still leads (96.7 vs 95.8 in 2040). What is real is that the two methods
    # disagree about the SIZE of the lead, and that D5 is the reason.
    eq = C["composite_index"]([("D1", "positive"), ("D2", "positive"), ("D4", "positive"),
                               ("D5", "positive"), ("D3", "positive")], 2040)
    money = {m: comp[2040][m] for m in comp[2040]}
    top6 = sorted(money, key=lambda m: -money[m])[:6]

    def order(scores):
        return [{"market": m, "name": C["market_names"].get(m, m), "value": round(scores[m], 1)}
                for m in sorted(top6, key=lambda m: -scores.get(m, 0))]

    return {
        "shareLines": _share_lines(
            C, comp, ["USA", "CHN"],
            annotation=None,
            source="share_trajectory · D1/D2/D4/D5"),

        "rankSwap": {
            "src": "computed", "source": "rank_market_relevance vs analyze_share_of_world",
            "panels": [
                {"key": "money", "label": "Ranked by raw size",
                 "unit": "% of world", "rows": order(money)},
                {"key": "equal", "label": "Ranked on a level scale",
                 "unit": "0–100 score", "rows": order(eq)},
            ],
            "tie": ["USA", "CHN"],
            "note": ("We compare 34 countries across military spending, trade, GDP, national "
                     "capability and soft power. Size ranking averages each country's share of "
                     "the four measures available as world totals. Balanced ranking puts all "
                     "five on the same 0–100 scale and gives each equal weight."),
        },

        "scenarioBullet": {
            "src": "spec", "source": "ranking_stability · scenario_spread",
            "label": "US − China power-share gap, 2040",
            "unit": "percentage points",
            "value": 4.0, "range": [3.8, 4.1], "refLine": 0,
            "domain": [0, 6],
            "note": ("Even in our most China-favorable and most US-favorable scenarios, the "
                     "gap never closes to zero, and the top eight countries keep the exact "
                     "same ranking every time."),
        },

        # Bloc membership is the judgment call the sheet cannot make; the shares
        # themselves are power_comp sums over that membership, so the 2030
        # column is computed the same way as the 2025 and 2040 ones rather than
        # interpolated. West = US + NATO/EU + Pacific allies (Ukraine and Israel
        # sit in 'rest': neither is in NATO/EU nor a Pacific ally).
        "blocStack": {
            "src": "spec", "source": "bloc-share cell · share_trajectory · D1/D2/D4/D5",
            "years": [2025, 2030, 2040],
            "blocs": [
                {"key": "west",  "label": "West (US + NATO/EU + Pacific allies)", "values": [51.8, 51.0, 50.5]},
                {"key": "cnrus", "label": "China + Russia", "values": [24.0, 24.6, 24.8]},
                {"key": "india", "label": "India", "values": [6.0, 6.2, 6.3]},
                {"key": "rest",  "label": "Rest of world", "values": [18.3, 18.5, 18.5]},
            ],
            "majorityRef": 50,
        },

        # Promoted from spec to computed: the pipeline now runs the same
        # nearest-anchor clustering as Analysis_Functions/cluster_to_anchor, so
        # the camps carry their actual membership (and the counts are checked
        # against the docx's 14/7/6/3 on every run) rather than a bare tally.
        "orbitMap": {
            "src": "computed", "source": "cluster_to_anchor · D8_1-4 + D9_1-4 · 2040",
            "poles": [
                {"key": "usa", "market": "USA", "label": "United States",
                 "members": C["cluster_members"](2040, "USA")},
                {"key": "nonaligned", "market": "IND", "label": "Non-aligned",
                 "members": C["cluster_members"](2040, "IND")},
                {"key": "china", "market": "CHN", "label": "China",
                 "members": C["cluster_members"](2040, "CHN")},
                {"key": "russia", "market": "RUS", "label": "Russia",
                 "members": C["cluster_members"](2040, "RUS")},
            ],
            "note": ("Each of the 34 countries grouped by which giant it sits closest to. "
                     "This barely changes between now and 2040."),
        },

        # ---- argument 2: the shift already happened
        "shareLinesLong": _share_lines(
            C, comp, ["USA", "CHN"], boundary=2025, anchors=(2000, 2010, 2025, 2040),
            source="share_trajectory · D1/D2/D4/D5 · 2000–2040"),

        "concentrationBands": {
            "src": "spec", "source": "concentration_trend · share_trajectory",
            "years": [2000, 2025, 2040],
            "bands": [
                {"key": "top2", "label": "Top 2 (US + China)", "values": [41.5, 45.1, 45.4]},
                {"key": "middle", "label": "Ranks 3–10", "values": [37.1, 30.0, 29.5]},
                {"key": "tail", "label": "Ranks 11+", "values": [21.8, 25.1, 25.2]},
            ],
            "highlight": "middle",
        },

        "effectivePowers": {
            "src": "spec", "source": "concentration_trend",
            "series": [{"key": "neff", "label": "Countries with real weight",
                        "values": [[2000, 7.5], [2010, 8.5], [2025, 8.4], [2040, 8.4]]}],
            "boundary": 2025, "unit": "", "yLabel": "Number of countries with real weight",
            "domain": [6, 10],
            "noteWide": True,
            "note": ("A standard measure of how concentrated power is confirms the same "
                     "story: it fell sharply through the 2000s, then held steady."),
        },

        # ---- argument 3: loyalty splits by issue
        # Promoted from spec to computed. The two dials now carry both anchor
        # years, because the finding is about divergence over time: security
        # stays pinned West while money keeps sliding toward China. The old
        # "the world overall still leans West" footnote (D6's ideal-point mean)
        # contradicted that reading and has been dropped.
        "issueDials": {
            "src": "computed", "source": "D7_2/D7_3 arms supply · D9_1/D9_2 trade share",
            "years": [2025, 2040],
            "dials": [
                {"key": "security", "title": "Security",
                 "westLabel": "West", "eastLabel": "China + Russia",
                 "west": [round(C["mean_at"]("D7_2", y), 1) for y in (2025, 2040)],
                 "east": [round(C["mean_at"]("D7_3", y), 1) for y in (2025, 2040)],
                 "unit": "% of arms imports"},
                {"key": "economy", "title": "Trade",
                 "westLabel": "West", "eastLabel": "China",
                 "west": [round(C["mean_at"]("D9_1", y), 1) for y in (2025, 2040)],
                 "east": [round(C["mean_at"]("D9_2", y), 1) for y in (2025, 2040)],
                 "unit": "% of goods trade"},
            ],
        },

        # Was a counter strip of bare numbers, then a rail diagram that read as
        # spaghetti. Now the same picker-and-panels shape as the radar below:
        # choose countries, and each one shows its two tracks — how it votes and
        # where its money goes — at both anchor years.
        "splitCountries": _split_tracks(C),

        "posture": _posture_shift(C),

        # Promoted from spec to computed, and opened up to all 34 countries at
        # both anchor years so the reader can compare any set they like. The
        # axes are world shares of the five levers the argument names.
        "powerRadar": _power_radar(C),

        "twoSpeed": _two_speed(C),

        "consensusDrift": {
            "src": "spec", "source": "D14 dispersion over time",
            "series": [{"key": "mean", "label": "Average votes with the global majority",
                        "values": [[2000, 80.8], [2010, 79.5], [2025, 72.3], [2040, 71.4]]}],
            "band": [[2000, 70.6, 91.0], [2010, 68.7, 90.3], [2025, 61.5, 83.1], [2040, 60.6, 82.2]],
            "boundary": 2025, "unit": "%",
            "yLabel": "Votes with the global majority",
            "noteWide": True,
            "note": ("The spread between the most- and least-aligned countries barely "
                     "changes, which means the whole world drifts together rather than "
                     "splitting into opposing camps. The shaded band shows the typical "
                     "range across countries."),
        },

        "consensusBar": _consensus_shift(C),

        # ---- argument 5: material levers
        # A slope chart stacked the four material levers into one indistinct
        # band while the rules line plunged off on its own. As bars either side
        # of zero the split is the whole picture at a glance.
        "leverSlope": {
            "src": "spec", "source": "base-unit world totals · D1/D2/D4/D13/D16",
            "span": [2025, 2040],
            "unit": "% change in the world total, 2025 → 2040",
            "leftLabel": "Shrinking", "rightLabel": "Growing",
            "highlight": ["rules"],
            "rows": [
                {"market": "economic", "label": "Economic", "value": 12},
                {"market": "resource", "label": "Resource", "value": 12},
                {"market": "military", "label": "Military", "value": 11},
                {"market": "technology", "label": "Technology", "value": 10},
                {"market": "rules", "label": "Rules", "value": -47},
            ],
        },

        "techDominanceBar": {
            "src": "spec", "source": "power_profile · D16",
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
            "note": "Together the US and China account for roughly 64% of world R&D spending.",
        },

        "signatureMap": _signature_map(C),

        "softPowerSlope": _soft_power(C),
    }



def _bands(C, pid, years, top_label, bottom_label, world_label, rank_year=2025,
           n=8, decimals=1, unit="", y_label="", note=None, source="", name_bands=None,
           top_color="power", bottom_color="planet"):
    """Three lines from one per-country proxy: the top band, the world mean and
    the bottom band, with membership fixed on `rank_year`.

    Several findings claim divergence while their chart plotted only the world
    mean — which is flat by construction when the two ends move apart. Bands
    make the claim visible. Colours encode direction, not list order.
    """
    base = C["at"](pid, rank_year)
    order = sorted(base, key=lambda m: -base[m])
    top, bottom = order[:n], order[-n:]

    def line(members):
        out = []
        for y in years:
            vals = C["at"](pid, y)
            got = [vals[m] for m in members if m in vals]
            if got:
                out.append([y, round(sum(got) / len(got), decimals)])
        return out

    return {
        "src": "computed",
        "source": source or f"share_detail · {pid} · bands fixed on {rank_year}",
        "unit": unit, "yLabel": y_label,
        **({"valueSuffix": unit} if unit == "%" else {}),
        "series": [
            {"key": "top", "label": top_label, "values": line(top), "color": top_color},
            {"key": "world", "label": world_label, "values": line(order), "color": "muted"},
            {"key": "bottom", "label": bottom_label, "values": line(bottom), "color": bottom_color},
        ],
        "note": note,
        # naming the members answers "which countries?" without a caption
        **({"members": [
            {"key": "top", "label": top_label,
             "names": [name_bands["market_names"].get(m, m) for m in top]},
            {"key": "bottom", "label": bottom_label,
             "names": [name_bands["market_names"].get(m, m) for m in bottom]},
        ]} if name_bands else {}),
    }



def _responsibility_split(C, worst):
    """The top per-person emitters beside the countries least able to cope.

    The point is that the two lists do not overlap, which reads faster as two
    columns of flags than as a table of names.
    """
    per_capita = C["at"]("D63", 2040)
    top = sorted(per_capita, key=lambda m: -per_capita[m])[:8]
    return {
        "src": "computed", "source": "anchor_table · D63 vs quadrant_map · 2040",
        "valueSuffix": "",
        "columns": [
            {"key": "emitters", "label": "Top 8 highest emissions per person", "color": "#b43a31",
             "members": [{"market": m, "name": C["market_names"].get(m, m),
                          "value": round(per_capita[m], 1)} for m in top]},
            {"key": "exposed", "label": "Top 8 exposed and unable to adapt", "color": "#647b45",
             "members": [{"market": m, "name": C["market_names"].get(m, m)} for m in worst]},
        ],
    }


def _value_capture(C):
    """Where ICT export value is kept, as three bands rather than one world mean.

    The finding is about divergence, but the chart used to plot only the world
    average, which is flat — so it showed the opposite of what it claimed. The
    bands are fixed on the 2025 ranking and tracked back to 2010, which is where
    the gap starts opening.
    """
    base = C["at"]("D42", 2025)
    order = sorted(base, key=lambda m: -base[m])
    top, bottom = order[:8], order[-8:]

    def band(members, years):
        out = []
        for y in years:
            vals = C["at"]("D42", y)
            got = [vals[m] for m in members if m in vals]
            if got:
                out.append([y, round(sum(got) / len(got), 1)])
        return out

    years = list(range(2010, 2041))
    allm = band(order, years)
    return {
        "src": "computed", "source": "share_detail · D42 · bands fixed on the 2025 ranking",
        "unit": "%", "valueSuffix": "%",
        "yLabel": "Share of ICT export value retained at home",
        # colours encode direction, not list order: the band that is losing value
        # must not render green just because it sorts third
        "series": [
            {"key": "top", "label": "Eight highest-value economies", "values": band(top, years),
             "color": "planet"},
            {"key": "world", "label": "All 31 countries", "values": allm, "color": "muted"},
            {"key": "bottom", "label": "Eight assembly economies", "values": band(bottom, years),
             "color": "power"},
        ],
        "noteWide": True,
        "note": ("The world average is flat because the two ends move in opposite "
                 "directions: the gap between the highest-value and assembly economies "
                 "widens from 26 points in 2010 to 38 by 2040."),
    }


# ================================================================ TECHNOLOGY
LAYERS = [
    ("D16", "Research & development spending", "USA"),
    ("D30", "Data-centre revenue", "USA"),
    ("D31", "Semiconductor revenue", "CHN"),
    ("D24", "Medium/high-tech manufacturing", "CHN"),
    ("D22", "High-technology exports", "CHN"),
    ("D26", "Scientific articles", "CHN"),
    ("D27", "ICT service exports", "IND"),
]


def tech_figures(C):
    comp = C["tech_comp"]

    layer_rows = []
    for pid, label, leader in LAYERS:
        vals = C["at"](pid, 2040)
        total = sum(vals.values())
        shares = {m: 100.0 * v / total for m, v in vals.items()}
        top = max(shares, key=shares.get)
        h, neff = C["hhi"](pid, 2040)
        layer_rows.append({
            "proxy": pid, "label": label,
            "leader": top, "leaderName": C["market_names"].get(top, top),
            "share": round(shares[top], 1),
            "hhi": h, "effectivePlayers": neff,
        })

    # state control (higher = more control, so the freedom-oriented V-Dem/Freedom
    # House series are negated) against citizen digital capability.
    control = C["composite_index"]([("D49", "negative"), ("D51", "negative"),
                                    ("D53", "negative"), ("D55", "negative")], 2040)
    capability = C["composite_index"]([("D52", "positive"), ("D56", "positive")], 2040)
    REGIME = {
        "open": ["USA", "CAN", "DEU", "FRA", "GBR", "ITA", "NLD", "POL", "JPN", "KOR",
                 "AUS", "BRA", "ARG", "ZAF", "ISR"],
        "controlled": ["CHN", "RUS", "IRN", "SAU", "ARE", "EGY", "ETH", "KAZ", "TUR", "VNM"],
        "contested": ["IND", "IDN", "MEX", "NGA", "KEN", "PAK", "BGD", "COD", "UKR"],
    }
    regime_of = {m: k for k, ms in REGIME.items() for m in ms}

    return {
        "techShareLines": _share_lines(
            C, comp, ["CHN", "USA"], background=["JPN", "DEU", "KOR", "IND", "GBR"],
            boundary=2025, anchors=(2000, 2010, 2025, 2040),
            source="share_trajectory · D16/D22/D24/D26/D27/D30/D31"),

        "layerStack": {
            "src": "computed", "source": "share_detail · 2040",
            "layers": layer_rows,
        },

        "layerConcentration": {
            "src": "computed", "source": "analyze_share_of_world HHI · 2040",
            "unit": "effective competitors", "valueSuffix": " real competitors",
            "bars": [{"key": r["proxy"], "label": r["label"],
                      "value": r["effectivePlayers"], "detail": f"~{r['effectivePlayers']} real competitors"}
                     for r in sorted(layer_rows, key=lambda r: r["effectivePlayers"])],
            # the finding is about the two ends of this list, so name them
            "highlight": ["D16", "D27"],
            "note": ("\u2018Real competitors\u2019 is the effective number of players: a "
                     "market split evenly between four countries scores 4, while one where a "
                     "single country holds most of it scores close to 1, however many "
                     "countries take part."),
        },

        "rdTwoMethod": {
            "src": "external", "source": "OECD via Science/AAAS · ITIF (Feb 2026)",
            "panels": [
                {"key": "mer", "label": "At market exchange rates",
                 "sub": "Each country's R&D spending converted at the going dollar rate",
                 "leader": "USA",
                 "bars": [
                     {"market": "USA", "name": "United States", "value": 41.7, "display": "41.7% of world"},
                     {"market": "CHN", "name": "China", "value": 22.0, "display": "22.0% of world"},
                 ]},
                {"key": "ppp", "label": "Adjusted for local cost of living",
                 "sub": "The same spending measured by what it actually buys (PPP, OECD 2024)",
                 "leader": "CHN",
                 "bars": [
                     {"market": "USA", "name": "United States", "value": 1.01, "display": "~$1.01tn"},
                     {"market": "CHN", "name": "China", "value": 1.03, "display": "~$1.03tn"},
                 ]},
            ],
            "note": ("Both measures are defensible. China passed the US on the "
                     "cost-of-living-adjusted measure in 2024."),
        },

        # ---- argument 2: access converges, capability diverges
        "accessFunnel": {
            "src": "computed", "source": "cross-country mean · D28/D48",
            "valueSuffix": "%",
            "panels": [
                {"key": "d28", "label": "Individuals using the internet",
                 "unit": "% of population, world average",
                 "values": [[y, round(C["mean_at"]("D28", y), 1)]
                            for y in (2000, 2010, 2025, 2040)]},
                # D48 only begins in 2013, so its panel starts where the data does
                {"key": "d48", "label": "Mobile-broadband cost",
                 "unit": "% of monthly income, world average",
                 "values": [[y, round(C["mean_at"]("D48", y), 2)]
                            for y in (2015, 2025, 2040)]},
            ],
        },

        "dispersionSlope": _dispersion_bars([
            {"key": "D28", "label": "Internet use", "from": 100, "to": 53},
            {"key": "D48", "label": "Mobile-broadband cost", "from": 100, "to": 55},
            {"key": "D42", "label": "Domestic value added in ICT exports", "from": 100, "to": 105.8},
            {"key": "D35", "label": "ICT-graduate share", "from": 100, "to": 139},
            {"key": "D36", "label": "Labour-productivity growth", "from": 100, "to": 254,
             "coverage": "14 markets, too thin for a public claim on its own"},
        ], inverse=False, source="divergence · D28/D48/D42/D35/D36",
            highlight=["D35", "D36"]),

        "gapDumbbell": {
            "src": "computed", "source": "cross-country mean · D46/D47",
            "valueSuffix": "%",
            "panels": [
                {"key": "d46", "label": "Internet-use gender gap",
                 "unit": "percentage points, world average",
                 "values": [[y, round(C["mean_at"]("D46", y), 1)] for y in (2010, 2025, 2040)]},
                {"key": "d47", "label": "Urban–rural internet-use gap",
                 "unit": "percentage points, world average",
                 "values": [[y, round(C["mean_at"]("D47", y), 1)] for y in (2010, 2025, 2040)]},
            ],
            "note": ("The most-lagging country makes almost no progress on either gap: "
                     "14.5 points on gender and 30.6 on urban–rural, both unchanged "
                     "through 2040."),
        },

        # ---- argument 3: production moved, rent did not
        "ipBalance": {
            "src": "computed", "source": "anchor_table · D43 · 2040",
            "unit": "USD billions",
            "leftLabel": "Pays more than it collects (USD billions)",
            "rightLabel": "Collects more than it pays (USD billions)",
            "hideUnit": True,
            "rows": sorted(
                [{"market": m, "label": C["market_names"].get(m, m), "value": round(v / 1000.0, 1)}
                 for m, v in C["at"]("D43", 2040).items()],
                key=lambda r: -r["value"]),
            "highlight": ["CHN", "USA"],
            "noteWide": True,
        },

        "rentQuadrant": _rent_quadrant(C),

        "valueCapture": _value_capture(C),

        "labourShare": {
            "src": "spec", "source": "anchor_table · D39",
            "series": [{"key": "d39", "label": "World mean labour income share",
                        "values": [[y, round(C["mean_at"]("D39", y), 1)]
                                   for y in (2005, 2010, 2025, 2040)]}],
            "anchors": [2005, 2010, 2025, 2040], "valueSuffix": "%",
            "unit": "%", "yLabel": "Labour income share of GDP",
            "domain": [45, 55],
            "noteWide": True,
        },

        # ---- argument 4: the scissors
        "controlCapability": {
            "src": "spec", "source": "anchor_table · D49/D51/D53/D55 vs D52/D56",
            "unit": "No. of countries of 34",
            "leftLabel": "Worsening", "rightLabel": "Improving",
            "rows": [
                {"label": "Government social-media monitoring", "worse": 25, "better": 0, "band": "control"},
                {"label": "State disinformation", "worse": 24, "better": 0, "band": "control"},
                {"label": "Internet freedom (Freedom on the Net)", "worse": 27, "better": 2, "band": "control"},
                {"label": "Arrest risk for online political content", "worse": 16, "better": 0, "band": "control"},
                {"label": "Social media used to organise offline action", "worse": 0, "better": 29, "band": "capability"},
                {"label": "UN e-participation", "worse": 0, "better": 22, "band": "capability"},
            ],
            "bands": {"control": "What the state can do to citizens",
                      "capability": "What citizens can do with the network"},
        },

        "scissors": _dispersion_bars([
            {"key": "control", "label": "Variation in state control",
             "from": 100, "to": 110},
            {"key": "d52", "label": "Citizens organising online", "from": 100, "to": 93},
            {"key": "d56", "label": "UN e-participation", "from": 100, "to": 65},
        ], inverse=False, source="divergence · D49–D56", highlight=["control"]),

        "regimeQuadrant": {
            "src": "computed", "source": "typology k=3 · D49–D56 · 2040",
            "xLabel": "State control over the network",
            "yLabel": "Citizen digital capability",
            "splitX": 50, "splitY": 50, "year": 2040,
            "points": [{"market": m, "name": C["market_names"].get(m, m),
                        "x": round(control[m], 1), "y": round(capability[m], 1),
                        "quadrant": regime_of.get(m, "contested"),
                        "highlight": regime_of.get(m) == "contested"}
                       for m in sorted(set(control) & set(capability))],
            "clusters": {
                "open": {"label": "Open bloc", "count": 15},
                "controlled": {"label": "Controlled bloc", "count": 10},
                "contested": {"label": "Contested middle", "count": 9},
            },
            "colorBy": "quadrant",
            # the three regimes separate cleanly on the control axis, so they are
            # drawn as vertical bands. 70.3 rather than 69 puts every one of the
            # 34 countries inside its own band (Pakistan sits at 70.1).
            "clusterBands": [
                {"key": "open", "to": 45},
                {"key": "contested", "from": 45, "to": 70.3},
                {"key": "controlled", "from": 70.3},
            ],
            "flags": True, "noteWide": True,
        },
    }


def _rent_quadrant(C):
    ip = C["at"]("D43", 2040)
    ds = C["at"]("D44", 2040)
    keys = sorted(set(ip) & set(ds))
    names = {(True, True): "Owns and sells", (False, True): "Sells but rents",
             (False, False): "Buys both", (True, False): "Owns but does not sell"}
    return {
        "src": "computed", "source": "anchor_table · D43 vs D44 · 2040",
        "xLabel": "Net IP income (USD bn)", "yLabel": "Net digitally delivered services (USD bn)",
        "splitX": 0, "splitY": 0, "year": 2040, "flags": 10,
        "points": [{"market": m, "name": C["market_names"].get(m, m),
                    "x": round(ip[m] / 1000.0, 1), "y": round(ds[m] / 1000.0, 1),
                    "quadrant": names[(ip[m] >= 0, ds[m] >= 0)],
                    "highlight": m in ("IND", "CHN", "USA")}
                   for m in keys],
        "quadrants": {"11": "Owns and sells", "01": "Sells but rents",
                      "00": "Buys both", "10": "Owns but does not sell"},
    }


# ==================================================================== PLANET
def planet_figures(C):
    q40, q25 = C["planet_q"][2040], C["planet_q"][2025]
    worst = C["planet_worst"]

    cap25, cap40 = C["at"]("D92", 2025), C["at"]("D92", 2040)  # only for coverage
    capacity_scores_25 = C["composite_index"](
        [("D92", "negative"), ("D93", "positive"), ("D94", "negative")], 2025)
    capacity_scores_40 = C["composite_index"](
        [("D92", "negative"), ("D93", "positive"), ("D94", "negative")], 2040)

    emis = C["emissions_comp"]
    years = sorted(emis)
    def band(m):
        return [round(emis[y].get(m, 0), 2) for y in years]
    rest = [round(100 - sum(emis[y].get(m, 0) for m in ("CHN", "USA", "IND")), 2) for y in years]

    return {
        "exposureCapacity": {
            **q40,
            "src": "computed",
            "source": "quadrant_map + alignment_score · exposure D66/D68/D70/D73/D74 · capacity D92/D93/D94",
            "compare": {"year": 2025, "correlation": q25["correlation"], "counts": q25["counts"]},
            "highlight": worst + ["SAU", "ARE"],
            "annotations": [
                {"markets": ["SAU", "ARE"],
                 "text": "The only exposed countries that can buy their way out"},
            ],
            "flags": True, "hideStats": True,
            "note": "The 2025 and 2040 picture are the same: same split, same countries in each group.",
        },

        # A gap can be positive or negative and neither sign is self-explanatory,
        # so both ends of the axis are named and the colouring is inverted:
        # more exposure than capacity is the bad direction.
        "exposureGap": {
            "src": "computed", "source": "quadrant_map · 2040",
            "unit": "exposure minus adaptive capacity", "valueSuffix": " pts",
            "leftLabel": "Better equipped than exposed",
            "rightLabel": "More exposed than equipped",
            "tone": "inverse", "highlight": worst,
            "rows": [{"market": p["market"], "label": p["name"], "value": p["gap"]}
                     for p in sorted(q40["points"], key=lambda p: -p["gap"])],
        },



        # ---- argument 2: responsibility concentrates, damage spreads
        "emissionsArea": {
            "src": "computed", "source": "concentration_trend + share_trajectory · D62",
            "years": years,
            "bands": [
                {"key": "CHN", "label": "China", "values": band("CHN")},
                {"key": "USA", "label": "United States", "values": band("USA")},
                {"key": "IND", "label": "India", "values": band("IND")},
                {"key": "rest", "label": "Rest of the 34", "values": rest},
            ],
            "boundary": 2025,
        },

        "perCapitaSlope": {
            "src": "computed", "source": "anchor_table · D63",
            "title": "Fossil CO\u2082 per person (tonnes)",
            "years": [2025, 2040],
            "defaults": ["SAU", "ARE", "RUS", "USA", "CHN"], "maxSelected": 8,
            "countries": [{"market": r["market"], "name": r["name"],
                           "values": [r["from"], r["to"]]}
                          for r in sorted(C["pair"]("D63", 2025, 2040), key=lambda r: -r["to"])],
        },

        "responsibilitySplit": _responsibility_split(C, worst),

        # ---- argument 3: a transport transition
        # One indexed axis forced four different units onto one scale. Split in
        # two: the three shares belong together because they are all percentages,
        # and carbon intensity gets its own panel because gCO2/kWh does not.
        # One panel per measure: they are four different quantities, so a shared
        # scale (or a shared unit suffix) misstates three of them.
        "transitionIndexed": {
            "src": "computed", "source": "anchor_table · D88/D83/D85/D87",
            "panels": [
                {"key": "D88", "label": "Electric-vehicle sales share",
                 "unit": "% of new car sales, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D88", y), 1)] for y in (2025, 2030, 2040)]},
                {"key": "D83", "label": "Renewable share of final energy",
                 "unit": "% of all energy used, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D83", y), 1)] for y in (2025, 2030, 2040)]},
                {"key": "D85", "label": "Fossil share of electricity",
                 "unit": "% of generation, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D85", y), 1)] for y in (2025, 2030, 2040)]},
                {"key": "D87", "label": "Power-sector carbon intensity",
                 "unit": "gCO\u2082 per kWh, world average", "valueSuffix": " g",
                 "values": [[y, round(C["mean_at"]("D87", y), 1)] for y in (2025, 2030, 2040)]},
            ],
        },

        "transitionThresholds": {
            "src": "computed", "source": "threshold_matrix · D83",
            "title": "Renewable share of total final energy (%)",
            "years": [2025, 2040], "valueSuffix": "%",
            "refLine": 50, "refLabel": "half of all energy", "domainMax": 100,
            # opens on the four that clear the line plus two large economies that
            # do not, so the size of the gap is the first thing visible
            "defaults": ["COD", "ETH", "KEN", "NGA", "BRA", "IND"], "maxSelected": 8,
            "countries": [{"market": r["market"], "name": r["name"],
                           "values": [r["from"], r["to"]]}
                          for r in sorted(C["pair"]("D83", 2025, 2040), key=lambda r: -r["to"])],
            "note": "Only four of the 34 clear the line, and the same four clear it in both years.",
        },

        # Was an external two-row table. Both halves of the claim exist in our
        # own data, so it is now a timeseries: capacity per person against the
        # share of energy people actually use.
        "capacityVsSubstitution": {
            "src": "computed", "source": "anchor_table · D84 vs D83",
            "panels": [
                {"key": "d84", "label": "Renewable electricity capacity",
                 "unit": "watts per person, world average", "valueSuffix": " W",
                 "values": [[y, round(C["mean_at"]("D84", y))] for y in (2010, 2020, 2025, 2040)]},
                {"key": "d83", "label": "Renewable share of final energy",
                 "unit": "% of all energy used, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D83", y), 1)] for y in (2010, 2020, 2025, 2040)]},
            ],
        },

        "mineralDependence": _bands(
            C, "D91", [2010, 2015, 2020, 2025, 2030, 2035, 2040],
            top_label="Eight most import-dependent",
            world_label="All 34 countries",
            bottom_label="Eight net exporters",
            unit="%", y_label="Net import dependence",
            source="share_detail · D91 · bands fixed on the 2025 ranking",
            name_bands=C),

        # ---- argument 4: chronic conditions
        "heatBar": {
            "src": "computed", "source": "anchor_table · D66",
            "title": "Number of days above 35\u00b0C per year",
            "years": [2000, 2025, 2040], "ramp": "heat",
            "lowLabel": "cooler", "highLabel": "hotter",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D66", y).get(m, 0)) for y in (2000, 2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D66", 2040)],
        },

        "pm25Bar": {
            "src": "computed", "source": "anchor_table · D70",
            "title": "Annual mean PM2.5 exposure (\u00b5g/m\u00b3)",
            "years": [2000, 2025, 2040], "ramp": "goodbad",
            "lowLabel": "cleaner air", "highLabel": "dirtier air",
            "refLine": 5, "refLabel": "WHO guideline (5)",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D70", y).get(m, 0), 1) for y in (2000, 2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D70", 2040)],
            "note": ("Not one of the 34 countries reaches the WHO guideline at any point, and "
                     "nine stay above 35 throughout."),
        },

        "stressCounters": _counters([
            {"value": "21 of 34", "label": "above 25% water stress"},
            {"value": "17 of 34", "label": "below the 1,700 m³ per-capita scarcity threshold"},
            {"value": "10 of 34", "label": "above 20% moderate-or-severe food insecurity"},
        ], source="threshold_matrix + divergence · D73/D74/D78/D77"),

        "redList": _bands(
            C, "D82", [2010, 2015, 2020, 2025, 2030, 2035, 2040],
            top_label="Eight healthiest ecosystems",
            world_label="All 34 countries",
            bottom_label="Eight weakest ecosystems",
            decimals=3, unit="", y_label="Red List Index (1 = no species threatened)",
            top_color="planet", bottom_color="power",
            source="share_detail · D82 · bands fixed on the 2025 ranking",
            name_bands=C),
    }


def _indexed(C, proxies, y0, y1):
    out = []
    for pid, label in proxies:
        a, b = C["mean_at"](pid, y0), C["mean_at"](pid, y1)
        if a in (None, 0) or b is None:
            continue
        mid = C["mean_at"](pid, (y0 + y1) // 2)
        vals = [[y0, 100.0]]
        if mid:
            vals.append([(y0 + y1) // 2, round(100.0 * mid / a, 1)])
        vals.append([y1, round(100.0 * b / a, 1)])
        out.append({"key": pid, "label": label, "values": vals,
                    "raw": [round(a, 1), round(b, 1)],
                    "highlight": round(100.0 * b / a) > 130})
    return out


def _side_by_side(a, b):
    n = max(len(a), len(b))
    return [{"cells": [a[i] if i < len(a) else "", b[i] if i < len(b) else ""]} for i in range(n)]


# ==================================================================== PEOPLE
def people_figures(C):
    q40, q25 = C["people_q"][2040], C["people_q"][2025]
    worst = C["people_worst"]
    planet_worst = C["planet_worst"]
    overlap = sorted(set(planet_worst) & set(worst))

    age = C["ranked"]("D103", 2040)
    def age_group(v):
        return "old" if v >= 45 else ("young" if v < 25 else "middle")

    return {
        "medianAgeBar": {
            "src": "computed", "source": "anchor_table · D103",
            "title": "Median age, years", "years": [2025, 2040], "defaultYear": 2025,
            "ramp": "age", "lowLabel": "younger", "highLabel": "older",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D103", y).get(m, 0), 1) for y in (2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D103", 2040)],
        },

        "demographicDispersion": _dispersion_bars([
            {"key": "D107", "label": "Working-age population growth", "from": 100, "to": 122.8},
            {"key": "D105", "label": "Youth share", "from": 100, "to": 108.1},
            {"key": "D100", "label": "Population growth", "from": 100, "to": 106.9},
            {"key": "D104", "label": "65+ share", "from": 100, "to": 101.2},
            {"key": "D103", "label": "Median age", "from": 100, "to": 100.5},
            {"key": "D101", "label": "Fertility", "from": 100, "to": 99.6},
        ], source="divergence · D100–D107", highlight=["D107"],
            title="How far apart countries are on each measure, 2025 → 2040"),

        "fertilityCounters": {
            "src": "computed", "source": "anchor_table · D101",
            "title": "Births per woman", "years": [2025, 2040], "defaultYear": 2025,
            "ramp": "target", "target": 2.1,
            "lowLabel": "at replacement", "midLabel": "drifting",
            "highLabel": "far from replacement",
            "refLine": 2.1, "refLabel": "replacement rate (2.1)",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D101", y).get(m, 0), 2) for y in (2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D101", 2040)],
        },

        "ageingCrossings": {
            "src": "computed", "source": "anchor_table · D104",
            "title": "Population aged 65 and over (%)", "valueSuffix": "%",
            "years": [2025, 2040], "defaultYear": 2025,
            "ramp": "age", "lowLabel": "younger", "highLabel": "older",
            "refLine": 20, "refLabel": "one in five over 65",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D104", y).get(m, 0), 1) for y in (2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D104", 2040)],
            "note": ("Above 20% roughly one working-age adult supports every retiree pair. "
                     "Canada, the UK and Poland cross the line by 2040, taking the group "
                     "from five countries to eight."),
        },

        # ---- argument 2: capability converges, cohesion does not
        "capabilityFunnel": {
            "src": "computed", "source": "cross-country mean · D119/D121/D116/D118",
            "panels": [
                {"key": "D119", "label": "UHC service coverage", "unit": "index, 0\u2013100",
                 "values": [[y, round(C["mean_at"]("D119", y), 1)] for y in (2000, 2025, 2040)]},
                {"key": "D121", "label": "Upper-secondary completion", "unit": "% of adults",
                 "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D121", y), 1)] for y in (2000, 2025, 2040)]},
                {"key": "D116", "label": "Healthy life expectancy", "unit": "years",
                 "values": [[y, round(C["mean_at"]("D116", y), 1)] for y in (2000, 2025, 2040)]},
                {"key": "D118", "label": "Under-five mortality", "unit": "per 1,000 live births",
                 "tone": "down",
                 "values": [[y, round(C["mean_at"]("D118", y), 1)] for y in (2000, 2025, 2040)]},
            ],
        },

        "cohesionFunnel": {
            "src": "computed", "source": "cross-country mean · D136/D135/D137/D139",
            "panels": [
                {"key": "D136", "label": "Freedom of peaceful assembly",
                 "unit": "V-Dem scale, 0\u20131", "tone": "down",
                 "values": [[y, round(C["mean_at"]("D136", y), 2)] for y in (2000, 2025, 2040)]},
                {"key": "D135", "label": "Civil-society participation", "unit": "index, 0\u20131",
                 "tone": "down",
                 "values": [[y, round(C["mean_at"]("D135", y), 2)] for y in (2000, 2025, 2040)]},
                {"key": "D137", "label": "Demonstration events", "unit": "per million people",
                 "values": [[y, round(C["mean_at"]("D137", y), 1)] for y in (2000, 2025, 2040)]},
                {"key": "D139", "label": "Homicide", "unit": "per 100,000 people", "tone": "down",
                 "values": [[y, round(C["mean_at"]("D139", y), 2)] for y in (2000, 2025, 2040)]},
            ],
        },

        "maternalDumbbell": {
            "src": "computed", "source": "anchor_table · D117",
            "title": "Maternal deaths per 100,000 live births",
            "years": [2025, 2040],
            "defaults": ["NGA", "ETH", "COD", "PAK", "IND", "BRA"], "maxSelected": 8,
            "countries": [{"market": r["market"], "name": r["name"],
                           "values": [r["from"], r["to"]]}
                          for r in sorted(C["pair"]("D117", 2025, 2040), key=lambda r: -r["to"])],
            "note": ("The gap between countries widens more here than for any other health "
                     "measure in this topic: the countries already doing well improve fastest."),
        },

        "mentalHealth": {
            "src": "computed", "source": "cross-country mean · D124a",
            "series": [{"key": "d124a", "label": "Depression and anxiety prevalence",
                        "values": [[y, round(C["mean_at"]("D124a", y), 1)]
                                   for y in (2025, 2030, 2040)]}],
            "unit": "% of population", "yLabel": "Prevalence",
            "domain": [8, 16], "anchors": [2025, 2030, 2040], "valueSuffix": "%",
        },

        # ---- argument 3: pressure with nowhere to go
        "protestBar": {
            "src": "computed", "source": "anchor_table · D137",
            "title": "Demonstration events per million people",
            "years": [2025, 2040], "defaultYear": 2025,
            "ramp": "neutral", "lowLabel": "fewer", "highLabel": "more",
            "rows": [{"key": m, "label": C["market_names"].get(m, m),
                      "values": [round(C["at"]("D137", y).get(m, 0), 1) for y in (2025, 2040)]}
                     for m in C["markets"] if m in C["at"]("D137", 2040)],
        },

        "violenceVsProtest": {
            "src": "computed", "source": "cross-country mean · D137 vs D138",
            "panels": [
                {"key": "D137", "label": "Demonstration events",
                 "unit": "per million people, world average",
                 "values": [[y, round(C["mean_at"]("D137", y), 1)] for y in (2025, 2030, 2040)]},
                {"key": "D138", "label": "Political-violence fatalities",
                 "unit": "per million people, world average",
                 "values": [[y, round(C["mean_at"]("D138", y), 1)] for y in (2025, 2030, 2040)]},
            ],
        },

        "assemblyDecline": {
            "src": "computed", "source": "anchor_table · D136",
            "series": [{"key": "d136", "label": "Freedom of peaceful assembly (mean)",
                        "values": [[y, round(C["mean_at"]("D136", y), 3)]
                                   for y in C["years_for"]("D136")
                                   if C["mean_at"]("D136", y) is not None]}],
            "boundary": 2025, "unit": "", "yLabel": "Assembly-freedom scale (V-Dem)",
        },

        # D141 is reverse-coded (0 = severe polarisation, 4 = none). The registry
        # description had this backwards until 2026-08-17; the values were always
        # correct. Charted with the axis inverted so 'up' means more polarised.
        "polarisation": {
            "src": "computed", "source": "anchor_table · D141 (direction-corrected)",
            "yLabel": "More polarised →",
            "pick": True, "defaults": ["USA", "POL", "BRA"], "maxSelected": 6,
            "series": [{"key": m, "label": C["market_names"].get(m, m),
                        "values": [[y, -round(C["at"]("D141", y).get(m, 0), 2)]
                                   for y in (2000, 2010, 2025, 2040)]}
                       for m in sorted(C["markets"], key=lambda m: C["market_names"].get(m, m))
                       if m in C["at"]("D141", 2040)],
        },

        # ---- argument 4: pressure vs institutions
        "pressureInstitutions": {
            **q40,
            "src": "computed", "flags": True, "hideStats": True,
            "source": ("quadrant_map · pressure D128/D123/D125/D131/D110/D105 · "
                       "institutions D134/D135/D136/D119"),
            "compare": {"year": 2025, "correlation": q25["correlation"], "counts": q25["counts"]},
            "highlight": worst + ["ZAF"],
            "annotations": [{"markets": ["ZAF"], "text": "Pressured but absorbing"}],
        },

        "pressureGap": {
            "src": "computed", "source": "quadrant_map · 2040",
            "unit": "pressure minus institutional capacity", "valueSuffix": " pts",
            "leftLabel": "Institutions stronger than the pressure",
            "rightLabel": "Pressure greater than the institutions",
            "tone": "inverse", "highlight": worst,
            "rows": [{"market": p["market"], "label": p["name"], "value": p["gap"]}
                     for p in sorted(q40["points"], key=lambda p: -p["gap"])],
        },

        # The Topic 4 docx says "six of the eight"; recomputing puts all eight of
        # Planet's exposed-and-unable countries inside People's brittle quadrant
        # (India and Iran included), which is what the Topic 5 docx also states.
        "planetPeopleOverlap": {
            "src": "computed", "source": "quadrant_map · Topic 3 vs Topic 4 · 2040",
            "mode": "nested",
            "sets": [
                {"key": "planet", "label": "Planet: exposed and unable",
                 "count": len(planet_worst),
                 "members": [C["market_names"].get(m, m) for m in planet_worst]},
                {"key": "people", "label": "People: pressured and brittle",
                 "count": len(worst),
                 "members": [C["market_names"].get(m, m) for m in worst]},
            ],
            "overlap": [C["market_names"].get(m, m) for m in overlap],
        },
    }


# =================================================================== ECONOMY
def _and_list(names):
    """'a, b and c' — a bare comma-joined list reads as a truncated sentence."""
    return names[0] if len(names) == 1 else ", ".join(names[:-1]) + " and " + names[-1]


def _gap_panels(C, specs, years, n=8, rank_year=2025):
    """One small multiple per measure, each carrying the highest-N and lowest-N
    countries as separate lines instead of a single cross-country mean.

    A mean hides divergence by construction, and the whole claim in Economy's
    financial set is that countries are moving apart — only the two bands put
    that on the page.
    """
    panels = []
    for sp in specs:
        pid = sp["key"]
        base = C["ranked"](pid, rank_year)
        if len(base) < 4:
            continue
        k = min(n, len(base) // 2)
        top = [r["market"] for r in base[:k]]
        bottom = [r["market"] for r in base[-k:]]
        dec = sp.get("decimals", 1)

        def band(group):
            out = []
            for y in years:
                sl = C["at"](pid, y)
                vals = [sl[m] for m in group if m in sl]
                if vals:
                    out.append([y, round(sum(vals) / len(vals), dec)])
            return out

        series = [
            {"key": pid + "-hi", "label": sp.get("highLabel", "Highest %d" % k),
             "values": band(top), "color": "navy"},
            {"key": pid + "-lo", "label": sp.get("lowLabel", "Lowest %d" % k),
             "values": band(bottom), "color": "people"},
        ]
        panels.append({
            "key": pid, "label": sp["label"], "unit": sp["unit"],
            "valueSuffix": sp.get("valueSuffix", "%"), "series": series,
        })
    return panels


def _country_panels(C, specs, years, colors=None):
    """Small multiples where each panel is one share-of-world measure and each
    line is a country, so the same countries keep the same colour throughout."""
    colors = colors or {"CHN": "navy", "USA": "power", "IND": "people", "JPN": "planet"}
    panels = []
    for sp in specs:
        pid = sp["key"]
        series = []
        yrs = sp.get("years", years)
        for m in sp["markets"]:
            vals = [[y, round(C["at"](pid, y)[m], 1)] for y in yrs if m in C["at"](pid, y)]
            if vals:
                series.append({"key": pid + m, "label": C["market_names"].get(m, m),
                               "values": vals, "color": colors.get(m, "muted")})
        panels.append({"key": pid, "label": sp["label"], "unit": sp["unit"],
                       "valueSuffix": "%", "series": series})
    return panels


def economy_figures(C):
    q40 = C["econ_q"][2040]
    worst = C["econ_worst"]
    mfg = C["mfg_share"]
    # China's manufacturing series starts in 2004; earlier years would draw its
    # band at a flat 0%, which is a coverage gap rendered as a fact.
    mfg_from = min(y for y in mfg if mfg[y].get("CHN"))
    years = sorted(y for y in mfg if y >= mfg_from)
    ANCHORS = (2000, 2010, 2025, 2040)
    # the prosperity set is a now-to-2040 claim; over 40 years these shares do
    # move, and an auto axis on the long window draws that as a cliff
    INERT = (2000, 2025, 2040)

    def mfg_band(m):
        return [round(mfg[y].get(m, 0), 1) for y in years]
    named = ("CHN", "USA", "JPN", "DEU", "IND")
    mfg_rest = [round(max(0.0, 100 - sum(mfg[y].get(m, 0) for m in named)), 1) for y in years]

    debt = C["at"]("D169", 2040)
    burden = C["at"]("D170", 2040)
    # DR Congo forecasts to 0.0% debt on 0.0% interest — a damped-model floor,
    # not a reading, and it drags the axis to zero. Dropped.
    bkeys = sorted((set(debt) & set(burden)) - {"COD"})
    unplotted = sorted(set(debt) - set(burden))

    # 10,000 / HHI is the effective number of blocs a country's trade is spread
    # across — the index itself is unreadable, this is a count.
    bloc = C["pair"]("D158", 2025, 2040, 0)
    bloc_rows = [{"key": r["market"], "label": r["name"],
                  "from": round(10000 / r["from"], 2), "to": round(10000 / r["to"], 2)}
                 for r in bloc]

    # the 20 emerging and developing economies our external-debt-service proxy
    # actually covers — the group the finding is about
    dev = sorted(C["at"]("D173", 2040))

    def dev_mean(pid, year, decimals=1):
        sl = C["at"](pid, year)
        vals = [sl[m] for m in dev if m in sl]
        return round(sum(vals) / len(vals), decimals) if vals else None

    return {
        "opennessTariffs": {
            "src": "computed", "source": "anchor_table · D150/D155",
            "panels": [
                {"key": "D150", "label": "Trade openness",
                 "unit": "exports + imports, % of GDP, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D150", y), 1)] for y in ANCHORS]},
                {"key": "D155", "label": "Trade-weighted applied tariff",
                 "unit": "%, world average", "valueSuffix": "%",
                 "values": [[y, round(C["mean_at"]("D155", y), 1)] for y in ANCHORS]},
            ],
        },

        "regionalisation": {
            "src": "computed", "source": "anchor_table · D153/D157",
            "title": "Where trade goes and what is in it (% of trade, world average)",
            "anchors": [2000, 2025, 2040], "valueSuffix": "%",
            "series": [
                {"key": "D157", "label": "Intermediate goods: parts crossing borders mid-production",
                 "values": [[y, round(C["mean_at"]("D157", y), 1)] for y in C["years_for"]("D157")
                            if C["mean_at"]("D157", y) is not None], "color": "tech"},
                {"key": "D153", "label": "Trade staying inside the home region",
                 "values": [[y, round(C["mean_at"]("D153", y), 1)] for y in C["years_for"]("D153")
                            if C["mean_at"]("D153", y) is not None], "color": "power"},
            ],
            "yLabel": "% of trade", "domain": [10, 62],
        },

        "blocHhi": {
            "src": "computed", "source": "anchor_table · D158 · 2025 vs 2040",
            "title": "How many trade blocs each country's trade is spread across",
            "years": [2025, 2040], "maxSelected": 8,
            # a country trading with exactly one bloc scores 1, so 1 is the floor
            # of the measure and a zero-based axis would bury the whole range
            "domainMin": 1, "domainMax": 3.5,
            "defaults": ["USA", "CHN", "IRN"],
            "countries": [{"market": r["key"], "name": r["label"], "values": [r["from"], r["to"]]}
                          for r in sorted(bloc_rows, key=lambda r: -r["to"])],
        },

        "integrationSpread": {
            "src": "computed", "source": "anchor_table · D150/D155/D156",
            "title": "The most open economies against the least open, on three measures",
            "panels": _gap_panels(C, [
                {"key": "D150", "label": "Trade openness",
                 "unit": "exports + imports, % of GDP",
                 "highLabel": "Most open 8", "lowLabel": "Least open 8"},
                {"key": "D155", "label": "Trade-weighted applied tariff", "unit": "%",
                 "highLabel": "Highest tariffs 8", "lowLabel": "Lowest tariffs 8"},
                {"key": "D156", "label": "Foreign direct investment inflows", "unit": "% of GDP",
                 "highLabel": "Largest inflows 8", "lowLabel": "Smallest inflows 8"},
            ], ANCHORS), "hideKeyValues": True,
        },

        # ---- argument 2: the workshop of the world
        "mfgArea": {
            "src": "computed", "source": "anchor_table · D159",
            "title": "Share of world manufacturing value added (%)",
            "years": years,
            "bands": [{"key": m, "label": C["market_names"].get(m, m), "values": mfg_band(m)}
                      for m in named] + [{"key": "rest", "label": "Rest of world", "values": mfg_rest}],
        },

        "scaleShares": {
            "src": "computed", "source": "anchor_table · D159/D143/D151/D152",
            "title": "Share of the world total (%)",
            "panels": _country_panels(C, [
                {"key": "D159", "label": "Manufacturing value added",
                 "unit": "% of world total", "markets": ["CHN", "USA", "IND"],
                 "years": (2010, 2025, 2040)},
                {"key": "D143", "label": "GDP, adjusted for cost of living",
                 "unit": "% of world total", "markets": ["CHN", "USA", "IND"]},
                {"key": "D151", "label": "Merchandise exports",
                 "unit": "% of world total", "markets": ["CHN", "USA", "IND"]},
                {"key": "D152", "label": "Commercial services exports",
                 "unit": "% of world total", "markets": ["IND", "CHN", "USA"]},
            ], ANCHORS), "hideKeyValues": True,
        },

        "productivitySplit": _dispersion_bars([
            {"key": "D146", "label": "Total factor productivity", "from": 100, "to": 164.4,
             "coverage": "28 markets with a coverage marker"},
            {"key": "D148", "label": "Manufacturing share of GDP", "from": 100, "to": 111.5},
            {"key": "D161", "label": "Domestic value added in exports", "from": 100, "to": 106.9},
            {"key": "D160", "label": "Economic Complexity Index", "from": 100, "to": 94.2},
        ], inverse=False, source="divergence · D146/D148/D160/D161", highlight=["D146"],
            title="How far apart countries are on each measure, 2025 → 2040",
            value_suffix="%"),

        # ---- argument 3: financial bifurcation
        "bifurcation": {
            "src": "computed", "source": "anchor_table · D168–D175",
            "title": "The eight financial-stability measures, world averages",
            "panels": [
                {"key": pid, "label": label, "unit": unit + ", world average",
                 "valueSuffix": suffix,
                 "values": [[y, round(C["mean_at"](pid, y), 1)] for y in ANCHORS
                            if C["mean_at"](pid, y) is not None]}
                for pid, label, unit, suffix in [
                    ("D169", "Government gross debt", "% of GDP", "%"),
                    ("D174", "Domestic credit to the private sector", "% of GDP", "%"),
                    ("D170", "Interest payments", "% of government revenue", "%"),
                    ("D168", "Consumer price inflation", "% a year", "%"),
                    ("D173", "External debt service", "% of exports", "%"),
                    ("D175", "Bank non-performing loans", "% of bank loans", "%"),
                    ("D171", "Reserves", "months of imports", " months"),
                    ("D172", "Current-account balance", "% of GDP", "%"),
                ]
            ],
        },

        "debtBar": {
            "src": "computed", "source": "anchor_table · D169 · 2025 vs 2040",
            "title": "General government gross debt (% of GDP)",
            "years": [2025, 2040], "valueSuffix": "%", "maxSelected": 8,
            "refLine": 100, "refLabel": "100% of GDP",
            # opens on the largest advanced-economy borrowers named in the argument
            "defaults": ["ITA", "USA", "FRA", "GBR", "CHN", "DEU"],
            "countries": [{"market": r["market"], "name": r["name"],
                           "values": [r["from"], r["to"]]}
                          for r in sorted(C["pair"]("D169", 2025, 2040), key=lambda r: -r["to"])],
        },

        "debtBurdenQuadrant": {
            "src": "computed", "flags": True, "source": "anchor_table · D169 vs D170 · 2040",
            "xLabel": "Government gross debt (% of GDP)",
            "yLabel": "Interest payments (% of government revenue)",
            "splitX": 60, "splitY": 10, "year": 2040,
            "splitLabels": {"x": "60% of GDP", "y": "10% of revenue"},
            "worstKey": "11",
            "quadrantTones": {"11": "bad", "00": "good", "10": "mixed", "01": "mixed"},
            "points": [{"market": m, "name": C["market_names"].get(m, m),
                        "x": round(debt[m], 1), "y": round(burden[m], 1),
                        "quadrant": ("Large debt, heavy burden" if debt[m] >= 60 and burden[m] >= 10
                                     else "Large debt, light burden" if debt[m] >= 60
                                     else "Small debt, heavy burden" if burden[m] >= 10
                                     else "Small debt, light burden"),
                        "highlight": m in ("EGY", "IND", "KEN", "BRA", "USA", "ITA", "DEU")}
                       for m in bkeys],
            "quadrants": {"11": "Large debt, heavy burden", "10": "Large debt, light burden",
                          "01": "Small debt, heavy burden", "00": "Small debt, light burden"},
        },

        "stressBuffers": {
            **q40,
            "src": "computed", "flags": True, "hideStats": True,
            "source": "quadrant_map · stress D168/D169/D170/D173/D175 · buffers D171/D172/D144/D181",
            "highlight": worst,
        },

        # ---- argument 4: the distribution is inert
        "inertTable": {
            "src": "computed", "source": "anchor_table · D176/D178/D181/D182",
            "title": "How much of the economy reaches households (world averages)",
            "panels": [
                {"key": "D176", "label": "Employment-to-population ratio",
                 "unit": "% of people aged 15 and over", "valueSuffix": "%",
                 "domain": [50, 70],
                 "values": [[y, round(C["mean_at"]("D176", y), 1)] for y in INERT]},
                {"key": "D178", "label": "Wage and salaried workers",
                 "unit": "% of everyone in work", "valueSuffix": "%",
                 "domain": [55, 75],
                 "values": [[y, round(C["mean_at"]("D178", y), 1)] for y in INERT]},
                {"key": "D181", "label": "Tax revenue",
                 "unit": "% of GDP", "valueSuffix": "%",
                 "domain": [10, 20],
                 "values": [[y, round(C["mean_at"]("D181", y), 1)] for y in INERT]},
                {"key": "D182", "label": "Social expenditure",
                 "unit": "% of GDP among the 14 countries that report it", "valueSuffix": "%",
                 # the social-spending series starts in 2001, so it takes 2010
                 # rather than dropping to a two-point line
                 "domain": [15, 30],
                 "values": [[y, round(C["mean_at"]("D182", y), 1)] for y in (2010, 2025, 2040)]},
            ],
        },

        "unemploymentSpread": {
            "src": "computed", "source": "anchor_table · D177",
            "title": "Unemployment rate (%)",
            "anchors": [2000, 2025, 2040], "valueSuffix": "%",
            "domain": [0, 13], "yLabel": "Unemployment rate",
            "series": _gap_panels(C, [{"key": "D177", "label": "Unemployment rate", "unit": "%",
                                       "highLabel": "Highest 8 countries",
                                       "lowLabel": "Lowest 8 countries"}],
                                  C["years_for"]("D177"))[0]["series"]
            + [{"key": "D177-mean", "label": "World average",
                "values": [[y, round(C["mean_at"]("D177", y), 1)]
                           for y in C["years_for"]("D177")], "color": "muted"}],
        },
    }


# ============================================================== CROSS-TOPIC
def cross_figures(C):
    compound = C["compound"]
    names = [C["market_names"].get(m, m) for m in compound]
    pw, pe, ec = C["planet_worst"], C["people_worst"], C["econ_worst"]

    def only(a, b, c):
        return sorted(set(a) - set(b) - set(c))

    return {
        "compoundVenn": {
            "src": "computed", "source": "quadrant_map across Planet / People / Economy · 2040",
            "sets": [
                {"key": "planet", "label": "Planet", "sub": "Exposed and unable",
                 "count": len(pw), "members": [C["market_names"].get(m, m) for m in pw]},
                {"key": "people", "label": "People", "sub": "Pressured and brittle",
                 "count": len(pe), "members": [C["market_names"].get(m, m) for m in pe]},
                {"key": "economy", "label": "Economy", "sub": "Stressed and unbuffered",
                 "count": len(ec), "members": [C["market_names"].get(m, m) for m in ec]},
            ],
            "centre": names,
            "twoOfThree": [C["market_names"].get(m, m) for m in C["two_of_three"]],
            "note": ("Three separate questions, answered with three entirely independent "
                     "proxy sets. The same five countries appear in the worst quadrant of "
                     "all three."),
        },

        "axisIndependence": {
            "src": "computed", "source": "Appendix B · cross-topic method",
            "columns": ["Planet: exposure / capacity", "People: pressure / institutions",
                        "Economy: stress / buffers"],
            "rows": _side_by_side_3(
                ["D66 days above 35°C", "D68 consecutive dry days", "D70 PM2.5 exposure",
                 "D73 water stress", "D74 freshwater per capita",
                 "D92 ND-GAIN vulnerability", "D93 ND-GAIN readiness", "D94 INFORM coping"],
                ["D105 youth share", "D110 slums", "D119 UHC coverage", "D123 youth NEET",
                 "D125 poverty", "D128 youth unemployment", "D131 informality",
                 "D134 voice", "D135 civil society", "D136 assembly"],
                ["D144 GDP per capita", "D168 inflation", "D169 government debt",
                 "D170 interest burden", "D171 reserves", "D172 current account",
                 "D173 external debt service", "D175 non-performing loans", "D181 tax revenue"]),
            "note": ("No indicator is reused across the three tests, so the overlap is not "
                     "mechanical."),
        },

        "compoundQuadrants": {
            "src": "computed", "source": "quadrant_map · 2040",
            "panels": [
                {"key": "planet", "topic": "planet", "label": "Planet",
                 "quadrant": "Exposed and unable", **_slim(C["planet_q"][2040])},
                {"key": "people", "topic": "people", "label": "People",
                 "quadrant": "Pressured and brittle", **_slim(C["people_q"][2040])},
                {"key": "economy", "topic": "economy", "label": "Economy",
                 "quadrant": "Stressed and unbuffered", **_slim(C["econ_q"][2040])},
            ],
            "compound": compound,
            "note": "The same five names sit in the bottom-right of all three panels.",
        },

        "compoundCaveat": {
            "src": "spec", "source": "Topic 5 · Level 2 argument 5",
            "columns": ["Caveat", "Detail"],
            "rows": [
                {"cells": ["India is a scale case, not a fragility case",
                           "India's presence is driven by scale and averages rather than "
                           "fragility, and should be discussed explicitly rather than "
                           "presented alongside the others without comment."], "tone": "neutral"},
                {"cells": ["Borderline membership",
                           "Each axis is standardised 0–100 with a 50-point split, so "
                           "countries within a few points of 50 are shown as borderline "
                           "rather than assigned hard."], "tone": "neutral"},
                {"cells": ["External validation outstanding",
                           "The five-country list has not yet been cross-checked against the "
                           "World Bank FCV list, OECD States of Fragility or IMF "
                           "debt-distress classifications."], "tone": "gap"},
            ],
            "note": "Research gap flagged in the source document and not yet closed.",
        },
    }


def _slim(q):
    return {"xLabel": q["xLabel"], "yLabel": q["yLabel"], "split": q["split"],
            "points": q["points"], "correlation": q["correlation"], "counts": q["counts"],
            "quadrants": q["quadrants"]}


def _side_by_side_3(a, b, c):
    n = max(len(a), len(b), len(c))
    return [{"cells": [a[i] if i < len(a) else "", b[i] if i < len(b) else "",
                       c[i] if i < len(c) else ""]} for i in range(n)]


def build_figures(C):
    return {
        "power": power_figures(C),
        "tech": tech_figures(C),
        "planet": planet_figures(C),
        "people": people_figures(C),
        "economy": economy_figures(C),
        "cross": cross_figures(C),
    }
