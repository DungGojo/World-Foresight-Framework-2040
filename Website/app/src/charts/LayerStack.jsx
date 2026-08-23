import { palette, legend } from '../theme';
import './chart.css';

// The technology stack, band by band, each coloured by the country that leads
// it. The point is that the colours change as you move up the stack — no one
// country owns more than its own layer.
export default function LayerStack({ fig }) {
  if (!fig || !fig.layers?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const colorOf = (m) => legend[m] || palette.muted;
  const max = Math.max(...fig.layers.map((l) => l.share));

  return (
    <div className="chart">
      <div className="layer-stack">
        {fig.layers.map((l) => (
          <div className="layer" key={l.proxy}>
            <span className="layer-name">{l.label}</span>
            <div className="layer-track">
              <div className="layer-fill"
                   style={{ width: `${(l.share / max) * 100}%`, background: colorOf(l.leader) }} />
              <span className="layer-leader">{l.leaderName} {l.share}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        {[...new Set(fig.layers.map((l) => l.leader))].map((m) => (
          <span className="lk" key={m}>
            <span className="sw" style={{ background: colorOf(m) }} />
            {fig.layers.find((l) => l.leader === m).leaderName} leads
          </span>
        ))}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
