import { useState } from 'react';
import { flagSrc } from '../lib/flags';
import './chart.css';

// Two named lists of countries side by side, as flags rather than text, so the
// reader can see at a glance that the two sets do not overlap.
export default function FlagColumns({ fig }) {
  const [active, setActive] = useState(null);
  if (!fig?.columns?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  return (
    <div className="chart">
      <div className="flag-columns">
        {fig.columns.map((col) => (
          <section key={col.key} style={{ '--col': col.color || 'var(--muted)' }}>
            <header>
              <b>{col.label}</b>
            </header>
            <ul>
              {col.members.map((mem) => {
                const src = flagSrc(mem.market);
                const on = active === mem.market;
                return (
                  <li key={mem.market}>
                    <button type="button" className={on ? 'on' : ''}
                            onMouseEnter={() => setActive(mem.market)}
                            onMouseLeave={() => setActive(null)}
                            onFocus={() => setActive(mem.market)}
                            onBlur={() => setActive(null)}
                            onClick={() => setActive((a) => (a === mem.market ? null : mem.market))}
                            aria-label={mem.name}>
                      {src && <img src={src} alt="" aria-hidden="true" />}
                      <span className="flag-col-name">{mem.name}</span>
                      {fig.showValues && mem.value != null && (
                        <em>{mem.value}{fig.valueSuffix || ''}</em>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
