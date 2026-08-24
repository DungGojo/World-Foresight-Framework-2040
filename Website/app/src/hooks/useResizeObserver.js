import { useCallback, useRef, useState } from 'react';

// Observe an element's size for responsive SVG charts.
//
// Uses a CALLBACK ref rather than `useRef` + a `useEffect(..., [])`. A plain
// ref only gets attached on whichever render actually returns an element with
// `ref={ref}` on it — a consumer that conditionally early-returns a
// placeholder (no chart yet, no country picked, etc.) can easily have that be
// a LATER render, not its first. A one-shot mount effect has already run (and,
// finding `ref.current` still null, given up for good) by the time that
// happens, permanently stranding the chart at its zero/fallback width. A
// callback ref instead fires on every attach/detach, whichever render it
// happens on, so setup always runs against a real element.
export function useResizeObserver() {
  const cleanupRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((el) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const next = { width: Math.round(rect.width), height: Math.round(rect.height) };
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };
    // Seed synchronously from the live layout box rather than waiting on the
    // observer's first callback — on a backgrounded tab (opened in a new tab,
    // restored from sleep, etc.) that callback can be deferred indefinitely,
    // leaving the chart stuck rendering at the fallback width.
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // The synchronous read above can itself land mid-layout — a sibling still
    // settling, fonts swapping in — and get a too-small box. ResizeObserver
    // only redelivers on an actual further size *change*, not "your last
    // reading was wrong", so a bad first read would otherwise never
    // self-correct. Re-check a few more times shortly after as a safety net.
    const retries = [50, 200, 600, 1500].map((delay) => setTimeout(measure, delay));

    // A resize that happens while hidden can go undelivered too; re-measure
    // once the tab is visible again to catch up.
    const onVisible = () => { if (!document.hidden) measure(); };
    document.addEventListener('visibilitychange', onVisible);

    cleanupRef.current = () => {
      ro.disconnect();
      retries.forEach(clearTimeout);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return [ref, size];
}
