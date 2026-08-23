import { useMemo, useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import CountryPicker from './CountryPicker';
import './chart.css';

// Arg 3 — "two tracks". For each chosen country, one marker for how it votes at
// the UN and one for where its trade goes, on a single US↔China axis. When the
// two markers straddle the centre the country is voting with one giant and
// earning from the other, and the connector between them is drawn in accent.
const ROW = 30, LABEL = 118;

function Panel({ title, rows, poles, trackLabels, width }) {
  const m = { top: 34, right: 42, bottom: 8, left: LABEL };
  const w = Math.max(width, 260);
  const iw = w - m.left - m.right;
  const H = m.top + rows.length * ROW + m.bottom;
  const x = (t) => m.left + iw * (1 - (t + 1) / 2); // +1 (US) left .. -1 (China) right
  const mid = x(0);

  return (
    <figure className="track-panel">
      <figcaption>{title}</figcaption>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={`Vote and trade lean, ${title}`}>
        <text x={m.left} y={14} className="track-pole" fill={palette.power}>← {poles.west}</text>
        <text x={m.left + iw} y={14} textAnchor="end" className="track-pole" fill={palette.navy}>
          {poles.east} →
        </text>
        <line x1={mid} x2={mid} y1={22} y2={H - m.bottom} stroke={palette.ink}
              strokeDasharray="3 4" opacity={0.4} />

        {rows.map((r, i) => {
          const cy = m.top + i * ROW + ROW / 2;
          const vx = x(r.votes), tx = x(r.trade);
          const col = r.split ? (r.votes > 0 ? palette.power : palette.navy) : palette.muted;
          return (
            <g key={r.market}>
              <line x1={m.left} x2={m.left + iw} y1={cy} y2={cy} stroke={palette.line} opacity={0.7} />
              <line x1={vx} x2={tx} y1={cy} y2={cy} stroke={col}
                    strokeWidth={r.split ? 3 : 2} opacity={r.split ? 0.9 : 0.35} />
              <circle cx={vx} cy={cy} r={5.5} fill={palette.paper || '#fffdf8'} stroke={col} strokeWidth={2} />
              <circle cx={tx} cy={cy} r={5.5} fill={col} opacity={r.split ? 1 : 0.55} />
              <text x={m.left - 8} y={cy} dy="0.32em" textAnchor="end" className="track-name"
                    fill={r.split ? palette.ink : palette.muted}>{r.name}</text>
              {r.split && (
                <text x={m.left + iw + 7} y={cy} dy="0.32em" className="track-tag" fill={col}>
                  split
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="track-key">
        <span><i className="ring" />{trackLabels.votes}</span>
        <span><i className="dot" />{trackLabels.trade}</span>
      </div>
    </figure>
  );
}

export default function SplitTracks({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const [picked, setPicked] = useState(() => fig?.defaults || []);

  const countries = fig?.countries || [];
  const years = fig?.years || [];
  const byMarket = useMemo(
    () => Object.fromEntries(countries.map((c) => [c.market, c])), [countries]);
  const selected = useMemo(
    () => picked.filter((mk) => byMarket[mk]), [picked, byMarket]);

  if (!countries.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const cap = fig.maxSelected || 10;
  const toggle = (mk) => setPicked((p) => (
    p.includes(mk) ? p.filter((x) => x !== mk) : p.length >= cap ? p : [...p, mk]));

  // The figure is already ordered on the 2040 vote lean; filtering preserves
  // that order, so a country sits on the same line in both year panels.
  const rowsFor = (year) => countries
    .filter((c) => selected.includes(c.market))
    .map((c) => ({
      market: c.market, name: c.name,
      votes: c.votes[String(year)], trade: c.trade[String(year)],
      split: c.split[String(year)],
    }))
    .filter((r) => r.votes != null && r.trade != null);

  const panelW = Math.min(Math.max((width - 220) / 2 - 12, 250), 430);
  const counts = fig.splitCount || [];
  const lastYear = String(years[years.length - 1]);

  return (
    <div className="chart" ref={ref}>
      <div className="split-head">
        <b>{counts[counts.length - 1]}</b>
        <span>of {fig.total} countries vote with one giant and earn from the other
          <em> up from {counts[0]} in {years[0]}</em>
        </span>
      </div>

      <div className="radar-layout">
        <CountryPicker countries={countries} selected={selected} cap={cap} onToggle={toggle}
                       colorOf={(mk) => (byMarket[mk].split[lastYear]
                         ? palette.power : palette.muted)} />
        <div className="track-grid">
          {selected.length === 0
            ? <div className="chart-empty">Pick a country to see its two tracks.</div>
            : years.map((yr) => (
                <Panel key={yr} title={String(yr)} rows={rowsFor(yr)} poles={fig.poles}
                       trackLabels={fig.trackLabels} width={panelW} />
              ))}
        </div>
      </div>
    </div>
  );
}
