import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Discrete-column sibling of StackedArea. Same figure shape ({years, blocs|bands})
// but drawn as one column per anchor year: when a composition moves by only a
// point or two across fifteen years, separated columns with printed values make
// the movement legible where a continuous area cannot.
const NAMED = {
  west: palette.power, cnrus: palette.navy, india: palette.people, rest: palette.muted,
  top2: palette.power, middle: palette.people, tail: palette.muted,
  CHN: palette.navy, USA: palette.power, IND: palette.people,
};
const RAMP = [palette.power, palette.navy, palette.people, palette.planet, palette.economy, palette.muted];

const fmt = (v) => `${v.toFixed(1)}%`;
const signed = (v) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(1)}`;

export default function StackedColumns({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const bands = fig?.bands || fig?.blocs;
  if (!fig || !bands?.length || !fig.years?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const years = fig.years;
  const H = 360, m = { top: 26, right: 96, bottom: 44, left: 44 };
  const w = Math.max(width, 280), iw = w - m.left - m.right, ih = H - m.top - m.bottom;
  const y = (v) => m.top + ih - (v / 100) * ih;

  // Columns sized off the plot width so 2 or 5 anchor years both read evenly.
  const slot = iw / years.length;
  const colW = Math.min(slot * 0.52, 108);
  const cx = (i) => m.left + slot * (i + 0.5);

  // The printed value has to survive a phone-width column, so it shrinks with
  // the column and is dropped entirely once even the floor would overflow.
  const valueFont = Math.max(8, Math.min(11.5, colW * 0.135));
  const valueFits = colW >= valueFont * 3;

  const colorOf = (b, i) => b.color || NAMED[b.key] || RAMP[i % RAMP.length];
  const opacityOf = (b) =>
    b.key === 'rest' ? 0.34 : fig.highlight && fig.highlight !== b.key ? 0.62 : 0.88;

  // Cumulative tops per column, so each segment knows where it sits.
  const stacks = years.map((_, i) => {
    let cum = 0;
    return bands.map((b) => {
      const y0 = cum; cum += b.values[i]; return { y0, y1: cum };
    });
  });

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Composition at each anchor year">
        <g className="grid">
          {[0, 25, 50, 75, 100].map((t) => (
            <line key={t} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
          ))}
        </g>

        {years.map((yr, i) => (
          <g key={yr}>
            {bands.map((b, bi) => {
              const seg = stacks[i][bi];
              const h = Math.max(y(seg.y0) - y(seg.y1), 0);
              const value = b.values[i];
              // muted or dimmed bands render pale against the paper, so the
              // printed value has to flip to ink to stay readable
              const pale = colorOf(b, bi) === palette.muted || opacityOf(b) < 0.5;
              return (
                <g key={b.key}>
                  <rect x={cx(i) - colW / 2} y={y(seg.y1)} width={colW} height={h}
                        fill={colorOf(b, bi)} opacity={opacityOf(b)} />
                  {/* value inside the segment; skip when the band is too thin to hold it */}
                  {valueFits && h > valueFont * 1.4 && (
                    <text x={cx(i)} y={y(seg.y1) + h / 2} dy="0.32em" textAnchor="middle"
                          className="col-value" fontSize={valueFont}
                          fill={pale ? palette.ink : '#fff'}>
                      {fmt(value)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {fig.majorityRef != null && (
          <>
            <line x1={m.left} x2={m.left + iw + 4} y1={y(fig.majorityRef)} y2={y(fig.majorityRef)}
                  stroke={palette.ink} strokeDasharray="4 4" opacity={0.55} />
            <text x={m.left + iw + 8} y={y(fig.majorityRef)} dy="0.32em" className="annot">
              {fig.majorityRef}% majority
            </text>
          </>
        )}

        <g className="axis">
          {[0, 25, 50, 75, 100].map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}%</text>
          ))}
          {years.map((yr, i) => (
            <text key={yr} x={cx(i)} y={m.top + ih + 20} textAnchor="middle">{yr}</text>
          ))}
        </g>

        {/* change across the full span, printed once per band next to the last column */}
        {bands.map((b, bi) => {
          const last = stacks[stacks.length - 1][bi];
          const mid = (last.y0 + last.y1) / 2;
          const delta = b.values[b.values.length - 1] - b.values[0];
          return (
            <text key={b.key} x={m.left + iw + 8} y={y(mid)} dy="0.32em" className="end-label"
                  fill={colorOf(b, bi)}>
              {signed(delta)}
            </text>
          );
        })}
        <text x={m.left + iw + 8} y={m.top - 10} className="annot">
          {years[0]}→{years[years.length - 1]} pts
        </text>
      </svg>

      <div className="chart-legend">
        {bands.map((b, bi) => (
          <span className="lk" key={b.key}>
            <span className="sw" style={{ background: colorOf(b, bi), opacity: b.key === 'rest' ? 0.45 : 1 }} />
            {b.label}
          </span>
        ))}
        {fig.annotation && <span className="annot-note">{fig.annotation}</span>}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
