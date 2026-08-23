import { flagSrc } from '../lib/flags';
import './chart.css';

// Shared left-hand country filter for the two interactive Power figures.
// `colorOf(market)` returns the swatch colour for a selected market, or null.
export default function CountryPicker({ countries, selected, cap, onToggle, colorOf }) {
  const full = selected.length >= cap;
  return (
    <div className="radar-picker">
      <div className="radar-picker-head">
        <span>Countries</span>
        <b>{selected.length}/{cap}</b>
      </div>
      <ul>
        {countries.map((c) => {
          const on = selected.includes(c.market);
          const locked = !on && full;
          const src = flagSrc(c.market);
          return (
            <li key={c.market}>
              <label className={`${on ? 'on' : ''}${locked ? ' full' : ''}`}>
                <input type="checkbox" checked={on} disabled={locked}
                       onChange={() => onToggle(c.market)} />
                <i style={{ background: on ? colorOf(c.market) : 'transparent' }} />
                {src && <img src={src} alt="" aria-hidden="true" />}
                <span>{c.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {full && <p className="radar-picker-hint">Deselect one to add another.</p>}
    </div>
  );
}
