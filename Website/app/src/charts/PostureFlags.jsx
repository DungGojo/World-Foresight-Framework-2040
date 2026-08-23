import { useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { flagSrc } from '../lib/flags';
import { palette } from '../theme';
import './chart.css';

// Arg 3 — the four alignment camps as flag clusters, same visual language as
// the orbit map. No anchor sits at the centre of any camp: these are postures,
// not orbits around a patron, so each is just a halo of members.
const CAMP_COLOR = {
  hedge: palette.muted, east: palette.navy, auto: palette.people, west: palette.power,
};
const FLAG = 27;

// Radii are driven by how many members a camp holds, so the fifteen hedgers and
// the single West-aligned state both read as one coherent blob.
function ringsFor(n) {
  if (n <= 1) return { rings: [], halo: 36 };
  // two members sit side by side rather than stacked, so a camp of two does not
  // read as a big empty circle with a flag at each pole
  if (n === 2) return { rings: [21], halo: 56, rot: Math.PI / 2 };
  if (n <= 4) return { rings: [34], halo: 66 };
  if (n <= 8) return { rings: [46], halo: 78 };
  if (n <= 12) return { rings: [40, 80], halo: 110 };
  return { rings: [44, 88], halo: 118 };
}

function place(cx, cy, rings, members, rot = 0) {
  if (!rings.length) return members.map((mem) => ({ ...mem, x: cx, y: cy }));
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
    const ang = rot + (ri * Math.PI) / n - Math.PI / 2 + ((idx - taken) / n) * Math.PI * 2;
    out.push({ ...mem, x: cx + Math.cos(ang) * rings[ri], y: cy + Math.sin(ang) * rings[ri] * 0.92 });
  });
  return out;
}

export default function PostureFlags({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const [active, setActive] = useState(null);
  if (!fig?.camps?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const narrow = width && width < 640;
  const VW = narrow ? 420 : 900;
  const cols = narrow ? 1 : 2;

  // Each row is only as tall as its biggest camp needs, so a row holding the
  // two small camps does not leave a band of dead space above it.
  const geo = fig.camps.map((c) => ({ ...c, ...ringsFor(c.members.length) }));
  const rowH = [];
  geo.forEach((c, i) => {
    const r = Math.floor(i / cols);
    rowH[r] = Math.max(rowH[r] || 0, c.halo * 2 + 62);
  });
  const rowTop = rowH.reduce((acc, h, i) => [...acc, (acc[i] ?? 0) + h], [0]);

  const laid = geo.map((camp, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = (VW / cols) * (col + 0.5);
    const cy = rowTop[row] + rowH[row] / 2 - 12;
    return {
      ...camp, cx, cy, color: CAMP_COLOR[camp.key] || palette.muted,
      nodes: place(cx, cy, camp.rings, camp.members, camp.rot),
    };
  });
  const VH = rowTop[rowTop.length - 1];

  const activeNode = active && laid.flatMap((c) => c.nodes).find((n) => n.market === active);

  return (
    <div className="chart orbit-map" ref={ref}>
      <svg viewBox={`0 0 ${VW} ${VH}`} role="img"
           aria-label={`Alignment posture of ${fig.total} countries in ${fig.year}`}
           onMouseLeave={() => setActive(null)}>
        {laid.map((c) => (
          <g key={c.key}>
            <circle cx={c.cx} cy={c.cy} r={c.halo} fill={c.color} opacity={0.12}
                    stroke={c.color} strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="7 6" />
            {c.nodes.map((n) => {
              const src = flagSrc(n.market);
              const on = active === n.market;
              return (
                <g key={n.market} className="orbit-flag" tabIndex={0} role="button"
                   aria-label={n.name}
                   onMouseEnter={() => setActive(n.market)} onMouseLeave={() => setActive(null)}
                   onFocus={() => setActive(n.market)} onBlur={() => setActive(null)}
                   onClick={() => setActive((a) => (a === n.market ? null : n.market))}>
                  <circle cx={n.x} cy={n.y} r={FLAG / 2 + 4} fill="transparent" />
                  <circle cx={n.x} cy={n.y} r={FLAG / 2 + (on ? 3 : 1.5)} fill={c.color}
                          opacity={on ? 0.5 : 0.24} />
                  {src
                    ? <image href={src} x={n.x - FLAG / 2} y={n.y - FLAG / 2}
                             width={FLAG} height={FLAG} />
                    : <circle cx={n.x} cy={n.y} r={FLAG / 2} fill={c.color} opacity={0.75} />}
                  <circle cx={n.x} cy={n.y} r={FLAG / 2} fill="none"
                          stroke={on ? c.color : palette.panel} strokeWidth={on ? 2 : 1} />
                </g>
              );
            })}
            <text x={c.cx} y={c.cy + c.halo + 22} textAnchor="middle" className="orbit-camp"
                  fill={c.color}>
              {c.label}
              <tspan className="orbit-count" dx="6">{c.count}</tspan>
            </text>
          </g>
        ))}

        {activeNode && (
          <text className="orbit-callout" pointerEvents="none" textAnchor="middle"
                x={Math.min(Math.max(activeNode.x, 64), VW - 64)}
                y={activeNode.y - FLAG / 2 - 10}>{activeNode.name}</text>
        )}
      </svg>
      <p className="chart-note coverage">Hover or tap a flag for the country name.</p>
    </div>
  );
}
