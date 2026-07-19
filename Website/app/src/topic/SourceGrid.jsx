import ArrowIcon from '../components/ArrowIcon';

export default function SourceGrid({ sources = [] }) {
  if (!sources.length) return null;
  return (
    <section className="source-section" aria-label="Sources">
      <header><h4>Sources</h4></header>
      <div className="source-grid">
        {sources.map((source) => (
          <a key={source.url} className="source-card" href={source.url} target="_blank" rel="noreferrer">
            <span className="source-publisher">{source.publisher}</span>
            <strong>{source.title}</strong>
            <footer><time>{source.date}</time><ArrowIcon /></footer>
          </a>
        ))}
      </div>
    </section>
  );
}
