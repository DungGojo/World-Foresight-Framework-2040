import { palette } from '../theme';
import './chart.css';

const SCENARIO_LABELS = ['China-favourable', 'Main', 'US-favourable'];
const STABLE_ORDER = ['US', 'China', 'India', 'Germany', 'Russia', 'UK', 'Japan', 'France'];

function position(value, domain) {
  const span = domain[1] - domain[0];
  return span > 0 ? ((value - domain[0]) / span) * 100 : 0;
}

export default function ScenarioBullet({ fig, accent = palette.power }) {
  if (!fig || fig.value == null || !fig.range?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const domain = fig.domain || [0, Math.max(fig.range[1], fig.value) + 1];
  const values = [fig.range[0], fig.value, fig.range[1]];
  const start = position(fig.range[0], domain);
  const end = position(fig.range[1], domain);
  const parity = position(fig.refLine ?? 0, domain);

  return (
    <div className="chart scenario-stability" role="group" aria-label="Scenario and ranking stability">
      <div className="scenario-proof-grid">
        <section className="scenario-proof scenario-gap">
          <header>
            <span>US lead over China</span>
            <strong>{fig.range[0]}–{fig.range[1]}</strong>
            <em>points in every scenario</em>
          </header>

          <div className="scenario-track" aria-hidden="true">
            <i className="scenario-parity" style={{ left: `${parity}%` }} />
            <span className="scenario-parity-label" style={{ left: `${parity}%` }}>Parity</span>
            <i className="scenario-range" style={{ left: `${start}%`, width: `${end - start}%`, background: accent }} />
            {values.map((value, index) => (
              <i
                className="scenario-point"
                key={SCENARIO_LABELS[index]}
                style={{ left: `${position(value, domain)}%`, background: index === 1 ? accent : palette.ink }}
              />
            ))}
          </div>

          <div className="scenario-values">
            {values.map((value, index) => (
              <div key={SCENARIO_LABELS[index]}>
                <span>{SCENARIO_LABELS[index]}</span>
                <b>{value.toFixed(1)} pts</b>
              </div>
            ))}
          </div>
        </section>

        <section className="scenario-proof scenario-order">
          <header>
            <span>Top-eight order</span>
            <strong>0</strong>
            <em>rank changes</em>
          </header>
          <div className="stable-ranks" aria-hidden="true">
            {STABLE_ORDER.map((country, index) => (
              <span key={country}><b>{index + 1}</b>{country}</span>
            ))}
          </div>
          <p>Same order in all three scenarios</p>
        </section>
      </div>

      <table className="vh">
        <caption>US lead and top-eight ranking stability across three scenarios</caption>
        <thead><tr><th>Scenario</th><th>US lead over China</th><th>Top-eight rank changes</th></tr></thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={SCENARIO_LABELS[index]}>
              <th>{SCENARIO_LABELS[index]}</th><td>{value.toFixed(1)} points</td><td>0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
