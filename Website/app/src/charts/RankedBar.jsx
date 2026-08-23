import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

const NAMED = {
  power: palette.power, navy: palette.navy, muted: palette.muted,
  planet: palette.planet, people: palette.people, tech: palette.tech,
  economy: palette.economy, line: palette.line,
};

// Generic ranked horizontal bar / lollipop with optional reference lines and
// colour groups. Covers heat days, PM2.5, debt, median age, protest rates,
// bloc-HHI, effective players, consensus, posture counts and the two
// gap-lollipop charts (exposure − capacity, pressure − institutions).
export default function RankedBar({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.bars?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const lollipop = fig.mode === 'lollipop';
  const bars = fig.bars;
  const rowH = bars.length > 22 ? 15 : bars.length > 12 ? 19 : 26;
  // The gutter has to fit the longest row label — a fixed width silently
  // clipped "Research & development spending" to "development spending".
  const longest = Math.max(...bars.map((b) => String(b.label).length));
  const cw = Math.max(width, 300);
  // …but it must never eat the plot: at 320px the longest Technology label
  // wanted a 293px gutter, leaving a negative inner width and rects the browser
  // refused to draw. Cap it at 45% of the chart.
  const labelW = Math.min(Math.max(96, longest * 6.4 + 16), 260, cw * 0.45);
  const m = { top: 12, right: 60, bottom: 30, left: labelW };
  const H = m.top + m.bottom + bars.length * rowH;
  const w = cw, iw = Math.max(w - m.left - m.right, 40);

  const vals = bars.map((b) => b.value);
  const refs = (fig.refs || []).map((r) => r.value);
  const lo = Math.min(0, ...vals, ...refs);
  const hi = Math.max(...vals, ...refs);
  const x = scaleLinear().domain([lo, hi * 1.02]).nice().range([m.left, m.left + iw]);
  const zero = x(Math.max(0, lo));

  const highlight = new Set(fig.highlight || []);
  const colorOf = (b) => {
    if (highlight.has(b.key)) return accent;
    const g = fig.groups?.[b.group];
    if (g) return NAMED[g.color] || g.color || palette.muted;
    return b.value < 0 ? palette.power : accent;
  };

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.unit || 'Ranked comparison'}>
        {(fig.refs || []).map((r) => (
          <g key={r.value}>
            <line x1={x(r.value)} x2={x(r.value)} y1={m.top - 4} y2={H - m.bottom + 2}
                  stroke={r.tone === 'target' ? palette.planet : palette.line}
                  strokeDasharray="3 4" strokeWidth={r.tone === 'target' ? 1.6 : 1} />
            <text className="annot" x={x(r.value)} y={H - m.bottom + 16} textAnchor="middle"
                  fill={r.tone === 'target' ? palette.planet : palette.muted}>{r.label}</text>
          </g>
        ))}

        {bars.map((b, i) => {
          const yy = m.top + i * rowH + rowH / 2;
          const c = colorOf(b);
          const x1 = x(b.value);
          return (
            <g key={b.key}>
              <text className="bar-label" x={m.left - 8} y={yy} dy="0.32em" textAnchor="end"
                    fill={highlight.has(b.key) ? palette.ink : palette.muted}>{b.label}</text>
              {lollipop ? (
                <>
                  <line x1={zero} x2={x1} y1={yy} y2={yy} stroke={c} strokeWidth={1.4} opacity={0.55} />
                  <circle cx={x1} cy={yy} r={4} fill={c} />
                </>
              ) : (
                <rect x={Math.min(zero, x1)} y={yy - rowH * 0.32}
                      width={Math.abs(x1 - zero)} height={rowH * 0.64} fill={c}
                      opacity={highlight.has(b.key) ? 1 : 0.82} rx={1} />
              )}
              <text className="bar-value" x={x1 + (b.value < 0 ? -7 : 7)} y={yy} dy="0.32em"
                    textAnchor={b.value < 0 ? 'end' : 'start'} fill={c}>
                {b.value}{fig.valueSuffix || ''}
              </text>
            </g>
          );
        })}
        <line x1={zero} x2={zero} y1={m.top - 4} y2={H - m.bottom + 2} stroke={palette.line} />
      </svg>

      <div className="chart-legend">
        {fig.unit && !fig.valueSuffix && <span className="lk">{fig.unit}</span>}
        {Object.entries(fig.groups || {}).map(([k, g]) => (
          <span className="lk" key={k}>
            <span className="sw" style={{ background: NAMED[g.color] || g.color }} /> {g.label}
          </span>
        ))}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
