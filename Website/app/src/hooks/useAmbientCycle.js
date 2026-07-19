import { useEffect, useRef, useState } from 'react';

// Drives the hub's ambient background (build spec §6.1):
//  - idle (focus == null): slowly cycle across all forces, one image each
//  - focused: cycle through that force's own image set
// Returns { forceId, index } identifying the current image to show.
export function useAmbientCycle(forces, focus, { hold = 6000, reduced = false } = {}) {
  const [state, setState] = useState({ forceId: forces[0]?.id, index: 0 });
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);

    // On focus change, jump immediately to that force's first image.
    if (focus) setState({ forceId: focus, index: 0 });

    if (reduced) return; // static image, no auto-cycle

    timer.current = setInterval(() => {
      setState((s) => {
        if (focus) {
          const f = forces.find((x) => x.id === focus);
          const n = Math.max(1, f?.ambient?.length || 1);
          return { forceId: focus, index: (s.index + 1) % n };
        }
        // idle: advance to the next force
        const i = forces.findIndex((x) => x.id === s.forceId);
        const next = forces[(i + 1) % forces.length];
        return { forceId: next.id, index: 0 };
      });
    }, hold);

    return () => clearInterval(timer.current);
  }, [focus, reduced, hold, forces]);

  return state;
}
