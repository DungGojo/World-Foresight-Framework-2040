import { useLaunch } from '../hooks/useLaunch';
import './LaunchOverlay.css';

// The rings-and-core handoff curtain, shared by both cinematic entrances
// (story -> framework, forces -> topic). Rendered once, above <Routes>, so it
// outlives the route swap that happens underneath it — see useLaunch.jsx for
// the beat-by-beat timing.
export default function LaunchOverlay() {
  const { destination, phase } = useLaunch();
  if (!destination) return null;
  const { accent, kicker, title, titleSize } = destination;
  return (
    <div
      className={`launch-handoff${phase === 'reveal' ? ' reveal' : ''}`}
      style={{ '--accent': accent, '--launch-title': titleSize || '26px' }}
      aria-hidden="true"
    >
      <i /><i /><i />
      <div><span>{kicker}</span><b>{title}</b></div>
    </div>
  );
}
