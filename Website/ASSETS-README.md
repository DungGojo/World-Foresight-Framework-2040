# Website assets — README

Media package for the World Foresight Framework front end. All copy + media references
live in **content.js** (see README.md). This file is the image credit/license table.

## Two ways the media works

1. **Live (no download):** every era references a Wikimedia Commons `Special:FilePath`
   URL that loads directly in the browser.
2. **Local (recommended):** `bash download-assets.sh` saves everything into `assets/`
   (montage photos are recompressed to ≤1920px JPEG on macOS). The site tries the local
   copy first, then the live URL, then gradient art — nothing ever renders broken.

## Earth textures (intro globe)

| Layer | Source | License |
|---|---|---|
| Day (Blue Marble 4K) | three-globe / NASA via jsDelivr | NASA imagery — PD |
| Night city lights 4K | three-globe / NASA via jsDelivr | NASA imagery — PD |
| Clouds (transparent) | three.js examples via jsDelivr | MIT repo / NASA source |
| Ocean mask, topology | three-globe via jsDelivr | NASA imagery — PD |
| Milky-Way starfield | three-globe via jsDelivr | ESO — CC BY 4.0 |

Want sharper? Drop any equirectangular 8K maps into `assets/earth/` keeping the same
filenames (e.g. from solarsystemscope.com/textures — CC BY 4.0).

## The 29 story moments (deep time → 2040)

| # | Moment | Image | Credit | License |
|---|--------|-------|--------|---------|
| 1 | A world ignites (4.6 Gya) | Hadean Earth | Tim Bertelink | CC BY-SA 4.0 |
| 2 | Life begins (3.8 Gya) | Shark Bay stromatolites | Paul Harrison | CC BY-SA 3.0 |
| 3 | The great reset (66 Mya) | Chicxulub impact | Donald E. Davis / NASA | Public domain |
| 4 | We arrive (300 kya) | Lascaux cave painting | — | Public domain |
| 5 | We settle (10,000 BCE) | Egyptian harvest tomb painting | — | Public domain |
| 6 | We record (3,000 BCE) | Ziggurat of Ur | Kaufingdude | CC BY-SA 4.0 |
| 7 | Empires rise (80 CE) | Colosseum | FeaturedPics | CC BY-SA 4.0 |
| 8 | One world, many markets (~1100) | Along the River During Qingming | Zhang Zeduan | Public domain |
| 9 | Knowledge breaks free (1440s) | Gutenberg Bible | — | Public domain |
| 10 | Worlds collide (1502) | Cantino planisphere | — | Public domain |
| 11 | Science rewrites the rules (1687) | Principia title page | — | Public domain |
| 12 | The engine age (1760s) | Coalbrookdale by Night | de Loutherbourg | Public domain |
| 13 | Distance dies (1869) | Golden spike ceremony | A. J. Russell | Public domain |
| 14 | The world at war (1914–18) | Somme trench | J. W. Brooke | Public domain |
| 15 | The economy breaks (1929) | Migrant Mother | Dorothea Lange | Public domain |
| 16 | Total war (1939–45) | Into the Jaws of Death | R. F. Sargent / USCG | Public domain |
| 17 | The atomic age (1945) | Trinity test fireball | U.S. Government | Public domain |
| 18 | The human tide (1950→) | Shibuya crossing | Dick Thomas Johnson | CC BY 2.0 |
| 19 | We leave Earth (1969) | Apollo 8 “Earthrise” | W. Anders / NASA | Public domain |
| 20 | The planet pushes back (1970s) | GW Bridge in smog | C. Higgins / EPA | Public domain |
| 21 | Walls come down (1989) | Fall of the Berlin Wall | Lear 21 | CC BY-SA 3.0 |
| 22 | One world market (1990s) | Port Elizabeth containers | NOAA | Public domain |
| 23 | Everyone, connected (1990s–2010s) | Earth’s city lights | NASA / DMSP | Public domain |
| 24 | The system trembles (2008) | Lehman Brothers HQ | David Shankbone | CC BY-SA 3.0 |
| 25 | A shared shock (2020) | Times Square lockdown | Natalie Wynne Pace | CC BY 4.0 |
| 26 | Machines that think (2020s) | Data center | Fleshas / BalticServers | CC BY-SA 3.0 |
| 27 | Hottest years on record (2023–24) | Orange wildfire sky, SF | Semiautonomous | CC BY-SA 4.0 |
| 28 | Now — five forces in motion (2025) | Aurora from the ISS | NASA | Public domain |
| 29 | What comes next? (2040) | Apollo 17 “Blue Marble” | NASA | Public domain |

Full source links: `asset-manifest.json`.

## License / attribution note

CC BY / BY-SA items **require attribution** — the site renders a per-frame credit line
automatically; keep it visible. Verify each item on its source page before publishing.

## Swapping in your own picks (or video)

1. Drop your file into `assets/montage/` (e.g. `17-trinity.jpg` or `17-trinity.mp4`).
2. In content.js, point that era’s `localImg` at it — or add `"video": "assets/montage/17-trinity.mp4"`.
Images render by default; a `video` value renders as a muted, looping, full-bleed clip.
