import { useEffect, useState } from 'react';

// Lazy-load a topic's Level-3 timeseries only when the explorer first mounts
// (keeps ~2 MB out of the intro/hub initial bundle). Cached per topic after the
// first load. The full 190-proxy set is ~12 MB, which is why these are split by
// topic in scripts/build_data.py rather than shipped as one file.
const LOADERS = {
  power: () => import('./power-timeseries.json'),
  tech: () => import('./tech-timeseries.json'),
  planet: () => import('./planet-timeseries.json'),
  people: () => import('./people-timeseries.json'),
  economy: () => import('./economy-timeseries.json'),
};

const cache = {};
const inflight = {};

export const TOPIC_IDS = Object.keys(LOADERS);

export function useTimeseries(topicId = 'power') {
  const [data, setData] = useState(cache[topicId] || null);

  useEffect(() => {
    const load = LOADERS[topicId];
    if (!load) { setData(null); return undefined; }
    if (cache[topicId]) { setData(cache[topicId]); return undefined; }

    let alive = true;
    setData(null);
    inflight[topicId] = inflight[topicId]
      || load().then((m) => { cache[topicId] = m.default; return m.default; });
    inflight[topicId].then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, [topicId]);

  return data;
}
