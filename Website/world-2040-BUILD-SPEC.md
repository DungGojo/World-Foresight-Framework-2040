# World Foresight Framework — Front-End Build Spec (Part 1)

**Audience:** an AI coding agent (Claude Code) building this from scratch.
**Goal of this document:** give you everything needed to build **Part 1** of the site — the cinematic entry experience — with no further clarification. Read it top to bottom before writing code.

**This is the `Website` folder — companion files:**
- `world-2040-content.json` — the single source of truth for all copy, colors, montage eras (with real image URLs + credits/licenses), Earth texture URLs, topics, and combo titles. **Do not invent or hard-code copy; pull it from here.**
- `world-2040-reference-prototype.html` — a working single-file reference implementation of everything in this spec: realistic Earth intro, **real-photo** montage, constellation, planet-gravity combine, Insights bar. Treat it as a *reference*, not gospel — start from it, satisfy the acceptance criteria, and harden/polish.
- `asset-manifest.json` — machine-readable list of every montage photo + Earth texture with source URL and license.
- `download-assets.sh` — run it (`cd Website && bash download-assets.sh`) to fetch all real media locally into `assets/montage/` and `assets/earth/`.
- `ASSETS-README.md` — the 14-moment media table, licensing notes, and how to swap in your own photos/video.
- `assets/montage/`, `assets/earth/` — local media (populated by the script).

**Media works two ways:** the prototype references live Wikimedia `Special:FilePath` URLs so it runs immediately online; once `download-assets.sh` is run, the code prefers the local copy (`localImg`). Fallback order everywhere is **local → live URL → gradient art**, so nothing ever renders broken.

---

## 1. Project context (background only — do not build beyond Part 1)

The **World Foresight Framework** answers one question: **"How will the world look in 2040?"** — not as a prediction, but as a structured, data-driven view of the forces shaping the future.

The framework has **5 system forces (topics):** Power, Technology, Planet, People, Economy. Each will eventually get a deep, data-driven "topic page." Right now **only the front-end shell is being built, and every topic is "coming soon."** The underlying data (country-level indicators projected to 2040 under optimistic/main/pessimistic scenarios) exists in a separate `Final Data.xlsx` and will power the topic deep-dives in a **later phase — not this one.**

