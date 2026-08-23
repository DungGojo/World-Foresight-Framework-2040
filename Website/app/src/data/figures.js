// Figure registry: {topicId}-figures.json, emitted by scripts/build_data.py.
// Bundled eagerly — all six files together are ~120 KB, small enough that
// splitting them would cost a request without saving anything meaningful.
// (The Level-3 timeseries is the large payload and stays lazy; see useTimeseries.)
const modules = import.meta.glob('./*-figures.json', { eager: true });

const FIGURES = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace('./', '').replace('-figures.json', ''),
    mod.default,
  ])
);

export function getFigures(topicId) {
  return FIGURES[topicId] || {};
}

export function getFigure(topicId, dataKey) {
  return FIGURES[topicId]?.[dataKey] || null;
}

export default FIGURES;
