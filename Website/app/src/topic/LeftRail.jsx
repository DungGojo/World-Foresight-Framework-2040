import { useScrollSpy } from '../hooks/useScrollSpy';

// Sticky scroll-spy rail (build spec §7.1).
export default function LeftRail({ topic, accent, onNav, onBack, onReplay }) {
  const ids = ['overview', ...topic.level2.map((a) => `arg-${a.n}`), 'data'];
  const active = useScrollSpy(ids);

  const Item = ({ id, num, label, nested }) => (
    <button
      className={'lr-item' + (nested ? ' nested' : '') + (active === id ? ' active' : '')}
      style={active === id ? { '--accent': accent } : undefined}
      aria-current={active === id ? 'true' : undefined}
      onClick={() => onNav(id)}
    >
      <span className="lr-num">{num}</span>
      <span className="lr-label">{label}</span>
    </button>
  );

  return (
    <nav className="left-rail" aria-label="On this page">
      <button className="lr-back" onClick={onBack}>◀ The five forces</button>
      <div className="lr-brand">{topic.name}</div>
      <div className="lr-nav">
        <Item id="overview" num="01" label="Overview" />
        <div className="lr-group-label">02 · The arguments</div>
        {topic.level2.map((a) => (
          <Item key={a.n} id={`arg-${a.n}`} num={`2.${a.n}`} label={shortTitle(a.title)} nested />
        ))}
        <Item id="data" num="03" label="Explore the data" />
      </div>
      <button className="lr-replay" onClick={onReplay}>↺ Replay the story</button>
    </nav>
  );
}

// first clause of the argument title, for the compact rail
function shortTitle(t) {
  const cut = t.split(/[:—]/)[0].trim();
  return cut.length > 34 ? cut.slice(0, 32) + '…' : cut;
}
