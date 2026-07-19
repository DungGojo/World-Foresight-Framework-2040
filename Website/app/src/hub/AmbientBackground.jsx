import { useEffect, useState } from 'react';
import { asset } from '../lib/assets';
import { accentGradient } from '../theme';
import { useAmbientCycle } from '../hooks/useAmbientCycle';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Ambient force imagery behind the hub (build spec §6.1): cross-fades + cycles,
// changes on hover/select, idles across forces, falls back to accent gradient.
export default function AmbientBackground({ forces, focus }) {
  const reduce = useReducedMotion();
  const { forceId, index } = useAmbientCycle(forces, focus, { hold: 6000, reduced: reduce });
  const [ok, setOk] = useState({}); // "id:idx" -> loaded?

  useEffect(() => {
    forces.forEach((f) =>
      (f.ambient || []).forEach((src, idx) => {
        const im = new Image();
        im.onload = () => setOk((o) => ({ ...o, [`${f.id}:${idx}`]: true }));
        im.src = asset(src);
      })
    );
  }, []); // eslint-disable-line

  const force = forces.find((f) => f.id === forceId) || forces[0];
  const src = force?.ambient?.[index];
  const loaded = src && ok[`${force.id}:${index}`];

  return (
    <div className="hub-ambient" aria-hidden="true">
      {/* accent-gradient base always present (the guaranteed fallback) */}
      <div className="hub-ambient-grad" style={{ background: accentGradient(force?.color || '#888') }} />
      {loaded && (
        <img key={`${force.id}:${index}`} src={asset(src)} alt="" className={'hub-ambient-img' + (reduce ? ' noanim' : '')} />
      )}
      <div className="hub-ambient-scrim" />
    </div>
  );
}
