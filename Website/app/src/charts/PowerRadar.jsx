import { useMemo, useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { palette, legend } from '../theme';
import CountryPicker from './CountryPicker';
import './chart.css';

// Arg 3 — power signatures across five levers, for any set of countries, at
// both anchor years. One shared scale across the two panels so the 2025 and
// 2040 shapes can be read against each other rather than each self-normalised.
const RAMP = [palette.power, palette.navy, palette.planet, palette.economy,
              palette.people, palette.tech];

function colorFor(market, index) {
  return legend[market] || RAMP[index % RAMP.length];
}

function Radar({ axes, series, maxV, size, showValues }) {
  const cx = size / 2, cy = size / 2 + 4, R = size * 0.32;
  const n = axes.length;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const rr = (Math.max(v, 0) / maxV) * R;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  };
  return (
    <svg viewBox={`0 0 ${size} ${size + 12}`} role="img" aria-label="Power signature">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={axes.map((_, i) => pt(i, maxV * f).join(',')).join(' ')}
                 fill="none" stroke={palette.line} strokeDasharray="3 4" />
      ))}
      {axes.map((ax, i) => {
        const [ex, ey] = pt(i, maxV);
        const [lx, ly] = pt(i, maxV * 1.2);
        return (
          <g key={ax}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={palette.line} />
            <text x={lx} y={ly} textAnchor={lx > cx + 4 ? 'start' : lx < cx - 4 ? 'end' : 'middle'}
                  dy="0.32em" className="radar-axis">{ax}</text>
          </g>
        );
      })}
      {series.map((s) => (
        <polygon key={s.market} points={s.values.map((v, i) => pt(i, v).join(',')).join(' ')}
                 fill={s.color} fillOpacity={0.13} stroke={s.color} strokeWidth={2} />
      ))}
      {series.map((s) => s.values.map((v, i) => {
        const [px, py] = pt(i, v);
        return <circle key={`${s.market}-${i}`} cx={px} cy={py} r={2.6} fill={s.color} />;
      }))}
      {/* with one country on the chart there is room to print the actual share
          at each vertex; with several the labels would collide */}
      {showValues && series[0]?.values.map((v, i) => {
        const [px, py] = pt(i, v);
        const [ox, oy] = pt(i, v + maxV * 0.09);
        return (
          <text key={`v-${i}`} x={ox} y={oy} dy="0.32em" textAnchor="middle"
                className="radar-value" fill={series[0].color}
                transform={v < maxV * 0.12 ? `translate(${(ox - px) * 1.5},${(oy - py) * 1.5})` : undefined}>
            {v}%
          </text>
        );
      })}
    </svg>
  );
}

export default function PowerRadar({ fig }) {
  const [ref, { width }] = useResizeObserver();
  const [pickerRef, { height: pickerH }] = useResizeObserver();
  const [picked, setPicked] = useState(() => fig?.defaults || []);

  // Every hook runs before the empty-data guard below, so the guard cannot
  // change the hook order between renders.
  const countries = fig?.countries || [];
  const byMarket = useMemo(
    () => Object.fromEntries(countries.map((c) => [c.market, c])), [countries]);
  const selected = useMemo(
    () => picked.filter((mk) => byMarket[mk]), [picked, byMarket]);
  // A single country is usually a small share of the world, so its polygon
  // collapses to a dot on a scale set by the biggest player. Alone, the chart
  // zooms to that country; with two or more it opens back out so the shapes
  // stay comparable.
  const solo = selected.length === 1;
  const maxV = useMemo(() => {
    const all = selected.flatMap((mk) => byMarket[mk].values);
    const top = Math.max(...all, 0);
    const step = solo && top < 12 ? 1 : solo && top < 30 ? 2 : 5;
    return Math.max(step * 2, Math.ceil(top / step) * step);
  }, [selected, byMarket, solo]);

  if (!fig?.axes || !countries.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const cap = fig.maxSelected || 6;
  const series = selected.map((mk, i) => ({
    market: mk, name: byMarket[mk].name, color: colorFor(mk, i),
    values: byMarket[mk].values,
  }));

  const toggle = (mk) => setPicked((p) => (
    p.includes(mk) ? p.filter((x) => x !== mk) : p.length >= cap ? p : [...p, mk]));

  // `size` sets the viewBox units; the rendered size has to be capped
  // separately, because .chart svg is width:100% and will otherwise stretch the
  // square viewBox to the full column width. Both are pinned to the picker's
  // height so the two columns end level.
  const size = 400;
  const drawn = Math.max(220, Math.min(pickerH ? pickerH - 12 : 420, width - 230, 460));
  const partial = selected.filter((mk) => byMarket[mk].missing?.length);

  return (
    <div className="chart radar-chart" ref={ref}>
      <div className="radar-layout">
        <div ref={pickerRef}>
          <CountryPicker countries={fig.countries} selected={selected} cap={cap}
                         onToggle={toggle}
                         colorOf={(mk) => colorFor(mk, selected.indexOf(mk))} />
        </div>

        <div className="radar-panels solo">
          {selected.length === 0 ? (
            <div className="chart-empty">Pick a country to draw its signature.</div>
          ) : (
            <div className="radar-frame" style={{ maxWidth: drawn }}>
              <Radar axes={fig.axes} series={series} maxV={maxV} size={size} showValues={solo} />
            </div>
          )}
        </div>
      </div>

      <div className="chart-legend">
        {selected.map((mk, i) => (
          <span className="lk" key={mk}>
            <span className="sw" style={{ background: colorFor(mk, i) }} />{byMarket[mk].name}
          </span>
        ))}
        {fig.unit && <span className="annot-note">Axes: {fig.unit}</span>}
      </div>
      {partial.length > 0 && (
        <p className="chart-note coverage">
          No data for {partial.map((mk) => `${byMarket[mk].name} (${byMarket[mk].missing.join(', ')})`).join('; ')}. These values are plotted at zero.
        </p>
      )}
    </div>
  );
}
