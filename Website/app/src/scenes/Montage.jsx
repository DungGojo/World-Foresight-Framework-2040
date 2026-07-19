import { useCallback, useEffect, useRef, useState } from 'react';
import { story, forceById, forces } from '../content/site';
import { asset } from '../lib/assets';
import { useReducedMotion } from '../hooks/useReducedMotion';
import ArrowIcon from '../components/ArrowIcon';
import './Montage.css';

const MOTIFS = {
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1"/>',
  cell:'<circle cx="12" cy="12" r="8.5"/><circle cx="10" cy="10.5" r="3.4"/><circle cx="15.5" cy="14.5" r="1.2"/>',
  comet:'<circle cx="16.5" cy="7.5" r="3"/><path d="M13 11L4 20M15.5 12.5L9 19M11.5 8.5L3 17"/>',
  spark:'<path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3"/>',
  grain:'<path d="M12 21V8M12 8c0-3 2-5 5-5 0 3-2 5-5 5zM12 12c0-3-2-5-5-5 0 3 2 5 5 5zM12 16c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
  tablet:'<rect x="6" y="3" width="12" height="18" rx="1.4"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  column:'<path d="M5 21h14M6 18h12M8 18V7M12 18V7M16 18V7M5 7h14M6 4h12"/>',
  scroll:'<path d="M6 4h11a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 011-1.8"/><path d="M9 9h7M9 13h7M9 17h4"/>',
  page:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 11h5M10 15h5"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  flask:'<path d="M10 3v6L4.8 18a2 2 0 001.8 3h10.8a2 2 0 001.8-3L14 9V3M8.5 3h7"/><path d="M8 15h8"/>',
  gear:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  rail:'<path d="M8 3l-4 18M16 3l4 18M6.5 9h11M5.5 15h13M7.3 5.8h9.4"/>',
  trench:'<path d="M2 15l4-4 3 3 4-5 3 3 4-6"/><path d="M2 20h20"/>',
  radar:'<path d="M12 12L19 5"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.1"/><circle cx="16" cy="8" r=".8"/>',
  atom:'<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
  crowd:'<circle cx="6" cy="8" r="2.2"/><circle cx="12" cy="6.6" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M2.5 20c0-3 1.6-5 3.5-5s3.5 2 3.5 5M8.5 18c0-3.4 1.6-5.6 3.5-5.6s3.5 2.2 3.5 5.6M14.5 20c0-3 1.6-5 3.5-5s3.5 2 3.5 5"/>',
  moon:'<path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/>',
  smog:'<path d="M7 21V10M11 21V7M7 10h4M4 21h16"/><path d="M13 8a3.5 3.5 0 013.4-3 3.5 3.5 0 013.4 2.6A2.7 2.7 0 0119 13h-6"/>',
  wall:'<path d="M3 21V9h18v12M3 13h18M3 17h18M8 9v4M14 9v4M6 13v4M12 13v4M18 13v4M9 17v4M15 17v4"/><path d="M7 9V5l5-2 5 2v4"/>',
  ship:'<path d="M3 17h18l-2 4H5zM5 17V9h14v8M8 9V6h8v3"/><path d="M9 12h6M9 14.5h6"/>',
  net:'<circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="12" cy="18" r="1.8"/><circle cx="12" cy="9.5" r="1.4"/><path d="M6.6 6.8l4 2M17.4 6.8l-4 2M12 11v5.2M6 7.5l4.8 9M18 7.5l-4.8 9"/>',
  chart:'<path d="M3 3v18h18"/><path d="M6 8l4 5 4-8 6 11"/>',
  mask:'<path d="M5 10c2-1.6 4.5-2.4 7-2.4S17 8.4 19 10v5c-2 2.4-4.5 3.8-7 3.8S7 17.4 5 15z"/><path d="M5 10.5L2 9v5l3 1.2M19 10.5L22 9v5l-3 1.2M8.5 12h7M9.5 14.5h5"/>',
  ai:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4"/><circle cx="12" cy="12" r="2.2"/>',
  flame:'<path d="M12 21c-4 0-6.5-2.6-6.5-6C5.5 11 9 8.6 9.5 5c2.5 1.6 3 3.8 2.8 5.8 1-.6 1.8-1.6 2.2-3 1.8 1.8 4 4.4 4 7.2 0 3.4-2.5 6-6.5 6z"/>',
  earth:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 2.6 4.5 5.6 4.5 9S15 18.4 12 21M12 3c-3 2.6-4.5 5.6-4.5 9S9 18.4 12 21"/>',
  q:'<path d="M8.5 8.6A3.8 3.8 0 0112.2 5c2.1 0 3.8 1.5 3.8 3.5 0 2.8-3.6 3-3.6 5.6"/><circle cx="12.3" cy="18.6" r=".9"/>',
};
const motif = (k) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${MOTIFS[k] || MOTIFS.q}</svg>`;

export default function Montage({ onFinish }) {
  const eras = story.eras;
  const chapters = story.chapters;
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);
  const leaveTimer = useRef(null);

  const durOf = (i) => {
    const e = eras[i];
    let d = e.dur != null ? e.dur : chapters[e.chapter] ? chapters[e.chapter].dur : 3600;
    if (reduce) d = Math.max(1200, d * (story.frameDurationReducedScale || 0.6));
    return d;
  };

  const finish = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearTimeout(timer.current);
    leaveTimer.current = setTimeout(onFinish, reduce ? 120 : 2300);
  }, [leaving, onFinish, reduce]);

  useEffect(() => {
    clearTimeout(timer.current);
    if (leaving) return undefined;
    timer.current = setTimeout(() => {
      if (idx + 1 < eras.length) setIdx(idx + 1);
      else finish();
    }, durOf(idx));
    return () => clearTimeout(timer.current);
  }, [idx, leaving, finish]); // eslint-disable-line

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const advance = () => {
    setInteracted(true);
    if (idx + 1 < eras.length) setIdx(idx + 1);
    else finish();
  };
  const back = () => { setInteracted(true); if (idx > 0) setIdx(idx - 1); };

  useEffect(() => {
    const onKey = (ev) => {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') return;
      if (ev.key === 'ArrowRight' || ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); advance(); }
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); back(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // eslint-disable-line

  return (
    <section
      id="montage"
      className={`screen${leaving ? ' leaving' : ''}`}
      aria-label="The story so far"
      onClick={(e) => { if (!e.target.closest('button')) advance(); }}
    >
      <div id="mBrand">World Foresight Framework</div>
      {!leaving ? (
        <button className="story-skip" onClick={(event) => { event.stopPropagation(); finish(); }}>
          <span>Skip story</span><ArrowIcon />
        </button>
      ) : null}

      {eras.map((e, i) => {
        const ch = chapters[e.chapter];
        const srcs = [asset(e.localImg), e.img].filter(Boolean);
        return (
          <div key={i} className={'frame' + (i === idx ? ' active' : '')}>
            <div className="art" style={{ background: `radial-gradient(120% 100% at 50% 30%, ${e.c2} 0%, ${e.c1} 55%, #04060b 100%)` }} />
            {srcs.length > 0 && (
              <img
                className="photo"
                alt=""
                loading="eager"
                decoding="async"
                src={srcs[0]}
                style={e.pos ? { objectPosition: e.pos } : undefined}
                data-i="0"
                onError={(ev) => {
                  const im = ev.currentTarget;
                  let k = Number(im.dataset.i || 0) + 1;
                  im.dataset.i = k;
                  if (k < srcs.length) im.src = srcs[k];
                  else im.style.display = 'none';
                }}
              />
            )}
            <div className="scrim" />
            <div className="content">
              <div className="chapter-kicker">{ch ? `${ch.label} / ${ch.name}` : ''}</div>
              <div className="motif" dangerouslySetInnerHTML={{ __html: motif(e.motif) }} />
              <div className="yr">{e.yr}</div>
              <h2>{e.title}</h2>
              <p className="cap">{e.cap}</p>
              {e.forces && e.forces.length > 0 && (
                <div className="chips">
                  {e.forces.map((fid) => {
                    const f = forceById[fid];
                    return f ? (
                      <span className="chip" key={fid}>
                        <i style={{ background: f.color }} />
                        {f.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              {e.finale && (
                <div className="finale-cta">
                  <button className="btn on-dark" onClick={(ev) => { ev.stopPropagation(); finish(); }}>
                    {story.finaleCtaLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <aside className="force-trace" aria-label="Forces connected to this event">
        {forces.map((force) => {
          const active = eras[idx].forces?.includes(force.id);
          return (
            <div key={force.id} className={`trace-force${active ? ' active' : ''}`} style={{ '--force': force.color }}>
              <i /><span>{force.name}</span>
            </div>
          );
        })}
      </aside>

      <div className="story-controls" onClick={(e) => e.stopPropagation()}>
        <button onClick={back} disabled={idx === 0} aria-label="Previous story event">
          <ArrowIcon direction="left" /><span>Previous</span>
        </button>
        <div className="story-progress">
          <div id="mProgress" aria-hidden="true">
            {eras.map((e, i) => (
              <div key={i} className={'seg' + (i < idx ? ' done' : '') + (i > 0 && eras[i - 1].chapter !== e.chapter ? ' chapter-gap' : '')}>
                <i key={i === idx ? `active-${idx}` : `rest-${i}`} style={i === idx ? { animation: `segfill ${durOf(idx)}ms linear forwards` } : { width: i < idx ? '100%' : '0' }} />
              </div>
            ))}
          </div>
          <span>{String(idx + 1).padStart(2, '0')} / {eras.length}</span>
        </div>
        <button onClick={advance} aria-label={idx + 1 < eras.length ? 'Next story event' : 'Enter the framework'}>
          <span>{idx + 1 < eras.length ? 'Next' : 'Enter framework'}</span><ArrowIcon />
        </button>
      </div>
      <div id="mHint" className={idx > 1 && interacted ? 'hide' : ''}>{story.advanceHint}</div>
      <div className="framework-handoff" aria-hidden="true">
        <i /><i /><i />
        <div><span>WORLD</span><b>2040</b></div>
      </div>
    </section>
  );
}
