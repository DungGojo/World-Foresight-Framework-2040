import { scaleLinear } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

const BLOC_COLORS = { west: palette.power, cnrus: palette.navy, india: palette.people, rest: palette.muted };

// Arg 1 — 100% stacked area of world power by bloc, sliding toward 50%.
export default function BlocStack({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.blocs) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const H = 300, m = { top: 16, right: 96, bottom: 30, left: 40 };
  const w = Math.max(width, 260), iw = w - m.left - m.right, ih = H - m.top - m.bottom;
  const years = fig.years;
  const x = scaleLinear().domain([years[0], years[years.length - 1]]).range([m.left, m.left + iw]);
  const y = scaleLinear().domain([0, 100]).range([m.top + ih, m.top]);

  // cumulative stack per year
  const stacks = years.map((_, i) => {
    let cum = 0;
    return fig.blocs.map((b) => {
      const y0 = cum; cum += b.values[i]; return { key: b.key, y0, y1: cum };
    });
  });
  const areaPath = (bi) => {
    const top = years.map((yr, i) => `${i === 0 ? 'M' : 'L'}${x(yr)},${y(stacks[i][bi].y1)}`).join(' ');
    const bot = years.slice().reverse().map((yr, ri) => {
      const i = years.length - 1 - ri; return `L${x(yr)},${y(stacks[i][bi].y0)}`;
    }).join(' ');
    return top + ' ' + bot + ' Z';
  };

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Share of world power by bloc">
        {fig.blocs.map((b, bi) => (
          <path key={b.key} d={areaPath(bi)} fill={BLOC_COLORS[b.key] || palette.muted} opacity={b.key === 'rest' ? 0.28 : 0.82} />
        ))}
        {/* 50% majority reference line */}
        <line x1={m.left} x2={m.left + iw} y1={y(fig.majorityRef)} y2={y(fig.majorityRef)} stroke="#fff" strokeDasharray="4 4" opacity={0.9} />
        <text x={m.left + 6} y={y(fig.majorityRef) - 6} className="annot" fill="#fff">50% majority</text>
        <g className="axis">
          {[0, 25, 50, 75, 100].map((t) => <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}%</text>)}
          {years.map((t) => <text key={t} x={x(t)} y={m.top + ih + 18} textAnchor="middle">{t}</text>)}
        </g>
        {/* end labels */}
        {fig.blocs.map((b, bi) => {
          const last = stacks[stacks.length - 1][bi];
          const mid = (last.y0 + last.y1) / 2;
          return <text key={b.key} x={m.left + iw + 6} y={y(mid)} dy="0.32em" className="end-label" fill={BLOC_COLORS[b.key] || palette.muted}>{b.values[b.values.length - 1]}%</text>;
        })}
      </svg>
      <div className="chart-legend">
        {fig.blocs.map((b) => (
          <span className="lk" key={b.key}><span className="sw" style={{ background: BLOC_COLORS[b.key], opacity: b.key === 'rest' ? .4 : 1 }} /> {b.label}</span>
        ))}
      </div>
    </div>
  );
}
