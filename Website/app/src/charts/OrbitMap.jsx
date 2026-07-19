import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import './chart.css';

// Arg 1 — "gravity map": US & China poles, states pulled to the nearer pole,
// with a large non-aligned cluster floating between the giants.
const POLE_POS = {
  usa: { cx: 0.16, cy: 0.5, color: palette.power, r: 26 },
  china: { cx: 0.84, cy: 0.5, color: palette.navy, r: 22 },
  russia: { cx: 0.8, cy: 0.16, color: palette.navy, r: 14 },
  nonaligned: { cx: 0.5, cy: 0.56, color: palette.people, r: 10 },
};

export default function OrbitMap({ fig }) {
  const [ref, { width }] = useResizeObserver();
  if (!fig || !fig.poles) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const w = Math.max(width, 300), H = 340;
  const px = (f) => f * w, py = (f) => f * H;

  // deterministic dots around each pole (ring + slight spiral)
  const dots = [];
  fig.poles.forEach((pole) => {
    const P = POLE_POS[pole.key]; if (!P) return;
    const n = pole.count;
    for (let i = 0; i < n; i++) {
      const ring = 1 + Math.floor(i / 7);
      const ang = (i * 2.399) % (Math.PI * 2); // golden angle
      const rad = (pole.key === 'nonaligned' ? 54 : 40) + ring * 16;
      dots.push({
        x: px(P.cx) + Math.cos(ang) * rad,
        y: py(P.cy) + Math.sin(ang) * rad * 0.8,
        color: P.color, pole: pole.key,
      });
    }
  });

  return (
    <div className="chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Which pole each state sits nearest">
        {/* faint pull lines to the two giants */}
        {dots.map((d, i) => {
          const P = d.pole === 'usa' ? POLE_POS.usa : d.pole === 'china' ? POLE_POS.china : d.pole === 'russia' ? POLE_POS.russia : POLE_POS.nonaligned;
          return <line key={'l' + i} x1={d.x} y1={d.y} x2={px(P.cx)} y2={py(P.cy)} stroke={d.color} strokeWidth={0.6} opacity={0.16} />;
        })}
        {/* non-aligned halo */}
        <circle cx={px(0.5)} cy={py(0.56)} r={96} fill={palette.people} opacity={0.06} />
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={5} fill={d.color} opacity={0.7} />)}
        {/* poles */}
        {fig.poles.map((pole) => {
          const P = POLE_POS[pole.key]; if (!P) return null;
          return (
            <g key={pole.key}>
              <circle cx={px(P.cx)} cy={py(P.cy)} r={P.r} fill={P.color} opacity={0.9} />
              <text x={px(P.cx)} y={py(P.cy) + P.r + 16} textAnchor="middle" className="end-label" fill={P.color}>{pole.label}</text>
              <text x={px(P.cx)} y={py(P.cy) + 4} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>{pole.count}</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend"><span className="annot-note" style={{ color: palette.muted, fontSize: 12 }}>{fig.note}</span></div>
    </div>
  );
}
