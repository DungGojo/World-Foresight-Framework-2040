import { useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

// Returns 0 -> 1 progress, restarting whenever `key` changes.
//
// Charts use this to wipe a clip rect across the plot so a series draws in from
// the left like time passing. A clip is used rather than the usual
// stroke-dashoffset trick because the forecast paths already use
// stroke-dasharray for their dashed styling — one attribute cannot carry both
// the dash pattern and the reveal — and a clip also brings the confidence band
// in together with its line.
export function useReveal(key, duration = 950) {
  const reduce = useReducedMotion();
  // Start hidden so the first paint is already the start of the sweep.
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(0);

  // useLayoutEffect, not useEffect: resetting to 0 after paint would flash the
  // finished chart for a frame before the sweep began.
  useLayoutEffect(() => {
    // No animation worth running when it cannot be seen, or when the visitor
    // has asked for reduced motion.
    if (reduce || document.hidden) {
      setProgress(1);
      return undefined;
    }

    const start = performance.now();
    setProgress(0);

    const step = (now) => {
      // Linear: the sweep stands in for time passing, and easing it would imply
      // the later years arrive faster than the early ones.
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);

    const onHide = () => {
      if (!document.hidden) return;
      cancelAnimationFrame(frameRef.current);
      setProgress(1);
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      document.removeEventListener('visibilitychange', onHide);
      cancelAnimationFrame(frameRef.current);
    };
  }, [key, reduce, duration]);

  return progress;
}
