// Site-wide content: ported from Part 1's content.js (build spec §9).
// site.json is the Part 1 source of truth (intro + montage + palette + combos).
import site from './site.json';

export const palette = site.palette;
export const typography = site.typography;
export const intro = site.intro;
export const montage = site.montage;
export const earthTextures = site.earthTextures;
export const constellationCopy = site.constellation;
export const combos = site.combos;
export const insightsBar = site.insightsBar;

// ---- Force registry (hub sidebar + constellation + ambient background) ----
// Power is the first LIVE topic; the others light up later with no layout change
// (just flip `live` + add a content module + ambient images).
// `ambient` lists image files expected in public/assets/topics/<id>/ambient/.
// Empty/missing files fall back to the accent gradient (build spec §6.1).
const AMBIENT = {
  power:   [
    'assets/montage/17-trinity.jpg',
    'assets/montage/21-berlin-wall.jpg',
    'assets/montage/22-containers.jpg',
    'assets/montage/26-ai-datacenter.jpg',
  ],
  tech:    ['1.jpg', '2.jpg', '3.jpg'],
  planet:  ['1.jpg', '2.jpg', '3.jpg'],
  people:  ['1.jpg', '2.jpg', '3.jpg'],
  economy: ['1.jpg', '2.jpg', '3.jpg'],
};

export const forces = site.topics.map((t) => ({
  ...t,
  live: t.id === 'power',
  href: `/topic/${t.id}`,
  ambient: (AMBIENT[t.id] || []).map((f) => f.startsWith('assets/') ? f : `assets/topics/${t.id}/ambient/${f}`),
}));

export const forceById = Object.fromEntries(forces.map((f) => [f.id, f]));

export function comboTitle(aId, bId) {
  return combos[[aId, bId].sort().join('|')];
}

const STORY_CHAPTERS = [
  { label: 'Chapter 00', name: 'Before us', dur: 4200 },
  { label: 'Chapter 01', name: 'We organize', dur: 4200 },
  { label: 'Chapter 02', name: 'We connect', dur: 4400 },
  { label: 'Chapter 03', name: 'We divide and rebuild', dur: 4400 },
  { label: 'Chapter 04', name: 'One planetary system', dur: 4600 },
  { label: 'Epilogue', name: 'The next chapter', dur: 12000 },
];

const STORY_SELECTION = [
  [0, 0], [1, 0], [3, 0],
  [4, 1], [5, 1], [6, 1],
  [7, 2], [8, 2], [10, 2], [11, 2], [12, 2],
  [13, 3], [16, 3], [17, 3], [18, 3], [20, 3],
  [21, 4], [22, 4], [24, 4], [25, 4], [27, 4],
  [28, 5],
];

export const story = {
  ...site.montage,
  chapters: STORY_CHAPTERS,
  eras: STORY_SELECTION.map(([index, chapter]) => ({ ...site.montage.eras[index], chapter })),
  advanceHint: '← → to move through the story',
};
