import { palette, legend } from '../theme';
import './chart.css';

const PANEL_COPY = {
  money: {
    title: 'Size ranking',
    unit: 'Share of world power (%)',
  },
  equal: {
    title: 'Balanced ranking',
    unit: 'Balanced power score (0-100)',
  },
};

const METHODOLOGY_COPY =
  'We compare 34 countries across military spending, trade, GDP, national capability and soft power. Size ranking averages each country’s share of the four measures available as world totals. Balanced ranking puts all five on the same 0–100 scale and gives each equal weight.';

function buildRanks(rows) {
  const ranks = new Map();
  let previousValue;
  let previousRank = 0;

  rows.forEach((row, index) => {
    const rank = index > 0 && row.value === previousValue ? previousRank : index + 1;
    ranks.set(row.market, rank);
    previousValue = row.value;
    previousRank = rank;
  });

  return ranks;
}

function formatValue(value, panelKey) {
  return panelKey === 'money' ? `${value.toFixed(1)}%` : value.toFixed(1);
}

function RankPanel({ panel, baselineRanks, tieMarkets }) {
  const copy = PANEL_COPY[panel.key] || { title: panel.label, unit: panel.unit };
  const ranks = buildRanks(panel.rows);
  const maxValue = Math.max(...panel.rows.map((row) => row.value), 1);

  return (
    <section className={`rank-panel rank-panel-${panel.key}`} aria-labelledby={`rank-${panel.key}-title`}>
      <header className="rank-panel-head">
        <h3 id={`rank-${panel.key}-title`}>{copy.title}</h3>
        <span className="rank-unit">{copy.unit}</span>
        <span className="rank-scope">Top 6</span>
      </header>

      <ol className="rank-list">
        {panel.rows.map((row) => {
          const rank = ranks.get(row.market);
          const previousRank = baselineRanks.get(row.market);
          const movement = previousRank ? previousRank - rank : 0;
          const isTie = panel.key === 'equal' && tieMarkets.has(row.market);
          const color = legend[row.market] || palette.muted;

          return (
            <li className="rank-row" key={row.market}>
              <div className="rank-row-copy">
                <span className="rank-number" aria-label={`Rank ${rank}${isTie ? ', tied' : ''}`}>
                  {rank}{isTie ? '=' : ''}
                </span>
                <span className="rank-country">
                  <i style={{ backgroundColor: color }} aria-hidden="true" />
                  {row.name}
                </span>
                {panel.key === 'equal' ? (
                  <span className={`rank-move ${movement > 0 ? 'up' : movement < 0 ? 'down' : ''}`}>
                    {movement > 0
                        ? `↑${movement}`
                        : movement < 0
                          ? `↓${Math.abs(movement)}`
                          : ''}
                  </span>
                ) : <span className="rank-move" />}
                <strong>{formatValue(row.value, panel.key)}</strong>
              </div>
              <div className="rank-track" aria-hidden="true">
                <span style={{ width: `${(row.value / maxValue) * 100}%`, backgroundColor: color }} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function RankSwap({ fig }) {
  if (!fig || fig.panels?.length < 2) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const [sizePanel, equalPanel] = fig.panels;
  const sizeRanks = buildRanks(sizePanel.rows);
  const tieMarkets = new Set(fig.tie || []);
  const equalRows = new Map(equalPanel.rows.map((row) => [row.market, row]));

  return (
    <div className="chart rank-compare" role="group" aria-label="Power rankings under two weighting methods">
      <div className="rank-compare-grid">
        <RankPanel panel={sizePanel} baselineRanks={sizeRanks} tieMarkets={tieMarkets} />
        <RankPanel panel={equalPanel} baselineRanks={sizeRanks} tieMarkets={tieMarkets} />
      </div>

      <details className="rank-method">
        <summary>Methodology</summary>
        <p>{METHODOLOGY_COPY}</p>
      </details>

      <table className="vh">
        <caption>Power rankings compared by weighting method</caption>
        <thead>
          <tr>
            <th>Country</th>
            <th>{PANEL_COPY.money.title}</th>
            <th>{PANEL_COPY.equal.title}</th>
          </tr>
        </thead>
        <tbody>
          {sizePanel.rows.map((row) => {
            const equalRow = equalRows.get(row.market);
            return (
              <tr key={row.market}>
                <th>{row.name}</th>
                <td>{formatValue(row.value, sizePanel.key)}</td>
                <td>{equalRow ? formatValue(equalRow.value, equalPanel.key) : 'Not available'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
