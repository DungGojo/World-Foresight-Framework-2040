import { useMemo, useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { flagSrc } from '../lib/flags';
import { palette } from '../theme';
import CountryPicker from './CountryPicker';
import './chart.css';

// Pick countries, then read 2025 against 2040 as a pair of columns each, with
// the direction of travel called out. Built for per-capita measures where the
// levels differ by an order of magnitude between countries, so a shared ranked
// bar buries everyone below the top few.
export default function PairedBars({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  const [picked, setPicked] = useState(() => fig?.defaults || []);

  const countries = fig?.countries || [];
  const byMarket = useMemo(
    () => Object.fromEntries(countries.map((c) => [c.market, c])), [countries]);
  const selected = useMemo(
    () => picked.filter((mk) => byMarket[mk]), [picked, byMarket]);

  if (!countries.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const cap = fig.maxSelected || 8;
  const toggle = (mk) => setPicked((p) => (
    p.includes(mk) ? p.filter((x) => x !== mk) : p.length >= cap ? p : [...p, mk]));

  const rows = selected.map((mk) => byMarket[mk]);
  const years = fig.years || [2025, 2040];
  const suffix = fig.valueSuffix || '';

  // The change-in-travel row sits above the plot and the tallest bar's own value
  // sits just under it, so the gap between them has to be cut from the plot
  // height rather than assumed — at top:74 they were 10px apart.
  const H = 360, m = { top: 96, right: 12, bottom: 58, left: 42 };
  const w = Math.max((width || 720) - 220, 300);
  const iw = w - m.left - m.right, ih = H - m.top - m.bottom;
  // Round the top of the scale to a readable number — the raw maximum gives
  // ticks like 48 and 96 where 50 and 100 are what a reader expects.
  const peak = Math.max(...rows.flatMap((r) => r.values), 0.1);
  const niceCeil = (v) => {
    const mag = 10 ** Math.floor(Math.log10(v));
    const step = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10].find((f) => f * mag >= v) ?? 10;
    return step * mag;
  };
  const maxV = fig.domainMax ?? niceCeil(peak * 1.04);
  // Some measures have a floor that is not zero — an effective number of trade
  // blocs cannot go below 1 — and a zero-based axis buries the whole range in
  // the top few percent of the bar.
  const minV = fig.domainMin ?? 0;
  const y = (v) => m.top + ih - ((v - minV) / (maxV - minV)) * ih;

  const slot = rows.length ? iw / rows.length : iw;
  const barW = Math.min(slot * 0.3, 44);
  const cx = (i) => m.left + slot * (i + 0.5);

  return (
    <div className="chart" ref={ref}>
      <div className="radar-layout">
        <CountryPicker countries={countries} selected={selected} cap={cap} onToggle={toggle}
                       colorOf={() => accent} />
        <div className="paired-panel">
          {rows.length === 0 ? (
            <div className="chart-empty">Pick a country to compare.</div>
          ) : (
            <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.title || 'Comparison'}>
              {fig.title && <text x={0} y={15} className="chart-svg-title">{fig.title}</text>}
              {fig.refLine != null && (
                <g>
                  <line x1={m.left} x2={m.left + iw} y1={y(fig.refLine)} y2={y(fig.refLine)}
                        stroke={palette.ink} strokeDasharray="4 4" opacity={0.5} />
                  <text x={m.left + iw} y={y(fig.refLine) - 6} textAnchor="end"
                        className="annot">{fig.refLabel}</text>
                </g>
              )}
              <g className="grid">
                {[0, 0.5, 1].map((f) => (
                  <line key={f} x1={m.left} x2={m.left + iw}
                        y1={y(minV + (maxV - minV) * f)} y2={y(minV + (maxV - minV) * f)} />
                ))}
              </g>

              {rows.map((r, i) => {
                const [a, b] = r.values;
                const pct = a ? ((b - a) / a) * 100 : 0;
                const up = b > a;
                const flat = Math.abs(pct) < 0.5;
                // sign colouring, as everywhere else on the site
                const dc = flat ? palette.muted : up ? palette.planet : palette.power;
                const src = flagSrc(r.market);
                return (
                  <g key={r.market}>
                    {r.values.map((v, yi) => {
                      const bx = cx(i) - barW - 3 + yi * (barW + 6);
                      return (
                        <g key={years[yi]}>
                          <rect x={bx} y={y(v)} width={barW} height={Math.max(m.top + ih - y(v), 0)}
                                fill={accent} opacity={yi === 0 ? 0.38 : 0.92} />
                          <text x={bx + barW / 2} y={y(v) - 6} textAnchor="middle"
                                className="bar-value" fill={palette.ink}>{v}{suffix}</text>
                          <text x={bx + barW / 2} y={m.top + ih + 14} textAnchor="middle"
                                className="axis-year">{years[yi]}</text>
                        </g>
                      );
                    })}
                    {/* direction of travel between the two years */}
                    <text x={cx(i)} y={m.top - 30} textAnchor="middle" className="paired-delta"
                          fill={dc}>
                      {flat ? '±' : up ? '▲' : '▼'} {flat ? '' : pct > 0 ? '+' : '−'}
                      {Math.abs(pct).toFixed(1)}%
                    </text>
                    {src && <image href={src} x={cx(i) - 11} y={m.top + ih + 22}
                                   width={22} height={22} />}
                  </g>
                );
              })}

              <g className="axis">
                <line x1={m.left} x2={m.left} y1={m.top - 4} y2={m.top + ih} />
                <line x1={m.left} x2={m.left + iw} y1={m.top + ih} y2={m.top + ih} />
                {[0, 0.5, 1].map((f) => {
                  const t = minV + (maxV - minV) * f;
                  return (
                    <text key={f} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
                      {Math.round(t * 100) / 100}{suffix}
                    </text>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
