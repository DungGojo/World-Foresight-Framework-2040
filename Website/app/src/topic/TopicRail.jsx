import ForceGlyph from '../components/ForceGlyph';
import ArrowIcon from '../components/ArrowIcon';

export default function TopicRail({ forces, currentId, onOpen }) {
  const items = forces.filter((force) => force.id !== currentId);
  const loop = [...items, ...items];
  return (
    <section className="topic-rail" aria-labelledby="topic-rail-title">
      <div className="topic-rail-head">
        <h2 id="topic-rail-title">Explore another force</h2>
        <p>The future becomes clearer when the topics are read together.</p>
      </div>
      <div className="topic-rail-window">
        <div className="topic-rail-track">
          {loop.map((force, index) => (
            <button key={`${force.id}-${index}`} className="topic-rail-item" style={{ '--accent': force.color }} onClick={() => onOpen(force)}>
              <span className="tri-icon"><ForceGlyph id={force.id} /></span>
              <span className="tri-copy"><b>{force.name}</b><em>{force.live ? 'Explore now' : 'Coming soon'}</em></span>
              <ArrowIcon />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
