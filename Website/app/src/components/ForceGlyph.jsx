const paths = {
  power: <><path d="M13.5 2.8 5.8 13h5l-1 8.2L18.2 10h-5z" /></>,
  tech: <><circle cx="12" cy="12" r="3.4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.2 2.2M16.5 16.5l2.2 2.2M18.7 5.3l-2.2 2.2M7.5 16.5l-2.2 2.2"/></>,
  planet: <><path d="M19.5 4.5C12 5 6.4 9.1 5.1 16.6c4.8 1.2 10.8-.8 14.4-12.1Z"/><path d="M5 20c2.8-5 6.1-7.8 10.1-10.2"/></>,
  people: <><circle cx="8" cy="8" r="2.7"/><circle cx="16.5" cy="8.8" r="2.3"/><path d="M3.5 20c.2-4 1.9-6.4 4.6-6.4s4.5 2.4 4.6 6.4M13 14.7c1-.9 2.1-1.3 3.4-1.3 2.5 0 4 2.3 4.1 6.1"/></>,
  economy: <><path d="M4 20V9M9.3 20V13M14.7 20V6M20 20V3"/><path d="M2.5 20.5h19"/></>,
};

export default function ForceGlyph({ id, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {paths[id] || paths.power}
    </svg>
  );
}
