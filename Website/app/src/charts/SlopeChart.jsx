import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

const TONE = { up: palette.power, down: palette.planet, flat: palette.muted };

// Generic two-anchor slope chart: { span:[a,b], series:[{label,from,to,tone}] }.
// Carries the converge-vs-diverge findings in Technology, Planet, People and
// Economy, plus per-country slopes (adaptive capacity, per-capita emissions).
export default function SlopeChart({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.series?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const rows = fig.series;
  const dense = rows.length > 10;
  const H = dense ? 380 : Math.max(240, 40 + rows.length * 30);
  const labelW = dense ? 96 : 190;
  const m = { top: 26, right: dense ? 74 : 132, bottom: 30, left: labelW };
  const w = Math.max(width, 300), iw = w - m.left - m.right;
  const xL = m.left, xR = m.left + iw;

  const vals = rows.flatMap((r) => [r.from, r.to]);
  const comparesSpread = fig.yLabel?.toLowerCase().startsWith('spread between countries');
  const y = scaleLinear()
    .domain([Math.min(...vals), Math.max(...vals)]).nice()
    .range([H - m.bottom, m.top]);

  const colorOf = (r) => (r.highlight ? accent : TONE[r.tone] || palette.muted);

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.yLabel || 'Slope chart'}>
        <line x1={xL} x2={xL} y1={m.top - 8} y2={H - m.bottom + 6} stroke={palette.line} />
        <line x1={xR} x2={xR} y1={m.top - 8} y2={H - m.bottom + 6} stroke={palette.line} />
        <text x={xL} y={H - 10} textAnchor="middle" className="annot">{fig.span[0]}</text>
        <text x={xR} y={H - 10} textAnchor="middle" className="annot">{fig.span[1]}</text>

        {rows.map((r) => {
          const c = colorOf(r);
          const strong = r.highlight || !dense;
          return (
            <g key={r.key} opacity={strong ? 1 : 0.5}>
              <line x1={xL} y1={y(r.from)} x2={xR} y2={y(r.to)} stroke={c}
                    strokeWidth={r.highlight ? 2.6 : dense ? 1.2 : 2} />
              <circle cx={xL} cy={y(r.from)} r={strong ? 3 : 2} fill={c} />
              <circle cx={xR} cy={y(r.to)} r={strong ? 3.5 : 2} fill={c} />
              {(!dense || r.highlight) && (
                <>
                  <text x={xL - 10} y={y(r.from)} dy="0.32em" textAnchor="end"
                        className="end-label" fill={c}>{r.label}</text>
                  <text x={xR + 10} y={y(r.to)} dy="0.32em" className="end-label" fill={c}>
                    {r.to}
                  </text>
                </>
              )}
            </g>
          );
        })}

        <g className="axis">
          {y.ticks(4).map((t) => (
            <text key={t} x={xL - 10} y={y(t)} dy="0.32em" textAnchor="end"
                  opacity={dense ? 1 : 0}>{dense ? t : ''}</text>
          ))}
        </g>
      </svg>

      <div className="chart-legend">
        {rows.some((r) => r.tone === 'up') && (
          <span className="lk"><span className="sw" style={{ background: TONE.up }} /> {comparesSpread ? 'Countries move further apart' : 'Rising'}</span>
        )}
        {rows.some((r) => r.tone === 'down') && (
          <span className="lk"><span className="sw" style={{ background: TONE.down }} /> {comparesSpread ? 'Countries move closer' : 'Falling'}</span>
        )}
        {fig.yLabel && <span className="lk">{fig.yLabel}</span>}
      </div>
      {rows.some((r) => r.coverage) && (
        <p className="chart-note coverage">
          {rows.filter((r) => r.coverage).map((r) => `${r.label}: ${r.coverage}`).join(' · ')}
        </p>
      )}
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
