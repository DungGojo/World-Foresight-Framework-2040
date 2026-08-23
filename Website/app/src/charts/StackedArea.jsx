import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Generic stacked composition over time. Carries Power's bloc stack and
// concentration bands, Planet's emissions share and Economy's manufacturing
// share. Band colours come from the figure when named, otherwise from a ramp.
const NAMED = {
  west: palette.power, cnrus: palette.navy, india: palette.people, rest: palette.muted,
  top2: palette.power, middle: palette.people, tail: palette.muted,
  CHN: palette.navy, USA: palette.power, IND: palette.people,
  JPN: palette.planet, DEU: palette.economy,
};
const RAMP = [palette.power, palette.navy, palette.people, palette.planet, palette.economy, palette.muted];

export default function StackedArea({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const bands = fig?.bands || fig?.blocs;
  if (!fig || !bands?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const titleH = fig.title ? 22 : 0;
  const H = 320 + titleH, m = { top: 18 + titleH, right: 108, bottom: 32, left: 44 };
  const w = Math.max(width, 280), iw = w - m.left - m.right, ih = H - m.top - m.bottom;
  const years = fig.years;
  const x = scaleLinear().domain([years[0], years[years.length - 1]]).range([m.left, m.left + iw]);
  const y = scaleLinear().domain([0, 100]).range([m.top + ih, m.top]);

  const colorOf = (b, i) => b.color || NAMED[b.key] || RAMP[i % RAMP.length];

  const stacks = years.map((_, i) => {
    let cum = 0;
    return bands.map((b) => {
      const y0 = cum; cum += b.values[i]; return { y0, y1: cum };
    });
  });
  const areaPath = (bi) => {
    const top = years.map((yr, i) => `${i === 0 ? 'M' : 'L'}${x(yr)},${y(stacks[i][bi].y1)}`).join(' ');
    const bot = years.slice().reverse().map((yr, ri) => {
      const i = years.length - 1 - ri; return `L${x(yr)},${y(stacks[i][bi].y0)}`;
    }).join(' ');
    return `${top} ${bot} Z`;
  };

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.title || 'Composition over time'}>
        {fig.title && <text x={0} y={14} className="chart-svg-title">{fig.title}</text>}
        {bands.map((b, bi) => (
          <path key={b.key} d={areaPath(bi)} fill={colorOf(b, bi)}
                opacity={b.key === 'rest' ? 0.3 : fig.highlight && fig.highlight !== b.key ? 0.62 : 0.85} />
        ))}

        {fig.majorityRef && (
          <>
            <line x1={m.left} x2={m.left + iw} y1={y(fig.majorityRef)} y2={y(fig.majorityRef)}
                  stroke="#fff" strokeDasharray="4 4" opacity={0.9} />
            <text x={m.left + 6} y={y(fig.majorityRef) - 6} className="annot" fill="#fff">
              {fig.majorityRef}% majority
            </text>
          </>
        )}

        <g className="axis">
          {[0, 25, 50, 75, 100].map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}%</text>
          ))}
          {x.ticks(Math.min(6, years.length)).map((t) => (
            <text key={t} x={x(t)} y={m.top + ih + 18} textAnchor="middle">{t}</text>
          ))}
        </g>

        {bands.map((b, bi) => {
          const last = stacks[stacks.length - 1][bi];
          const mid = (last.y0 + last.y1) / 2;
          return (
            <text key={b.key} x={m.left + iw + 6} y={y(mid)} dy="0.32em" className="end-label"
                  fill={colorOf(b, bi)}>{b.values[b.values.length - 1]}%</text>
          );
        })}
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
