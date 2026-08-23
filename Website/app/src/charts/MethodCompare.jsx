import { useResizeObserver } from '../hooks/useResizeObserver';
import { flagSrc } from '../lib/flags';
import { palette, legend } from '../theme';
import './chart.css';

// Two ways of measuring the same quantity, side by side, where they disagree
// about who leads. Each panel is self-scaled because the two methods are in
// different units — the point is the ordering inside a panel, not the levels
// across them, so the winner is marked rather than left to be inferred.
const FLAG = 22;

export default function MethodCompare({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig?.panels?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const panelW = Math.min(Math.max((width - 26) / fig.panels.length, 240), 420);

  return (
    <div className="chart" ref={ref}>
      <div className="method-grid">
        {fig.panels.map((p) => {
          const max = Math.max(...p.bars.map((b) => b.value));
          const rowH = 46;
          const m = { top: 8, right: 12, bottom: 8, left: 38 };
          const H = m.top + m.bottom + p.bars.length * rowH;
          const valueW = Math.max(...p.bars.map((b) => String(b.display).length)) * 6.2 + 16;
          const iw = Math.max(panelW - m.left - m.right - valueW, 60);
          return (
            <figure className="method-panel" key={p.key}>
              <figcaption>
                <b>{p.label}</b>
                {p.sub && <span>{p.sub}</span>}
              </figcaption>
              <svg viewBox={`0 0 ${panelW} ${H}`} role="img" aria-label={p.label}>
                {p.bars.map((b, i) => {
                  const yy = m.top + i * rowH;
                  const bw = Math.max((b.value / max) * iw, 2);
                  const wins = b.market === p.leader;
                  const c = wins ? (legend[b.market] || accent) : palette.muted;
                  const src = flagSrc(b.market);
                  return (
                    <g key={b.market}>
                      {src && <image href={src} x={4} y={yy + rowH / 2 - FLAG / 2 - 6}
                                     width={FLAG} height={FLAG} />}
                      <rect x={m.left} y={yy + 8} width={bw} height={20} fill={c}
                            opacity={wins ? 0.92 : 0.42} rx={1} />
                      <text x={m.left + bw + 8} y={yy + 18} dy="0.32em" className="bar-value"
                            fill={c}>{b.display}</text>
                      <text x={m.left} y={yy + 40} className="method-name"
                            fill={wins ? palette.ink : palette.muted}>
                        {b.name}{wins ? ' · leads' : ''}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </figure>
          );
        })}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
