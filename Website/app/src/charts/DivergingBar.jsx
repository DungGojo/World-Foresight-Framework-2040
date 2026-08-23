import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Two shapes behind one component:
//  · value mode  — a signed value per row (Technology's net IP income).
//  · count mode  — worsening-vs-improving country counts either side of a
//                  centre line (Technology's control/capability scissors,
//                  People's protest-vs-violence growth).
export default function DivergingBar({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  const rows = fig?.rows;
  if (!fig || !rows?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const countMode = rows[0].worse !== undefined && rows[0].value === undefined;
  const rowH = rows.length > 20 ? 16 : 26;
  // Gutter sized to the longest label — a fixed width clipped
  // "How much state control varies by country" mid-word.
  const longest = Math.max(...rows.map((r) => String(r.label).length));
  const cw = Math.max(width, 320);
  // …but it must never eat the plot: at 320px the longest Technology label
  // wanted a 293px gutter, leaving a negative inner width and rects the browser
  // refused to draw. Cap it at 45% of the chart.
  const m = { top: 26, right: 56, bottom: 26,
              left: Math.min(Math.max(140, longest * 6.4 + 18), 300, cw * 0.45) };
  // Each band caption gets its own line; drawn between rows it landed on top of
  // the label above it.
  const BAND_GAP = 20;
  const bandStarts = new Set();
  let seen = null;
  rows.forEach((r, i) => { if (r.band && r.band !== seen) { bandStarts.add(i); seen = r.band; } });
  const offsetAt = (i) => [...bandStarts].filter((b) => b <= i).length * BAND_GAP;
  const H = m.top + m.bottom + rows.length * rowH + bandStarts.size * BAND_GAP;
  const w = cw, iw = Math.max(w - m.left - m.right, 40);

  const extent = countMode
    ? Math.max(...rows.map((r) => Math.max(r.worse, r.better)))
    : Math.max(...rows.map((r) => Math.abs(r.value)));
  const lo = countMode ? -extent : Math.min(0, ...rows.map((r) => r.value));
  const hi = countMode ? extent : Math.max(0, ...rows.map((r) => r.value));
  // 12% headroom so the longest bar stops short of the plot edge and its value
  // label still fits outside the bar rather than being flipped inside it.
  const span = Math.max(hi - lo, 1e-6);
  const x = scaleLinear()
    .domain([Math.min(lo * 1.12, -span * 0.18), Math.max(hi * 1.12, span * 0.18)])
    .nice().range([m.left, m.left + iw]);
  const mid = x(0);

  const highlight = new Set(fig.highlight || []);
  // On a dispersion index a positive move means countries pulled APART, which is
  // the bad direction — `tone: 'inverse'` flips the good/bad colouring.
  const inverse = fig.tone === 'inverse';
  const good = inverse ? palette.power : palette.planet;
  const bad = inverse ? palette.planet : palette.power;
  let lastBand = null;

  return (
    <div className="chart" ref={ref}>
      {fig.title && <p className="chart-title">{fig.title}</p>}
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.title || fig.unit || 'Diverging comparison'}>
        <text className="annot" x={mid - 10} y={m.top - 10} textAnchor="end">{fig.leftLabel || 'Negative'}</text>
        <text className="annot" x={mid + 10} y={m.top - 10}>{fig.rightLabel || 'Positive'}</text>

        {rows.map((r, i) => {
          const yy = m.top + i * rowH + rowH / 2 + offsetAt(i);
          const key = r.market || r.label;
          const on = highlight.has(r.market);
          const showBand = fig.bands && r.band && r.band !== lastBand;
          if (r.band) lastBand = r.band;
          return (
            <g key={key}>
              {showBand && (
                <text className="band-label" x={4} y={yy - rowH / 2 - 7} fill={palette.muted}>
                  {fig.bands[r.band]}
                </text>
              )}
              <text className="bar-label" x={m.left - 10} y={yy} dy="0.32em" textAnchor="end"
                    fill={on ? palette.ink : palette.muted}>{r.label}</text>
              {countMode ? (
                <>
                  {r.worse > 0 && (
                    <rect x={x(-r.worse)} y={yy - rowH * 0.3} width={mid - x(-r.worse)}
                          height={rowH * 0.6} fill={palette.power} opacity={0.85} rx={1} />
                  )}
                  {r.better > 0 && (
                    <rect x={mid} y={yy - rowH * 0.3} width={x(r.better) - mid}
                          height={rowH * 0.6} fill={palette.planet} opacity={0.85} rx={1} />
                  )}
                  {r.worse > 0 && (
                    <text className="bar-value" x={x(-r.worse) - 7} y={yy} dy="0.32em"
                          textAnchor="end" fill={palette.power}>{r.worse}</text>
                  )}
                  {r.better > 0 && (
                    <text className="bar-value" x={x(r.better) + 7} y={yy} dy="0.32em"
                          fill={palette.planet}>{r.better}</text>
                  )}
                </>
              ) : (
                <>
                  <rect x={Math.min(mid, x(r.value))} y={yy - rowH * 0.3}
                        width={Math.abs(x(r.value) - mid)} height={rowH * 0.6}
                        fill={r.value >= 0 ? good : bad}
                        opacity={on ? 1 : 0.8} rx={1} />
                  {/* the longest bar reaches the axis start, where an outside
                      label would sit on top of the row name — flip it inside */}
                  {(() => {
                    const barLen = Math.abs(x(r.value) - mid);
                    const fits = r.value >= 0
                      ? x(r.value) + 7 < m.left + iw - 4
                      : x(r.value) - 7 > m.left + 34;
                    const outside = fits || barLen < 44;
                    const tx = outside
                      ? x(r.value) + (r.value >= 0 ? 7 : -7)
                      : x(r.value) + (r.value >= 0 ? -7 : 7);
                    const anchor = outside
                      ? (r.value >= 0 ? 'start' : 'end')
                      : (r.value >= 0 ? 'end' : 'start');
                    return (
                      <text className="bar-value" x={tx} y={yy} dy="0.32em" textAnchor={anchor}
                            fill={outside ? (r.value >= 0 ? good : bad) : palette.panel}>
                        {r.value > 0 ? '+' : r.value < 0 ? '−' : ''}{Math.abs(r.value)}{fig.valueSuffix || ''}
                      </text>
                    );
                  })()}
                </>
              )}
            </g>
          );
        })}
        <line x1={mid} x2={mid} y1={m.top - 4} y2={H - m.bottom + 2} stroke={palette.ink} opacity={0.35} />
      </svg>

      <div className="chart-legend">
        {fig.unit && !fig.hideUnit && (!fig.valueSuffix || fig.showUnit)
          && <span className="lk">{fig.unit}</span>}
        {countMode && (
          <>
            <span className="lk"><span className="sw" style={{ background: palette.power }} /> Worsening</span>
            <span className="lk"><span className="sw" style={{ background: palette.planet }} /> Improving</span>
          </>
        )}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
