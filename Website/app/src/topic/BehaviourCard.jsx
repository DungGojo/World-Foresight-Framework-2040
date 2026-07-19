export default function BehaviourCard({ b, accent }) {
  return (
    <div className="behaviour-card" style={{ borderLeftColor: accent }}>
      <h4>{b.title}</h4>
      <p className="bc-line"><span className="bc-lbl">Why</span> {b.why}</p>
      <p className="bc-line"><span className="bc-lbl">Evidence</span> {b.evidence}</p>
    </div>
  );
}
