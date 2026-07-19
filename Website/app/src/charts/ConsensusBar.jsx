import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 2 — ranked "votes with the global majority"; the US near the bottom.
export default function ConsensusBar({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.bars) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const bars = [...fig.bars].sort((a, b) => b.value - a.value);
  const rowH = 32, m = { top: 8, right: 46, bottom: 8, left: 132 };
  const H = m.top + m.bottom + bars.length * rowH;
  const w = Math.max(width, 260), iw = w - m.left - m.right;
  const x = scaleLinear().domain([0, 100]).range([0, iw]);

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Votes with the global majority">
        {bars.map((b, i) => {
          const yy = m.top + i * rowH;
          const isUS = b.key === 'usa';
          return (
            <g key={b.key}>
              <text x={m.left - 10} y={yy + rowH / 2} dy="0.32em" textAnchor="end" className="end-label" fill={isUS ? palette.power : palette.ink}>{b.label}</text>
              <rect x={m.left} y={yy + 5} width={x(b.value)} height={rowH - 12} rx={2} fill={isUS ? palette.power : palette.navy} opacity={isUS ? 0.95 : 0.5} />
              <text x={m.left + x(b.value) + 6} y={yy + rowH / 2} dy="0.32em" className="end-label" fill={isUS ? palette.power : palette.ink}>{b.value}%</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend"><span className="annot-note" style={{ color: palette.muted, fontSize: 12 }}>{fig.note}</span></div>
    </div>
  );
}
