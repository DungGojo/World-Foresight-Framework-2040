import { useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// One row per country for a chosen year, ranked. Switching year re-ranks the
// rows, and because each row keeps its identity across the switch the bars
// animate into their new place rather than snapping — the movement itself is
// the finding.
//
// Two ramps: `heat` reads cold→warm→hot for a physical quantity, `goodbad`
// reads green→red where low is simply better.
const RAMPS = {
  heat: [[0, [124, 168, 199]], [0.5, [222, 178, 74]], [1, [180, 58, 49]]],
  goodbad: [[0, [150, 182, 112]], [0.55, [222, 178, 74]], [1, [180, 58, 49]]],
  // neither end is "good" — a plain low→high gradient for measures like median
  // age, where the reader should not read a verdict into colour
  neutral: [[0, [151, 184, 205]], [1, [123, 92, 138]]],
  // young → old: light orange through to deep plum
  age: [[0, [240, 186, 122]], [0.5, [186, 141, 152]], [1, [92, 56, 100]]],
  // distance from a target value: on target is green, either direction away
  // from it is worse. Used with `fig.target`.
  target: [[0, [110, 158, 92]], [0.5, [226, 184, 74]], [1, [180, 58, 49]]],
};

function rampColor(t, ramp) {
  const stops = RAMPS[ramp] || RAMPS.heat;
  const u = Math.max(0, Math.min(1, t));
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const f = (u - t0) / (t1 - t0 || 1);
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * f)).join(',')})`;
    }
  }
  return `rgb(${stops[stops.length - 1][1].join(',')})`;
}

export default function HeatBars({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const years = fig?.years || [];
  const [year, setYear] = useState(() => fig?.defaultYear ?? years[years.length - 1]);
  if (!fig?.rows?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const suffix = fig.valueSuffix || '';
  const yi = Math.max(years.indexOf(year), 0);

  // ranked for the chosen year; the y position is what animates
  const ranked = [...fig.rows].sort((a, b) => b.values[yi] - a.values[yi]);
  const rank = Object.fromEntries(ranked.map((r, i) => [r.key, i]));

  const rowH = 20;
  const longest = Math.max(...fig.rows.map((r) => String(r.label).length));
  const m = { top: 26, right: 82, bottom: 26,
              left: Math.min(Math.max(110, longest * 6.3 + 18), 220) };
  const H = m.top + m.bottom + fig.rows.length * rowH;
  const w = Math.max(width, 320), iw = w - m.left - m.right;
  // one scale across every year, so switching year moves the bars honestly
  const maxV = Math.max(...fig.rows.flatMap((r) => r.values));
  const allVals = fig.rows.flatMap((r) => r.values);
  const spanUp = fig.target != null
    ? Math.max(...allVals.map((v) => Math.max(v - fig.target, 0)), 1e-6) : 1;
  const spanDown = fig.target != null
    ? Math.max(...allVals.map((v) => Math.max(fig.target - v, 0)), 1e-6) : 1;
  const x = (v) => (v / (maxV || 1)) * iw;

  return (
    <div className="chart" ref={ref}>
      <div className="heat-head">
        {fig.title && <h4>{fig.title}</h4>}
        <div className="year-toggle" role="group" aria-label="Year">
          {years.map((y) => (
            <button key={y} type="button" className={y === year ? 'on' : ''}
                    onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${H}`} role="img"
           aria-label={`${fig.title || 'Country comparison'}, ${year}`}>
        {fig.refLine != null && x(fig.refLine) < iw && (
          <>
            <line x1={m.left + x(fig.refLine)} x2={m.left + x(fig.refLine)}
                  y1={m.top - 4} y2={m.top + fig.rows.length * rowH}
                  stroke={palette.ink} strokeDasharray="3 4" opacity={0.45} />
            <text x={m.left + x(fig.refLine) + 5} y={m.top - 8} className="annot">
              {fig.refLabel}
            </text>
          </>
        )}

        {fig.rows.map((r) => {
          const v = r.values[yi];
          const yy = m.top + rank[r.key] * rowH;
          // a target ramp keys colour to distance from the target, not to level
          const t = fig.ramp === 'target' && fig.target != null
            ? (v >= fig.target ? (v - fig.target) / spanUp : (fig.target - v) / spanDown)
            : v / (maxV || 1);
          const c = rampColor(t, fig.ramp);
          return (
            <g key={r.key} className="heat-row" style={{ transform: `translateY(${yy}px)` }}>
              <text className="bar-label" x={m.left - 9} y={rowH / 2} dy="0.32em"
                    textAnchor="end" fill={palette.ink}>{r.label}</text>
              <rect x={m.left} y={3} width={Math.max(x(v), 1)} height={rowH - 7} fill={c} />
              <text className="bar-value" x={m.left + x(v) + 7} y={rowH / 2} dy="0.32em"
                    fill={c}>{v}{suffix}</text>
            </g>
          );
        })}

        <g className="axis">
          <line x1={m.left} x2={m.left + iw} y1={m.top + fig.rows.length * rowH}
                y2={m.top + fig.rows.length * rowH} />
          {(iw > 420 ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.5, 1]).map((f) => (
            <text key={f} x={m.left + iw * f} y={m.top + fig.rows.length * rowH + 16}
                  textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}>
              {Math.round(maxV * f * 10) / 10}{suffix}
            </text>
          ))}
        </g>
      </svg>

      <div className="chart-legend">
        <span className="lk"><span className="sw" style={{ background: rampColor(0.03, fig.ramp) }} />
          {fig.lowLabel || 'lower'}</span>
        {fig.midLabel && (
          <span className="lk"><span className="sw" style={{ background: rampColor(0.5, fig.ramp) }} />
            {fig.midLabel}</span>
        )}
        <span className="lk"><span className="sw" style={{ background: rampColor(1, fig.ramp) }} />
          {fig.highLabel || 'higher'}</span>
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
