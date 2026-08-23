import { scaleLinear, line as d3line } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 4 — two panels, both drawn from the real world series rather than the
// decorative lines this chart used to carry: what states sign up to on one
// side, what they actually put in the field on the other. The first panel is a
// bundle (thirteen participation measures, all high and rising, with their
// average picked out); the second is the single line that collapses.
function Panel({ panel, width, accent }) {
  const H = 250, m = { top: 16, right: 58, bottom: 28, left: 40 };
  const w = Math.max(width, 250), iw = w - m.left - m.right, ih = H - m.top - m.bottom;
  const pts = panel.series.flatMap((s) => s.values);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x = scaleLinear().domain([Math.min(...xs), Math.max(...xs)]).range([m.left, m.left + iw]);
  const y = scaleLinear()
    .domain(panel.domain || [0, Math.max(...ys) * 1.08]).nice()
    .range([m.top + ih, m.top]);
  const g = d3line().x((d) => x(d[0])).y((d) => y(d[1]));
  const bundle = panel.series.length > 1;

  return (
    <figure className="twospeed-panel">
      <figcaption>
        <b>{panel.label}</b>
        <span>{panel.sub}</span>
      </figcaption>

      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={panel.label}>
        <g className="grid">
          {y.ticks(4).map((t) => (
            <line key={t} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
          ))}
        </g>

        {panel.series.map((s) => (
          <g key={s.key}>
            <path d={g(s.values)} fill="none"
                  stroke={s.highlight ? accent : palette.navy}
                  strokeWidth={s.highlight ? 2.8 : bundle ? 1.2 : 2.4}
                  opacity={s.highlight ? 1 : bundle ? 0.32 : 1} />
            {!bundle && (() => {
              const c = s.highlight ? accent : palette.navy;
              const last = s.values[s.values.length - 1];
              return (
                <>
                  <circle cx={x(last[0])} cy={y(last[1])} r={4} fill={c} />
                  <text className="end-label" x={x(last[0]) + 7} y={y(last[1])} dy="0.32em"
                        fill={c}>{last[1]}</text>
                </>
              );
            })()}
          </g>
        ))}

        {panel.mean && (
          <g>
            <path d={g(panel.mean.values)} fill="none" stroke={palette.navy} strokeWidth={3} />
            <circle cx={x(panel.mean.values[panel.mean.values.length - 1][0])}
                    cy={y(panel.mean.values[panel.mean.values.length - 1][1])} r={4}
                    fill={palette.navy} />
            <text className="end-label" x={x(panel.mean.values[panel.mean.values.length - 1][0]) + 7}
                  y={y(panel.mean.values[panel.mean.values.length - 1][1])} dy="0.32em"
                  fill={palette.navy}>
              {panel.mean.values[panel.mean.values.length - 1][1]}
            </text>
          </g>
        )}

        <g className="axis">
          {y.ticks(4).map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}</text>
          ))}
          {x.ticks(Math.min(5, new Set(xs).size)).map((t) => (
            <text key={t} x={x(t)} y={m.top + ih + 18} textAnchor="middle">{t}</text>
          ))}
          <line x1={m.left} x2={m.left + iw} y1={m.top + ih} y2={m.top + ih} />
        </g>
      </svg>

      <div className="twospeed-stats">
        {panel.stats.map((st) => (
          <div key={st.label}>
            <strong style={{ color: st.tone === 'down' ? accent : palette.navy }}>{st.value}</strong>
            <span>{st.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function TwoSpeed({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig?.panels?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const panelW = Math.min(Math.max((width - 26) / 2, 250), 470);
  return (
    <div className="chart" ref={ref}>
      <div className="twospeed-grid">
        {fig.panels.map((p) => (
          <Panel key={p.key} panel={p} width={panelW} accent={accent} />
        ))}
      </div>
    </div>
  );
}
