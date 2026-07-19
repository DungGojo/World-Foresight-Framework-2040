import { palette } from '../theme';
import './chart.css';

// Arg 3 — split panel: on paper the treaties hold (flat/rising); in practice
// collective muscle fades (peacekeeping steeply down).
export default function TwoSpeed({ fig }) {
  if (!fig) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  const W = 520, H = 220, midX = W / 2;

  // left: bundle of flat lines + a few rising
  const flat = fig.onPaper.flat, rising = fig.onPaper.rising;
  const leftLines = [];
  for (let i = 0; i < flat; i++) {
    const y = 40 + (i / Math.max(1, flat - 1)) * 120 * 0.7 + 20;
    leftLines.push(<line key={'f' + i} x1={24} y1={y} x2={midX - 30} y2={y - 4} stroke={palette.muted} strokeWidth={1.4} opacity={0.4} />);
  }
  for (let i = 0; i < rising; i++) {
    const y = 150 - i * 8;
    leftLines.push(<line key={'r' + i} x1={24} y1={y} x2={midX - 30} y2={y - 40} stroke={palette.navy} strokeWidth={1.8} opacity={0.8} />);
  }

  const pk = fig.inPractice.find((d) => d.key === 'pko');
  const icj = fig.inPractice.find((d) => d.key === 'icj');

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Rules on paper vs in practice" style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* divider */}
        <line x1={midX} y1={16} x2={midX} y2={H - 30} stroke={palette.line} strokeDasharray="3 4" />
        {/* left */}
        <text x={24} y={26} className="end-label" fill={palette.ink}>On paper</text>
        {leftLines}
        <text x={24} y={H - 10} className="annot" fill={palette.muted}>{rising} rising · {flat} flat · {fig.onPaper.declining} declining</text>
        {/* right: steep decline */}
        <text x={midX + 24} y={26} className="end-label" fill={palette.ink}>In practice</text>
        <polyline points={`${midX + 30},60 ${W - 30},150`} fill="none" stroke={palette.power} strokeWidth={2.6} />
        <circle cx={W - 30} cy={150} r={3.5} fill={palette.power} />
        <text x={W - 30} y={168} textAnchor="end" className="end-label" fill={palette.power}>{pk ? `${pk.label} ${pk.change}%` : ''}</text>
        {icj && <text x={midX + 24} y={H - 10} className="annot" fill={palette.muted}>{icj.label} ~{icj.level}%</text>}
      </svg>
    </div>
  );
}
