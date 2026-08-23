import { CHARTS } from '../charts';
import { getFigure } from '../data/figures';
import FindingSources from './FindingSources';

export default function FigureBlock({ topicId, finding, figure, sources, accent }) {
  const Chart = CHARTS[figure.type];
  // `figure.from` lets an argument pull a figure from another figure set.
  const fig = getFigure(figure.from || topicId, figure.dataKey);
  const unavailable = !Chart || !fig || fig.unavailable;

  return (
    <figure className="figure">
      <figcaption className="figure-cap">
        <p className="finding">{finding}</p>
      </figcaption>
      <div className="figure-chart">
        {unavailable
          ? <div className="chart-empty">Data unavailable.</div>
          : <Chart fig={fig} accent={accent} />}
      </div>
      <FindingSources sources={sources} accent={accent} />
    </figure>
  );
}
