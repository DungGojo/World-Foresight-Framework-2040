# World Foresight Framework — Part 2 Build Spec: Hub Redesign + Topic Pages

**Audience:** an AI coding agent (Claude Code) building Part 2 from scratch.
**Goal:** everything needed to build (a) the **redesigned five-force hub** and (b) the first **topic deep-dive page (Power)**, structured around a three-level content model. Read top to bottom before writing code. Do **not** invent copy or numbers — all Topic-1 content is reproduced verbatim in §11 and comes from `Topic 1 - Power.docx`; all data comes from `Final Data.xlsx`.

**Relationship to Part 1:** Part 1 (`world-2040-BUILD-SPEC.md`) built the cinematic **intro + history montage + constellation shell** as a single vanilla `index.html`. Part 2 **replaces the constellation (Screen 3) with a redesigned hub and adds live topic pages.** The intro + montage are kept and ported (see §9). The design language, palette, and fonts are inherited unchanged (§3).

---

## 1. Context & what changes

The framework answers one question — **"How will the world look in 2040?"** — across **5 forces:** Power, Technology, Planet, People, Economy. Part 1 shipped with every force "coming soon." **Power now goes live** as the first data-driven deep-dive; the other four stay "coming soon" and light up later with zero layout change.

Two things get built in Part 2:

1. **Hub redesign** — the post-intro home (the five-force screen). Fixes three problems in the current constellation: orbs visually collide during the combine, large dead space around the ring, and a static background with no way to reach the underlying data. New: per-force **ambient background imagery** that cycles, a **left sidebar**, a cleaned-up combine, and **routing into live topics**.
2. **Topic page (Power)** — a three-level page: **Level 1** cinematic overview, **Level 2** editorial arguments with charts, **Level 3** a calm data explorer. The Level-3 explorer is a shared component, also reachable as a **quick-view slide-over from the hub sidebar**.

---

## 2. The three-level content model (the core idea)

Every topic is authored and displayed at three depths. This model drives the whole IA — learn it first.

| Level | What it is | Where it lives | Feel |
|-------|-----------|----------------|------|
| **Level 1 — The big picture** | One high-level statement of how the force plays out to 2040 + the overall human-behaviour response. | Topic-page hero (full-viewport). Also the one-line teaser in the hub. | **Cinematic** — full-bleed force imagery, big serif statement, dark scrim. |
| **Level 2 — The arguments** | A small set of **unified arguments** (Power has 4). Each argument = an *Overall* line + **data points paired with figures** + optional **human behaviours** + **supporting documents**. | Topic-page body, one section per argument. | **Editorial** — light, scannable, chart-forward (think Our World in Data / FT). |
| **Level 3 — Full data view** | The raw timeseries: every proxy charted 2000→2040 with country / scenario / year filters. No interpretation. | A section at the end of the topic page **and** a slide-over launched from the hub sidebar. | **Calm** — filters + a scenario fan chart + table + CSV. |

**Authoring source of truth:** each topic's Level 1 + Level 2 copy is a structured content module (see §7.2 and the Power content in §11), transcribed from the topic's `.docx`. Level 3 is generated from `Final Data.xlsx` (see §10). **Never hard-code copy in components** — import it from the content module, exactly like Part 1 used `content.js`.

---

## 3. Design language (inherited — do not restyle)

Reuse Part 1's tokens verbatim. Put them in `src/styles/tokens.css` as CSS variables and mirror in a JS theme object.

### 3.1 Color
Light (editorial, Level 2 & 3, hub): `--bg #f6f4ef`, `--panel #fffdf9`, `--ink #17181d`, `--muted #6d6a63`, `--line #e4dfd4`, `--navy #1b2a4a`.
Dark (cinematic, Level 1 hero, intro): space `#05070d`, glow `#12294d`, white text, muted white `rgba(255,255,255,.68)`.
Force accents (muted/editorial — **do not brighten**): Power `#9e2b25`, Technology `#3b4e8c`, Planet `#2e7d6b`, People `#b07a34`, Economy `#4a5d73`.

### 3.2 Typography
**Fraunces** (400/500/600) for all display, headlines, argument titles, chart titles. **Inter** (400/500/600) for body, UI, labels. Kickers/labels UPPERCASE, letter-spacing `.14em–.34em`, 11–13px. Headlines use `clamp()`. Google Fonts href from Part 1's `typography.googleFontsHref`; degrade to Georgia / system.

### 3.3 Shape, space, motion
Generous whitespace; 1px hairline borders in `--line`; small radii (2px buttons, pill tags). Soft orbs = radial-gradient fill + outer shadow + inner highlight (reuse Part 1 `.orb`). Everything eases (`cubic-bezier(.22,1,.36,1)`); nothing snaps. Cross-fades ~0.6–0.9s. **Respect `prefers-reduced-motion`** everywhere: no Ken-Burns, no scroll parallax, no camera fly-in, instant reveals; branch on a `reduceMotion` boolean and a media query that zeroes durations.

