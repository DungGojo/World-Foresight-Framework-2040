import { useMemo, useState } from 'react';
import { scaleLinear, scaleLog } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import CountryPicker from './CountryPicker';
import './chart.css';

// Per-row 2025 → 2040 movement. Used for People's maternal mortality (log axis,
// because the best and worst performers are two orders of magnitude apart),
// Technology's mean-vs-worst connectivity gaps, and Power's consensus ranking.
// `fig.neutral` turns off the good/bad colouring for series where moving down
// is not an improvement; `fig.highlight` accents named rows.
export default function Dumbbell({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  // `fig.pick` turns the chart into a chooser: the full row set stays in the
  // left-hand list and only the selected rows are drawn.
  const [picked, setPicked] = useState(() => fig?.defaults || []);
  const allRows = fig?.rows || [];
  const selected = useMemo(
    () => (fig?.pick ? picked.filter((k) => allRows.some((r) => r.key === k)) : []),
    [picked, allRows, fig]);

  if (!fig || !allRows.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const cap = fig.maxSelected || 8;
  const toggle = (mk) => setPicked((p) => (
    p.includes(mk) ? p.filter((x) => x !== mk) : p.length >= cap ? p : [...p, mk]));
  const rows = fig.pick ? allRows.filter((r) => selected.includes(r.key)) : allRows;
  if (!rows.length) {
    return (
      <div className="chart" ref={ref}>
        <div className="radar-layout">
          <CountryPicker countries={allRows.map((r) => ({ market: r.key, name: r.label }))}
                         selected={selected} cap={cap} onToggle={toggle}
                         colorOf={() => accent} />
          <div className="chart-empty">Pick a country to plot its change.</div>
        </div>
      </div>
    );
  }
  const highlight = new Set(fig.highlight || []);
  // 'delta' prints the move rather than the endpoint, for series where the
  // interesting number is how far a row travelled, not where it landed.
  const delta = fig.valueMode === 'delta';
  const fromColor = palette.navy;
  const suffix = fig.valueSuffix || '';
  const rowH = rows.length > 20 ? 16 : 26;
  // Gutter sized to the longest label — a fixed width clipped
  // "Internet-use gender gap — mean" to "et-use gender gap — mean".
  const longestLabel = Math.max(...rows.map((r) => String(r.label).length));
  const cw = Math.max(width, 300);
  // …but it must never eat the plot: at 320px the longest Technology label
  // wanted a 293px gutter, leaving a negative inner width and rects the browser
  // refused to draw. Cap it at 45% of the chart.
  const m = { top: 26, right: 62, bottom: 30,
              left: Math.min(Math.max(120, longestLabel * 6.3 + 18), 300, cw * 0.45) };
  const H = m.top + m.bottom + rows.length * rowH;
  const w = cw, iw = Math.max(w - m.left - m.right, 40);

  // Some damped series floor at (or below) zero — Russia's maternal mortality
  // forecasts to 0.0, which a log axis cannot plot. Clamp to the smallest
  // positive value on the chart and mark those rows rather than dropping them.
  const positives = rows.flatMap((r) => [r.from, r.to]).filter((v) => v > 0);
  const all = rows.flatMap((r) => [r.from, r.to]);
  const floor = positives.length ? Math.min(...positives) : 1;
  const top = Math.max(...all, floor * 2);
  const clamp = (v) => (fig.log ? Math.max(v, floor) : v);
  const isFloored = (r) => fig.log && (r.from < floor || r.to < floor);

  // Index-style scores (soft power) live in a narrow high band, so a
  // zero-based axis crushes every dumbbell into one blob. `fig.domain` lets a
  // figure open the axis on its own data instead.
  // A picker changes which rows are on screen, so the axis is fitted to the
  // visible ones — a domain spanning all 33 countries squeezes any selection
  // into a sliver.
  const visible = rows.flatMap((r) => [r.from, r.to]);
  const fitted = [
    Math.floor((Math.min(...visible) - 3) / 5) * 5,
    Math.ceil((Math.max(...visible) + 3) / 5) * 5,
  ];
  const x = fig.log
    ? scaleLog().domain([floor, top]).range([m.left, m.left + iw])
    : scaleLinear().domain(fig.pick ? fitted : fig.domain || [0, top * 1.05]).nice()
        .range([m.left, m.left + iw]);

  const chart = (
    <>
      {fig.title && <p className="chart-title">{fig.title}</p>}
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.title || fig.unit || 'Change by row'}>
        <text className="annot" x={m.left} y={m.top - 10}>
          <tspan fill={fromColor}>● {fig.fromLabel || 'from'}</tspan>
          {fig.toneLegend
            ? fig.toneLegend.map((t) => (
                <tspan key={t.label} fill={palette[t.color] || t.color} dx="12">● {t.label}</tspan>
              ))
            : <tspan fill={accent} dx="12">● {fig.toLabel || 'to'}</tspan>}
        </text>
        {rows.map((r, i) => {
          const yy = m.top + i * rowH + rowH / 2;
          const improved = r.to < r.from;
          const flagged = highlight.has(r.key ?? r.label);
          // `r.tone` overrides the default reading of the move. On most figures
          // falling is the improvement; where rising is (Economy's effective
          // number of trade blocs) the spec names the tone on every row.
          const c = flagged || fig.neutral ? accent
            : r.tone === 'good' ? palette.planet
            : r.tone === 'bad' ? palette.power
            : improved ? palette.planet : palette.power;
          const floored = isFloored(r);
          return (
            <g key={r.label}>
              <text className="bar-label" x={m.left - 10} y={yy} dy="0.32em" textAnchor="end"
                    fill={flagged ? accent : palette.ink}
                    fontWeight={flagged ? 700 : undefined}>{r.label}</text>
              <line x1={x(clamp(r.from))} x2={x(clamp(r.to))} y1={yy} y2={yy} stroke={c}
                    strokeWidth={2} opacity={0.42} strokeDasharray={floored ? '3 3' : undefined} />
              {/* when both years land on the same value the later dot hides the
                  earlier one, which reads as missing data — ring it instead */}
              {Math.abs(x(clamp(r.to)) - x(clamp(r.from))) < 3 ? (
                <circle cx={x(clamp(r.from))} cy={yy} r={6.5} fill="none"
                        stroke={fromColor} strokeWidth={1.5} />
              ) : (
                <circle cx={x(clamp(r.from))} cy={yy} r={4} fill={fromColor} opacity={0.85} />
              )}
              <circle cx={x(clamp(r.to))} cy={yy} r={4.5} fill={c}
                      opacity={floored ? 0.45 : 1} />
              {/* the move reads as a gain or a loss, so it is coloured by sign
                  rather than by the row's series colour */}
              <text className="bar-value" x={m.left + iw + 8} y={yy} dy="0.32em"
                    opacity={floored ? 0.6 : 1}
                    fill={delta
                      ? (r.to - r.from >= 0 ? palette.planet : palette.power)
                      : c}>
                {delta ? `${r.to - r.from > 0 ? '+' : r.to - r.from < 0 ? '−' : '±'}${Math.abs(Math.round((r.to - r.from) * 10) / 10)}${suffix}`
                       : `${r.to}${suffix}`}{floored ? '*' : ''}
              </text>
            </g>
          );
        })}
        <g className="axis">
          {x.ticks(5, '~s').map((t) => (
            <text key={t} x={x(t)} y={H - m.bottom + 16} textAnchor="middle">{t}</text>
          ))}
          <line x1={m.left} x2={m.left + iw} y1={H - m.bottom + 2} y2={H - m.bottom + 2} />
        </g>
      </svg>
      <div className="chart-legend">
        {fig.unit && (!fig.valueSuffix || fig.showUnit) && <span className="lk">{fig.unit}</span>}
        {fig.log && <span className="lk">logarithmic scale</span>}
      </div>
    </>
  );

  return (
    <div className="chart" ref={ref}>
      {fig.pick ? (
        <div className="radar-layout">
          <CountryPicker countries={allRows.map((r) => ({ market: r.key, name: r.label }))}
                         selected={selected} cap={cap} onToggle={toggle}
                         colorOf={() => accent} />
          <div className="dumbbell-panel">{chart}</div>
        </div>
      ) : chart}
      {rows.some(isFloored) && (
        <p className="chart-note coverage">
          * {rows.filter(isFloored).map((r) => r.label).join(', ')} forecast at or below the
          bottom of the scale. These are damped-model floors rather than credible values.
          The series is already near zero and the model cannot go below it.
        </p>
      )}
      {fig.note && (
        <p className={`chart-note${fig.noteWide ? ' wide' : ''}`}>{fig.note}</p>
      )}
    </div>
  );
}
