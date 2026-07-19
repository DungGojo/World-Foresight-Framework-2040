import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 4 — slope chart 2025→2040: material levers rise in parallel; rules alone falls.
export default function LeverSlope({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.levers) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const H = 300, m = { top: 24, right: 120, bottom: 30, left: 120 };
  const w = Math.max(width, 280), iw = w - m.left - m.right;
  const xL = m.left, xR = m.left + iw;
  const changes = fig.levers.map((l) => l.change);
  const lo = Math.min(...changes, 0), hi = Math.max(...changes);
  const pad = (hi - lo) * 0.15 || 5;
  const y = (v) => m.top + (1 - (v - (lo - pad)) / ((hi + pad) - (lo - pad))) * (H - m.top - m.bottom);

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Change by power lever 2025 to 2040">
        <line x1={xL} x2={xL} y1={m.top - 6} y2={H - m.bottom + 6} stroke={palette.line} />
        <line x1={xR} x2={xR} y1={m.top - 6} y2={H - m.bottom + 6} stroke={palette.line} />
        <text x={xL} y={H - 8} textAnchor="middle" className="annot">{fig.span[0]}</text>
        <text x={xR} y={H - 8} textAnchor="middle" className="annot">{fig.span[1]}</text>
        {fig.levers.map((l) => {
          const c = l.highlight ? palette.power : palette.navy;
          const y2 = y(l.change), y1 = y(0);
          return (
            <g key={l.key}>
              <line x1={xL} y1={y1} x2={xR} y2={y2} stroke={c} strokeWidth={l.highlight ? 2.6 : 1.8} opacity={l.highlight ? 1 : 0.75} />
              <circle cx={xL} cy={y1} r={3} fill={c} />
              <circle cx={xR} cy={y2} r={3.5} fill={c} />
              <text x={xL - 10} y={y1} dy="0.32em" textAnchor="end" className="end-label" fill={c}>{l.label}</text>
              <text x={xR + 10} y={y2} dy="0.32em" className="end-label" fill={c}>{l.change > 0 ? '+' : ''}{l.change}%</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span className="lk"><span className="sw" style={{ background: palette.navy }} /> Material levers (rising)</span>
        <span className="lk"><span className="sw" style={{ background: palette.power }} /> Rules lever (declining)</span>
      </div>
    </div>
  );
}