### 3.4 Chart styling (new, must be consistent across ALL Level-2 figures)
Editorial, print-like: thin 1.5–2px lines, **dashed** gridlines in `--line`, Fraunces chart titles, Inter axis labels in `--muted`, transparent/`--panel` background, direct end-of-line labels (avoid legends where possible). **One fixed color legend across every chart in a topic** so a reader learns it once:
- United States → force accent `--power #9e2b25` (the "focus" color).
- China → `--navy #1b2a4a`.
- West bloc → `#9e2b25` tint; China+Russia bloc → `--navy` tint; India → `#b07a34`; Rest/Global South → `--muted`.
- "Projected" portion of any line → same hue, **dashed**; historical → solid. (This matches the house `create-timeseries-chart` style: serif title, dashed gridlines, focus line in warm accent, secondary in grey.)

---

## 4. Tech stack & deliverable

- **React + Vite** SPA (the user chose React for the data-heavy pages). No SSR needed; static-hostable build (`vite build` → `/dist`).
- **Router:** `react-router-dom`. Routes: `/` (intro→montage→hub flow), `/topic/power`, and a catch that shows the hub. Live-topic gating is data-driven (a topic's `status`).
- **Charts:** **D3 (v7)** for the bespoke figures (orbit/gravity map, radar, slope, signature map, fan chart) — full control for the editorial look. Simple bar/line figures may use D3 too; do **not** pull in a heavy dashboard lib. One thin `useResizeObserver` hook for responsive SVG.
- **3D:** Three.js r128 (unchanged) for the intro Earth, wrapped in a React component (§9).
- **Static data:** a Node build script converts `Final Data.xlsx` → JSON at build time (§10). No backend, no runtime XLSX parsing.
- **Offline-graceful** like Part 1: every image falls back local → remote → gradient; if a chart's JSON is missing, render its caption + a small "data unavailable" note, never a blank/broken box.
- Keep the existing `Website/` (vanilla Part 1) intact as the **reference** for intro/montage; the new app lives in `Website/app/` (or a sibling `website-v2/`). State which you chose in the app README.

---

## 5. Information architecture & routing

```
/  ┌─ Intro (Earth fly-in)  ──Begin/Skip──▶  Montage (14 frames)  ──finish/Skip──▶  HUB
   └─ (returning visitor may deep-link straight to the hub or a topic)

HUB (redesigned constellation)
   ├─ sidebar: 5 forces (Power = "Explore" → /topic/power ; others → coming-soon teaser)
   ├─ sidebar: "Explore the data" → Level-3 quick-view slide-over (on the hub)
   └─ constellation: click live orb → /topic/power ; drag-combine → combo teaser (unchanged delight)

/topic/power
   ├─ Level 1  (#overview)      cinematic hero
   ├─ Level 2  (#arguments)     2.1 … 2.4, editorial, charts
   └─ Level 3  (#data)          data explorer (full)
   left rail nav: 1 Overview · 2 The arguments (2.1–2.4) · 3 Explore the data
   top-left: ◀ back to the five forces   ·   top-right: "Replay the story" (→ intro)
```

Anchor-scroll within the topic page; the left rail is a sticky scroll-spy that highlights the current level/argument. Every Level-2 **source chip** deep-links to `/topic/power#data?proxy=D1&markets=USA,CHN` (pre-filters Level 3).

---

## 6. HUB REDESIGN (fixes the screen in the reference image)

**Layout (desktop), three bands left→right:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [ ambient background image for the focused force — cycles, Ken-Burns ]    │
│ ┌───────────────┐                                                          │
│ │  SIDEBAR      │            Five forces will shape                        │
│ │               │            the next fifteen years.                       │
│ │ ◦ Power     ▸ │                                                          │
│ │ ◦ Technology  │                 ( • Power )                              │
│ │ ◦ Planet      │          ( • Economy )   ( • Technology )                │
│ │ ◦ People      │              ( • People ) ( • Planet )                   │
│ │ ◦ Economy     │                                                          │
│ │               │            Select a force · or drag two together         │
│ │ ▤ Explore the │                                                          │
│ │   data        │                                                          │
│ └───────────────┘                                                          │
│               [ Insights bar slides up here when a force/combo is active ] │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Ambient background (the "images change based on topic, repeatedly")
- A fixed, full-viewport layer **behind** everything (`z-index:0`), under a legibility overlay.
- Each force has an **image set** (2–4 editorial photos evoking it) in `public/assets/topics/<id>/ambient/`. The layer **cross-fades through that force's set on a slow loop** (~6s hold, ~1.2s fade) with a gentle Ken-Burns drift.
- **Idle** (nothing hovered/selected): slowly cycle across all five forces (one image each) so the page always feels alive.
- **On hover or select** of a force (sidebar row or orb): switch the ambient set to that force and stay until another is chosen.
- Overlay for legibility: a `--bg`-toward-transparent gradient from the left (so the sidebar sits on near-solid paper) plus a global scrim at ~`rgba(246,244,239,.55)`; images render desaturated ~85% and low-contrast so orbs/text always win. **Do not** let imagery reduce text contrast below AA.
- **Fallback chain** (like Part 1 montage): local file → remote URL (if provided in content) → the force's **accent gradient**. Never a broken image. Provide the accent-gradient fallback for all five so the hub works before any photos are added.
- `prefers-reduced-motion`: no Ken-Burns and no auto-cycle — show one static image for the focused force (or the accent gradient), swap only on explicit selection.
- **Assets are not yet in the repo.** Scaffold the folders, wire the fallback gradients, and list the needed shots in `assets/topics/<id>/ambient/NEEDED.md` (see §12 for Power's shot list). The hub must look finished with gradients alone.

### 6.2 Left sidebar (fills the dead space, hosts Level-3 access)
A persistent, ~300px rail on near-solid `--panel` with a hairline right border. Collapsible to a 56px icon rail (chevron toggle); on ≤900px it becomes a top bar + slide-down menu.
Contents, top→bottom:
1. **Brand:** "World Foresight Framework" (Fraunces) + kicker "THE 5 FORCES OF 2040".
2. **Force list:** five rows, each = accent dot + name + a right-aligned status (`Explore ▸` for live, `Coming soon` pill for others). Hover → sets ambient + highlights that orb (two-way linked with the constellation). Click: live → navigate to the topic; coming-soon → open the Insights bar with that force's teaser. Current/hovered row gets an accent left-border.
3. **Divider**, then **"▤ Explore the data"** button → opens the **Level-3 quick-view** slide-over (§6.5). Sub-label: "Jump straight to the timeseries."
4. Footer: "↺ Replay the story" (→ intro) + a serif "2040" badge.

### 6.3 Constellation (cleaned up)
- Move the ring's center into the **right ~68%** of the viewport (right of the sidebar) so the composition is balanced and the dead space is gone. Center `(sidebarW + (w−sidebarW)/2, h/2 + 10)`, radius `min(w−sidebarW, h) * 0.30`, first orb at top (−90°), evenly spaced. Recompute on resize; keep an orb's live position if mid-interaction.
- Orbs are the Part 1 soft spheres. Labels get a subtle `--panel` chip behind them so they stay legible over imagery.
- **Fix the clash (the main complaint):** during a combine, **only the two involved orbs may move.** When a drag starts: every *other* orb eases to its home **and dims to opacity .45 with pointer-events off**, so nothing collides or overlaps labels. Draw a single dashed curved link between the active pair; show a subtle "merge zone" ring at the pair's midpoint. Enforce a minimum center-to-center gap (`MERGE*0.86`) so the two never actually overlap — they *kiss and settle*. Constrain all orb positions to never enter the sidebar column or leave the viewport.
- Keep the gravity feel from Part 1 (`ATTRACT 230`, `MERGE 118`, `orbLoop` easing `.16`) but apply the "dim the bystanders" rule above.

### 6.4 Insights bar (bottom, unchanged behavior)
Reuse Part 1's slide-up Insights bar for: single-force teaser (accent pip + name + teaser + "Full topic — coming soon", **except Power** whose pill becomes **"Open the Power deep-dive ▸"** and routes to `/topic/power`), and two-force combos (navy pip + combo title + "Combined insight — coming soon"). Close / Esc / empty-click resets.

### 6.5 Level-3 quick-view slide-over (data from the hub)
"Explore the data" opens a right-side slide-over (~560px, `--panel`, hairline border, dark scrim behind) containing a **compact Level-3 explorer** (§8.3): force selector (default Power, the only one with data), proxy picker, a couple of country chips, scenario toggle, and a single fan chart + "Open full data view ▸" (→ `/topic/power#data`). This satisfies "quick-view the separate Level-3 data right from the main page." Esc / scrim / close button dismisses. Reuse the exact same explorer component used on the topic page, in a `compact` mode.

---

## 7. TOPIC PAGE — shell & Level 1

### 7.1 Page shell
`/topic/power`. A sticky **left rail** (~220px) scroll-spy: "01 Overview", "02 The arguments" (nested 2.1–2.4), "03 Explore the data", plus back-to-hub and replay controls. Body is a single scroll with three `<section>`s (`#overview`, `#arguments`, `#data`). Rail collapses to a top progress bar on mobile.

### 7.2 Content module shape (author once, render generically)
`src/content/topics/power.js` exports:
```
{
  id:"power", name:"Power", accent:"#9e2b25",
  level1:{ kicker, heroHeadline, heroSub, framing },      // §11.1
  level2:[ { n, title, overall,
             data:[ {finding, sourceTag, figure} ],       // figure = {type, dataKey, caption}
             behaviours:[ {title, why, evidence, sources} ],
             documents:[ "…" ] } , … x4 ],                 // §11.2
  level3:{ defaultProxy:"D1", defaultMarkets:["USA","CHN"] }
}
```
Components read this; adding Technology later = add `technology.js`, no component changes.

### 7.3 Level 1 — cinematic hero (immersive)
- Full-viewport dark section. Background = Power **ambient set** (deep-red-graded editorial imagery, cycling, slow Ken-Burns) under a strong bottom-weighted dark scrim. Same fallback chain → Power accent gradient.
- Foreground, left-aligned, lower third:
  - kicker `TOPIC 01 · POWER` (uppercase, wide track, accent dot).
  - `heroHeadline` — one punchy Fraunces line, `clamp(2.4rem, 6vw, 5rem)` (see §11.1 for the exact line).
  - `heroSub` — the high-level human-behaviour line, muted-white, `clamp(1rem,2.2vw,1.4rem)`, max ~60ch.
  - a scroll cue: "Scroll — why the world has no ruler in 2040 ↓".
- On scroll, the hero cross-fades/parallax-lifts (disabled under reduced-motion) into the light Level-2 body. Immediately below the fold, restate the fuller `framing` paragraph in editorial light style as the bridge into the arguments.

---

## 8. TOPIC PAGE — Level 2 (arguments) & Level 3 (explorer)

### 8.1 Level-2 section pattern (repeat for each of the 4 arguments)
Light editorial. Each argument section:
1. **Header:** oversized index `01`–`04` (Fraunces, accent, low opacity) + argument `title` (Fraunces) + accent hairline. Then the `overall` line as a large lead paragraph (`~1.25rem`, max ~68ch).
2. **Data & figures:** for each `data[i]`, a **figure block** = the chart (see §8.2) with a caption below it: the `finding` sentence + a monospace **source chip** (e.g., `analyze_share_of_world · D1/D2/D4/D5`). The chip is a button → deep-links into Level 3 pre-filtered (and shows a small methodology tooltip on hover). Figures reveal on scroll (IntersectionObserver fade+rise ~0.5s; static under reduced-motion). Alternate full-width and text-beside-chart layouts to keep rhythm.
3. **Human behaviours** (if present): a tinted band titled "What people do about it" — one card per behaviour: title (Fraunces) + *Why* (one line) + *Evidence* (the stat) + *Sources* (names). Accent-tinted left border.
4. **Supporting documents:** a compact `<details>` "Sources & further reading" listing `documents[]`.

### 8.2 The Level-2 figures (exact list — 11 charts)
Build each as a small D3 component in `src/charts/`. Data comes from `power-figures.json` (§10). Use the fixed color legend (§3.4). Every chart needs: title, source chip, responsive SVG, an accessible `<table>` fallback (visually hidden), and a graceful empty state.

**Argument 1 — No hegemon (two-giant standoff on a non-aligned field):**
- `ShareLines` — US vs China share-of-world, 2025/2030/2040, as two bold lines (US accent, China navy) pulling away from faint thin lines for the rest of the field. Annotate the ~5→~4pt closing gap. `[analyze_share_of_world · D1/D2/D4/D5]`
- `BlocStack` — 100%-stacked area/bar across 2025→2040: West, China+Russia, India, Rest; dashed "50% majority" reference line the West slides toward. `[bloc-share cell]`
- `OrbitMap` — the "gravity map": US and China as two large nodes, ~34 country dots pulled toward the nearer pole, a large **non-aligned cluster** floating in the middle. Counts: US 14 · non-aligned 7 · China 6 · Russia 3. `[cluster_to_anchor · D8_1-4 + D9_1-4]`

**Argument 2 — Loyalty by issue, not bloc (China for money, West for security):**
- `IssueDials` — two gauges side by side: **Security** needle → West, **Economy** needle → China (with the +1.10→+1.08 net-West alignment and ~72% Western arms as the security read). `[world_direction · D6/D7]`
- `PowerRadar` — US vs China across Military, Technology, Industry (CINC), Trade, GDP; shows US spikes on Military/Tech, China on Industry, near-parity on Trade/GDP. `[power_profile / share_detail]`
- `ConsensusBar` — ranked horizontal bars "votes with the global majority", US near the bottom (~48%), Global South near the top (~83%). `[D14]`

**Argument 3 — Rules hollow out; a parallel system rises:**
- `TwoSpeed` — a split panel: left, many flat/rising treaty-ratification lines ("on paper", 3 rising + 10 flat, 0 declining); right, one steep declining line — UN peacekeeping −47% (2025→2040), ICJ ~42% noted. `[classify_trends · D10/D11/D12]`
- `InstitutionsBars` — incumbent vs parallel: large World Bank/IMF bars beside smaller-but-rising NDB+AIIB bars (~$120B 2024 → ~$200B 2025). Mark as external (flagged data gap). `[external]`

**Argument 4 — Power's currency = tech, economics, force (US-led tech race):**
- `LeverSlope` — slope chart 2025→2040: Military +11%, Economic +12%, Resource +12%, Technology +11% rising in parallel; the **rules lever alone slopes down** (highlighted red). `[base-unit world totals · D1/D2/D4/D13/D16]`
- `TechDominanceBar` — technology world-share 2040: US 42%, China 22%, long tail; annotation "US + China ≈ 64% of world R&D". `[power_profile · D16]`
- `SignatureMap` — power-signature map: each country a chip colored by its dominant lever — Technology elite 5 (US, China, Germany, Japan, Korea), Force fringe 4 (Russia, Israel, Pakistan, Ukraine), Resource bloc 15, Economic middle 10. `[power_profile signatures]`

### 8.3 Level 3 — data explorer
The calm, separate data view. Two modes from the same component: `full` (topic-page `#data` section) and `compact` (hub slide-over §6.5).
- **Controls:** proxy/indicator picker (D1–D16 and sub-proxies, grouped & searchable), country multi-select (chips), scenario toggle (Historical · Main · Optimistic · Pessimistic), year-range 2000–2040 (anchors 2025/2030/2040 marked).
- **Main viz — scenario fan chart** (`FanChart`): historical solid line → main projected dashed line, with the optimistic–pessimistic band shaded and `lower_ci`/`upper_ci` as a lighter inner band. Multiple countries = small multiples or overlaid lines with direct labels.
- **Below:** a data table (sortable) for the current selection + **Download CSV**.
- **Deep-link params:** `?proxy=&markets=&scenario=&from=&to=` so Level-2 source chips land pre-filtered.
- Data from `power-timeseries.json` (§10). Compact mode hides the table and shows one chart + "Open full data view ▸".

---

## 9. Porting the intro + montage (Part 1 → React)

Keep the cinematic entry. Lift the Part 1 Three.js Earth and the 14-frame montage into two components, `scenes/Intro.jsx` and `scenes/Montage.jsx`, driven by the same content (port `content.js` → `src/content/site.js`). Put the imperative Three.js setup in a `useEffect` (create renderer/scene on mount, `cancelAnimationFrame` + dispose on unmount when leaving for the hub — Part 1 §5). Preserve all Part 1 acceptance criteria (photoreal layered Earth, fly-in, fallbacks, reduced-motion, montage fallback chain, skip). If porting Three.js proves risky, acceptable fallback: keep Part 1's `index.html` as a static pre-app splash that links into the React hub — but the preferred path is the port so the flow is seamless.

---

## 10. Data pipeline (Final Data.xlsx → JSON, build-time)

`scripts/build-data.mjs` (Node, run before `vite build`; uses `xlsx`/SheetJS). Reads **`Final Data.xlsx` → sheet `Final Full Data`** (columns: `proxy_id, id, market, year, value, labels, scenario, lower_ci, upper_ci`; scenarios `historical`, `main_scenario`, `optimistic_scenario`, `pessimistic_scenario`; years 2000–2040; anchors 2025/2030/2040). Emits two files into `src/data/`:

1. **`power-timeseries.json`** — the Level-3 explorer feed: all Power proxies, tidy rows `{proxy_id,id,market,year,value,scenario,lower_ci,upper_ci,labels}`. Keep it lean (round values; drop unused columns).
2. **`power-figures.json`** — precomputed, exact series for the 11 Level-2 charts, one key per figure (`shareLines`, `blocStack`, `orbitMap`, `issueDials`, `powerRadar`, `consensusBar`, `twoSpeed`, `institutionsBars`, `leverSlope`, `techDominanceBar`, `signatureMap`). **Compute these with the notebook's logic, not ad hoc** — they must match `Data Analysis.ipynb` (`Data Preparation/Analysis_Functions/`): `analyze_share_of_world`, `cluster_to_anchor`, `world_direction`, `power_profile`, `classify_trends`, and the base-unit world-totals used for Q4 (convert each proxy to base units via its `labels`/`metric` unit before summing — millions/billions/trillions — see the notebook Q4 cells). The numbers in §11 are the expected outputs; the build must reproduce them. `institutionsBars` values are external (not in the sheet) — read them from the content module and label as external.

Guard: if the sheet or a series is missing, emit the file with an `"unavailable": true` flag so charts render their caption + a quiet note instead of breaking.

---

## 11. Topic-1 POWER content (verbatim — do not rewrite)

Transcribe into `src/content/topics/power.js`. Source: `Topic 1 - Power.docx`. Numbers already validated against the notebook.

### 11.1 Level 1
- **kicker:** "Topic 01 · Power"
- **heroHeadline:** "No one runs the world in 2040."
- **heroSub:** "No single patron, currency, institution or technology standard can be assumed to win — so states, firms and individuals all hedge: a foot in both camps, more than one currency, both tech stacks. Refusing to choose becomes strategy."
- **framing (overall):** "The age of a single world leader ends — but nothing clean replaces it. Power in 2040 is contested (two giants, the US still narrowly ahead, China closing), diffuse (a large non-aligned majority that refuses to pick a side), and split by domain (economy vs security vs technology). Global rules hollow out while technology, money and force become the real currency of power."

### 11.2 Level 2 — the four arguments
Each argument below gives: **title**, **Overall**, the **data points** (finding + source tag + which figure renders it), the **human behaviours** (Overall/Why/Evidence/Sources), and **supporting documents**.

**Argument 01 — No hegemon: a two-giant standoff nobody commands, on a field that won't choose sides.**
- *Overall:* The unipolar era is over, but no new hegemon takes its place. Two giants tower over everyone — the US still the single largest through 2040, China closing but not overtaking — while below them the field is flat and mostly non-aligned. Neither giant can command the system.
- *Data:*
  - Finding: "Two giants, US still #1: share-of-world power US 25.2% → 24.9% → 24.7% vs China 19.9% → 20.5% → 20.8% (2025/2030/2040); the US leads all three anchor years and the gap only narrows from ~5 to ~4 points." → figure `ShareLines`. Source: `analyze_share_of_world · D1/D2/D4/D5`.
  - Finding: "The West's majority is thinning: West (US + NATO/EU + Pacific allies) 51.8% → 50.6%, China + Russia 24% → 28%, India ~6%, rest of world ~19%." → figure `BlocStack`. Source: `bloc-share cell`.
  - Finding: "Below the two giants, the world won't pick sides: 14 states near the US, 7 non-aligned (around India), 6 near China, 3 near Russia — stable across anchors; only 6 sit truly in China's orbit." → figure `OrbitMap`. Source: `cluster_to_anchor · D8_1-4 + D9_1-4`.
- *Human behaviour:* "Multi-alignment becomes strategy." Why: in a leaderless, two-giant world the payoff is belonging to both camps' clubs at once rather than betting on a winner. Evidence: BRICS expanded in 2024 (Egypt, Ethiopia, Iran, UAE, a dozen more invited) while those same states kept their Western ties. Sources: Modern Diplomacy (Global South 2.0); CFR.
- *Supporting documents:* CFR and Modern Diplomacy on BRICS expansion and Global-South hedging.

**Argument 02 — Loyalty splits by issue, not by bloc: China for money, the West for security.**
- *Overall:* The world does not divide into two clean blocs. Countries lean to China for trade and economic ties yet stay tied to the West for weapons, security and high-end technology — so alignment is issue-by-issue, and even America's own allies permanently hedge.
- *Data:*
  - Finding: "Security stays West, economy tilts China: power-weighted world alignment stays net-West (+1.10 → +1.08) and ~72% of arms remain Western-supplied, even as China becomes the top trade partner for most of the Global South." → figure `IssueDials`. Source: `world_direction · D6/D7`.
  - Finding: "Power splits by domain, not by country: the US leads Military (37%) and Technology (42%); China leads industrial capacity (CINC 31% vs US 14%); GDP and trade are near-parity." → figure `PowerRadar`. Source: `power_profile / share_detail`.
  - Finding: "Even US allies hedge, and the UN drifts from Washington: US allies (Japan, Korea, Australia) lean West on votes but China on trade; on votes-with-the-global-majority the US is among the biggest outliers (~48%) while the Global South is most in consensus (~83%)." → figure `ConsensusBar`. Source: `D8 vs D9 · D14`.
- *Human behaviours:*
  - "Learn Mandarin — Chinese fluency becomes a career asset." Why: as China becomes the largest economic pole and top trade partner for most of the Global South, Chinese fluency pays, the way the 20th century learned English. Evidence: the Chinese-language-learning market is ~$7.4B and set to roughly double this decade; Africa Mandarin courses +21%; Saudi added Mandarin to schools. Sources: HolonIQ; MandarinZone.
  - "Chinese products and platforms become everyday defaults." Why: the economic axis tilts China, so consumption follows even without political alignment. Evidence: BYD is the world's #1 EV maker; Temu/Shein overtook Amazon as most-downloaded shopping apps; TikTok led 2024 app downloads; Hisense is South Africa's #1 TV brand. Sources: China Global Hub; News.az.
- *Supporting documents:* HolonIQ and MandarinZone (language demand); China Global Hub and News.az (Chinese consumer platforms).

**Argument 03 — The rules-based order hollows out, and a parallel system rises to fill the gap.**
- *Overall:* The UN-centred system does not collapse; it hollows out. Membership and treaty commitment stay high, but collective action retreats — and a junior, China/BRICS-led system grows alongside without yet replacing the incumbents.
- *Data:*
  - Finding: "Membership holds, muscle fades: of the global institutional series, 3 are rising and 10 flat at high levels with 0 declining — yet UN peacekeeping falls −47% (2025→2040) and ICJ compulsory-jurisdiction acceptance stays a minority at ~42%." → figure `TwoSpeed`. Source: `classify_trends · D10/D11/D12`.
  - Finding: "A junior parallel system grows: BRICS New Development Bank + AIIB combined lending rose from ~$120B (2024) to ~$200B (2025) — still smaller than the Western-built institutions." → figure `InstitutionsBars`. Source: `external (flagged data gap)`.
- *Human behaviours:*
  - "Route around weak global institutions." Why: a paralysed, low-trust incumbent system can't deliver, so states and firms self-help through regional bodies, ad-hoc coalitions and parallel banks. Evidence: UN trust fell in 23 of 27 countries; the Security Council saw its most vetoes since 1986 in 2024; NDB + AIIB lending ~$120B→$200B. Sources: IPI; Foreign Policy; Grand Review.
  - "Diversify money and pricing off the dollar." Why: with two co-equal giants and no single guarantor, settling only in USD becomes a concentration risk. Evidence: the RMB hit a record ~7.5% of global trade credit in 2025; over half of China's cross-border payments settle in RMB; China–Russia trade is ~95% in local currencies. Sources: Asia Society; Visual Capitalist.
- *Supporting documents:* IPI (UN trust) and Foreign Policy (Security-Council vetoes); Grand Review and CADTM (NDB/AIIB lending); Asia Society and Visual Capitalist (RMB internationalisation).

**Argument 04 — Power's real currency becomes technology, economics and force, with a US-led tech race at the centre.**
- *Overall:* As rules fade, the material levers — technology, economics, resources and force — become how power is actually wielded. The single sharpest contest is a US-led technology race with China the only real challenger, and countries specialise into distinct power types.
- *Data:*
  - Finding: "Power drains from rules to material levers: world-total military +11%, economic +12%, resource +12% and technology +11% (2025→2040) all grow evenly, while the rules lever declines (peacekeeping −47%, ICJ ~42%, treaties flat)." → figure `LeverSlope`. Source: `base-unit world totals · D1/D2/D4/D13/D16`.
  - Finding: "The decisive contest is a US-led tech race: 2040 technology world-share US 42% vs China 22% — roughly two-thirds of world R&D between them." → figure `TechDominanceBar`. Source: `power_profile · D16`.
  - Finding: "Countries specialise four ways: a technology elite of 5 (US, China, Germany, Japan, Korea), a force fringe of 4 (Russia, Israel, Pakistan, Ukraine), a resource/commodity bloc of 15 (Gulf, Australia, Canada, Brazil, Indonesia…), and an economic middle of 10 (France, UK, India, Mexico, Turkey…)." → figure `SignatureMap`. Source: `power_profile signatures`.
- *Human behaviours:*
  - "Reorganise around the technology race." Why: technology is the decisive, most-contested lever, so states pursue 'tech sovereignty' and firms and individuals must pick a US or Chinese stack. Evidence: state chip investment surges (US CHIPS Act, EU Chips Act, Japan, Korea, China's Big Fund); Huawei sanctions and HarmonyOS split the stack. Sources: FinancialContent/GMInsights; Global Policy Journal; IFRI.
  - "Hedge production — 'China+1' and dual-system operating become default." Why: a contested, leaderless two-giant world punishes betting on one side, so firms build across both systems and workers gain in the 'plus-one' hubs. Evidence: 94% of EMEA firms are cutting China-sourcing dependence; Apple is shifting China production ~95%→75%; Vietnam drew ~$25B FDI in 2024. Sources: AlixPartners; CNBC.
- *Supporting documents:* FinancialContent/GMInsights, Global Policy Journal and IFRI (tech sovereignty, splinternet); AlixPartners and CNBC (China+1 supply-chain shift).

> **Appendix mapping (traceability):** the four arguments synthesise the docx's original Q1–Q4. Keep a collapsed "How this was derived" `<details>` at the end of Level 2 linking each argument to its source questions (Arg 1 ← Q1+Q2 · Arg 2 ← Q2+Q1+Q4 · Arg 3 ← Q3 · Arg 4 ← Q4), mirroring the docx Appendix.

---

## 12. Assets (to be sourced — scaffold now, gradients as fallback)

Per-force ambient imagery is **not in the repo yet.** Create `public/assets/topics/<id>/ambient/` for all five and a `NEEDED.md` shot list; wire the accent-gradient fallback so everything works without photos. Respect licensing exactly like Part 1 (`asset-manifest.json`): prefer public-domain / CC, keep visible credits, verify before publishing.

**Power ambient shot list (`assets/topics/power/ambient/NEEDED.md`):** a UN General Assembly / Security Council hall; a G20 or BRICS leaders' summit line-up; a busy container port or trade scene; a naval/defence review or missile-defence image; a stock/exchange or currency-trading floor. Deep-red editorial grading, desaturated, wide crops that read behind text. 3–4 final images, ≤~400 KB each.

Add each force's accent-gradient fallback to the theme: `radial-gradient(circle at 30% 30%, <accent>22, <accent>05 60%, transparent)` over `--bg`.

---

## 13. File structure (target)

```
Website/app/                         # the new React app (keep Part 1 Website/ as reference)
  index.html   package.json   vite.config.js
  scripts/build-data.mjs             # Final Data.xlsx -> src/data/*.json
  public/assets/topics/<id>/ambient/ # ambient imagery + NEEDED.md (+ reuse earth/ montage/ from Part 1)
  src/
    main.jsx  App.jsx  router.jsx
    styles/tokens.css                # §3 tokens
    content/
      site.js                        # palette, topics, intro/montage copy (port of content.js)
      topics/power.js                # §11 content module
    data/  power-timeseries.json  power-figures.json     # generated
    scenes/  Intro.jsx  Montage.jsx  # ported Three.js + montage (§9)
    hub/     Hub.jsx  Sidebar.jsx  Constellation.jsx  AmbientBackground.jsx  InsightsBar.jsx  DataQuickView.jsx
    topic/   TopicPage.jsx  LeftRail.jsx  Level1Hero.jsx  Level2Argument.jsx  FigureBlock.jsx  BehaviourCard.jsx  SourceList.jsx  Level3Explorer.jsx
    charts/  ShareLines.jsx BlocStack.jsx OrbitMap.jsx IssueDials.jsx PowerRadar.jsx ConsensusBar.jsx TwoSpeed.jsx InstitutionsBars.jsx LeverSlope.jsx TechDominanceBar.jsx SignatureMap.jsx FanChart.jsx
    hooks/   useResizeObserver.js  useReducedMotion.js  useScrollSpy.js  useAmbientCycle.js
  README.md                          # run + how to add the next topic
```

**Adding the next topic later** = (1) author `topics/<id>.js`, (2) set its `status:"live"` + ambient images, (3) extend `build-data.mjs` to emit its JSON. No component/layout changes.

---

## 14. Tokens, motion, responsive, accessibility

- **Tokens:** all colors/spacing/fonts from §3 as CSS variables; a JS `theme` mirror for D3.
- **Motion:** IntersectionObserver reveals for Level-2 figures; ambient Ken-Burns + cycle; hero parallax. All gated behind `useReducedMotion()` and a `@media (prefers-reduced-motion: reduce)` that zeroes durations.
- **Responsive:** desktop ≥1100px = sidebar + constellation / left rail + content. 900–1100 = narrower rails. ≤900 = sidebar→top bar + menu; constellation ring→vertical force list; topic left rail→sticky progress bar; charts stack full-width; Level-3 controls collapse into an accordion. Works to ~360px. SVG charts use `viewBox` + `useResizeObserver`.
- **Touch:** hub combine uses Pointer Events + `touch-action:none` (from Part 1).
- **A11y:** keyboard-navigable everywhere; visible focus rings; `Esc` closes slide-over/insights; every chart has a visually-hidden data `<table>` and a title/desc; alt text on ambient imagery; AA contrast on both dark hero and light body (verify text over imagery); scroll-spy updates `aria-current`.

---

## 15. Acceptance criteria (definition of done)

**Hub**
- [ ] Left sidebar present (brand · 5-force list with Power="Explore ▸", others "Coming soon" · "Explore the data" · replay/2040). Collapses on mobile.
- [ ] Ambient background shows force imagery that **cross-fades and cycles**, changes on hover/select, idles across all five, and falls back local→remote→accent-gradient with no broken images. Reduced-motion shows a static image.
- [ ] Constellation is balanced (no dead space), orbs never overlap the sidebar or each other; during a combine only the two involved orbs move and **bystanders dim** — no clashing.
- [ ] Clicking the **Power** orb or its sidebar row navigates to `/topic/power`; other forces open the Insights teaser; drag-combine still shows the correct combo title for all 10 pairs.
- [ ] "Explore the data" opens the Level-3 quick-view slide-over with a working fan chart and "Open full data view ▸".

**Topic page — Power**
- [ ] Level 1 is a full-viewport cinematic hero: kicker, the exact `heroHeadline`/`heroSub`, ambient/gradient background, scroll cue; transitions into the light body with the `framing` paragraph.
- [ ] Level 2 renders all **4 arguments** with their exact Overall text, all **11 figures** correctly (right chart type, fixed color legend, source chip that deep-links into Level 3), human-behaviour cards, and a Sources `<details>`.
- [ ] Figure numbers **match the notebook / §11** (e.g., US 24.7 vs CHN 20.8 in 2040; West 51.8→50.6; orbit 14/7/6/3; tech US 42 vs CHN 22; levers +11/+12/+12/+11; signatures 5/4/15/10).
- [ ] Level 3 explorer works in full + compact modes: proxy/country/scenario/year filters, scenario fan chart with CI band, table + CSV, deep-link params honored.
- [ ] Left rail scroll-spy tracks 01/02(2.1–2.4)/03; back-to-hub and replay work.

**General**
- [ ] Intro + montage preserved (ported) with Part 1's realism, fallbacks, reduced-motion, and skip; Three.js loop disposed on unmount.
- [ ] No copy or numbers hard-coded in components — all from content modules / generated JSON.
- [ ] `build-data.mjs` regenerates both JSON files from `Final Data.xlsx` and figure outputs match §11; missing data degrades gracefully.
- [ ] Fonts degrade; AA contrast; keyboard + reduced-motion paths verified; no console errors; static `dist` runs from any static host.

---

## 16. Build order (suggested)

1. Scaffold Vite React app + router + `tokens.css` + content modules (`site.js`, `topics/power.js` from §11).
2. `build-data.mjs` → `power-timeseries.json` + `power-figures.json`; verify a few numbers against §11.
3. Hub: layout + Sidebar + AmbientBackground (gradients first) + Constellation (with the "dim bystanders" combine) + InsightsBar + routing.
4. Level-3 `FanChart` + `Level3Explorer` (full + compact) + hub DataQuickView slide-over.
5. Topic shell + LeftRail scroll-spy + Level1Hero.
6. Level-2 sections + the 11 chart components (start with `ShareLines`, `BlocStack`, `LeverSlope`, `TechDominanceBar`; then `OrbitMap`, `PowerRadar`, `IssueDials`, `ConsensusBar`, `TwoSpeed`, `InstitutionsBars`, `SignatureMap`).
7. Port Intro + Montage (§9); wire the full flow.
8. Ambient imagery when available; responsive, reduced-motion, keyboard, a11y passes.
9. Verify against §15; compare hub feel to the reference image (balanced, no clash, alive background).

---

*Part 2 input package. Content in §11 is authoritative — transcribe, don't rewrite. Numbers trace to `Data Analysis.ipynb` via `build-data.mjs`. The three-level model (§2) is the backbone: cinematic L1, editorial L2, calm L3.*
