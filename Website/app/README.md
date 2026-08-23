# World Foresight Framework — App (Part 2)

The React + Vite build of the site: the cinematic entry (ported from Part 1),
the **redesigned five-force hub**, and the first data-driven **topic deep-dive (Power)**
with its three levels — cinematic overview, editorial arguments with charts, and a calm
data explorer. Built per `../PART2-topic-pages-BUILD-SPEC.md`.

Part 1 (the original single-file `../index.html`) is kept intact as the reference.

## Run it

```bash
cd Website/app
npm install                 # first time (if npm cache errors: npm install --cache /tmp/npmcache)
npm run build:data          # Final Data.xlsx -> src/data/*.json  (needs python3 + openpyxl)
npm run dev                 # http://localhost:5180
```

Build a static site (deploys to any static host — no backend):

```bash
npm run build               # runs build:data, then vite build -> dist/
npm run preview             # serve the built dist/ locally
```

Routing uses a **hash router** (`/#/hub`, `/#/topic/power`) so the static build works
from any host — including refreshing a deep link — with no server rewrites.

## The data pipeline (offline, no backend)

`scripts/build_data.py` reads `Final Data.xlsx → Final Full Data` and emits, into `src/data/`:

- **`power-timeseries.json`** — the explorer feed: every proxy × market × scenario,
  2000→2040, with CI bounds. Nested to stay small; lazy-loaded only when the explorer opens.
- **`power-figures.json`** — the exact series for the 11 Level-2 charts. Share-of-world /
  bloc composites are **computed here** (mirrors `Analysis_Functions/share_of_world`);
  the script prints computed-vs-spec anchor checks (US 25.3/24.9/24.7 · CN 19.9/20.5/20.8,
  matching spec §11). Editorial/external figures carry the notebook-validated §11 numbers.

Re-run your models → `npm run build:data` → the site updates. This is the "resolve the
data" step — it happens once, offline, in Python, not on a server per request.

## Figure conventions

Before writing a Level-2 finding or building its chart, read
**`../TOPIC-FIGURE-CONVENTIONS.md`** — how findings should be written, and how charts should be
built, settled during the Power rework and applying to all five topics.

## Edit the content (no component changes)

- **Topic copy** (headlines, arguments, findings, behaviours, sources): `src/content/topics/power.js`
  — transcribed verbatim from `Topic 1 - Power.docx`. Add a topic = add `topics/<id>.js`,
  set `status:"live"`, register it in `topics/index.js`, and extend `build_data.py`.
- **Site copy** (intro, montage, forces, combos): `src/content/site.js` (+ `site.json`, the Part 1 port).
- **Design tokens**: `src/styles/tokens.css` (mirrored for D3 in `src/theme.js`).
- **Ambient imagery**: drop `1.jpg…` into `public/assets/topics/<id>/ambient/`
  (see each folder's `NEEDED.md`). Missing images fall back to the force's accent gradient.

## Structure

```
scripts/build_data.py          data pipeline (xlsx -> json)
public/assets/                  earth textures, montage photos, per-force ambient/
src/
  content/  site.js  site.json  topics/power.js
  data/     power-timeseries.json  power-figures.json  (generated)  useTimeseries.js
  scenes/   Intro.jsx  Montage.jsx        (ported Part 1; lazy-loaded)
  hub/      Hub · Sidebar · AmbientBackground · Constellation · InsightsBar · DataQuickView
  topic/    TopicPage · LeftRail · Level1Hero · Level2Argument · FigureBlock · BehaviourCard · Level3Explorer
  charts/   11 Level-2 figures + FanChart  (index.js = type→component registry)
  hooks/    useResizeObserver · useReducedMotion · useScrollSpy · useAmbientCycle
```

## Notes

- **Offline-graceful**: images fall back local → remote → gradient; a missing chart series
  renders its caption + a quiet "data unavailable" note, never a broken box.
- **Performance**: routes are code-split — the hub loads without Three.js (intro) or the
  chart bundle (topic); the big timeseries loads only when the explorer is opened.
- **Accessibility / motion**: keyboard-navigable, visible focus, `Esc` closes overlays,
  and every animation is gated behind `prefers-reduced-motion`.
