import { palette, forceAccent } from '../theme';
import './chart.css';

// The framework's signature graphic: three independently built worst-quadrant
// sets and the countries sitting in all of them. Also renders a two-set nested
// layout (`mode: 'nested'`) for Planet's strict-subset relationship to People.
const SET_COLOR = { planet: forceAccent.planet, people: forceAccent.people, economy: forceAccent.economy };

export default function VennThree({ fig }) {
  if (!fig || !fig.sets?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  if (fig.mode === 'nested') {
    const [inner, outer] = fig.sets;
    return (
      <div className="chart">
        <div className="nested-sets">
          <div className="nested-outer" style={{ borderColor: SET_COLOR.people }}>
            <span className="nested-title" style={{ color: SET_COLOR.people }}>
              {outer.label} · {outer.count}
            </span>
            <div className="nested-inner" style={{ borderColor: SET_COLOR.planet }}>
              <span className="nested-title" style={{ color: SET_COLOR.planet }}>
                {inner.label} · {inner.count}
              </span>
              <ul>{inner.members.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
            <ul className="nested-rest">
              {outer.members.filter((m) => !inner.members.includes(m)).map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        </div>
        {fig.note && <p className="chart-note">{fig.note}</p>}
      </div>
    );
  }

  const W = 460, H = 380, r = 116;
  const centres = [
    { key: fig.sets[0].key, cx: W / 2, cy: 148 },
    { key: fig.sets[1].key, cx: W / 2 - 100, cy: 250 },
    { key: fig.sets[2].key, cx: W / 2 + 100, cy: 250 },
  ];

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
           aria-label="Countries in the worst quadrant of Planet, People and Economy"
           style={{ maxWidth: 520, margin: '0 auto' }}>
        {centres.map((c, i) => (
          <circle key={c.key} cx={c.cx} cy={c.cy} r={r}
                  fill={SET_COLOR[c.key] || palette.muted} opacity={0.17}
                  stroke={SET_COLOR[c.key] || palette.muted} strokeOpacity={0.5} />
        ))}
        {centres.map((c, i) => {
          const s = fig.sets[i];
          const lx = i === 0 ? c.cx : i === 1 ? c.cx - 42 : c.cx + 42;
          const ly = i === 0 ? c.cy - r - 26 : c.cy + r + 22;
          return (
            <g key={`l${c.key}`}>
              <text className="venn-title" x={lx} y={ly} textAnchor="middle"
                    fill={SET_COLOR[c.key]}>{s.label} · {s.count}</text>
              <text className="venn-sub" x={lx} y={ly + 14} textAnchor="middle">{s.sub}</text>
            </g>
          );
        })}

        <g className="venn-centre">
          {fig.centre.map((n, i) => (
            <text key={n} x={W / 2} y={214 + i * 15} textAnchor="middle">{n}</text>
          ))}
        </g>
      </svg>

      {fig.twoOfThree?.length > 0 && (
        <p className="chart-note">
          In two of the three: <strong>{fig.twoOfThree.join(', ')}</strong>.
        </p>
      )}
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
