import { palette } from '../theme';
import './chart.css';

// A table as a graphic. Economy's prosperity set makes its point by repeating
// "stable" down a verdict column; the two-method R&D comparison, the
// fragmentation signals and the axis-independence listing are all genuinely
// tabular and read worse as charts.
const TONE_COLOR = {
  up: palette.power, bad: palette.power, flip: palette.navy, conflict: palette.power,
  agree: palette.planet, good: palette.planet, gap: palette.people,
  flat: palette.muted, neutral: palette.muted,
};

export default function StatTable({ fig }) {
  if (!fig || !fig.rows?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  return (
    <div className="chart">
      <div className="stat-table-wrap">
        <table className="stat-table">
          {fig.columns && (
            <thead>
              <tr>{fig.columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {fig.rows.map((r, i) => (
              <tr key={i} className={r.tone ? `tone-${r.tone}` : undefined}>
                {r.cells.map((c, j) => (
                  <td key={j}
                      style={j === r.cells.length - 1 && r.tone
                        ? { color: TONE_COLOR[r.tone] || palette.ink, fontWeight: 600 }
                        : undefined}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
