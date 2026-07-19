import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette, legend } from '../theme';
import './chart.css';

// Arg 4 — technology world-share in 2040, a two-country race with a long tail.
export default function TechDominanceBar({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.bars) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const bars = fig.bars;
  const rowH = 34, m = { top: 10, right: 60, bottom: 24, left: 118 };
  const H = m.top + m.bottom + bars.length * rowH;
  const w = Math.max(width, 260), iw = w - m.left - m.right;
  const x = scaleLinear().domain([0, Math.max(...bars.map((b) => b.value))]).range([0, iw]);
  const color = (mk) => legend[mk] || palette.muted;

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={`Technology world share ${fig.year}`}>
        {bars.map((b, i) => {
          const yy = m.top + i * rowH;
          return (
            <g key={b.market}>
              <text x={m.left - 10} y={yy + rowH / 2} dy="0.32em" textAnchor="end" className="end-label" fill={palette.ink}>{b.name}</text>
              <rect x={m.left} y={yy + 6} width={x(b.value)} height={rowH - 14} rx={2} fill={color(b.market)} opacity={b.market === 'USA' || b.market === 'CHN' ? 0.92 : 0.5} />
              <text x={m.left + x(b.value) + 6} y={yy + rowH / 2} dy="0.32em" className="end-label" fill={palette.ink}>{b.value}%</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend"><span className="annot-note" style={{ color: palette.muted, fontSize: 12 }}>{fig.annotation}</span></div>
    </div>
  );
}