**In scope for Part 1 (this build):**
1. Cinematic Earth intro.
2. History montage (Earth's creation → 2040).
3. Five-topic "constellation" with a planet-gravity combine interaction and an Insights bar.

**Explicitly out of scope for Part 1:** any topic deep-dive pages, any charts, any data loading from the spreadsheet, any backend. Build the shell so these can slot in later (see §12).

---

## 2. Deliverable & tech stack

- **One self-contained `index.html`** (single file) that runs by opening it directly in a browser (`file://`) — no build step, no bundler, no server required.
- **Vanilla JS + CSS.** No React/Vue/framework. No CSS framework.
- **Three.js r128** loaded from cdnjs for the 3D Earth:
  `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` (global `THREE`, non-module build).
- **Fonts:** Google Fonts — *Fraunces* (serif display) + *Inter* (sans). Link tag in `world-2040-content.json → typography.googleFontsHref`. Must degrade gracefully to system fonts offline.
- **Must be offline-graceful:** if Three.js, textures, or fonts fail to load, the site still works (see fallbacks in §7.1 and §9).
- **Content is data-driven:** load all strings/eras/topics/combos from `world-2040-content.json` (either `fetch()` it, or inline the object into a `const CONTENT = {…}` — inlining is preferred so the single file works over `file://` without CORS issues). If you inline it, keep it as one clearly-marked block at the top of the script so it stays easy to edit.

---

## 3. Design language

Two moods, one transition. **The intro + montage are dark and cinematic (deep space). The constellation is clean and light (institutional / editorial — think Financial Times or Our World in Data).** The moment we "land" from space, the palette flips from dark to light. This contrast is intentional and is the signature of the piece.

### 3.1 Color tokens (from `content.json → palette`)
Light (constellation): `--bg #f6f4ef`, `--panel #fffdf9`, `--ink #17181d`, `--muted #6d6a63`, `--line #e4dfd4`, `--navy #1b2a4a`.
Dark (intro/montage): space `#05070d`, glow `#12294d`, white text, muted white `rgba(255,255,255,.68)`.
Topic accents: Power `#9e2b25`, Technology `#3b4e8c`, Planet `#2e7d6b`, People `#b07a34`, Economy `#4a5d73`. These are muted/editorial on purpose — **do not brighten them.**

### 3.2 Typography
- **Fraunces** for all display/headlines and topic/era titles (weights 400–600). Slightly tight letter-spacing (`-0.01em`) on large headings.
- **Inter** for body, labels, buttons, UI chrome. Labels/kickers are UPPERCASE with wide letter-spacing (`.14em–.34em`), 11–13px.
- Headlines use `clamp()` for fluid sizing (see reference CSS for exact values).

### 3.3 Spacing, shape, texture
- Generous whitespace; hairline 1px borders in `--line`; small radii (2px on buttons, pill shapes for tags).
- Orbs are soft spheres: radial-gradient fill + subtle outer shadow + inner highlight (see `.orb` in reference).
- Buttons: ghost/outline style, fill-on-hover, letter-spacing widens slightly on hover.

### 3.4 Motion principles
- Everything eases; nothing snaps. Default easing `cubic-bezier(.22,1,.36,1)` for UI, `easeInOutCubic` for the camera.
- Screen cross-fades ~0.9s. Insights bar slides up ~0.55s. Montage frame cross-fade ~1s.
- **Respect `prefers-reduced-motion`:** skip the camera fly-in (start already near), slow the globe spin, shorten montage frames, and disable long CSS transitions. A media query zeroes transition/animation durations; JS also branches on a `reduceMotion` boolean.

### 3.5 Accessibility
- Persistent **Skip** control on intro and montage; keyboard-focusable, visible focus states on all interactive elements.
- Sufficient contrast for text on both dark and light scenes.
- All controls reachable by keyboard; `Enter`/`Space` triggers Begin/Skip; `Esc` closes the Insights bar.
- Montage auto-advance must be pausable/escapable (Skip jumps straight to constellation).

### 3.6 Responsive
- Works from ~360px (mobile) to large desktop. Orbs shrink on ≤640px (see media query). Constellation layout is computed from viewport (see §8.1), so it re-flows on resize.
- **Touch:** the combine interaction must work with touch — use **Pointer Events** (`pointerdown/move/up`), not mouse events, and set `touch-action:none` on orbs.

---

## 4. File structure

Single file, in this order:
1. `<head>`: meta, font `<link>`s, one `<style>` block using CSS variables from §3.1.
2. `<body>`: three `<section class="screen">` blocks (`#intro`, `#montage`, `#space`) + one shared `#insights` bar. Only one screen has class `active` at a time.
3. Three.js `<script src>` from cdnjs.
4. One inline `<script>` containing: the inlined `CONTENT` object, then modules for Intro / Montage / Constellation / Insights / flow wiring.

Keep functions small and named by screen (`initThree`, `buildMontage`, `buildConstellation`, `orbLoop`, etc.). Comment the tricky algorithms (§7.1, §7.2, §8.2).

---

## 5. Screen flow / state machine

```
[#intro]  --Begin / Skip intro-->  [#montage]  --auto-finish / Skip / click-through last-->  [#space]
```

- Exactly one `.screen.active`. `show(id)` toggles the class; CSS cross-fades opacity.
- On entering `#montage`: build frames, start auto-advance.
- On entering `#space`: build constellation, and **cancel the Three.js render loop** (`cancelAnimationFrame`) to free the GPU/CPU — the globe is no longer visible.
- The Insights bar is global and only meaningful on `#space`.

---

## 6. Content data (authoritative lists)

All of the following live in `world-2040-content.json`. Reproduced here so the spec is self-contained.

### 6.1 Topics (5) — all `status: "coming_soon"`
| id | name | accent |
|----|------|--------|
| power | Power | #9e2b25 |
| tech | Technology | #3b4e8c |
| planet | Planet | #2e7d6b |
| people | People | #b07a34 |
| economy | Economy | #4a5d73 |

Teasers (shown in Insights bar for a single force):
- **Power:** "Who sets the rules and who holds the leverage — geopolitics, alliances, and whether the world cooperates or fragments."
- **Technology:** "Whether innovation enriches, divides, or destabilizes — AI, labour markets, productivity, and inequality."
- **Planet:** "Whether we can adapt before planetary boundaries break — climate, food, water, energy, and livability."
- **People:** "Who moves, who ages, who concentrates, and who pushes back — demographics, migration, and unrest."
- **Economy:** "Whether the global economy integrates, fractures, or rewires — trade blocs, supply chains, and resilience."

### 6.2 Montage eras (14, in order) — Earth's creation → 2040
Each frame: `yr`, `title`, `cap`, `motif` (line-icon key), gradient colors `c1`/`c2`.

1. ~4.5 billion years ago — **A world ignites** — "From a disc of dust and fire, a molten planet takes shape." (motif `sun`)
2. ~3.8 billion years ago — **Life begins** — "In ancient seas, the first living cells appear." (`cell`)
3. ~540 million years ago — **Life explodes** — "Oceans fill with complex, competing forms of life." (`wave`)
4. ~66 million years ago — **The great reset** — "An age of giants ends; mammals inherit the Earth." (`comet`)
5. ~300,000 years ago — **We arrive** — "Homo sapiens appears — curious, social, restless." (`spark`)
6. ~10,000 BCE — **We settle** — "Farming replaces wandering. The first villages rise." (`grain`)
7. ~3,000 BCE — **We record** — "Writing, cities, and the first states are born." (`tablet`)
8. 1440s — **We print** — "Movable type sets knowledge loose across the world." (`page`)
9. 1760s — **We industrialize** — "Steam and steel accelerate everything, all at once." (`gear`)
10. 1945 — **We split the atom** — "A new scale of power — and of peril — arrives." (`atom`)
11. 1969 — **We leave Earth** — "For the first time, we see our home from the outside." (`moon`)
12. 1990s–2010s — **We connect** — "Networks link billions of people into one system." (`net`)
13. The 2020s — **We build minds** — "Machines begin to reason, write, and create alongside us." (`ai`)
14. 2040 — **What comes next?** — "Five forces will decide the shape of the world to come." (`q`)

### 6.3 Combo titles (10) — human-behaviour headlines
Key = two topic ids sorted alphabetically, joined with `|`.
`power|tech` → **The Splinternet Generation** · `planet|power` → **Climate as Leverage** · `people|power` → **Borders & Belonging** · `economy|power` → **The Sanctions Decade** · `planet|tech` → **Compute vs. Carbon** · `people|tech` → **Living With Machines** · `economy|tech` → **The Automation Squeeze** · `people|planet` → **The Great Relocation** · `economy|planet` → **Pricing a Hotter World** · `economy|people` → **Who Gets the Growth**

For Part 1 the combo shows **the title only** + "Combined insight — coming soon." No detail body.

---

## 7. Screen 1 — Cosmic Earth intro

**Visual:** deep-space black. A photoreal, slowly-rotating Earth. The camera drifts from far to near, the Earth growing until it fills much of the frame, then eases to a stop. As it settles, the headline **"How will the world look in 2040?"** fades in with the kicker, subhead, and a **Begin** button. A **Skip intro** control sits top-right throughout.

### 7.1 Three.js scene — realistic Earth (build exactly this)
The Earth must read as **photoreal**, not a flat ball. Achieve it with layered maps + a fresnel atmosphere, not a single texture. Texture URLs come from `content.json → earthTextures` (three.js example planet maps on jsDelivr; CORS-enabled, which WebGL requires).
- `WebGLRenderer({antialias:true})`, `setPixelRatio(min(devicePixelRatio,2))`, full-window canvas `#bg`.
- `PerspectiveCamera(45, aspect, 0.1, 200)`, start `z = 9.6` (or `4.7` if reduced-motion).
- **Lighting (this is what sells realism):** low `AmbientLight(0x2b3550, 0.45)`, a warm key `DirectionalLight(0xfff3e0, 1.55)` at `(5,3,5)` to create a crisp day/night terminator, and a dim cool fill `DirectionalLight(0x2b5a9e, 0.35)` at `(-5,-2,-3)`. Keep ambient low so the night side stays dark.
- **Earth mesh:** `SphereGeometry(2, 96, 96)` + `MeshPhongMaterial`. Set the default `map` to a **procedural canvas texture** (oceans + land + ice caps) so it's never blank, then load and apply, each guarded with an error no-op:
  - `map` = `earthTextures.day` (earth_atmos_2048.jpg)
  - `specularMap` = `earthTextures.specular` + `specular` color ~`0x6f8bb0` (oceans glint under the key light)
  - `normalMap` = `earthTextures.normal`, `normalScale ≈ (0.7,0.7)` (terrain relief)
  - `TextureLoader.setCrossOrigin('anonymous')`.
- **Clouds:** separate sphere `2.03`, `MeshPhongMaterial` with `earthTextures.clouds` as `map`+`alphaMap`, opacity ~0.45, `depthWrite:false`, rotating ~25% faster than the globe.
- **Atmosphere glow (fresnel):** a `2.28` sphere with a `ShaderMaterial` (`BackSide`, `AdditiveBlending`, `transparent`, `depthWrite:false`). Fragment approximates `intensity = max(pow(0.62 - dot(vNormal, vec3(0,0,1)), 3.0), 0.0)` × blue `(0.30,0.58,1.0)`. **Wrap creation in try/catch**; on failure fall back to a larger `MeshBasicMaterial` blue shell at low opacity. This blue limb halo is the single biggest realism win.
- **Stars:** ~2200 `Points` on a random sphere shell (r 45–90), tiny size, very slow rotation.
- **Optional enhancement (not required):** day/night blend with `earthTextures.nightOptional` (city lights on the dark side) via a custom earth shader mixing day/night by the sun-direction dot product. Higher risk (a shader bug = black globe) — only add it if you can test in-browser; otherwise the layered Phong Earth above already looks great.
- **Offline fallback:** if `typeof THREE === 'undefined'`, set `#bg` to a radial-gradient space background and reveal the hero immediately. Never leave a blank screen.

### 7.2 Camera fly-in (the "far → near" zoom)
- On a single rAF loop: continuously spin Earth (`rotation.y += 0.0011`, or `0.0004` reduced-motion) + spin clouds slightly faster + drift stars.
- Zoom: over `~5200ms`, lerp `camera.position.z` from `9.5 → 4.6` using `easeInOutCubic`. When `p ≥ 1`, mark `zoomDone` and **reveal the hero** (add `.show` → CSS fades/rises the headline block in over ~1.4s).
- Reduced-motion: skip the zoom (camera starts near), reveal hero immediately, slow spin.
- Handle `resize`: update camera aspect + renderer size.

### 7.3 Copy (from `content.json → intro`)
Kicker "World Foresight Framework" · H1 "How will the world look in 2040?" · Sub "Not a prediction — a structured, data-driven look at the forces shaping our future, and where the evidence says they are heading." · Button "Begin" · Skip "Skip intro".

### 7.4 Behavior
- **Begin** → go to montage. **Skip intro** → set `zoomDone=true`, go to montage.

---

## 8. Screen 2 — History montage (Earth's creation → 2040)

**Visual:** full-screen, one era at a time. Each frame is a **real full-bleed photograph** (`object-fit:cover`) with a slow Ken-Burns zoom, under a dark bottom-weighted scrim for legibility, with a small line-icon **motif** accent, an uppercase **year**, a serif **title**, a one-line **caption**, and a tiny **credit** line bottom-right. Frames cross-fade; content rises slightly on entry. A **segmented progress bar** across the bottom fills the current segment over the frame duration. Skip top-right; hint "Click anywhere to advance". The images are real (Earth's creation → 2040) — see §6.2 / `content.json` / `ASSETS-README.md`.

### 8.1 Structure & timing
- Build one `.frame` per era + one progress `.seg` per era.
- `frameDurationMs = 3200` (`1800` if reduced-motion) — a touch longer so the photos land. Auto-advance via `setTimeout`; the active segment's inner bar animates width `0→100%` over that duration (linear).
- **Ken Burns:** the `<img>` starts at `scale(1.06)` and eases to `scale(1.16)` over ~7s while its frame is active (`will-change:transform`). Disable under reduced-motion.
- **Click anywhere** (except Skip) advances immediately. After the last frame, transition to the constellation. **Skip →** jumps straight there.
- Motifs are inline SVG line-icons drawn in code (keys in §6.2) shown small (~64px) as an accent above the year. See `motifSVG()` in the reference for all 14 paths — reuse them.

### 8.2 Image rendering + fallback chain (build exactly this)
Each era object carries `localImg` (downloaded path), `img` (live Wikimedia URL), `credit`, and gradient colors `c1/c2`. For every frame:
1. Always render the gradient `.art` div first (radial `c2 → c1 → space black`) as the base layer.
2. If `localImg`/`img` exist, create an `<img class="photo">` and try sources in order **`[localImg, img]`**: on `error`, advance to the next source; if all fail, `display:none` the img so the gradient shows through. (Guard against infinite loops — increment an index, don't reset `onerror` to itself.)
3. Scrim + content + credit sit above the image, identical whether photo or gradient — captions stay legible either way.

This gives the local→live→gradient robustness. **Video option:** to use a clip for a moment, support an optional `era.video` (mp4/webm) rendered as a muted, looping, autoplay `<video class="photo">` with the same cover/scrim treatment; `ASSETS-README.md` explains the swap.

---

## 9. Screen 3 — Five-topic constellation + planet-gravity combine

**Visual:** the light institutional scene. Top bar: brand (title + "The 5 forces of 2040") left, a serif "2040" badge right. Centered lead: "Five forces will shape the next decade." / "Select a force to preview it — or drag two together to see how they combine." Five soft **orbs** (one per topic) arranged in a ring, each labeled with its name + a "Coming soon" pill + an accent dot/ring. A faint hint near the bottom: "Drag one force toward another".

### 9.1 Layout
- Place orbs on a circle: center `(w/2, h/2 + 20)`, radius `min(w,h) * 0.30`, first orb at top (`-90°`), evenly spaced. Recompute on resize (keep each orb's current position if already placed; only reset home targets).
- Each orb stores `{x, y, tx, ty, hx, hy}` (current, target, home). A single rAF `orbLoop` eases `x += (tx-x)*0.16` each frame and writes `left/top`.

### 9.2 The combine interaction (planet gravity) — build this precisely
Constants: `ATTRACT = 230px` (attraction radius), `MERGE = 118px` (merge threshold).

Pointer flow (Pointer Events, works on touch):
1. `pointerdown` on an orb → it becomes `dragging`; record start point; `setPointerCapture`.
2. `pointermove` → the dragged orb follows the pointer *instantly* (set both `x` and `tx`). Track whether the pointer moved >6px to distinguish **drag** vs **click**.
3. Each frame in `orbLoop`, while dragging: find the **nearest other orb**.
   - If distance `< ATTRACT`: that orb is **pulled toward** the dragged one (like gravity) — set its target along the line to the dragged orb, stopping at a small gap (`~MERGE*0.86`). All other orbs ease back home. Draw a dashed **curved link** between the two.
   - If distance `< MERGE`: mark them a **merged pair** and show a **live combo preview** in the Insights bar (title only).
4. `pointerup`:
   - If it was a **click** (no real movement) → treat as **select single**: show that topic's teaser in the Insights bar.
   - Else if a **merged pair** exists → **settle** the two orbs adjacent near center and keep the combo shown in the Insights bar.
   - Else → animate all orbs home, hide the Insights bar.
5. Clicking empty stage background, or the Insights **Close** button, resets all orbs home and hides the bar.

The visual feel should read as *two planets caught in each other's gravity, gliding together to meet.* The easing + the "pull the neighbor toward you" behavior in the reference produces exactly this; preserve it. Reuse/improve `orbLoop`, `onDown/onMove/onUp`, `drawLink`.

### 9.3 States
- Every orb is permanently **"Coming soon"** in Part 1. Selecting/merging never navigates anywhere — it only updates the Insights bar. (Wire a `TODO` where a live topic would route to its page; see §12.)
- Selected orbs get a ring highlight (`.selected`).

---

## 10. Insights bar (shared, bottom)

A panel fixed to the bottom, hidden by default (`translateY(102%)`), slides up (`.up`) when there's something to show. Layout: an "Insights" label with a colored pip, a body (tag + serif title + teaser + a "coming soon" pill), and a Close button.

- **Single force selected:** pip + tag in the topic's accent color; tag = "Force"; title = topic name; teaser = topic teaser (§6.1); pill = "Full topic — coming soon".
- **Two forces combined:** pip + tag in `--navy`; tag = "Power × Economy" (both names); title = the combo headline in quotes, e.g. *"The Sanctions Decade"*; teaser = "How your daily life shifts when these two forces move together."; pill = "Combined insight — coming soon".
- **Close / Esc / empty-stage click:** hides the bar and resets orbs.
- Copy keys live in `content.json → insightsBar`.

---

## 11. Assets (already curated — just fetch them)

All real media is already identified with stable URLs, credits, and licenses in `asset-manifest.json` / `content.json`. To pull local copies:

```bash
cd Website
bash download-assets.sh      # saves into assets/montage/ and assets/earth/
```

1. **Montage photos (14).** Real public-domain / CC images (Earth's creation → 2040) from Wikimedia Commons — see the table in `ASSETS-README.md`. They load live from `Special:FilePath` URLs even without downloading. **Compress** the downloaded files (aim ≤ ~400 KB each; the DMSP/Blue-Marble/Coalbrookdale originals are large) and verify each license/attribution before publishing. A tiny per-frame credit line is already shown.
2. **Earth textures (4 + 1 optional).** three.js example planet maps (day / specular / normal / clouds, plus optional night) via jsDelivr — CORS-enabled, required for WebGL. Procedural fallback guarantees a globe if they don't load.
3. **Fonts.** Fraunces + Inter via Google Fonts (`content.json → typography.googleFontsHref`). Optional: self-host for offline.

**Note for the agent:** licenses vary (NASA/US-gov PD vs. CC BY-SA). Keep visible credits and confirm each item on its `source` page before any public release. Do not swap in copyrighted images without permission.

---

## 12. Future-proofing (build the shell so Phase 2 slots in)

Phase 2 will add per-topic deep-dive pages powered by `Final Data.xlsx`. To avoid rework:
- Give each orb a stable `topic.id` and a single **`TODO: navigate to /topic/{id}`** branch where a `status:"live"` topic would open its page (instead of just showing the Insights teaser). Flipping a topic from `coming_soon` → `live` should be a one-line data change.
- Keep all copy in `CONTENT` so topics can gain a `deepDive` object later without touching layout code.
- Data shape you'll integrate later (for context only, do **not** build now): country × indicator time series 2000→2040 with four series — `historical`, `main_scenario`, `optimistic_scenario`, `pessimistic_scenario` — plus confidence bounds (`lower_ci`/`upper_ci`). ~35 countries, ~37 Power indicators. The likely first deep-dive viz is a **scenario "fan chart."** Architect the constellation so "Discover deeper" can hand off to such a page.

---

## 13. Acceptance criteria (definition of done)

Build is complete when all of the following are true:

**Intro**
- [ ] Opening loads to a dark space scene with a **realistic** rotating Earth — layered day + specular + normal maps, a cloud layer, a blue fresnel limb glow, a clear day/night terminator, and stars. It should look photoreal, not a flat ball.
- [ ] Camera visibly flies from far to near and eases to a stop (~5s), then the headline + Begin fade in.
- [ ] Globe is never blank: procedural texture shows immediately; real textures swap in when loaded; works with Three.js/textures blocked (fallback gradient + hero). Fresnel shader is wrapped in try/catch.
- [ ] "Skip intro" jumps to the montage; visible focus state; keyboard-activatable.
- [ ] Reduced-motion: no fly-in, slower spin, hero shown immediately.

**Montage**
- [ ] 14 frames play in order (Earth's creation → 2040), each showing a **real photograph** with a slow Ken-Burns zoom, scrim, motif accent, year, title, caption, and credit line, plus a filling segmented progress bar.
- [ ] Fallback chain works: local file → live Wikimedia URL → gradient art; a missing/blocked image degrades gracefully with no broken-image icon.
- [ ] Click anywhere advances; "Skip →" jumps to constellation; after the last frame it auto-advances to the constellation.
- [ ] Running `download-assets.sh` makes frames use the local `assets/montage/*` copies.

**Constellation + combine**
- [ ] Scene is the light/institutional palette; 5 orbs in a ring, all "Coming soon", top bar + lead copy present.
- [ ] Clicking (not dragging) an orb opens the Insights bar with that force's teaser.
- [ ] Dragging one orb near another triggers a visible **gravity pull**: the neighbor glides toward the dragged orb, a dashed link is drawn, and within the merge threshold they meet.
- [ ] On merge, the Insights bar shows the correct **combo title** (title only) + "Combined insight — coming soon"; the correct title appears for all 10 pairs.
- [ ] Releasing settles a merged pair; releasing a non-merge returns orbs home; empty-click / Close / Esc resets and hides the bar.
- [ ] Works with **touch** (pointer events, `touch-action:none`), and re-flows on window resize.

**General**
- [ ] Single `index.html`, opens over `file://` with no server; no console errors.
- [ ] All copy comes from `CONTENT`/`world-2040-content.json` (nothing hard-coded elsewhere).
- [ ] Fonts degrade gracefully; layout holds from 360px to desktop.
- [ ] Only one screen visible at a time; the Three.js loop is cancelled once the constellation is shown.

---

## 14. Build order (suggested)
1. Scaffold `index.html` + `<style>` tokens + inline `CONTENT` + the three empty screens + the flow (`show()`).
2. Intro Three.js scene + fly-in + hero reveal + skip + fallbacks.
3. Montage (frames, motifs, progress, timing, click/skip, `img` hook).
4. Constellation layout + orb rendering + idle placement.
5. Combine interaction (`orbLoop` gravity, drag vs click, link, merge/settle/reset).
6. Insights bar (single + combo) + Close/Esc.
7. Reduced-motion, responsive, keyboard, resize.
8. Verify against §13. Compare behavior to `world-2040-reference-prototype.html`.

---

*Prepared as the input package for Part 1. The reference prototype implements this spec end-to-end; use it to resolve any ambiguity, then harden and polish.*
