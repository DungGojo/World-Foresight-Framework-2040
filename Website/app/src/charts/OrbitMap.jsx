import { useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { flagSrc } from '../lib/flags';
import { palette } from '../theme';
import './chart.css';

// Arg 1 — "gravity map": every one of the 34 countries shown as its own flag,
// grouped by the anchor power it sits closest to (cluster_to_anchor). The three
// giants anchor their camp from the centre; the non-aligned camp deliberately
// has no centre — just a ring inside one wide halo — because that is the claim.
const CAMP_COLOR = {
  usa: palette.power, china: palette.navy, russia: palette.navy,
  nonaligned: palette.people,
};

// Two fixed compositions rather than a fluid one: the blobs are sized in
// absolute units, so a single layout either collides on phones or floats apart
// on desktop. `rings` lists the orbit radii, filled outward.
const WIDE = {
  vb: [880, 460],
  poles: {
    usa:        { cx: 162, cy: 235, rings: [66, 104], halo: 132, anchored: true },
    nonaligned: { cx: 428, cy: 258, rings: [40, 90],  halo: 114, anchored: false },
    china:      { cx: 706, cy: 315, rings: [64],      halo: 96,  anchored: true },
    russia:     { cx: 706, cy: 98,  rings: [56],      halo: 86,  anchored: true },
  },
};
const NARROW = {
  vb: [420, 1080],
  poles: {
    usa:        { cx: 210, cy: 152, rings: [66, 104], halo: 132, anchored: true },
    nonaligned: { cx: 210, cy: 452, rings: [40, 90],  halo: 114, anchored: false },
    china:      { cx: 210, cy: 702, rings: [64],      halo: 96,  anchored: true },
    russia:     { cx: 210, cy: 934, rings: [56],      halo: 86,  anchored: true },
  },
};

const FLAG = 27, ANCHOR_FLAG = 42;

// Deterministic ring placement: seats are split between the rings in proportion
// to their circumference, so the inner ring never ends up more crowded than the
// outer one, and each ring starts at a different angle so they do not line up.
function placeRing(P, members) {
  const rings = P.rings;
  const weight = rings.reduce((t, r) => t + r, 0);
  const counts = rings.map((r, i) =>
    (i === rings.length - 1 ? null : Math.round((members.length * r) / weight)));
  counts[counts.length - 1] = members.length - counts.slice(0, -1).reduce((t, n) => t + n, 0);

  const out = [];
  let ri = 0, taken = 0;
  members.forEach((mem, idx) => {
    while (counts[ri] != null && idx - taken >= counts[ri] && ri < rings.length - 1) {
      taken += counts[ri]; ri += 1;
    }
    const n = counts[ri] || 1;
    // half-step per ring, so an inner flag never lines up radially with an outer one
    const ang = (ri * Math.PI) / n - Math.PI / 2 + ((idx - taken) / n) * Math.PI * 2;
    out.push({ ...mem, x: P.cx + Math.cos(ang) * rings[ri], y: P.cy + Math.sin(ang) * rings[ri] * 0.92 });
  });
  return out;
}

function Flag({ node, size, color, active, onEnter, onLeave, onClick }) {
  const src = flagSrc(node.market);
  const half = size / 2;
  return (
    <g className="orbit-flag" onMouseEnter={onEnter} onMouseLeave={onLeave}
       onFocus={onEnter} onBlur={onLeave} onClick={onClick}
       tabIndex={0} role="button" aria-label={node.name}>
      {/* transparent hit area so the gap between flags stays hoverable */}
      <circle cx={node.x} cy={node.y} r={half + 4} fill="transparent" />
      <circle cx={node.x} cy={node.y} r={half + (active ? 3 : 1.5)}
              fill={color} opacity={active ? 0.5 : 0.24} />
      {src
        ? <image href={src} x={node.x - half} y={node.y - half} width={size} height={size}
                 preserveAspectRatio="xMidYMid slice" />
        : <circle cx={node.x} cy={node.y} r={half} fill={color} opacity={0.75} />}
      <circle cx={node.x} cy={node.y} r={half} fill="none"
              stroke={active ? color : palette.panel} strokeWidth={active ? 2 : 1} />
    </g>
  );
}

export default function OrbitMap({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null);
  if (!fig?.poles?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const L = width && width < 620 ? NARROW : WIDE;
  const [VW, VH] = L.vb;

  // The anchor country is part of its own camp: it sits at the centre of the
  // three giants' groups, and inside the ring for the non-aligned one.
  const camps = fig.poles.map((pole) => {
    const P = L.poles[pole.key];
    if (!P) return null;
    const color = CAMP_COLOR[pole.key] || palette.muted;
    const anchor = pole.market
      ? { market: pole.market, name: pole.label === 'Non-aligned' ? 'India' : pole.label }
      : null;
    const members = pole.members || [];
    const orbiting = P.anchored || !anchor ? members : [anchor, ...members];
    return {
      ...pole, P, color, anchor: P.anchored ? anchor : null,
      total: members.length + (anchor ? 1 : 0),
      nodes: placeRing(P, orbiting),
    };
  }).filter(Boolean);

  const active = pinned || hover;
  const activeNode = active && camps
    .flatMap((c) => [...c.nodes, ...(c.anchor ? [{ ...c.anchor, x: c.P.cx, y: c.P.cy, anchor: true }] : [])])
    .find((n) => n.market === active);

  return (
    <div className="chart orbit-map" ref={ref}>
      <svg viewBox={`0 0 ${VW} ${VH}`} role="img"
           aria-label="Which pole each of the 34 countries sits nearest"
           onMouseLeave={() => setHover(null)}>
        {camps.map((c) => (
          <g key={c.key}>
            {/* camp halo — the only marker the non-aligned group gets */}
            <circle cx={c.P.cx} cy={c.P.cy} r={c.P.halo} fill={c.color}
                    opacity={c.key === 'nonaligned' ? 0.14 : 0.08}
                    stroke={c.color} strokeOpacity={c.key === 'nonaligned' ? 0.85 : 0.24}
                    strokeWidth={c.key === 'nonaligned' ? 2 : 1}
                    strokeDasharray={c.key === 'nonaligned' ? '7 6' : undefined} />
            {/* pull lines to the anchor, drawn only where there is one */}
            {c.anchor && c.nodes.map((n) => (
              <line key={`l-${n.market}`} x1={n.x} y1={n.y} x2={c.P.cx} y2={c.P.cy}
                    stroke={c.color} strokeWidth={0.7} opacity={0.18} />
            ))}
          </g>
        ))}

        {camps.map((c) => (
          <g key={`f-${c.key}`}>
            {c.nodes.map((n) => (
              <Flag key={n.market} node={n} size={FLAG} color={c.color}
                    active={active === n.market}
                    onEnter={() => setHover(n.market)} onLeave={() => setHover(null)}
                    onClick={() => setPinned((p) => (p === n.market ? null : n.market))} />
            ))}
            {c.anchor && (
              <Flag node={{ ...c.anchor, x: c.P.cx, y: c.P.cy }} size={ANCHOR_FLAG} color={c.color}
                    active={active === c.anchor.market}
                    onEnter={() => setHover(c.anchor.market)} onLeave={() => setHover(null)}
                    onClick={() => setPinned((p) => (p === c.anchor.market ? null : c.anchor.market))} />
            )}
            <text x={c.P.cx} y={c.P.cy + c.P.halo + 20} textAnchor="middle"
                  className="orbit-camp" fill={c.color}>
              {c.label}
              <tspan className="orbit-count" dx="6">{c.total}</tspan>
            </text>
          </g>
        ))}

        {/* name of the hovered / tapped country, above the flag */}
        {activeNode && (
          <text className="orbit-callout" pointerEvents="none" textAnchor="middle"
                x={Math.min(Math.max(activeNode.x, 64), VW - 64)}
                y={activeNode.y - (activeNode.anchor ? ANCHOR_FLAG : FLAG) / 2 - 10}>
            {activeNode.name}
          </text>
        )}
      </svg>

      {fig.note && <p className="chart-note">{fig.note}</p>}
      <p className="chart-note coverage">Hover or tap a flag for the country name.</p>
    </div>
  );
}
