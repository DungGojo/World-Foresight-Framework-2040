# World Foresight Framework — Website (Part 1)

A cinematic, single-page front end for the question **“How will the world look in 2040?”**

**Flow:** photoreal Earth intro → the story of how five forces (Power, Technology, Planet,
People, Economy) shaped the world from deep time to 2025 → the 2040 question → the
five-force constellation with the drag-to-combine interaction.

---

## Run it locally

**Option A — just double-click [index.html](index.html).**
Works offline-ish: Earth textures and any missing photos stream from the internet
(local files can’t feed WebGL over `file://` for security reasons).

**Option B — tiny local server (recommended, uses the downloaded assets):**

```bash
cd Website
python3 -m http.server 8123
# then open http://localhost:8123
```

**First time?** Download all media locally (photos + Earth textures, ~1–2 min):

```bash
cd Website
bash download-assets.sh
```

Nothing breaks if you skip this — every image falls back to its live URL, then to
gradient art.

---

## Edit the content (no code needed)

**Everything editable lives in [content.js](content.js)** — every headline, caption,
year label, photo, credit, color, teaser, and combo title. Open it in any text editor,
change a value, save, refresh the browser.

| I want to… | Edit |
|---|---|
| Change the opening headline / subtitle | `intro.headline`, `intro.subhead` |
| Rewrite a timeline moment | `montage.eras[n]` → `yr`, `title`, `cap` |
| Swap a timeline photo | drop the file in `assets/montage/`, point `era.localImg` at it |
| Use a **video** for a moment | add `"video": "assets/montage/clip.mp4"` to that era |
| Add / remove / reorder moments | edit the `montage.eras` array (keep `chapter` 0–5 in order) |
| Change which forces a moment touches | `era.forces`: any of `power, tech, planet, people, economy` |
| Make chapters faster/slower | `montage.chapters[n].dur` (milliseconds per frame) |
| Change a force’s teaser text | `topics[n].teaser` |
| Rename a combined-forces headline | `combos` (key = two ids alphabetical, e.g. `"economy|power"`) |
| Change site colors | `palette` (light scene, dark scene, per-force accents) |
| Higher-res Earth | replace files in `assets/earth/` (equirectangular maps), keep the same names |

`world-2040-content.json` is a machine-readable mirror of content.js (kept for tooling) —
when in doubt, **edit content.js**; it is what the site actually loads.

---

## When a topic goes live (Phase 2)

Each orb in the constellation carries a stable `topic.id`. To connect a real topic page
later: build the page, then in content.js set that topic’s `status` to `"live"` and add
`"href": "topics/power.html"`. The shell was built so this needs no layout changes —
the data deep-dives (from `Final Data.xlsx`) slot into those pages.

## Files

| File | Purpose |
|---|---|
| `index.html` | the whole site (structure, styles, Earth engine, interactions) |
| `content.js` | **single source of truth for all copy + media — edit this** |
| `world-2040-content.json` | generated mirror of content.js |
| `asset-manifest.json` | every image with source + license |
| `download-assets.sh` | fetches all media into `assets/` |
| `ASSETS-README.md` | image credit/license table, how to swap media |
| `world-2040-BUILD-SPEC.md` | original build brief (montage since redesigned into the chaptered story) |

## Credits & licensing

Most photos are NASA / U.S.-government public domain; several are Creative Commons
(BY / BY-SA) and **require visible attribution** — the site shows a per-frame credit
line automatically. Verify each license on its source page (see `asset-manifest.json`)
before any public release.
