import { palette } from '../theme';
import './chart.css';

// Arg 4 — each country a chip colored by its dominant power lever (its "signature").
const GROUP_COLOR = {
  tech: palette.tech,
  force: palette.power,
  resource: palette.planet,
  economic: palette.economy,
};

export default function SignatureMap({ fig }) {
  if (!fig || !fig.groups) return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  return (
    <div className="chart">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 }}>
        {fig.groups.map((g) => (
          <div key={g.key}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: GROUP_COLOR[g.key], display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '.98rem' }}>{g.label}</span>
              <span style={{ color: palette.muted, fontSize: 12 }}>· {g.count}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {g.members.map((mk) => (
                <span key={mk} style={{
                  fontSize: 11, letterSpacing: '.04em', padding: '4px 9px', borderRadius: 4,
                  border: `1px solid ${GROUP_COLOR[g.key]}44`, color: GROUP_COLOR[g.key],
                  background: `${GROUP_COLOR[g.key]}0d`,
                }}>{mk}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
