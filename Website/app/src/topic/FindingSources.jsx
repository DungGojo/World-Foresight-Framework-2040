// Sources for one finding. The section label is intentionally static while
// every document card links directly to its original source.
export default function FindingSources({ sources = [] }) {
  if (!sources.length) return null;

  return (
    <div className="finding-sources">
      <div className="finding-sources-label">
        Supported Documents
      </div>
      <ul>
        {sources.map((s) => (
          <li key={`${s.url}-${s.title}`}>
            <a className="finding-source-card" href={s.url} target="_blank" rel="noreferrer">
              <span className="fs-pub">{s.publisher}</span>
              <span className="fs-title">{s.title}</span>
              <span className="fs-date">{s.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
