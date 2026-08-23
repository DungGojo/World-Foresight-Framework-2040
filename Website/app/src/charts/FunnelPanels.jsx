import { palette } from '../theme';
import './chart.css';

// Converging / diverging panels: a mean that moves and a spread that narrows or
// widens. This is the shape behind Technology's access funnels, People's
// capability-vs-cohesion pair and Economy's integration spread. The wedge is a
// schematic of the dispersion verdict, with the numbers stated beside it.
export default function FunnelPanels({ fig, accent = palette.power }) {
  if (!fig || !fig.panels?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const [a, b] = fig.anchors || [2025, 2040];

  return (
    <div className="chart">
      <div className="funnel-grid">
        {fig.panels.map((p) => {
          const converging = p.dispersion < 0;
          const c = converging ? palette.planet : palette.power;
          // wedge half-heights, scaled by the dispersion change
          const start = 34;
          const end = Math.max(4, Math.min(46, start * (1 + p.dispersion / 100)));
          return (
            <figure className="funnel" key={p.key}>
              <svg viewBox="0 0 220 108" role="img" aria-label={`${p.label} dispersion`}>
                <polygon points={`14,${50 - start} 206,${50 - end} 206,${50 + end} 14,${50 + start}`}
                         fill={c} opacity={0.16} />
                <line x1={14} x2={206} y1={50} y2={50} stroke={c} strokeWidth={2} />
                <circle cx={14} cy={50} r={3.5} fill={palette.muted} />
                <circle cx={206} cy={50} r={4} fill={c} />
                {/* the mean sits on the line and the spread change inside the
                    wedge, so the shape is readable without the caption */}
                {p.mean?.[0] != null && (
                  <>
                    <text className="funnel-value" x={14} y={42} textAnchor="start"
                          fill={palette.muted}>{p.mean[0]}</text>
                    <text className="funnel-value" x={206} y={42} textAnchor="end"
                          fill={c}>{p.mean[1]}</text>
                  </>
                )}
                <text className="funnel-gap" x={110} y={50 - Math.max(start, end) - 6}
                      textAnchor="middle" fill={c}>
                  gap {converging ? '−' : '+'}{Math.abs(p.dispersion)}%
                </text>
                <text className="annot" x={14} y={104} textAnchor="start">{a}</text>
                <text className="annot" x={206} y={104} textAnchor="end">{b}</text>
              </svg>
              <figcaption>
                <b>{p.label}</b>
                <strong className="funnel-summary" style={{ color: c }}>
                  {converging ? 'Countries move closer' : 'Countries move further apart'}
                </strong>
                {p.unit && <span className="funnel-mean">Average, {p.unit}</span>}
                {p.detail && <em>{p.detail}</em>}
                {p.coverage && <em className="coverage">{p.coverage}</em>}
              </figcaption>
            </figure>
          );
        })}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
