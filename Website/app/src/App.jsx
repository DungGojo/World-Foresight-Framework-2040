import { HashRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Suspense, lazy, useCallback, useLayoutEffect, useState } from 'react';
import Hub from './hub/Hub';
import ForcesPage from './hub/ForcesPage';
import LaunchOverlay from './components/LaunchOverlay';
import { LaunchProvider, useLaunch, STORY_HANDOFF } from './hooks/useLaunch';

// Lazy-load the heavy routes so the hub doesn't ship Three.js (intro) or the
// full D3 chart set (topic) until they're actually visited.
const Intro = lazy(() => import('./scenes/Intro'));
const Montage = lazy(() => import('./scenes/Montage'));
const TopicPage = lazy(() => import('./topic/TopicPage'));
const DataPage = lazy(() => import('./data/DataPage'));
const AboutPage = lazy(() => import('./about/AboutPage'));

const Loading = () => <div style={{ position: 'fixed', inset: 0, background: 'var(--space)' }} />;

// The browser's own history-based scroll restoration fights this: every
// navigate() push is a history entry, and once a hash URL (HashRouter puts
// the whole route in the fragment) has been visited before in this tab, the
// browser restores ITS remembered scrollY for that entry — sometime after
// our own reset below runs, since it's triggered by the browser's layout
// heuristics, not React. Disabling it once, up front, is the standard fix;
// without it a topic reached from a scrolled-down position (the "Explore
// <force>" rail at the bottom of the page) can silently land scrolled deep
// into the new page instead of at its hero.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function RouteScrollReset() {
  const { pathname } = useLocation();
  // Layout effect, not effect: this must land before the browser paints the
  // new route, or the page briefly paints at whatever scrollY the browser
  // last left it at.
  //
  // `behavior: 'instant'`, not 'auto' — global.css sets `scroll-behavior:
  // smooth` on <html>, and per spec `scrollTo({behavior:'auto'})` defers to
  // that CSS property rather than overriding it. With 'auto' this was firing
  // a smooth, animated scroll-to-top instead of an instant jump; if a topic
  // page's content height was still settling (async chart data, images) as
  // that animation ran, it could be interrupted mid-flight and land well
  // short of 0 — exactly the "opens scrolled down" bug this effect exists
  // to prevent. 'instant' bypasses the CSS setting entirely.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// "/" = the cinematic entry flow (intro → montage), then hand off to /framework.
function Landing() {
  const [phase, setPhase] = useState('intro'); // intro | montage
  const { launch } = useLaunch();
  // Same shared handoff the forces page uses, so both entrances to the site
  // are the same component with the same timings.
  const toFramework = useCallback(() => launch(STORY_HANDOFF), [launch]);
  return (
    <Suspense fallback={<Loading />}>
      {phase === 'intro' ? (
        <Intro onBegin={() => setPhase('montage')} />
      ) : (
        <Montage onFinish={toFramework} />
      )}
    </Suspense>
  );
}

// Keyed on the topic id so moving topic -> topic REMOUNTS the page rather
// than just re-rendering it with new params. TopicPage lazily initialises
// per-visit state (`useState(() => ...)`) for its arrival animation and for
// whether the contents rail is open; without a fresh mount that state is
// carried over from the previous topic, so the rail would stay open and the
// arrival animation would not replay.
function KeyedTopicPage() {
  const { topicId } = useParams();
  return <TopicPage key={topicId} />;
}

function LegacyHubRedirect() {
  const { search } = useLocation();
  return <Navigate to={new URLSearchParams(search).get('view') === 'topics' ? '/forces' : '/framework'} replace />;
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LaunchProvider>
      <RouteScrollReset />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/framework" element={<Hub />} />
        <Route path="/forces" element={<ForcesPage />} />
        <Route path="/hub" element={<LegacyHubRedirect />} />
        <Route
          path="/topic/:topicId"
          element={
            <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'var(--bg)' }} />}>
              <KeyedTopicPage />
            </Suspense>
          }
        />
        <Route
          path="/data"
          element={
            <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'var(--bg)' }} />}>
              <DataPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'var(--bg)' }} />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/framework" replace />} />
      </Routes>
      {/* Above <Routes> on purpose: the curtain has to outlive the route
          swap it is covering, so the zoom-out reveals the arriving page. */}
      <LaunchOverlay />
      </LaunchProvider>
    </HashRouter>
  );
}
