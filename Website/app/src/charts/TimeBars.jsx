import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// A small multiple per measure, each a short run of years as bars. Used where
// several measures move in the same direction but share no unit, so a single
// axis would misstate all but one of them. Every bar carries its own value and
// unit, so the panel is readable without a caption.
export default function TimeBars({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig?.panels?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const cols = Math.min(fig.panels.length, width && width < 620 ? 1 : 2);
  const w = Math.max((width || 720) / cols - 16, 190);
  const H = 190, m = { top: 26, right: 10, bottom: 30, left: 10 };
  const iw = w - m.left - m.right, ih = H - m.top - m.bottom;

  return (
    <div className="chart" ref={ref}>
      <div className="timebars-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {fig.panels.map((p) => {
          const vals = p.values.map((v) => v[1]);
          // bars start at zero unless the measure lives in a narrow band well
          // above it, where a zero baseline would flatten every difference
          const top = Math.max(...vals);
          const bottom = Math.min(...vals);
          const base = bottom > 0 && (top - bottom) / top < 0.35 ? bottom * 0.9 : 0;
          const y = (v) => m.top + ih - ((v - base) / ((top * 1.06) - base || 1)) * ih;
          const slot = iw / p.values.length;
          const barW = Math.min(slot * 0.52, 54);
          const dir = vals[vals.length - 1] - vals[0];
          const c = p.tone === 'down' || (p.tone !== 'up' && dir < 0) ? palette.power : accent;
          return (
            <figure key={p.key}>
              <figcaption>
                <b>{p.label}</b>
                {p.unit && <span>{p.unit}</span>}
              </figcaption>
              <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={p.label}>
                {p.values.map((v, i) => {
                  const x = m.left + slot * (i + 0.5) - barW / 2;
                  return (
                    <g key={v[0]}>
                      <rect x={x} y={y(v[1])} width={barW} height={Math.max(m.top + ih - y(v[1]), 1)}
                            fill={c} opacity={0.35 + (i / (p.values.length - 1 || 1)) * 0.55} />
                      <text x={x + barW / 2} y={y(v[1]) - 7} textAnchor="middle"
                            className="bar-value" fill={palette.ink}>
                        {v[1]}{p.valueSuffix ?? fig.valueSuffix ?? ''}
                      </text>
                      <text x={x + barW / 2} y={m.top + ih + 16} textAnchor="middle"
                            className="axis-year">{v[0]}</text>
                    </g>
                  );
                })}
                <line className="timebars-base" x1={m.left} x2={m.left + iw}
                      y1={m.top + ih} y2={m.top + ih} />

              </svg>
            </figure>
          );
        })}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
