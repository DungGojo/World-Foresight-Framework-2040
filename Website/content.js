/* ============================================================================
   WORLD FORESIGHT FRAMEWORK — content.js
   ----------------------------------------------------------------------------
   EVERY word, image, color and credit on the site lives in this one file.
   Edit it with any text editor, save, and refresh the browser — no build step.

   Quick recipes:
   • Change a headline/caption      -> intro / montage.eras[n].title | .cap
   • Swap a timeline photo          -> era.localImg (drop file in assets/montage/)
                                        and/or era.img (any direct image URL)
   • Use a video for one moment     -> add  "video": "assets/montage/clip.mp4"
   • Re-order / add / delete moments-> edit the montage.eras array (chapter: 0-5)
   • Change force tags on a moment  -> era.forces: ["power","tech",...]
   • Frame timing                   -> montage.chapters[n].dur (milliseconds)
   • Topic teasers / combo titles   -> topics / combos
   • When a topic page goes live    -> set its topic.status to "live" and add
                                        "href": "topics/power.html"
   ========================================================================== */
window.WFF_CONTENT =
{
  "meta": {
    "project": "World Foresight Framework",
    "build": "Part 1 — Front-end shell (intro + story montage + constellation)",
    "centralQuestion": "How will the world look in 2040?",
    "note": "SINGLE SOURCE OF TRUTH for all Part-1 copy and media lives in content.js (this JSON is a generated mirror of it — edit content.js). The montage tells one story: deep past → first civilizations → 1000–2025 across the five forces → the 2040 question. Every era: localImg is tried first, then the live Wikimedia img URL, then gradient art (c1/c2 + motif) — nothing ever renders broken. Verify each image's license before public release (see ASSETS-README.md)."
  },
  "palette": {
    "light": {
      "bg": "#f6f4ef",
      "panel": "#fffdf9",
      "ink": "#17181d",
      "muted": "#6d6a63",
      "line": "#e4dfd4",
      "navy": "#1b2a4a"
    },
    "dark": {
      "space": "#05070d",
      "spaceGlowFrom": "#12294d",
      "textOnDark": "#ffffff",
      "textOnDarkMuted": "rgba(255,255,255,0.68)"
    },
    "topicColors": {
      "power": "#9e2b25",
      "tech": "#3b4e8c",
      "planet": "#2e7d6b",
      "people": "#b07a34",
      "economy": "#4a5d73"
    }
  },
  "typography": {
    "serifDisplay": "Fraunces (Google Fonts) 400/500/600; fallback Georgia, 'Times New Roman', serif",
    "sans": "Inter (Google Fonts) 400/500/600; fallback -apple-system, 'Segoe UI', sans-serif",
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
  },
  "earthTextures": {
    "comment": "Photoreal Earth for the intro. Live URLs are CORS-enabled CDNs (required for WebGL). localPath is written by download-assets.sh; the site prefers local files when served over http(s) and falls back to the live URL, then to a procedural canvas Earth — the globe is never blank.",
    "day": {
      "url": "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
      "localPath": "assets/earth/earth_day.jpg",
      "note": "4K NASA Blue Marble"
    },
    "night": {
      "url": "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg",
      "localPath": "assets/earth/earth_night.jpg",
      "note": "4K city lights, blended on the night side"
    },
    "clouds": {
      "url": "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_2048.png",
      "localPath": "assets/earth/earth_clouds.png",
      "note": "transparent cloud layer"
    },
    "water": {
      "url": "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png",
      "localPath": "assets/earth/earth_water.png",
      "note": "ocean mask → sun glint"
    },
    "topology": {
      "url": "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png",
      "localPath": "assets/earth/earth_topology.png",
      "note": "terrain relief (bump)"
    },
    "sky": {
      "url": "https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png",
      "localPath": "assets/earth/night_sky.png",
      "note": "Milky-Way starfield backdrop"
    }
  },
  "intro": {
    "kicker": "World Foresight Framework",
    "headline": "How will the world look in 2040?",
    "subhead": "This is not a prediction. It is a structured, data-driven look at the five forces shaping our future and where the evidence says they are heading.",
    "beginLabel": "Begin the story",
    "skipLabel": "Skip intro"
  },
  "montage": {
    "skipLabel": "Skip →",
    "advanceHint": "Click anywhere to continue · ← → keys work too",
    "finaleCtaLabel": "Meet the five forces",
    "frameDurationReducedScale": 0.6,
    "kenBurns": true,
    "chapters": [
      {
        "label": "Prologue · Deep time",
        "dur": 2400
      },
      {
        "label": "Prologue · First civilizations",
        "dur": 2600
      },
      {
        "label": "Chapter One · The world converges, 1000 to 1900",
        "dur": 4200
      },
      {
        "label": "Chapter Two · The great acceleration, 1900 to 2000",
        "dur": 4200
      },
      {
        "label": "Chapter Three · The world we inherit, 2000 to 2025",
        "dur": 4400
      },
      {
        "label": "The next chapter is unwritten",
        "dur": 12000
      }
    ],
    "eras": [
      {
        "chapter": 0,
        "yr": "4.6 billion years ago",
        "title": "A world ignites",
        "cap": "From a disc of dust and fire, a molten planet takes shape.",
        "motif": "sun",
        "c1": "#2a0a06",
        "c2": "#7a2410",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Hadean.png?width=1920",
        "localImg": "assets/montage/01-hadean.jpg",
        "credit": "Tim Bertelink",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Hadean.png"
      },
      {
        "chapter": 0,
        "yr": "3.8 billion years ago",
        "title": "Life begins",
        "cap": "In ancient seas, the first living cells appear.",
        "motif": "cell",
        "c1": "#04231f",
        "c2": "#0d5c4a",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Stromatolites_in_Sharkbay.jpg?width=1920",
        "localImg": "assets/montage/02-stromatolites.jpg",
        "credit": "Paul Harrison",
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Stromatolites_in_Sharkbay.jpg"
      },
      {
        "chapter": 0,
        "yr": "66 million years ago",
        "title": "The great reset",
        "cap": "An asteroid ends the age of giants. Mammals inherit the Earth.",
        "motif": "comet",
        "c1": "#241207",
        "c2": "#6b3410",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicxulub_impact_-_artist_impression.jpg?width=1920",
        "localImg": "assets/montage/03-chicxulub.jpg",
        "credit": "Donald E. Davis / NASA",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Chicxulub_impact_-_artist_impression.jpg"
      },
      {
        "chapter": 0,
        "yr": "300,000 years ago",
        "title": "We arrive",
        "cap": "Homo sapiens appears: curious, social and restless.",
        "motif": "spark",
        "c1": "#1c1408",
        "c2": "#5c4420",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Lascaux_painting.jpg?width=1920",
        "localImg": "assets/montage/04-lascaux.jpg",
        "credit": "Lascaux cave art, France",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg"
      },
      {
        "chapter": 1,
        "yr": "10,000 BCE",
        "title": "We settle",
        "cap": "Farming replaces wandering. The first villages take root.",
        "motif": "grain",
        "c1": "#182008",
        "c2": "#4d6b18",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_harvest.jpg?width=1920",
        "localImg": "assets/montage/05-egypt-harvest.jpg",
        "credit": "Ancient Egyptian tomb painting",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Egyptian_harvest.jpg"
      },
      {
        "chapter": 1,
        "yr": "3,000 BCE",
        "title": "We record",
        "cap": "Writing, cities, and the first states are born.",
        "motif": "tablet",
        "c1": "#1e1606",
        "c2": "#6b5116",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Ziggurat_of_Ur.jpg?width=1920",
        "localImg": "assets/montage/06-ziggurat-ur.jpg",
        "credit": "Kaufingdude (Wikimedia)",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Ziggurat_of_Ur.jpg"
      },
      {
        "chapter": 1,
        "yr": "80 CE",
        "title": "Empires rise",
        "cap": "Rome, Han China, and the first superpowers stitch continents together.",
        "motif": "column",
        "c1": "#191410",
        "c2": "#5e4a30",
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Colosseo_2020.jpg?width=1920",
        "localImg": "assets/montage/07-colosseum.jpg",
        "credit": "FeaturedPics (Wikimedia)",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg"
      },
      {
        "chapter": 2,
        "yr": "~1100",
        "title": "One world, many markets",
        "cap": "Song China hums with commerce. Silk roads and sea lanes tie strangers' fates together.",
        "motif": "scroll",
        "c1": "#1a140a",
        "c2": "#6b5424",
        "forces": [
          "economy",
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Bianjing_city_gate.JPG?width=1920",
        "localImg": "assets/montage/08-qingming.jpg",
        "credit": "Zhang Zeduan, 'Along the River During Qingming' (12th c., detail)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Bianjing_city_gate.JPG"
      },
      {
        "chapter": 2,
        "yr": "1440s",
        "title": "Knowledge breaks free",
        "cap": "Gutenberg's press sets ideas loose. Learning stops being a privilege.",
        "motif": "page",
        "c1": "#160f1e",
        "c2": "#4a3a6b",
        "forces": [
          "tech"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Gutenberg_Bible_scan.jpg?width=1920",
        "localImg": "assets/montage/09-gutenberg.jpg",
        "credit": "Gutenberg Bible (c. 1455)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Gutenberg_Bible_scan.jpg"
      },
      {
        "chapter": 2,
        "yr": "1502",
        "title": "Worlds collide",
        "cap": "Ocean empires redraw the map through conquest, commerce and the first global economy.",
        "motif": "map",
        "c1": "#0d1a24",
        "c2": "#2e5a7a",
        "forces": [
          "power",
          "economy"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Cantino_planisphere_%281502%29.jpg?width=1920",
        "localImg": "assets/montage/10-cantino.jpg",
        "credit": "Cantino planisphere (1502)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Cantino_planisphere_(1502).jpg"
      },
      {
        "chapter": 2,
        "yr": "1687",
        "title": "Science rewrites the rules",
        "cap": "Newton shows that the universe runs on laws we can discover and use.",
        "motif": "flask",
        "c1": "#141414",
        "c2": "#4a4438",
        "forces": [
          "tech"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Prinicipia-title.png?width=1920",
        "localImg": "assets/montage/11-principia.jpg",
        "credit": "Isaac Newton, 'Principia' (1687)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Prinicipia-title.png",
        "pos": "50% 12%"
      },
      {
        "chapter": 2,
        "yr": "1760s",
        "title": "The engine age",
        "cap": "Steam, coal and iron accelerate everything and begin rewriting the atmosphere.",
        "motif": "gear",
        "c1": "#161616",
        "c2": "#4a4a4a",
        "forces": [
          "economy",
          "tech",
          "planet"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Philipp_Jakob_Loutherbourg_d._J._-_Coalbrookdale_by_Night_-_WGA13730.jpg?width=1920",
        "localImg": "assets/montage/12-coalbrookdale.jpg",
        "credit": "P. J. de Loutherbourg, 'Coalbrookdale by Night' (1801)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Philipp_Jakob_Loutherbourg_d._J._-_Coalbrookdale_by_Night_-_WGA13730.jpg"
      },
      {
        "chapter": 2,
        "yr": "1869",
        "title": "Distance dies",
        "cap": "Railways and telegraphs shrink the planet. People, goods, and ideas move like never before.",
        "motif": "rail",
        "c1": "#171310",
        "c2": "#57432e",
        "forces": [
          "economy",
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/East_and_West_Shaking_hands_at_the_laying_of_last_rail_Union_Pacific_Railroad_-_Restoration.jpg?width=1920",
        "localImg": "assets/montage/13-golden-spike.jpg",
        "credit": "A. J. Russell (1869)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:East_and_West_Shaking_hands_at_the_laying_of_last_rail_Union_Pacific_Railroad_-_Restoration.jpg"
      },
      {
        "chapter": 3,
        "yr": "1914–1918",
        "title": "The world at war",
        "cap": "Industrial power turns on itself. Empires fall in the trenches.",
        "motif": "trench",
        "c1": "#141210",
        "c2": "#4a4236",
        "forces": [
          "power"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Cheshire_Regiment_trench_Somme_1916.jpg?width=1920",
        "localImg": "assets/montage/14-ww1-trench.jpg",
        "credit": "John Warwick Brooke (1916)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Cheshire_Regiment_trench_Somme_1916.jpg"
      },
      {
        "chapter": 3,
        "yr": "1929",
        "title": "The economy breaks",
        "cap": "The Great Depression shows how one market's crash becomes everyone's crisis.",
        "motif": "coin",
        "c1": "#171412",
        "c2": "#4d4034",
        "forces": [
          "economy",
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Lange-MigrantMother02.jpg?width=1920",
        "localImg": "assets/montage/15-migrant-mother.jpg",
        "credit": "Dorothea Lange, 'Migrant Mother' (1936)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg"
      },
      {
        "chapter": 3,
        "yr": "1939–1945",
        "title": "Total war",
        "cap": "The deadliest conflict in history redraws the world order.",
        "motif": "radar",
        "c1": "#10141a",
        "c2": "#3a4a5e",
        "forces": [
          "power"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Into_the_Jaws_of_Death_23-0455M_edit.jpg?width=1920",
        "localImg": "assets/montage/16-dday.jpg",
        "credit": "Robert F. Sargent, U.S. Coast Guard (1944)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Into_the_Jaws_of_Death_23-0455M_edit.jpg"
      },
      {
        "chapter": 3,
        "yr": "1945",
        "title": "The atomic age",
        "cap": "We split the atom and unlock a new scale of power and peril.",
        "motif": "atom",
        "c1": "#1c0a0a",
        "c2": "#7a1f1f",
        "forces": [
          "power",
          "tech"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Trinity_Test_Fireball_25ms.jpg?width=1920",
        "localImg": "assets/montage/17-trinity.jpg",
        "credit": "U.S. Government (Trinity test)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Trinity_Test_Fireball_25ms.jpg"
      },
      {
        "chapter": 3,
        "yr": "1950 → today",
        "title": "The human tide",
        "cap": "From 2.5 to 8 billion people in one lifetime. Humanity becomes an urban species.",
        "motif": "crowd",
        "c1": "#131118",
        "c2": "#43405e",
        "forces": [
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Shibuya_Crossing_%2853333799585%29.jpg?width=1920",
        "localImg": "assets/montage/18-human-tide.jpg",
        "credit": "Dick Thomas Johnson",
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Shibuya_Crossing_(53333799585).jpg"
      },
      {
        "chapter": 3,
        "yr": "1969",
        "title": "We leave Earth",
        "cap": "For the first time, we see our home from the outside as one small blue world.",
        "motif": "moon",
        "c1": "#050814",
        "c2": "#1a2b6b",
        "forces": [
          "tech"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/NASA-Apollo8-Dec24-Earthrise.jpg?width=1920",
        "localImg": "assets/montage/19-earthrise.jpg",
        "credit": "William Anders / NASA (Apollo 8)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:NASA-Apollo8-Dec24-Earthrise.jpg"
      },
      {
        "chapter": 3,
        "yr": "1970s",
        "title": "The planet pushes back",
        "cap": "Smog, oil shocks, vanishing forests: growth reveals its price tag.",
        "motif": "smog",
        "c1": "#141414",
        "c2": "#4f4a3a",
        "forces": [
          "planet"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/THE_GEORGE_WASHINGTON_BRIDGE_IN_HEAVY_SMOG._VIEW_TOWARD_THE_NEW_JERSEY_SIDE_OF_THE_HUDSON_RIVER_-_NARA_-_548335.jpg?width=1920",
        "localImg": "assets/montage/20-smog.jpg",
        "credit": "Chester Higgins Jr., EPA Documerica (1973)",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:THE_GEORGE_WASHINGTON_BRIDGE_IN_HEAVY_SMOG._VIEW_TOWARD_THE_NEW_JERSEY_SIDE_OF_THE_HUDSON_RIVER_-_NARA_-_548335.jpg"
      },
      {
        "chapter": 3,
        "yr": "1989",
        "title": "Walls come down",
        "cap": "The Cold War ends. For a moment, the world feels like one system.",
        "motif": "wall",
        "c1": "#12100e",
        "c2": "#4a3f38",
        "forces": [
          "power"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Thefalloftheberlinwall1989.JPG?width=1920",
        "localImg": "assets/montage/21-berlin-wall.jpg",
        "credit": "Lear 21 (Wikimedia)",
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Thefalloftheberlinwall1989.JPG"
      },
      {
        "chapter": 3,
        "yr": "1990s",
        "title": "One world market",
        "cap": "Container ships and open borders wire national economies into a single machine.",
        "motif": "ship",
        "c1": "#0a1418",
        "c2": "#2a4a56",
        "forces": [
          "economy"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Line3174_-_Shipping_Containers_at_the_terminal_at_Port_Elizabeth%2C_New_Jersey_-_NOAA.jpg?width=1920",
        "localImg": "assets/montage/22-containers.jpg",
        "credit": "NOAA",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Line3174_-_Shipping_Containers_at_the_terminal_at_Port_Elizabeth,_New_Jersey_-_NOAA.jpg"
      },
      {
        "chapter": 3,
        "yr": "1990s–2010s",
        "title": "Everyone, connected",
        "cap": "The internet links billions of minds into one restless network.",
        "motif": "net",
        "c1": "#04141a",
        "c2": "#0e5566",
        "forces": [
          "tech",
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg?width=1920",
        "localImg": "assets/montage/23-city-lights.jpg",
        "credit": "NASA / DMSP",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Earth's_City_Lights_by_DMSP,_1994-1995_(large).jpg"
      },
      {
        "chapter": 4,
        "yr": "2008",
        "title": "The system trembles",
        "cap": "A mortgage crisis in one country becomes a crisis everywhere. Trust in the machine cracks.",
        "motif": "chart",
        "c1": "#12141a",
        "c2": "#3e4a63",
        "forces": [
          "economy"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Lehman_Brothers_Times_Square_by_David_Shankbone.jpg?width=1920",
        "localImg": "assets/montage/24-lehman.jpg",
        "credit": "David Shankbone",
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Lehman_Brothers_Times_Square_by_David_Shankbone.jpg"
      },
      {
        "chapter": 4,
        "yr": "2020",
        "title": "A shared shock",
        "cap": "A virus stops the world in weeks, revealing how tightly our fates are connected.",
        "motif": "mask",
        "c1": "#0e1216",
        "c2": "#37454f",
        "forces": [
          "people"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Times_Square_Pandemic_Lockdown_Dec._31%2C_2020.jpg?width=1920",
        "localImg": "assets/montage/25-pandemic.jpg",
        "credit": "Natalie Wynne Pace",
        "license": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Times_Square_Pandemic_Lockdown_Dec._31,_2020.jpg",
        "pos": "50% 30%"
      },
      {
        "chapter": 4,
        "yr": "The 2020s",
        "title": "Machines that think",
        "cap": "AI begins to reason, write and create alongside us, reshaping work itself.",
        "motif": "ai",
        "c1": "#0a1424",
        "c2": "#2b4a8c",
        "forces": [
          "tech"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/BalticServers_data_center.jpg?width=1920",
        "localImg": "assets/montage/26-ai-datacenter.jpg",
        "credit": "Fleshas / BalticServers",
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:BalticServers_data_center.jpg"
      },
      {
        "chapter": 4,
        "yr": "2023–2024",
        "title": "The hottest years on record",
        "cap": "Orange skies and broken records: the climate bill starts arriving.",
        "motif": "flame",
        "c1": "#1c0f06",
        "c2": "#8c4a10",
        "forces": [
          "planet"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Kite_Hill_under_a_sky_orange_with_wildfire_smoke%2C_San_Francisco%2C_California%2C_USA.jpg?width=1920",
        "localImg": "assets/montage/27-orange-sky.jpg",
        "credit": "Semiautonomous (Wikimedia)",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Kite_Hill_under_a_sky_orange_with_wildfire_smoke,_San_Francisco,_California,_USA.jpg"
      },
      {
        "chapter": 4,
        "yr": "2025",
        "title": "Now, five forces are in motion",
        "cap": "Eight billion people share one wired, warming and restless world. Five forces have written the story so far.",
        "motif": "earth",
        "c1": "#0d1420",
        "c2": "#2e3d5e",
        "forces": [
          "power",
          "tech",
          "planet",
          "people",
          "economy"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/An_aurora_blankets_the_Earth_beneath_a_celestial_night_sky_as_the_International_Space_Station_orbited_261_miles_above_the_Atlantic_Ocean_off_the_coast_of_North_America.jpg?width=1920",
        "localImg": "assets/montage/28-iss-aurora.jpg",
        "credit": "NASA / ISS",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:An_aurora_blankets_the_Earth_beneath_a_celestial_night_sky_as_the_International_Space_Station_orbited_261_miles_above_the_Atlantic_Ocean_off_the_coast_of_North_America.jpg",
        "pos": "50% 88%"
      },
      {
        "chapter": 5,
        "yr": "2025 → 2040",
        "title": "What will the world look like in 2040?",
        "cap": "How will the way we live, work, move and belong change with it? Five forces hold the answer, and this project follows the data to find it.",
        "motif": "q",
        "c1": "#0d1420",
        "c2": "#2e3d5e",
        "forces": [
          "power",
          "tech",
          "planet",
          "people",
          "economy"
        ],
        "img": "https://commons.wikimedia.org/wiki/Special:FilePath/The_Earth_seen_from_Apollo_17.jpg?width=1920",
        "localImg": "assets/montage/29-blue-marble.jpg",
        "credit": "NASA (Apollo 17, 'Blue Marble')",
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg",
        "finale": true
      }
    ]
  },
  "constellation": {
    "brandTitle": "World Foresight Framework",
    "brandSub": "The 5 forces of 2040",
    "yearBadge": "2040",
    "leadTitle": "Five forces will shape the next fifteen years.",
    "leadSub": "Select a force to preview it, or drag two together to see how they combine.",
    "dragHint": "Drag one force toward another",
    "replayLabel": "↺ Replay the story"
  },
  "topics": [
    {
      "id": "power",
      "name": "Power",
      "color": "#9e2b25",
      "status": "coming_soon",
      "teaser": "Who sets the rules and holds the leverage? This force looks at geopolitics, alliances and whether the world cooperates or fragments."
    },
    {
      "id": "tech",
      "name": "Technology",
      "color": "#3b4e8c",
      "status": "coming_soon",
      "teaser": "Will innovation enrich, divide or destabilize society? This force looks at AI, labour markets, productivity and inequality."
    },
    {
      "id": "planet",
      "name": "Planet",
      "color": "#2e7d6b",
      "status": "coming_soon",
      "teaser": "Can we adapt before planetary boundaries break? This force looks at climate, food, water, energy and livability."
    },
    {
      "id": "people",
      "name": "People",
      "color": "#b07a34",
      "status": "coming_soon",
      "teaser": "Who moves, who ages, who gathers in cities and who pushes back? This force looks at demographics, migration and unrest."
    },
    {
      "id": "economy",
      "name": "Economy",
      "color": "#4a5d73",
      "status": "coming_soon",
      "teaser": "Will the global economy integrate, fracture or rewire itself? This force looks at trade blocs, supply chains and resilience."
    }
  ],
  "combos": {
    "_comment": "Key = two topic ids sorted alphabetically, joined with '|'. Value = human-behaviour headline shown in the Insights bar.",
    "power|tech": "The Splinternet Generation",
    "planet|power": "Climate as Leverage",
    "people|power": "Borders & Belonging",
    "economy|power": "The Sanctions Decade",
    "planet|tech": "Compute vs. Carbon",
    "people|tech": "Living With Machines",
    "economy|tech": "The Automation Squeeze",
    "people|planet": "The Great Relocation",
    "economy|planet": "Pricing a Hotter World",
    "economy|people": "Who Gets the Growth"
  },
  "insightsBar": {
    "label": "Insights",
    "singleTag": "Force",
    "singleSoon": "Full topic coming soon",
    "comboTeaser": "How your daily life shifts when these two forces move together.",
    "comboSoon": "Combined insight coming soon",
    "closeLabel": "Close"
  }
};
