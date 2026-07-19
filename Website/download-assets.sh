#!/bin/bash
# Downloads all site media into assets/ (montage photos + Earth textures).
# Re-run any time; safe to interrupt. Uses a polite delay for Wikimedia.
# On macOS, images are recompressed to ~1920px JPEG via sips to stay light.
cd "$(dirname "$0")"
mkdir -p assets/montage assets/earth
UA="WorldForesightFramework/1.0 (personal project; contact via repo)"

fetch () {  # fetch <url> <outfile>
  if [ -s "$2" ]; then echo "skip (exists)  $2"; return 0; fi
  echo "fetching       $2"
  curl -sL --fail --retry 2 --max-time 120 -A "$UA" "$1" -o "$2.tmp" || { echo "  !! failed: $1"; rm -f "$2.tmp"; return 1; }
  mv "$2.tmp" "$2"
}

compress () {  # compress <file>  (macOS only; no-op elsewhere)
  command -v sips >/dev/null || return 0
  case "$1" in *.jpg|*.jpeg) sips -Z 1920 -s format jpeg -s formatOptions 78 "$1" --out "$1" >/dev/null 2>&1 ;; esac
}

echo '— Earth textures —'
fetch "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg" "assets/earth/earth_day.jpg"
fetch "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg" "assets/earth/earth_night.jpg"
fetch "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_2048.png" "assets/earth/earth_clouds.png"
fetch "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png" "assets/earth/earth_water.png"
fetch "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png" "assets/earth/earth_topology.png"
fetch "https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png" "assets/earth/night_sky.png"

echo '— Montage photos (29) —'
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Hadean.png?width=1920" "assets/montage/01-hadean.jpg" && compress "assets/montage/01-hadean.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Stromatolites_in_Sharkbay.jpg?width=1920" "assets/montage/02-stromatolites.jpg" && compress "assets/montage/02-stromatolites.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Chicxulub_impact_-_artist_impression.jpg?width=1920" "assets/montage/03-chicxulub.jpg" && compress "assets/montage/03-chicxulub.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Lascaux_painting.jpg?width=1920" "assets/montage/04-lascaux.jpg" && compress "assets/montage/04-lascaux.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_harvest.jpg?width=1920" "assets/montage/05-egypt-harvest.jpg" && compress "assets/montage/05-egypt-harvest.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Ziggurat_of_Ur.jpg?width=1920" "assets/montage/06-ziggurat-ur.jpg" && compress "assets/montage/06-ziggurat-ur.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Colosseo_2020.jpg?width=1920" "assets/montage/07-colosseum.jpg" && compress "assets/montage/07-colosseum.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Bianjing_city_gate.JPG?width=1920" "assets/montage/08-qingming.jpg" && compress "assets/montage/08-qingming.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Gutenberg_Bible_scan.jpg?width=1920" "assets/montage/09-gutenberg.jpg" && compress "assets/montage/09-gutenberg.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Cantino_planisphere_%281502%29.jpg?width=1920" "assets/montage/10-cantino.jpg" && compress "assets/montage/10-cantino.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Prinicipia-title.png?width=1920" "assets/montage/11-principia.jpg" && compress "assets/montage/11-principia.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Philipp_Jakob_Loutherbourg_d._J._-_Coalbrookdale_by_Night_-_WGA13730.jpg?width=1920" "assets/montage/12-coalbrookdale.jpg" && compress "assets/montage/12-coalbrookdale.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/East_and_West_Shaking_hands_at_the_laying_of_last_rail_Union_Pacific_Railroad_-_Restoration.jpg?width=1920" "assets/montage/13-golden-spike.jpg" && compress "assets/montage/13-golden-spike.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Cheshire_Regiment_trench_Somme_1916.jpg?width=1920" "assets/montage/14-ww1-trench.jpg" && compress "assets/montage/14-ww1-trench.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Lange-MigrantMother02.jpg?width=1920" "assets/montage/15-migrant-mother.jpg" && compress "assets/montage/15-migrant-mother.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Into_the_Jaws_of_Death_23-0455M_edit.jpg?width=1920" "assets/montage/16-dday.jpg" && compress "assets/montage/16-dday.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Trinity_Test_Fireball_25ms.jpg?width=1920" "assets/montage/17-trinity.jpg" && compress "assets/montage/17-trinity.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Shibuya_Crossing_%2853333799585%29.jpg?width=1920" "assets/montage/18-human-tide.jpg" && compress "assets/montage/18-human-tide.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/NASA-Apollo8-Dec24-Earthrise.jpg?width=1920" "assets/montage/19-earthrise.jpg" && compress "assets/montage/19-earthrise.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/THE_GEORGE_WASHINGTON_BRIDGE_IN_HEAVY_SMOG._VIEW_TOWARD_THE_NEW_JERSEY_SIDE_OF_THE_HUDSON_RIVER_-_NARA_-_548335.jpg?width=1920" "assets/montage/20-smog.jpg" && compress "assets/montage/20-smog.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Thefalloftheberlinwall1989.JPG?width=1920" "assets/montage/21-berlin-wall.jpg" && compress "assets/montage/21-berlin-wall.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Line3174_-_Shipping_Containers_at_the_terminal_at_Port_Elizabeth%2C_New_Jersey_-_NOAA.jpg?width=1920" "assets/montage/22-containers.jpg" && compress "assets/montage/22-containers.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg?width=1920" "assets/montage/23-city-lights.jpg" && compress "assets/montage/23-city-lights.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Lehman_Brothers_Times_Square_by_David_Shankbone.jpg?width=1920" "assets/montage/24-lehman.jpg" && compress "assets/montage/24-lehman.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Times_Square_Pandemic_Lockdown_Dec._31%2C_2020.jpg?width=1920" "assets/montage/25-pandemic.jpg" && compress "assets/montage/25-pandemic.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/BalticServers_data_center.jpg?width=1920" "assets/montage/26-ai-datacenter.jpg" && compress "assets/montage/26-ai-datacenter.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/Kite_Hill_under_a_sky_orange_with_wildfire_smoke%2C_San_Francisco%2C_California%2C_USA.jpg?width=1920" "assets/montage/27-orange-sky.jpg" && compress "assets/montage/27-orange-sky.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/An_aurora_blankets_the_Earth_beneath_a_celestial_night_sky_as_the_International_Space_Station_orbited_261_miles_above_the_Atlantic_Ocean_off_the_coast_of_North_America.jpg?width=1920" "assets/montage/28-iss-aurora.jpg" && compress "assets/montage/28-iss-aurora.jpg" ; sleep 1.2
fetch "https://commons.wikimedia.org/wiki/Special:FilePath/The_Earth_seen_from_Apollo_17.jpg?width=1920" "assets/montage/29-blue-marble.jpg" && compress "assets/montage/29-blue-marble.jpg" ; sleep 1.2

echo "Done. Missing files simply fall back to the live URL or gradient art."
