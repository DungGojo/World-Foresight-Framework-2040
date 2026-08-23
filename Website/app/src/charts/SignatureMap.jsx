import { useState } from 'react';
import { flagSrc } from '../lib/flags';
import { palette } from '../theme';
import './chart.css';

// Arg 5 — each country badged by the lever it is strongest on. Flags rather
// than ISO codes, with the name on hover or tap, matching the orbit map.
const GROUP_COLOR = {
  tech: palette.tech,
  force: palette.power,
  resource: palette.planet,
  economic: palette.economy,
};

export default function SignatureMap({ fig }) {
  const [active, setActive] = useState(null);
  if (!fig?.groups?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  return (
    <div className="chart">
      <div className="signature-grid">
        {fig.groups.map((g) => {
          const color = GROUP_COLOR[g.key] || palette.muted;
          return (
            <section key={g.key} className="signature-group" style={{ '--sig': color }}>
              <header>
                <i />
                <b>{g.label}</b>
                <span>{g.count}</span>
              </header>
              <ul>
                {g.members.map((mem) => {
                  const market = mem.market || mem;
                  const name = mem.name || market;
                  const src = flagSrc(market);
                  const on = active === market;
                  return (
                    <li key={market}>
                      <button type="button" className={on ? 'on' : ''}
                              onMouseEnter={() => setActive(market)}
                              onMouseLeave={() => setActive(null)}
                              onFocus={() => setActive(market)}
                              onBlur={() => setActive(null)}
                              onClick={() => setActive((a) => (a === market ? null : market))}
                              aria-label={name}>
                        {src
                          ? <img src={src} alt="" aria-hidden="true" />
                          : <span className="sig-fallback">{market}</span>}
                        <span className="sig-name" role="tooltip">{name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      {fig.note && <p className="chart-note wide">{fig.note}</p>}
    </div>
  );
}
