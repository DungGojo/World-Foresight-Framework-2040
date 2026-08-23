import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// The cinematic page-to-page handoff, in three beats:
//
//   0 ─────────── HOLD_MS ─────────── │ ────── REVEAL_MS ────── │
//   curtain fades in, rings orbit     │ curtain zooms out+fades │
//   ("loading")                       │ ("pop"/reveal)          │
//                                     └─ navigate() happens HERE,
//                                        while the curtain is fully opaque
//
// Navigating at the *start* of the reveal is the whole trick. The curtain is
// opaque at that instant, so the route swap is invisible; then the zoom-out
// uncovers the page that just mounted, instead of the page we left. Doing it
// the other way round (zoom out, then navigate) is what made the origin page
// flash back into view before the swap.
//
// This lives above <Routes> (see App.jsx) precisely so the element survives
// that swap — an overlay rendered inside the outgoing page gets unmounted
// with it, which is why the zoom could never play to completion.
const HOLD_MS = 2000;
const REVEAL_MS = 900;

const LaunchContext = createContext(null);

export function LaunchProvider({ children }) {
  const navigate = useNavigate();
  // phase: 'idle' | 'hold' | 'reveal'
  const [{ destination, phase }, setState] = useState({ destination: null, phase: 'idle' });
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const launch = useCallback((next) => {
    if (!next?.href) return;
    // One handoff at a time — a second click mid-flight is ignored rather than
    // queued, so the curtain can never restart halfway through.
    if (timers.current.length) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { navigate(next.href, { state: next.state }); return; }

    setState({ destination: next, phase: 'hold' });
    timers.current.push(setTimeout(() => {
      navigate(next.href, { state: next.state });
      setState({ destination: next, phase: 'reveal' });
    }, HOLD_MS));
    timers.current.push(setTimeout(() => {
      clearTimers();
      setState({ destination: null, phase: 'idle' });
    }, HOLD_MS + REVEAL_MS));
  }, [navigate, clearTimers]);

  const value = useMemo(() => ({ launch, destination, phase }), [launch, destination, phase]);
  return <LaunchContext.Provider value={value}>{children}</LaunchContext.Provider>;
}

export function useLaunch() {
  return useContext(LaunchContext);
}

// Convenience wrapper: the forces -> topic handoff, keyed to a force's accent.
export function useTopicLaunch() {
  const { launch } = useLaunch();
  return useCallback((force) => {
    if (!force) return;
    launch({
      href: force.href,
      accent: force.color,
      kicker: 'Opening',
      title: force.name,
      state: { fromForces: true },
    });
  }, [launch]);
}

// The story -> framework handoff reuses the same machinery, so both entrances
// to the site are literally the same component and the same timings.
export const STORY_HANDOFF = {
  href: '/framework',
  accent: '#d8c4a2',
  kicker: 'World',
  title: '2040',
  titleSize: '43px',
  state: { fromStory: true },
};
