import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette, legend } from '../theme';
import './chart.css';

// Arg 2 — US vs China radar across five domains of power.
export default function PowerRadar({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.axes) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const size = Math.min(Math.max(width, 260), 420);
  const cx = size / 2, cy = size / 2 + 6, R = size * 0.34;
  const axes = fig.axes, n = axes.length;
  const maxV = Math.max(...fig.series.flatMap((s) => s.values)) * 1.1;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const rr = (v / maxV) * R;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  };
  const color = (mk) => legend[mk] || palette.muted;

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${size} ${size + 10}`} role="img" aria-label="US vs China power radar" style={{ maxWidth: 440, margin: '0 auto' }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={axes.map((_, i) => pt(i, maxV * f).join(',')).join(' ')} fill="none" stroke={palette.line} strokeDasharray="3 4" />
        ))}
        {axes.map((ax, i) => {
          const [x, y] = pt(i, maxV);
          const [lx, ly] = pt(i, maxV * 1.16);
          return (
            <g key={ax}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={palette.line} />
              <text x={lx} y={ly} textAnchor="middle" dy="0.32em" className="axis" fontSize={11} fill={palette.muted}>{ax}</text>
            </g>
          );
        })}
        {fig.series.map((s) => {
          const c = color(s.market);
          const poly = s.values.map((v, i) => pt(i, v).join(',')).join(' ');
          return <polygon key={s.market} points={poly} fill={c} fillOpacity={0.14} stroke={c} strokeWidth={2} />;
        })}
      </svg>
      <div className="chart-legend">
        {fig.series.map((s) => <span className="lk" key={s.market}><span className="sw" style={{ background: color(s.market) }} /> {s.name}</span>)}
      </div>
    </div>
  );
}
