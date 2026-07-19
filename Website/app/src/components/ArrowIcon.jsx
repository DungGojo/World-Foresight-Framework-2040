export default function ArrowIcon({ direction = 'right', className = '' }) {
  const rotate = direction === 'left' ? 'rotate(180 12 12)' : undefined;
  return (
    <svg className={`arrow-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <g transform={rotate}>
        <path d="M4 12h15" />
        <path d="m14 6 6 6-6 6" />
      </g>
    </svg>
  );
}
