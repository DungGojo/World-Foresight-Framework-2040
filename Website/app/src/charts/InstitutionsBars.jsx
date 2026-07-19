import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 3 — incumbent institutions vs the smaller-but-rising parallel system (external data).
export default function InstitutionsBars({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const items = [
    ...fig.incumbent.map((d) => ({ ...d, grp: 'incumbent' })),
    ...fig.parallel.map((d) => ({ ...d, grp: 'parallel' })),
  ];
  const colW = 70, gap = 26, m = { top: 16, right: 20, bottom: 54, left: 44 };
  const w = Math.max(width, 300), ih = 200;
  const H = m.top + ih + m.bottom;
  const maxV = Math.max(...items.map((d) => d.value));
  const y = scaleLinear().domain([0, maxV]).range([m.top + ih, m.top]);
  const totalW = items.length * colW + (items.length - 1) * gap;
  const startX = Math.max(m.left, (w - totalW) / 2);

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Incumbent vs parallel institutions">
        <g className="axis">
          {y.ticks(4).map((t) => (
            <g key={t}><line x1={m.left - 6} x2={w - m.right} y1={y(t)} y2={y(t)} stroke={palette.line} strokeDasharray="3 4" />
              <text x={m.left - 10} y={y(t)} dy="0.32em" textAnchor="end">{t}</text></g>
          ))}
        </g>
        {items.map((d, i) => {
          const bx = startX + i * (colW + gap);
          const c = d.grp === 'incumbent' ? palette.navy : palette.power;
          return (
            <g key={i}>
              <rect x={bx} y={y(d.value)} width={colW} height={m.top + ih - y(d.value)} rx={2} fill={c} opacity={d.grp === 'incumbent' ? 0.55 : 0.9} />
              <text x={bx + colW / 2} y={y(d.value) - 6} textAnchor="middle" className="end-label" fill={c}>{d.value}</text>
              <text x={bx + colW / 2} y={m.top + ih + 18} textAnchor="middle" className="axis" fontSize={10} fill={palette.muted}>
                {d.label.split('(')[0].trim()}
              </text>
            </g>
          );
        })}
        <text x={m.left - 34} y={m.top + ih / 2} transform={`rotate(-90 ${m.left - 34} ${m.top + ih / 2})`} textAnchor="middle" className="axis" fontSize={10} fill={palette.muted}>{fig.unit}</text>
      </svg>
      <div className="chart-legend">
        <span className="lk"><span className="sw" style={{ background: palette.navy, opacity: .55 }} /> Incumbent (World Bank / IMF)</span>
        <span className="lk"><span className="sw" style={{ background: palette.power }} /> Parallel (NDB + AIIB)</span>
        <span className="pill">External estimate</span>
      </div>
    </div>
  );
}
