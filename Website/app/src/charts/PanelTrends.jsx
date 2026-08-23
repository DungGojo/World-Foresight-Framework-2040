import { scaleLinear, line as d3line } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Small multiples, each with its own y-scale — for pairs of series whose units
// are not comparable (Economy's openness in % of GDP beside tariffs in %).
const SERIES = [palette.navy, palette.planet, palette.economy, palette.people];
// the real minus sign, as everywhere else on the site — a hyphen next to a
// digit reads as a dash, not a negative
const num = (v) => String(v).replace('-', '\u2212');

export default function PanelTrends({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.panels?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const cols = Math.min(fig.panels.length, 2);
  const w = Math.max((width || 640) / cols - 12, 200);
  const H = 200, m = { top: 26, right: 20, bottom: 26, left: 42 };
  const iw = w - m.left - m.right, ih = H - m.top - m.bottom;

  return (
    <div className="chart" ref={ref}>
      {fig.title && <p className="chart-title">{fig.title}</p>}
      <div className="panel-trends" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {fig.panels.map((p) => {
          // a panel is either one series (`values`) or several (`series`),
          // which must share a unit because they share the panel's y-scale
          const lines = p.series || [{ key: p.key, label: p.label, values: p.values }];
          const xs = [...new Set(lines.flatMap((l) => l.values.map((v) => v[0])))].sort((a, b) => a - b);
          const ys = lines.flatMap((l) => l.values.map((v) => v[1]));
          const x = scaleLinear().domain([Math.min(...xs), Math.max(...xs)]).range([m.left, m.left + iw]);
          // A flat series has a zero-width domain, which leaves d3 with no ticks
          // to place — the panel loses its gridlines and axis labels entirely.
          // Widen anything under 8% of its own level: the line still reads as
          // flat, but inside a frame the reader can actually see.
          const lo = Math.min(...ys), hi = Math.max(...ys);
          const mid = (lo + hi) / 2;
          const thin = hi - lo < Math.abs(mid) * 0.08;
          const pad = Math.max(Math.abs(mid) * 0.15, 0.5);
          // `p.domain` frames a panel against a meaningful range: over a long
          // window a share that drifts less than a point still fills an auto
          // axis and reads as a climb.
          const y = scaleLinear()
            .domain(p.domain || (thin ? [mid - pad, mid + pad] : [lo, hi])).nice()
            .range([m.top + ih, m.top]);
          const g = d3line().x((d) => x(d[0])).y((d) => y(d[1]));
          return (
            <figure key={p.key}>
              <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={p.label}>
                <g className="grid">
                  {y.ticks(4).map((t) => (
                    <line key={t} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
                  ))}
                </g>
                {fig.boundary && (
                  <line className="history-seam" x1={x(fig.boundary)} x2={x(fig.boundary)}
                        y1={m.top} y2={m.top + ih} />
                )}
                {lines.map((l, li) => (
                  <path key={l.key} d={g(l.values)} fill="none"
                        stroke={palette[l.color] || (li === 0 ? accent : SERIES[li % SERIES.length])}
                        strokeWidth={l.highlight === false ? 1.8 : 2.4}
                        opacity={l.highlight === false ? 0.75 : 1} />
                ))}
                {/* with several lines in one panel there is only room for the
                    ends, so each series states where it started and where it
                    finishes rather than every year in between. Where bands
                    converge the labels land on each other, so each side is
                    pushed apart to a minimum gap after placement. */}
                {lines.length > 1 && [0, 1].flatMap((ei) => {
                  const placed = lines.map((l, li) => {
                    const v = ei ? l.values[l.values.length - 1] : l.values[0];
                    const py = y(v[1]);
                    return {
                      key: `${l.key}-${ei}`, v, py,
                      ly: py - 9 > m.top + 6 ? py - 9 : py + 15,
                      c: palette[l.color] || (li === 0 ? accent : SERIES[li % SERIES.length]),
                    };
                  }).sort((a, b) => a.ly - b.ly);
                  const GAP = 13;
                  for (let i = 1; i < placed.length; i++) {
                    if (placed[i].ly - placed[i - 1].ly < GAP) {
                      placed[i].ly = placed[i - 1].ly + GAP;
                    }
                  }
                  return placed.map((d) => (
                    <g key={d.key}>
                      <circle cx={x(d.v[0])} cy={d.py} r={ei ? 4 : 3} fill={d.c}
                              opacity={ei ? 1 : 0.6} />
                      <text className="panel-value" x={x(d.v[0]) + (ei ? -6 : 6)} y={d.ly}
                            textAnchor={ei ? 'end' : 'start'} fill={d.c}>
                        {num(d.v[1])}{p.valueSuffix ?? fig.valueSuffix ?? ''}
                      </text>
                    </g>
                  ));
                })}
                {/* every plotted year carries its value — with three or four
                    anchors there is room, and it saves reading off the axis */}
                {lines.length === 1 && lines[0].values.map((v, i) => {
                  const last = i === lines[0].values.length - 1;
                  const rising = i > 0 && v[1] > lines[0].values[i - 1][1];
                  // keep the label inside the plot: a point near the floor has
                  // no room below it and would land on the year axis
                  const py = y(v[1]);
                  // alternate sides down the line: with three or four points a
                  // fixed rule puts labels on top of the path
                  const room = py > m.top + 20 && py < m.top + ih - 20;
                  const below = room ? i % 2 === 1 : py < m.top + ih - 22;
                  return (
                    <g key={v[0]}>
                      <circle cx={x(v[0])} cy={y(v[1])} r={last ? 4 : 3} fill={accent}
                              opacity={last ? 1 : 0.55} />
                      <text className="panel-value"
                            x={x(v[0]) + (i === 0 ? 9 : 0)}
                            y={i === 0
                              ? (py - 9 > m.top + 6 ? py - 9 : py + 15)
                              : below ? py + 15 : Math.max(py - 9, m.top + 9)}
                            textAnchor={i === 0 ? 'start' : last ? 'end' : 'middle'}
                            fill={accent} opacity={last ? 1 : 0.75}>
                        {num(v[1])}{p.valueSuffix ?? fig.valueSuffix ?? ''}
                      </text>
                    </g>
                  );
                })}
                <g className="axis">
                  <line x1={m.left} x2={m.left} y1={m.top - 4} y2={m.top + ih} />
                  <line x1={m.left} x2={m.left + iw} y1={m.top + ih} y2={m.top + ih} />
                  {y.ticks(4).map((t) => (
                    <text key={t} x={m.left - 6} y={y(t)} dy="0.32em" textAnchor="end">{num(t)}</text>
                  ))}
                  {xs.map((t) => (
                    <text key={t} x={x(t)} y={m.top + ih + 16} textAnchor="middle">{t}</text>
                  ))}
                </g>
              </svg>
              {lines.length > 1 && (
                <div className="panel-keys">
                  {lines.map((l, li) => (
                    <span key={l.key}>
                      <i style={{ background: palette[l.color] || (li === 0 ? accent : SERIES[li % SERIES.length]) }} />
                      {l.label}
                      {!fig.hideKeyValues && (
                        <b>{num(l.values[0][1])} → {num(l.values[l.values.length - 1][1])}
                        {p.valueSuffix ?? fig.valueSuffix ?? ''}</b>
                      )}
                    </span>
                  ))}
                </div>
              )}
              <figcaption>
                <b>{p.label}</b>
                <span>{p.detail || p.unit}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
