import { useMemo, useState } from 'react';
import { scaleLinear, line as d3line, area as d3area } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette } from '../theme';
import CountryPicker from './CountryPicker';
import './chart.css';

const SERIES_COLORS = [palette.power, palette.navy, palette.planet, palette.people, palette.economy];
// a figure may name a palette token instead of hardcoding a hex
const named = (c) => palette[c] || c;

function formatValue(value) {
  return Number.isInteger(value) ? value : Number(value.toFixed(1));
}

// Generic line chart with optional ±1sd band, forecast boundary, inverted axis
// and a "model is blind after here" wash. Carries the effective-number-of-powers
// line, the consensus drift, assembly-freedom decline, polarisation small
// multiples, labour share, Red List, mineral dependence, EV-vs-everything-else
// and the openness/tariff panels.
export default function TrendLine({ fig, accent = palette.power }) {
  const [ref, { width }] = useResizeObserver();
  // `fig.pick` turns the line set into a chooser: every series stays in the
  // left-hand list and only the selected ones are drawn.
  const [picked, setPicked] = useState(() => fig?.defaults || []);
  const all = fig?.series || fig?.panels || [];
  const selected = useMemo(
    () => (fig?.pick ? picked.filter((k) => all.some((sr) => sr.key === k)) : []),
    [picked, all, fig]);

  if (!fig || !all.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }
  const cap = fig.maxSelected || 6;
  const toggle = (k) => setPicked((p) => (
    p.includes(k) ? p.filter((x) => x !== k) : p.length >= cap ? p : [...p, k]));
  const series = fig.pick ? all.filter((sr) => selected.includes(sr.key)) : all;
  if (!series.length) {
    return (
      <div className="chart" ref={ref}>
        <div className="radar-layout">
          <CountryPicker countries={all.map((sr) => ({ market: sr.key, name: sr.label }))}
                         selected={selected} cap={cap} onToggle={toggle} colorOf={() => accent} />
          <div className="chart-empty">Pick a country to plot its line.</div>
        </div>
      </div>
    );
  }
  const H = 300, m = { top: 22, right: 118, bottom: 34, left: 52 };
  const w = Math.max(fig.pick ? width - 220 : width, 280),
    iw = w - m.left - m.right, ih = H - m.top - m.bottom;

  const pts = series.flatMap((s) => s.values);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const bandYs = (fig.band || []).flatMap((b) => [b[1], b[2]]);
  const x = scaleLinear().domain([Math.min(...xs), Math.max(...xs)]).range([m.left, m.left + iw]);
  const yDomain = [Math.min(...ys, ...bandYs), Math.max(...ys, ...bandYs)];
  // `fig.domain` frames a series against a meaningful range. Auto-scaling a
  // measure that "barely moves" zooms into the noise and draws a steep line.
  const dom = fig.domain || yDomain;
  const y = scaleLinear()
    .domain(fig.invertY ? [dom[1], dom[0]] : dom).nice()
    .range([m.top + ih, m.top]);

  const g = d3line().x((d) => x(d[0])).y((d) => y(d[1]));
  const bandPath = d3area().x((d) => x(d[0])).y0((d) => y(d[1])).y1((d) => y(d[2]));

  const chart = (
    <>
      {fig.title && <p className="chart-title">{fig.title}</p>}
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={fig.title || fig.yLabel || 'Trend'}>
        <g className="grid">
          {y.ticks(5).map((t) => (
            <line key={t} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
          ))}
        </g>

        {/* region the damped model cannot see through */}
        {fig.blindFrom && (
          <g>
            <rect x={x(fig.blindFrom)} y={m.top} width={m.left + iw - x(fig.blindFrom)} height={ih}
                  fill={palette.muted} opacity={0.07} />
            <text className="annot" x={x(fig.blindFrom) + 6} y={m.top + 14} fill={palette.muted}>
              {fig.blindLabel}
            </text>
          </g>
        )}

        {fig.band && <path d={bandPath(fig.band)} fill={accent} opacity={0.12} />}

        {series.map((s, i) => {
          const c = named(s.color) || (s.highlight ? accent : SERIES_COLORS[i % SERIES_COLORS.length]);
          const last = s.values[s.values.length - 1];
          return (
            <g key={s.key}>
              <path d={g(s.values)} fill="none" stroke={c}
                    strokeWidth={s.highlight ? 2.8 : 2} opacity={s.highlight === false ? 0.45 : 1} />
              {!fig.anchors && (
                <>
                  <circle cx={x(last[0])} cy={y(last[1])} r={3.5} fill={c} />
                  <text className="end-label" x={x(last[0]) + 7} y={y(last[1])} dy="0.32em" fill={c}>
                    {last[1]}{fig.valueSuffix || ''}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* values at the named anchor years, so a flat line states its level
            rather than only its endpoint. With more than one series the labels
            are pushed to opposite sides of their own point so two lines at
            different levels do not print on top of each other. */}
        {fig.anchors && series.flatMap((s2, si) => {
          const c = named(s2.color) || (s2.highlight ? accent : SERIES_COLORS[si % SERIES_COLORS.length]);
          return fig.anchors.map((yr) => {
            const pt = s2.values.find((v) => v[0] === yr);
            if (!pt) return null;
            const py = y(pt[1]);
            // above the point unless that would leave the plot; alternate for
            // multi-series so a crossing pair keeps its labels apart
            const below = series.length > 1 && si % 2 === 1
              ? py < m.top + ih - 20
              : py - 10 < m.top + 8;
            const first = yr === fig.anchors[0];
            const last = yr === fig.anchors[fig.anchors.length - 1];
            return (
              <g key={`a${s2.key}${yr}`}>
                <circle cx={x(pt[0])} cy={py} r={3.5} fill={c} opacity={0.85} />
                <text className="panel-value" x={x(pt[0]) + (first ? 7 : last ? -7 : 0)}
                      y={below ? py + 15 : py - 10}
                      textAnchor={first ? 'start' : last ? 'end' : 'middle'}
                      fill={c}>{pt[1]}{fig.valueSuffix || ''}</text>
              </g>
            );
          });
        })}

        <g className="axis">
          {y.ticks(5).map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}</text>
          ))}
          {(fig.anchors || x.ticks(Math.min(6, new Set(xs).size))).map((t) => (
            <text key={t} x={x(t)} y={m.top + ih + 18} textAnchor="middle">{t}</text>
          ))}
          <line x1={m.left} x2={m.left + iw} y1={m.top + ih} y2={m.top + ih} />
          {fig.yLabel && (
            <text className="axis-title" transform={`rotate(-90 12 ${m.top + ih / 2})`}
                  x={12} y={m.top + ih / 2} textAnchor="middle">{fig.yLabel}</text>
          )}
        </g>
      </svg>

      {fig.spread?.length > 1 && (() => {
        const main = series[0].values;
        const mainStart = main[0][1];
        const mainEnd = main[main.length - 1][1];
        const spreadStart = fig.spread[0][1];
        const spreadEnd = fig.spread[fig.spread.length - 1][1];
        const spreadChange = spreadEnd - spreadStart;
        return (
          <div className="trend-proof-strip">
            <div>
              <span>World average</span>
              <strong>{formatValue(mainStart)} <i>→</i> {formatValue(mainEnd)}</strong>
              {fig.unit && <em>{fig.unit}</em>}
            </div>
            <div className="trend-spread-proof">
              <span>Gap between countries</span>
              <strong style={{ color: spreadChange >= 0 ? palette.power : palette.planet }}>
                {Math.abs(formatValue(spreadChange))}% {spreadChange >= 0 ? 'wider' : 'narrower'}
              </strong>
              <em>2025 to 2040</em>
            </div>
          </div>
        );
      })()}

      <div className="chart-legend">
        {series.map((s, i) => (
          <span className="lk" key={s.key}>
            <span className="sw" style={{ background: named(s.color) || (s.highlight ? accent : SERIES_COLORS[i % SERIES_COLORS.length]) }} />
            {s.label}{s.raw ? ` (${s.raw[0]} → ${s.raw[1]})` : ''}
          </span>
        ))}
        {fig.annotation && !fig.spread && <span className="annot-note">{fig.annotation}</span>}
      </div>
      {/* naming the members answers "which countries are in each band?" without
          sending the reader to a caption */}
      {fig.members?.length > 0 && (
        <div className="band-members">
          {fig.members.map((b) => (
            <div key={b.key}>
              <span style={{ color: named(fig.series.find((sr) => sr.key === b.key)?.color) || accent }}>
                {b.label}
              </span>
              <p>{b.names.join(' · ')}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="chart" ref={ref}>
      {fig.pick ? (
        <div className="radar-layout">
          <CountryPicker countries={all.map((sr) => ({ market: sr.key, name: sr.label }))}
                         selected={selected} cap={cap} onToggle={toggle} colorOf={() => accent} />
          <div className="dumbbell-panel">{chart}</div>
        </div>
      ) : chart}
      {fig.note && (
        <p className={`chart-note${fig.noteWide ? ' wide' : ''}`}>{fig.note}</p>
      )}
    </div>
  );
}
