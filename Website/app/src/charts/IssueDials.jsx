import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 3 — two gauges on a West↔China spectrum, each carrying both anchor years.
// The finding is about divergence over time, so a single needle per dial cannot
// make it: the ghost needle is the first year, the solid one the last, and the
// wedge between them is the direction of travel.
const W = 240, H = 168, CX = 120, CY = 124, R = 92;

// frac 1 = West (the 9 o'clock end), 0.5 = top, 0 = China (3 o'clock).
// x uses +cos so frac 1 lands left of the pivot; getting this sign wrong
// mirrors the gauge and the two half-arcs cross instead of meeting at the top.
const polar = (frac, radius) => {
  const rad = Math.PI * frac;
  return [CX + Math.cos(rad) * radius, CY - Math.sin(rad) * radius];
};

function arc(a0, a1, radius, color, width) {
  const [x0, y0] = polar(a0, radius);
  const [x1, y1] = polar(a1, radius);
  return <path d={`M${x0},${y0} A${radius},${radius} 0 0 ${a0 > a1 ? 1 : 0} ${x1},${y1}`}
               fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

function Gauge({ dial }) {
  const frac = (i) => {
    const total = dial.west[i] + dial.east[i];
    return total > 0 ? dial.west[i] / total : 0.5;
  };
  const from = frac(0), to = frac(dial.west.length - 1);
  const accent = to >= 0.5 ? palette.power : palette.navy;
  const [fx, fy] = polar(from, R - 16);
  const [tx, ty] = polar(to, R - 16);

  return (
    <div className="dial">
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
           aria-label={`${dial.title}: ${dial.westLabel} versus ${dial.eastLabel}`}>
        {arc(1, 0.5, R, palette.power, 8)}
        {arc(0.5, 0, R, palette.navy, 8)}
        {/* the wedge the needle travelled between the two years */}
        {Math.abs(to - from) > 0.004 && (
          <path d={`M${CX},${CY} L${fx},${fy} A${R - 16},${R - 16} 0 0 ${from > to ? 1 : 0} ${tx},${ty} Z`}
                fill={accent} opacity={0.22} />
        )}
        <line x1={CX} y1={CY} x2={fx} y2={fy} stroke={palette.muted} strokeWidth={2}
              strokeDasharray="3 3" strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={tx} y2={ty} stroke={palette.ink} strokeWidth={3.5}
              strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={5.5} fill={palette.ink} />
        <text x={6} y={CY + 22} className="dial-pole" fill={palette.power}>
          {dial.westLabel.toUpperCase()}
        </text>
        <text x={W - 6} y={CY + 22} textAnchor="end" className="dial-pole" fill={palette.navy}>
          {dial.eastLabel.toUpperCase()}
        </text>
      </svg>

      <div className="dial-title">{dial.title}</div>
      <div className="dial-readout">
        <span><i style={{ background: palette.power }} />{dial.westLabel}</span>
        <b>{dial.west[0]}% <em>→</em> {dial.west[dial.west.length - 1]}%</b>
        <span><i style={{ background: palette.navy }} />{dial.eastLabel}</span>
        <b>{dial.east[0]}% <em>→</em> {dial.east[dial.east.length - 1]}%</b>
      </div>
    </div>
  );
}

export default function IssueDials({ fig }) {
  const [ref] = useResizeObserver();
  if (!fig?.dials?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  return (
    <div className="chart" ref={ref}>
      <div className="dial-row">
        {fig.dials.map((d) => <Gauge key={d.key} dial={d} />)}
      </div>
    </div>
  );
}
