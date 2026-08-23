import { useEffect, useRef, useState } from 'react';
import { combination } from '../content/site';
import { useReducedMotion } from '../hooks/useReducedMotion';
import ForceGlyph from '../components/ForceGlyph';
import ArrowIcon from '../components/ArrowIcon';
import CentreGlobe from './CentreGlobe';

const CENTRE = { x: 50, y: 49 };
const positions = [
  { x: 50, y: 9 },
  { x: 86, y: 35 },
  { x: 72, y: 83 },
  { x: 28, y: 83 },
  { x: 14, y: 35 },
];

const questions = {
  power: 'Who sets the rules, and who holds the leverage?',
  tech: 'Who controls the systems that amplify human capability?',
  planet: 'How far can growth stretch planetary limits?',
  people: 'How do demography, movement and belonging reshape society?',
  economy: 'How will value, production and resilience be reorganised?',
};

// How long a spoke takes to travel from its force to the centre.
const TRAVEL_MS = 2000;

export default function SystemsMap({ forces, onOpenTopic, onOpenData }) {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState(['power']);
  // Which spokes have finished travelling — the centre only takes a force's
  // colour once its line has actually arrived.
  const [arrived, setArrived] = useState({ power: true });
  const [showWhy, setShowWhy] = useState(false);
  const timers = useRef({});

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const land = (id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setArrived((prev) => ({ ...prev, [id]: true }));
  };

  const launch = (id) => {
    if (reduce) { setArrived((prev) => ({ ...prev, [id]: true })); return; }
    // A line still in flight completes immediately, so rapid clicking never
    // queues up a backlog of slow animations.
    clearTimeout(timers.current[id]);
    setArrived((prev) => ({ ...prev, [id]: false }));
    timers.current[id] = setTimeout(() => land(id), TRAVEL_MS);
  };

  // Any subset of the five forces is a valid combination — 0 through all 5.
  const select = (force) => {
    setShowWhy(false);
    setPicked((current) => {
      if (current.includes(force.id)) return current.filter((id) => id !== force.id);
      launch(force.id);
      return [...current, force.id];
    });
  };

  const clearAll = () => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setPicked([]);
    setArrived({});
    setShowWhy(false);
  };

  const pickedForces = picked.map((id) => forces.find((f) => f.id === id)).filter(Boolean);
  const [a, b] = pickedForces;
  const count = pickedForces.length;
  const isPair = count === 2;
  const isCompound = count >= 3;
  const accent = a ? a.color : forces[0].color;
  const indexOf = (id) => forces.findIndex((f) => f.id === id);

  // Only forces whose spoke has landed colour the centre.
  const ringColors = pickedForces.filter((f) => arrived[f.id]).map((f) => f.color);

  // One lookup covers all 32 states (0-5 forces) — every subset has a curated
  // title, behaviour, the pipeline finding ('why') and the early signals that
  // ground it: a framing line plus 3-5 primary documents. See combinations.js.
  const entry = combination(picked);
  const behaviour = entry?.behaviour;
  const signals = entry?.signals || [];

  // Highlight the current choice by dimming everything not selected, unless
  // every force is already part of it.
  const dimOthers = count > 0 && count < forces.length;

  const Grounding = () => (
    entry?.why ? (
      <div className="detail-grounding">
        <button
          className="detail-grounding-toggle"
          onClick={() => setShowWhy((v) => !v)}
          aria-expanded={showWhy}
        >
          {showWhy ? 'Hide the reason behind this' : 'Show the reason behind this'}
        </button>
        {showWhy && (
          <div className="detail-grounding-body">
            <div className="dg-line">
              <span className="dg-lbl">Why</span>
              <p>{entry.why}</p>
            </div>
            {(entry.evidence || signals.length > 0) && (
              <div className="dg-line">
                <span className="dg-lbl">Early Signals</span>
                {entry.evidence && <p>{entry.evidence}</p>}
                {signals.length > 0 && (
                  <div className="dg-signals">
                    {signals.map((doc) => (
                      <a
                        key={doc.url}
                        className="dg-signal"
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="dgs-meta">{doc.publisher} · {doc.date}</span>
                        <strong>{doc.title}</strong>
                        <ArrowIcon />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    ) : null
  );

  return (
    <div className="systems-map">
      {/* Controls + diagram share the left column, so the detail panel on the
          right gets most of the width — its headline and grounding text are
          what actually need the room, not the diagram. */}
      <div className="systems-left">
      <div className="systems-controls">
        <p className="systems-heading">
          Select forces to see how the world will be affected by them.
        </p>
        {count > 0 && (
          <button className="systems-clear" onClick={clearAll}>Clear all</button>
        )}
      </div>

      <div className="systems-canvas" aria-label="Five Forces systems map">
        <svg className="systems-lines" viewBox="0 0 100 100" aria-hidden="true">
          {/* orbit rings, slowly turning so the map never sits completely still */}
          <g className="orbit-rings">
            <circle cx={CENTRE.x} cy={CENTRE.y} r="33" />
            <circle cx={CENTRE.x} cy={CENTRE.y} r="21" />
          </g>
          <g className="orbit-rings reverse">
            <circle cx={CENTRE.x} cy={CENTRE.y} r="27" />
          </g>

          {/* Spokes only ever run force -> centre; forces are never linked to
              each other, because everything flows through World 2040. */}
          {picked.map((id) => {
            const p = positions[indexOf(id)];
            const force = forces.find((f) => f.id === id);
            const done = arrived[id];
            return (
              <line
                key={`spoke-${id}`}
                className={`spoke${done ? ' landed' : ' travelling'}`}
                style={{ '--spoke': force.color, '--travel': `${TRAVEL_MS}ms` }}
                // pathLength=1 normalises the dash space, so one dash of length 1
                // is exactly the whole line no matter how the SVG is scaled.
                pathLength="1"
                x1={p.x} y1={p.y} x2={CENTRE.x} y2={CENTRE.y}
              />
            );
          })}
        </svg>

        <div className="world-node">
          <CentreGlobe rings={ringColors} />
        </div>

        {forces.map((force, index) => {
          const on = picked.includes(force.id);
          const dim = dimOthers && !on;
          return (
            <button
              key={force.id}
              className={`system-node${on ? ' active' : ''}${dim ? ' dim' : ''}`}
              style={{ '--accent': force.color, '--x': `${positions[index].x}%`, '--y': `${positions[index].y}%` }}
              onClick={() => select(force)}
              aria-pressed={on}
              title={on ? `${force.name} is selected` : `Select ${force.name}`}
            >
              <span className="system-node-icon">
                {/* signal that this force is the one being explored */}
                {on && <span className="node-wave" />}
                {on && <span className="node-wave delay" />}
                <ForceGlyph id={force.id} />
              </span>
              <b>{force.name}</b>
            </button>
          );
        })}
      </div>
      </div>

      <aside className="systems-detail" style={{ '--accent': accent }}>
        {count === 0 ? (
          <>
            <div className="detail-label">No forces selected</div>
            <h3 className="detail-waiting">Pick a force.</h3>
            <div className="detail-block">
              <p>{behaviour}</p>
            </div>
          </>
        ) : isPair ? (
          <>
            <div className="detail-label">Two forces</div>
            <div className="detail-pair">
              <span style={{ color: a.color }}>{a.name}</span>
              <em>+</em>
              <span style={{ color: b.color }}>{b.name}</span>
            </div>
            <h3>{entry?.title}</h3>
            <div className="detail-block">
              <span>How people respond</span>
              <p>{behaviour}</p>
            </div>
            <Grounding />
            <div className="detail-actions">
              <button className="detail-open" onClick={() => onOpenTopic(a)}>
                <span>Explore {a.name}</span><ArrowIcon />
              </button>
              <button className="detail-open alt" style={{ '--accent': b.color }} onClick={() => onOpenTopic(b)}>
                <span>Explore {b.name}</span><ArrowIcon />
              </button>
            </div>
          </>
        ) : isCompound ? (
          <>
            <div className="detail-label">{count} forces together</div>
            <div className="detail-chips">
              {pickedForces.map((f) => (
                <span className="detail-chip" key={f.id} style={{ '--chip': f.color }}>
                  <i />{f.name}
                </span>
              ))}
            </div>
            <h3>{entry?.title}</h3>
            <div className="detail-block">
              <span>How people respond</span>
              <p>{behaviour}</p>
            </div>
            <Grounding />
            <div className="detail-actions">
              {pickedForces.map((f, i) => (
                <button
                  key={f.id}
                  className={`detail-open${i > 0 ? ' alt' : ''}`}
                  style={i > 0 ? { '--accent': f.color } : undefined}
                  onClick={() => onOpenTopic(f)}
                >
                  <span>Explore {f.name}</span><ArrowIcon />
                </button>
              ))}
            </div>
          </>
        ) : a ? (
          <>
            <div className="detail-label">Topic</div>
            <h3>{a.name}</h3>
            <div className="detail-block">
              <span>The question</span>
              <p className="detail-question">{questions[a.id]}</p>
            </div>
            <div className="detail-block">
              <span>How people respond</span>
              <p>{behaviour}</p>
            </div>
            <Grounding />
            <div className="detail-actions">
              <button className="detail-open" onClick={() => onOpenTopic(a)}>
                <span>Explore {a.name}</span><ArrowIcon />
              </button>
            </div>
          </>
        ) : null}
        <button className="detail-open data" onClick={onOpenData}>
          <span>Explore the data</span><ArrowIcon />
        </button>
      </aside>
    </div>
  );
}
