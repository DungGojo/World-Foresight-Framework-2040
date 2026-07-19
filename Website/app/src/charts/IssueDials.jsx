import { palette } from '../theme';
import './chart.css';

// Arg 2 — two gauges on a West↔China spectrum: Security leans West, Economy leans China.
// `lean` (0..100) = how strongly the needle points to `side`; the other half is the
// opposite pole. Needle angle: PI (left = West) .. 0 (right = China).
function Gauge({ title, side, lean, valueLabel }) {
  const cx = 110, cy = 105, r = 82;
  // fraction from China(0) → West(1). A West lean of 72 → 0.5 + 0.22 = 0.72 toward West.
  const westFrac = side === 'West' ? 0.5 + (lean / 100) * 0.5 : 0.5 - (lean / 100) * 0.5;
  const needleAng = Math.PI * westFrac; // 0.5→PI/2 (top), 1→PI (left/West), 0→0 (right/China)
  const nx = cx - Math.cos(needleAng) * (r - 12); // minus: westFrac=1 → cos(PI)=-1 → nx=cx+ (right)… invert
  // simpler: map westFrac to angle where West(1)=180°, China(0)=0°
  const deg = 180 * westFrac;
  const rad = (deg * Math.PI) / 180;
  const tipX = cx - Math.cos(rad) * (r - 12);
  const tipY = cy - Math.sin(rad) * (r - 12);
  const arc = (a0, a1, color) => {
    const x0 = cx + Math.cos(a0) * r, y0 = cy - Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r, y1 = cy - Math.sin(a1) * r;
    return <path d={`M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />;
  };
  return (
    <div style={{ textAlign: 'center', flex: 1, minWidth: 220 }}>
      <svg viewBox="0 0 220 132" style={{ width: '100%', maxWidth: 260, margin: '0 auto', display: 'block' }}>
        {arc(Math.PI, Math.PI / 2, palette.power)}
        {arc(Math.PI / 2, 0, palette.navy)}
        <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke={palette.ink} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={palette.ink} />
        <text x={16} y={126} fontSize={10} fill={palette.power} fontWeight={600} style={{ letterSpacing: '.1em' }}>WEST</text>
        <text x={204} y={126} fontSize={10} fill={palette.navy} fontWeight={600} textAnchor="end" style={{ letterSpacing: '.1em' }}>CHINA</text>
      </svg>
      <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1.05rem', marginTop: 4 }}>{title}</div>
      <div style={{ color: palette.muted, fontSize: 12.5, marginTop: 2, maxWidth: 260, marginInline: 'auto' }}>{valueLabel}</div>
    </div>
  );
}

export default function IssueDials({ fig }) {
  if (!fig) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  return (
    <div className="chart">
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Gauge title="Security" side="West" lean={fig.security.value} valueLabel={fig.security.label} />
        <Gauge title="Economy" side="China" lean={fig.economy.value} valueLabel={fig.economy.label} />
      </div>
      <div className="chart-legend"><span className="annot-note" style={{ color: palette.muted, fontSize: 12 }}>{fig.netAlignment.label} ({fig.netAlignment.from} → {fig.netAlignment.to}).</span></div>
    </div>
  );
}
