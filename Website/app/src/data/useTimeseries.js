import { useEffect, useState } from 'react';

// Lazy-load the ~1.7MB Level-3 timeseries only when the explorer first mounts
// (keeps it out of the intro/hub initial bundle). Cached after first load.
let cache = null;
let inflight = null;

export function useTimeseries() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    if (cache) { setData(cache); return; }
    let alive = true;
    inflight = inflight || import('./power-timeseries.json').then((m) => (cache = m.default));
    inflight.then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, []);
  return data;
}
