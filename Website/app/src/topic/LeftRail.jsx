import { useEffect, useMemo, useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

// The rail is fixed at the vertical centre of the screen, so as the reader
// scrolls it passes over both the dark hero (`#overview`) and the light
// editorial sections below — and, right at the end, the dark discovery rail
// (`.topic-rail`) + footer. Its collapsed "peek" state has no background of
// its own (see design note below), so it needs to know which one is
// currently behind it to pick a readable colour. True while a tracked dark
// section sits across the screen's vertical centre.
function useOnDarkBackground() {
  const [onDark, setOnDark] = useState(true);
  useEffect(() => {
    const targets = [document.getElementById('overview'), document.querySelector('.topic-rail')].filter(Boolean);
    if (!targets.length) return undefined;
    const hit = new Set();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? hit.add(e.target) : hit.delete(e.target)));
        setOnDark(hit.size > 0);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return onDark;
}

// Scroll-spy rail: each argument is one jump target, so a reader can move
// between questions instead of scrolling through every figure to find one.
//
// Collapsed, it is not hidden — it shows a labelled tick meter, one tick per
// section, with the current one lit. That earns its place on screen: it is
// how you discover the rail exists, and it doubles as a reading-position
// indicator for the (very long) topic pages. Expanded, it becomes a full
// card. `open` is owned by TopicPage.
export default function LeftRail({ topic, accent, onNav, onBack, onData, open, onToggle }) {
  const sections = useMemo(
    () => [
      { id: 'overview', num: '01', label: 'Overview' },
      ...topic.level2.map((a, i) => ({
        id: `arg-${a.n}`,
        num: `0${i + 2}`,
        label: shortTitle(a.title),
      })),
    ],
    [topic]
  );
  const active = useScrollSpy(useMemo(() => sections.map((s) => s.id), [sections]));
  const onDark = useOnDarkBackground();

  // Jumping closes the card: it overlays the reading column, so leaving it up
  // would cover the very thing the reader just asked to see.
  const jump = (id) => { onNav(id); if (open) onToggle(); };

  return (
    <div className={`rail-dock${open ? ' open' : ''}`}>
      {/* Collapsed affordance — always on screen, so the rail is discoverable
          and the reader can see where they are without opening anything. It
          has no background of its own (a chip would compete with the hero),
          so it recolours itself to `onDark`/`onLight` instead. */}
      <button
        className={`rail-peek${onDark ? '' : ' on-light'}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Show contents"
        style={{ '--accent': accent }}
      >
        <span className="rp-label">Contents</span>
        <span className="rp-ticks" aria-hidden="true">
          {sections.map((s) => (
            <i key={s.id} className={active === s.id ? 'on' : undefined} />
          ))}
        </span>
      </button>

      <nav className="left-rail" aria-label="On this page" aria-hidden={!open}>
        <div className="lr-inner">
          <div className="lr-head">
            <button className="lr-back" onClick={onBack} tabIndex={open ? 0 : -1}>◀ The five forces</button>
            <button
              className="lr-close"
              onClick={onToggle}
              aria-label="Hide contents"
              tabIndex={open ? 0 : -1}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="lr-brand">{topic.name}</div>
          <div className="lr-nav">
            {sections.map((s) => (
              <button
                key={s.id}
                className={'lr-item' + (active === s.id ? ' active' : '')}
                style={active === s.id ? { '--accent': accent } : undefined}
                aria-current={active === s.id ? 'true' : undefined}
                onClick={() => jump(s.id)}
                tabIndex={open ? 0 : -1}
              >
                <span className="lr-num">{s.num}</span>
                <span className="lr-label">{s.label}</span>
              </button>
            ))}
          </div>
          <button className="lr-replay" onClick={onData} tabIndex={open ? 0 : -1}>Explore the data ▸</button>
        </div>
      </nav>
    </div>
  );
}

// First clause of the argument title — enough to recognise it in a narrow rail.
function shortTitle(t) {
  // Just the headline clause (before the em dash/colon that introduces the
  // rest of the sentence) — no character cap. The rail is wide enough for
  // this to wrap over a couple of lines, and cutting it further left readers
  // unable to tell arguments apart ("Power's real currency becomes…" vs.
  // "…becomes technology, economics and force").
  return t.split(/[:—]/)[0].trim();
}
