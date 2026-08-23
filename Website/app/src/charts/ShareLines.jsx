import { scaleLinear, line as d3line } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette, legend } from '../theme';
import './chart.css';

// Share-of-world lines: two (or more) focus countries bold, the rest of the
// field faint behind. Originally hardcoded to Power's US/China framing; the
// legend and the closing annotation now all
// come from the figure, so Technology's production-share chart reuses it as-is.
export default function ShareLines({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.focus?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const H = 320, m = { top: 18, right: 76, bottom: 30, left: 40 };
  const w = Math.max(width, 260), iw = w - m.left - m.right, ih = H - m.top - m.bottom;

  const background = fig.background || [];
  const allLines = [...background, ...fig.focus];
  const years = allLines.flatMap((s) => s.values.map((v) => v[0]));
  const vals = allLines.flatMap((s) => s.values.map((v) => v[1]));
  const x = scaleLinear().domain([Math.min(...years), Math.max(...years)]).range([m.left, m.left + iw]);
  const y = scaleLinear().domain([0, Math.max(...vals) * 1.1]).nice().range([m.top + ih, m.top]);
  const g = d3line().x((d) => x(d[0])).y((d) => y(d[1]));
  const color = (mk, i) => legend[mk] || (i === 0 ? accent : palette.navy);

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img"
           aria-label={fig.focus.map((s) => s.name).join(' vs ') + ' share of world'}>
        <g className="grid">
          {y.ticks(5).map((t) => (
            <line key={t} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
          ))}
        </g>

        <g className="axis">
          {y.ticks(5).map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}%</text>
          ))}
          <line x1={m.left} x2={m.left + iw} y1={m.top + ih} y2={m.top + ih} />
          {(fig.anchors || []).map((t) => (
            <text key={t} x={x(t)} y={m.top + ih + 18} textAnchor="middle">{t}</text>
          ))}
        </g>

        {background.map((s) => (
          <path key={s.market} d={g(s.values)} fill="none" stroke={palette.muted}
                strokeWidth={1} opacity={0.28} />
        ))}

        {fig.focus.map((s, i) => {
          const last = s.values[s.values.length - 1];
          const c = color(s.market, i);
          return (
            <g key={s.market}>
              <path d={g(s.values)} fill="none" stroke={c} strokeWidth={2.4} />
              <circle cx={x(last[0])} cy={y(last[1])} r={3.5} fill={c} />
              <text className="end-label" x={x(last[0]) + 7} y={y(last[1])} dy="0.32em" fill={c}>
                {s.market} {last[1].toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-legend">
        {fig.focus.map((s, i) => (
          <span className="lk" key={s.market}>
            <span className="sw" style={{ background: color(s.market, i) }} /> {s.name}
          </span>
        ))}
        {background.length > 0 && (
          <span className="lk">
            <span className="sw" style={{ background: palette.muted, opacity: 0.4 }} /> Rest of field
          </span>
        )}
        {fig.annotation && (
          <span className="annot-note" style={{ color: palette.muted, fontSize: 11.5 }}>
            {fig.annotation}
          </span>
        )}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
