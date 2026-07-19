import { useState } from 'react';
import { comboTitle } from '../content/site';
import ForceGlyph from '../components/ForceGlyph';
import ArrowIcon from '../components/ArrowIcon';

const positions = [
  { x: 50, y: 10 },
  { x: 84, y: 36 },
  { x: 71, y: 81 },
  { x: 29, y: 81 },
  { x: 16, y: 36 },
];

const questions = {
  power: 'Who sets the rules, and who holds the leverage?',
  tech: 'Who controls the systems that amplify human capability?',
  planet: 'How far can growth stretch planetary limits?',
  people: 'How do demography, movement and belonging reshape society?',
  economy: 'How will value, production and resilience be reorganized?',
};

const lenses = {
  power: ['Influence shifts', 'Security & stability', 'Governance', 'Domestic cohesion'],
  tech: ['AI & automation', 'Innovation capacity', 'Digital access', 'System control'],
  planet: ['Climate risk', 'Energy transition', 'Food & water', 'Livability'],
  people: ['Population change', 'Migration', 'Urbanization', 'Social pressure'],
  economy: ['Trade networks', 'Growth & debt', 'Supply chains', 'Resilience'],
};

export default function SystemsMap({ forces, onOpenTopic, onOpenData }) {
  const [selectedId, setSelectedId] = useState('power');
  const [connecting, setConnecting] = useState(false);
  const [pair, setPair] = useState([]);
  const selected = forces.find((force) => force.id === selectedId) || forces[0];
  const connectedForces = pair.map((id) => forces.find((force) => force.id === id)).filter(Boolean);
  const combo = connectedForces.length === 2 ? comboTitle(connectedForces[0].id, connectedForces[1].id) : null;

  const select = (force) => {
    if (!connecting) {
      setSelectedId(force.id);
      setPair([]);
      return;
    }
    setPair((current) => {
      if (current.includes(force.id)) return current.filter((id) => id !== force.id);
      if (current.length >= 2) return [force.id];
      return [...current, force.id];
    });
  };

  const toggleConnecting = () => {
    setConnecting((value) => !value);
    setPair([]);
  };

  return (
    <div className="systems-map">
      <div className="systems-controls">
        <button className={`connect-toggle${connecting ? ' active' : ''}`} onClick={toggleConnecting} aria-pressed={connecting}>
          <i aria-hidden="true"><span /><span /></i>
          {connecting ? 'Connecting forces' : 'Connect two forces'}
        </button>
        <p>{connecting ? (pair.length === 0 ? 'Choose the first force.' : pair.length === 1 ? 'Now choose a second force.' : 'Connection selected.') : 'Select a force to understand its role.'}</p>
      </div>

      <div className="systems-canvas" aria-label="Five Forces systems map">
        <svg className="systems-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="50" cy="49" r="32" />
          <circle cx="50" cy="49" r="21" />
          {positions.map((position, index) => <line key={forces[index].id} x1="50" y1="49" x2={position.x} y2={position.y} />)}
          {pair.map((id) => {
            const point = positions[forces.findIndex((force) => force.id === id)];
            return <line key={`connection-${id}`} className="selected-connection" x1="50" y1="49" x2={point.x} y2={point.y} />;
          })}
        </svg>

        <div className={`world-node${pair.length ? ' connected' : ''}`}><span>WORLD</span><b>2040</b></div>
        {forces.map((force, index) => {
          const inPair = pair.includes(force.id);
          const active = !connecting && selectedId === force.id;
          return (
            <button
              key={force.id}
              className={`system-node${active ? ' active' : ''}${inPair ? ' paired' : ''}`}
              style={{ '--accent': force.color, '--x': `${positions[index].x}%`, '--y': `${positions[index].y}%` }}
              onClick={() => select(force)}
              aria-pressed={active || inPair}
            >
              <span className="system-node-icon"><ForceGlyph id={force.id} /></span>
              <b>{force.name}</b>
            </button>
          );
        })}
      </div>

      <aside className="systems-detail" style={{ '--accent': combo ? connectedForces[0].color : selected.color }}>
        {combo ? (
          <>
            <div className="detail-label">Connected forces</div>
            <div className="detail-pair">
              {connectedForces.map((force) => <span key={force.id} style={{ color: force.color }}>{force.name}</span>)}
            </div>
            <h3>{combo}</h3>
            <p>How these forces combine will shape choices for governments, firms and people. Combined analysis will deepen as both topics come online.</p>
            <button className="detail-reset" onClick={() => setPair([])}>Choose another connection</button>
          </>
        ) : (
          <>
            <div className="detail-label">{selected.live ? 'Live topic' : 'In development'}</div>
            <h3>{selected.name}</h3>
            <p className="detail-question">{questions[selected.id]}</p>
            <p>{selected.teaser}</p>
            <ul>{lenses[selected.id].map((lens) => <li key={lens}>{lens}</li>)}</ul>
            <button className="detail-open" onClick={() => onOpenTopic(selected)}>
              <span>{selected.live ? `Explore ${selected.name}` : 'View topic preview'}</span><ArrowIcon />
            </button>
          </>
        )}
        <button className="detail-data" onClick={onOpenData}>Explore the global data <ArrowIcon /></button>
      </aside>
    </div>
  );
}
