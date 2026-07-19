import { insightsBar, comboTitle } from '../content/site';
import { palette as theme } from '../theme';

// Shared slide-up Insights bar (build spec §6.4).
export default function InsightsBar({ insight, onClose, onOpenTopic }) {
  const up = !!insight;
  let pip = theme.navy, tag = '', title = '', teaser = '', pill = '', accent = theme.navy;
  let action = null;

  if (insight?.type === 'single') {
    const f = insight.force;
    pip = f.color; accent = f.color;
    tag = insightsBar.singleTag;
    title = f.name;
    teaser = f.teaser;
    if (f.live) { pill = 'Open the Power deep-dive ▸'; action = () => onOpenTopic(f); }
    else pill = insightsBar.singleSoon;
  } else if (insight?.type === 'combo') {
    pip = theme.navy; accent = theme.navy;
    tag = `${insight.a.name} × ${insight.b.name}`;
    title = `“${comboTitle(insight.a.id, insight.b.id) || 'A combined force'}”`;
    teaser = insightsBar.comboTeaser;
    pill = insightsBar.comboSoon;
  }

  return (
    <aside className={'hub-insights' + (up ? ' up' : '')} aria-live="polite">
      <div className="hi-inner">
        <div className="hi-label"><span className="hi-pip" style={{ background: pip }} />{insightsBar.label}</div>
        <div className="hi-body">
          <div className="hi-tag" style={{ color: accent }}>{tag}</div>
          <div className="hi-title">{title}</div>
          <div className="hi-teaser">{teaser}</div>
          {action ? (
            <button className="hi-pill-btn" style={{ borderColor: accent, color: accent }} onClick={action}>{pill}</button>
          ) : (
            <span className="pill">{pill}</span>
          )}
        </div>
        <button className="hi-close" onClick={onClose}>{insightsBar.closeLabel}</button>
      </div>
    </aside>
  );
}
