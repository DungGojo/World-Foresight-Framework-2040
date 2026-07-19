import { constellationCopy } from '../content/site';

// Left rail (build spec §6.2): brand, five-force list, data access, replay + badge.
export default function Sidebar({ forces, activeId, onHover, onSelect, onExploreData, onReplay }) {
  return (
    <aside className="hub-sidebar">
      <div className="hub-brand">
        <b>{constellationCopy.brandTitle}</b>
        <span>The 5 forces of 2040</span>
      </div>

      <div className="hub-forcelist" onMouseLeave={() => onHover(null)}>
        {forces.map((f) => (
          <button
            key={f.id}
            className={'hub-forcerow' + (activeId === f.id ? ' active' : '')}
            style={{ '--accent': f.color }}
            onMouseEnter={() => onHover(f.id)}
            onFocus={() => onHover(f.id)}
            onClick={() => onSelect(f)}
          >
            <span className="hf-dot" style={{ background: f.color }} />
            <span className="hf-name">{f.name}</span>
            <span className={'hf-status' + (f.live ? ' live' : '')}>
              {f.live ? 'Explore ▸' : 'Coming soon'}
            </span>
          </button>
        ))}
      </div>

      <div className="hub-divider" />
      <button className="hub-data-btn" onClick={onExploreData}>
        <span className="hd-icon">▤</span>
        <span>
          <b>Explore the data</b>
          <em>Jump straight to the timeseries.</em>
        </span>
      </button>

      <div className="hub-sidefoot">
        <button className="hub-replay" onClick={onReplay}>↺ Replay the story</button>
        <span className="hub-badge">{constellationCopy.yearBadge}</span>
      </div>
    </aside>
  );
}
