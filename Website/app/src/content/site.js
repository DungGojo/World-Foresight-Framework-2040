// Site-wide content: ported from Part 1's content.js (build spec §9).
// site.json is the Part 1 source of truth (intro + montage + palette). Force-
// combination copy (`combinations.js`) is a separate, actively maintained module.
import site from './site.json';
import { topicModules } from './topics';
export { combination } from './combinations';

export const palette = site.palette;
export const intro = site.intro;
export const montage = site.montage;
export const earthTextures = site.earthTextures;

// ---- Force registry (hub ambient background) ----
// All five topics are live. `ambient` lists image files expected in
// public/assets/topics/<id>/ambient/. Only Power has real imagery so far; the
// others list placeholder filenames that do not exist yet, and Level1Hero
// probes each image before showing it, so those heroes fall back cleanly to the
// accent gradient rather than breaking (build spec s.6.1).
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
  // A topic is live exactly when it has a content module — no separate gate to
  // forget. (site.json's `status` field is inert and read by nothing.)
  live: topicModules[t.id] != null,
  href: `/topic/${t.id}`,
  ambient: (AMBIENT[t.id] || []).map((f) => f.startsWith('assets/') ? f : `assets/topics/${t.id}/ambient/${f}`),
}));

export const forceById = Object.fromEntries(forces.map((f) => [f.id, f]));

const STORY_CHAPTERS = [
  { label: 'Chapter 00', name: 'Before us', dur: 3000 },
  { label: 'Chapter 01', name: 'We organize', dur: 3000 },
  { label: 'Chapter 02', name: 'We connect', dur: 3000 },
  { label: 'Chapter 03', name: 'We divide and rebuild', dur: 3000 },
  { label: 'Chapter 04', name: 'One planetary system', dur: 3000 },
  { label: 'Epilogue', name: 'The next chapter', dur: 7000 },
];

// A seven-beat overview rather than a full chronology: one frame per chapter,
// plus a second frame for the present. 3s a frame with a longer hold on the
// closing question — 25s in total.
// [era index in site.json, chapter index, duration ms]
const STORY_SELECTION = [
  [3, 0, 3000],    // We arrive — 300,000 years ago
  [5, 1, 3000],    // We record — the first states
  [11, 2, 3000],   // The engine age — industrial acceleration
  [16, 3, 3000],   // The atomic age — a new scale of power
  [22, 4, 3000],   // Everyone, connected
  [27, 4, 3000],   // Now — five forces in motion
  [28, 5, 7000],   // What will the world look like in 2040?
];

export const story = {
  ...site.montage,
  chapters: STORY_CHAPTERS,
  eras: STORY_SELECTION.map(([index, chapter, dur]) => ({ ...site.montage.eras[index], chapter, dur })),
  advanceHint: '← → to move through the story',
};
