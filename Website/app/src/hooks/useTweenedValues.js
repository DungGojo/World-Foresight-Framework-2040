import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);

// Tween a flat object of numbers toward a target. Charts animate their SCALE
// DOMAINS through this rather than animating DOM nodes: every path, axis tick
// and label is derived from the scales, so they all move together as one
// camera move instead of drifting out of sync.
//
// Honours prefers-reduced-motion by snapping straight to the target.
export function useTweenedValues(target, duration = 620) {
  const reduce = useReducedMotion();
  const keys = Object.keys(target);
  const signature = keys.map((k) => target[k]).join('|');

  const [value, setValue] = useState(target);
  const currentRef = useRef(target);
  const frameRef = useRef(0);

  useEffect(() => {
    const from = currentRef.current;
    // First paint, a resize, or reduced motion: no animation to run.
    const changed = keys.some((k) => from[k] !== target[k]);
    if (!changed) return undefined;
    if (reduce) {
      currentRef.current = target;
      setValue(target);
      return undefined;
    }

    const start = performance.now();
    cancelAnimationFrame(frameRef.current);

    const snap = () => {
      cancelAnimationFrame(frameRef.current);
      currentRef.current = target;
      setValue(target);
    };

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(p);
      const next = {};
      keys.forEach((k) => {
        const a = from[k] ?? target[k];
        next[k] = a + (target[k] - a) * e;
      });
      currentRef.current = next;
      setValue(next);
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };

    // requestAnimationFrame does not fire while the tab is hidden, so a tween
    // interrupted by a tab switch would otherwise stay frozen part-way for good.
    // Jump to the target instead — nobody is watching the motion anyway.
    const onHide = () => { if (document.hidden) snap(); };
    document.addEventListener('visibilitychange', onHide);

    if (document.hidden) snap();
    else frameRef.current = requestAnimationFrame(step);

    return () => {
      document.removeEventListener('visibilitychange', onHide);
      cancelAnimationFrame(frameRef.current);
    };
  }, [signature, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return value;
}
