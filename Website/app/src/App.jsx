import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import Hub from './hub/Hub';
import ForcesPage from './hub/ForcesPage';

// Lazy-load the heavy routes so the hub doesn't ship Three.js (intro) or the
// full D3 chart set (topic) until they're actually visited.
const Intro = lazy(() => import('./scenes/Intro'));
const Montage = lazy(() => import('./scenes/Montage'));
const TopicPage = lazy(() => import('./topic/TopicPage'));
const DataPage = lazy(() => import('./data/DataPage'));
const AboutPage = lazy(() => import('./about/AboutPage'));

const Loading = () => <div style={{ position: 'fixed', inset: 0, background: 'var(--space)' }} />;

function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

// "/" = the cinematic entry flow (intro → montage), then hand off to /framework.
function Landing() {
  const [phase, setPhase] = useState('intro'); // intro | montage
  const navigate = useNavigate();
  const toFramework = useCallback(() => navigate('/framework', { state: { fromStory: true } }), [navigate]);
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

function LegacyHubRedirect() {
  const { search } = useLocation();
  return <Navigate to={new URLSearchParams(search).get('view') === 'topics' ? '/forces' : '/framework'} replace />;
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
              <TopicPage />
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
    </HashRouter>
  );
}
