import { asset } from '../lib/assets';

// A small rotating Earth for the centre of the systems map.
//
// Deliberately not the intro's Three.js globe: that ships ~517KB of library for
// a decorative 200px sphere on a page people land on often. Here the Blue Marble
// texture scrolls inside a circle with sphere shading and a terminator over it,
// which at this size is very hard to tell apart and costs one 86KB image.
//
// `rings` are the accent colours of the currently connected forces — each one
// adds a halo and a pulse leaving the globe.
export default function CentreGlobe({ rings = [], label = 'WORLD', value = '2040' }) {
  return (
    <div className={`centre-globe${rings.length ? ' connected' : ''}`}>
      {/* Halo layers, one per connected force, so two forces read as two rings */}
      {rings.map((color, i) => (
        <span key={`${color}-${i}`} className="globe-halo"
              style={{ '--halo': color, '--halo-i': i }} />
      ))}
      {rings.map((color, i) => (
        <span key={`pulse-${color}-${i}`} className="globe-pulse"
              style={{ '--halo': color, '--halo-i': i }} />
      ))}

      <div className="globe-body">
        <div className="globe-tex" style={{ backgroundImage: `url(${asset('assets/earth/earth_day_small.jpg')})` }} />
        {/* sphere falloff + day/night terminator, so the flat texture reads round */}
        <div className="globe-shade" />
        <div className="globe-scrim" />
      </div>

      <div className="globe-label">
        <span>{label}</span>
        <b>{value}</b>
      </div>
    </div>
  );
}
