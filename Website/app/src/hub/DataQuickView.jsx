import { useEffect } from 'react';
import Level3Explorer from '../topic/Level3Explorer';

// Level-3 quick-view slide-over launched from the sidebar (build spec §6.5).
export default function DataQuickView({ open, onClose, onOpenFull }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={'qv-root' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="qv-scrim" onClick={onClose} />
      <div className="qv-panel" role="dialog" aria-label="Explore the data">
        <div className="qv-head">
          <div>
            <div className="qv-kicker">Explore the data</div>
            <div className="qv-sub">Power · quick view</div>
          </div>
          <button className="qv-close" onClick={onClose}>Close ✕</button>
        </div>
        {open && (
          <Level3Explorer
            mode="compact"
            initialProxy="D1"
            initialMarkets={['USA', 'CHN']}
            onOpenFull={onOpenFull}
          />
        )}
      </div>
    </div>
  );
}
