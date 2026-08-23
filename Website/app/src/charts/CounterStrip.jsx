import { palette } from '../theme';
import './chart.css';

// Big-number counters. Several findings are genuinely a count, not a curve —
// threshold crossings, split countries, fertility and ageing crossings — and
// the docx says so explicitly ("a counter graphic", "a counter strip").
export default function CounterStrip({ fig, accent = palette.power }) {
  if (!fig || !fig.counters?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  return (
    <div className="chart">
      <div className="counter-strip">
        {fig.counters.map((c, i) => (
          <div className={`counter${c.wide ? ' wide' : ''}`} key={i}>
            <b style={{ color: accent }}>{c.value}</b>
            <span>{c.label}</span>
            {c.detail && <em>{c.detail}</em>}
          </div>
        ))}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
