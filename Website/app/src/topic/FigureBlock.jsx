import { CHARTS } from '../charts';
import figures from '../data/power-figures.json';

export default function FigureBlock({ finding, figure }) {
  const Chart = CHARTS[figure.type];
  const fig = figures[figure.dataKey];
  const unavailable = !Chart || !fig || fig.unavailable;

  return (
    <figure className="figure">
      <figcaption className="figure-cap">
        <p className="finding">{finding}</p>
      </figcaption>
      <div className="figure-chart">
        {unavailable ? <div className="chart-empty">Data unavailable — {figure.caption}</div> : <Chart fig={fig} />}
      </div>
      <p className="figure-note">{figure.caption} Historical evidence and framework projections; full provenance is documented in methodology.</p>
    </figure>
  );
}
