import { useState } from 'react';
import { scaleLinear, line as d3line, area as d3area, format } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useTweenedValues } from '../hooks/useTweenedValues';
import { useReveal } from '../hooks/useReveal';
import { legend, palette } from '../theme';
import './chart.css';

const FALLBACK = ['#9e2b25', '#1b2a4a', '#b07a34', '#2e7d6b', '#4a5d73', '#6d6a63'];

// 'Possible futures' shows the three modelled paths instead of one path plus its
// confidence band. Offered for a single country only — three scenarios across
// several countries is unreadable. Colours are fixed per scenario rather than
// taken from the country accent, because that accent can itself be the same red
// as 'pessimistic'.
const SCENARIO_PATHS = [
  { key: 'main_scenario', label: 'Main', color: palette.navy, width: 2.4 },
  { key: 'optimistic_scenario', label: 'Optimistic', color: palette.planet, width: 1.9 },
  { key: 'pessimistic_scenario', label: 'Pessimistic', color: palette.power, width: 1.9 },
];

const colorFor = (market, index) => legend[market] || FALLBACK[index % FALLBACK.length];
const axisFormat = format('~s');
const clip = (rows, from, to) => (rows || []).filter((row) => row[0] >= from && row[0] <= to);
const exactFormat = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
// Two decimals on a seven-figure number is noise; scale the precision instead.
const compactFormat = (value) => {
  const abs = Math.abs(Number(value));
  const digits = abs >= 1000 ? 0 : abs >= 10 ? 1 : 2;
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: digits });
};
const percentFormat = (value) => (value == null || value === '' ? '—' : `${(Number(value) * 100).toFixed(1)}%`);

// Push end labels apart when their y positions collide. Three scenario paths
// (and several countries) routinely land within a few pixels of each other.
const decollide = (items, minGap) => {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i += 1) {
    const gap = sorted[i].y - sorted[i - 1].y;
    if (gap < minGap) sorted[i].y = sorted[i - 1].y + minGap;
  }
  return sorted;
};

const joinAtHistory = (history, projection) => {
  if (!projection.length || !history.length) return projection;
  const lastHistorical = history[history.length - 1];
  return projection[0][0] === lastHistorical[0] ? projection : [lastHistorical, ...projection];
};

const intervalAtHistory = (history, projection) => {
  const interval = projection
    .filter((point) => point[2] != null && point[3] != null)
    .map((point) => [point[0], point[2], point[3]]);
  if (!history.length || !interval.length) return interval;
  const seam = history[history.length - 1];
  return [[seam[0], seam[1], seam[1]], ...interval.filter((point) => point[0] > seam[0])];
};

const tooltipRows = (row) => {
  const seamYear = row.history[row.history.length - 1]?.[0];
  const points = new Map();
  row.projection.forEach(([year, value, low, high]) => points.set(year, { year, value, low, high }));
  row.history.forEach(([year, value]) => points.set(year, {
    year,
    value,
    low: year === seamYear ? value : null,
    high: year === seamYear ? value : null,
  }));
  return [...points.values()].sort((a, b) => a.year - b.year);
};

const collectValues = (rows, withCi) => {
  const out = [];
  rows.forEach((row) => {
    row.history.forEach(([, value]) => value != null && out.push(value));
    row.projection.forEach(([, value, low, high]) => {
      if (value != null) out.push(value);
      if (!withCi) return;
      if (low != null) out.push(low);
      if (high != null) out.push(high);
    });
  });
  return out;
};

export default function FanChart({
  series,
  proxy,
  markets,
  scenario = 'main_scenario',
  scenarioLabel = 'Main',
  mode = 'interval',
  yLabel = '',
  from = 2000,
  to = 2040,
  height,
  statistics,
}) {
  const [ref, { width }] = useResizeObserver();
  const [hover, setHover] = useState(null);
  const H = height || (markets.length === 1 ? 340 : 310);
  const showCagr = markets.length === 1 && statistics;
  const margin = { top: showCagr ? 80 : 18, right: 68, bottom: 34, left: 70 };
  const w = Math.max(width, 280);
  const innerWidth = w - margin.left - margin.right;
  const innerHeight = H - margin.top - margin.bottom;
  const proxySeries = series?.series?.[proxy];
  const singleCountry = markets.length === 1;

  // ---------------------------------------------------------------- layers
  // Both layers are built whenever one country is selected — including while
  // the other view is showing — so switching can cross-fade in both directions
  // rather than swapping instantly.
  const predictionRows = markets.map((market) => {
    const history = clip(proxySeries?.[market]?.historical, from, to);
    const projection = clip(proxySeries?.[market]?.[scenario], from, to);
    const row = { market, history, projection, connected: joinAtHistory(history, projection) };
    return { ...row, tooltip: tooltipRows(row) };
  });

  const scenarioLayer = (() => {
    if (!singleCountry || !proxySeries) return null;
    const market = markets[0];
    const history = clip(proxySeries?.[market]?.historical, from, to);
    const seam = history[history.length - 1];
    if (!seam) return null;
    const seamRow = [seam];
    const rows = SCENARIO_PATHS.map((pth, i) => {
      const projection = clip(proxySeries?.[market]?.[pth.key], from, to);
      return {
        market,
        label: pth.label,
        colorOverride: pth.color,
        strokeWidth: pth.width,
        // Only the first row carries the seam so the marker is drawn once; all
        // three paths start from it, which is what opens the fan cleanly.
        history: i === 0 ? seamRow : [],
        projection,
        connected: joinAtHistory(seamRow, projection),
        tooltip: tooltipRows({ history: seamRow, projection }),
      };
    }).filter((row) => row.projection.length);
    return rows.length ? { market, seam, rows } : null;
  })();

  const wantScenario = mode === 'scenarios' && scenarioLayer != null;
  const activeRows = wantScenario ? scenarioLayer.rows : predictionRows;

  // ---------------------------------------------------------------- domains
  const predictionValues = collectValues(predictionRows, true);
  const scenarioValues = scenarioLayer ? collectValues(scenarioLayer.rows, false) : [];

  const predictionDomain = predictionValues.length
    ? { xFrom: from, yMin: Math.min(0, Math.min(...predictionValues)), yMax: Math.max(...predictionValues) }
    : { xFrom: from, yMin: 0, yMax: 1 };

  // 'Possible futures' zooms to the forecast window and drops the zero baseline.
  // Across the dataset that lifts the 2040 scenario gap from ~3% of the chart
  // height to ~33%. The confidence bounds are excluded from this domain: they
  // are far wider than the scenario spread and would keep the axis stretched,
  // squashing the three paths back together.
  const scenarioDomain = (() => {
    if (!scenarioLayer || !scenarioValues.length) return predictionDomain;
    const lo = Math.min(...scenarioValues);
    const hi = Math.max(...scenarioValues);
    const pad = (hi - lo) * 0.12 || Math.abs(hi * 0.05) || 1;
    return { xFrom: scenarioLayer.seam[0], yMin: lo - pad, yMax: hi + pad };
  })();

  const target = wantScenario ? scenarioDomain : predictionDomain;

  // Tween the SCALE DOMAIN, not the DOM. Every path, gridline, tick and label is
  // derived from these scales, so the whole chart moves as one camera move —
  // the axis slides right and the y-range closes in (or reopens) together.
  // `blend` cross-fades the two layers over the same easing curve.
  const view = useTweenedValues({
    xFrom: target.xFrom,
    yMin: target.yMin,
    yMax: target.yMax,
    blend: wantScenario ? 1 : 0,
  });

  // Deliberately keyed on the indicator and country set only: switching between
  // Prediction and Possible futures already animates via the domain tween, and
  // re-drawing the lines on top of that would read as a stutter.
  const reveal = useReveal(`${proxy}|${[...markets].sort().join(',')}`);

  if (!markets.length) {
    return <div className="chart"><div className="chart-empty">Please select a country to explore this indicator.</div></div>;
  }
  if (!proxySeries || !predictionValues.length) {
    return <div className="chart"><div className="chart-empty">No data is available for this selection.</div></div>;
  }

  const blend = Math.max(0, Math.min(1, view.blend));
  const labelReveal = Math.max(0, Math.min(1, (reveal - 0.82) / 0.18));
  const clipId = `plot-${proxy}-${markets.join('-')}`;
  const x = scaleLinear().domain([view.xFrom, to]).range([margin.left, margin.left + innerWidth]);
  const y = scaleLinear()
    // No .nice() — it snaps the domain in steps, which makes the tween stutter.
    .domain(view.yMin === view.yMax ? [view.yMin - 1, view.yMax + 1] : [view.yMin, view.yMax])
    .range([margin.top + innerHeight, margin.top]);
  const line = d3line().defined((row) => row[1] != null).x((row) => x(row[0])).y((row) => y(row[1]));
  const area = d3area().defined((row) => row[1] != null && row[2] != null).x((row) => x(row[0])).y0((row) => y(row[1])).y1((row) => y(row[2]));

  const yTicks = y.ticks(5);
  const latestHistorical = Math.max(...predictionRows.flatMap((row) => row.history.map((point) => point[0])));
  const seamYear = Number.isFinite(latestHistorical) ? latestHistorical : null;
  // One candidate list spanning both views; ticks fade out as the zoom carries
  // them off the left edge rather than vanishing at a threshold.
  const xTicks = [from, 2010, seamYear, 2030, 2035, to]
    .filter((tick, index, all) => tick != null && tick <= to && all.indexOf(tick) === index)
    .map((tick) => {
      const px = x(tick);
      // Inside the plot: fully visible (a tick sitting exactly on the domain
      // start is the axis origin, not something leaving the frame). Only ticks
      // pushed left of the axis by the zoom fade out.
      const opacity = px >= margin.left ? 1 : Math.max(0, 1 + (px - margin.left) / 26);
      return { tick, px, opacity };
    })
    .filter((t) => t.opacity > 0.01);

  const scenarioRange = (() => {
    if (!scenarioLayer) return null;
    const ends = scenarioLayer.rows
      .map((row) => row.projection[row.projection.length - 1]?.[1])
      .filter((v) => v != null);
    if (ends.length < 2) return null;
    const low = Math.min(...ends);
    const high = Math.max(...ends);
    if (low === high) return null;
    const mainRow = scenarioLayer.rows.find((row) => row.label === 'Main');
    const mainLast = mainRow?.projection[mainRow.projection.length - 1]?.[1];
    const base = mainLast ? Math.abs(mainLast) : null;
    return { low, high, pct: base ? ((high - low) / base) * 100 : 0 };
  })();

  const handlePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * w;
    if (svgX < margin.left || svgX > margin.left + innerWidth) return setHover(null);
    const targetYear = x.invert(svgX);
    const availableYears = [...new Set(activeRows.flatMap((row) => row.tooltip.map((point) => point.year)))];
    const year = availableYears.reduce(
      (best, candidate) => (Math.abs(candidate - targetYear) < Math.abs(best - targetYear) ? candidate : best),
      availableYears[0]
    );
    const points = activeRows.map((row, index) => {
      if (!row.tooltip.length) return null;
      const point = row.tooltip.reduce(
        (best, candidate) => (Math.abs(candidate.year - year) < Math.abs(best.year - year) ? candidate : best),
        row.tooltip[0]
      );
      return point ? {
        market: row.market,
        label: row.label,
        value: point.value,
        low: point.low,
        high: point.high,
        color: row.colorOverride || colorFor(row.market, index),
      } : null;
    }).filter(Boolean);
    setHover({ year, points });
  };

  // One renderer for both layers; `opacity` drives the cross-fade.
  const renderRows = (rows, opacity, withInterval) => {
    if (opacity <= 0.01) return null;
    return (
      <g opacity={opacity}>
        {rows.map((row, index) => {
          const color = row.colorOverride || colorFor(row.market, index);
          const interval = withInterval ? intervalAtHistory(row.history, row.projection) : [];
          const seam = row.history[row.history.length - 1];
          return (
            <g key={row.label ? `${row.market}-${row.label}` : row.market}>
              {interval.length ? <path d={area(interval)} fill={color} opacity={singleCountry ? 0.16 : 0.07} /> : null}
              {row.history.length > 1 ? <path d={line(row.history)} fill="none" stroke={color} strokeWidth="2" /> : null}
              {row.connected.length ? (
                <path d={line(row.connected)} fill="none" stroke={color}
                      strokeWidth={row.strokeWidth || 2} strokeDasharray="6 4" />
              ) : null}
              {seam ? (
                <circle cx={x(seam[0])} cy={y(seam[1])} r={3 + blend} fill={color}
                        stroke="var(--paper)" strokeWidth="1.5" />
              ) : null}
            </g>
          );
        })}
      </g>
    );
  };

  const endLabels = (rows, opacity, asScenario) => {
    if (opacity <= 0.01) return null;
    const labels = rows.map((row, index) => {
      const last = row.projection[row.projection.length - 1] || row.history[row.history.length - 1];
      if (!last) return null;
      return asScenario
        ? { key: row.label, y: y(last[1]), text: compactFormat(last[1]), sub: row.label, color: row.colorOverride }
        : { key: row.market, y: y(last[1]), text: row.market, color: colorFor(row.market, index) };
    }).filter(Boolean);

    return (
      <g opacity={opacity}>
        {decollide(labels, 13).map((l) => (
          <text key={l.key} className="end-label" x={margin.left + innerWidth + 8} y={l.y} dy="0.32em"
                fill={l.color} fontSize={l.sub ? 10.5 : undefined}>
            {l.text}{l.sub ? <tspan className="end-label-sub" dx="4">{l.sub}</tspan> : null}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div className="chart fan-chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img"
           aria-label={wantScenario ? `Scenario paths for ${proxy}` : `${scenarioLabel} scenario for ${proxy}`}
           onPointerMove={handlePointer} onPointerLeave={() => setHover(null)}>
        <defs>
          {/* Two jobs: stops the history line running out over the y-axis labels
              while the view zooms in, and carries the left-to-right reveal by
              animating its width from 0. */}
          <clipPath id={clipId}>
            <rect x={margin.left} y={margin.top - 4}
                  width={Math.max(0, innerWidth * reveal)} height={innerHeight + 8} />
          </clipPath>
        </defs>

        {showCagr ? (
          <g className="cagr-callouts" aria-hidden="true">
            {[
              ['CAGR past 1 year', statistics.cagr_p1y],
              ['CAGR past 3 years', statistics.cagr_p3y],
              ['CAGR full history', statistics.cagr_full],
            ].map(([label, value], index) => {
              const columnWidth = innerWidth / 3;
              const xPos = margin.left + columnWidth * index;
              return (
                <g key={label} transform={`translate(${xPos} 8)`}>
                  <line x1="0" x2="0" y1="0" y2="40" />
                  <text x="10" y="13">{label}</text>
                  <text className="cagr-value" x="10" y="32">{percentFormat(value)}</text>
                </g>
              );
            })}
          </g>
        ) : null}

        <g className="grid">
          {yTicks.map((tick) => (
            <line key={tick} x1={margin.left} x2={margin.left + innerWidth} y1={y(tick)} y2={y(tick)} />
          ))}
        </g>
        <g className="axis">
          {yTicks.map((tick) => (
            <text key={tick} x={margin.left - 9} y={y(tick)} dy="0.32em" textAnchor="end">{axisFormat(tick)}</text>
          ))}
          {yLabel ? (
            <text className="axis-title" transform={`translate(15 ${margin.top + innerHeight / 2}) rotate(-90)`}
                  textAnchor="middle">{yLabel}</text>
          ) : null}
        </g>
        <g className="axis">
          <line x1={margin.left} x2={margin.left + innerWidth} y1={margin.top + innerHeight} y2={margin.top + innerHeight} />
          {xTicks.map((t) => (
            <text key={t.tick} x={t.px} y={margin.top + innerHeight + 20} textAnchor="middle" opacity={t.opacity}>
              {t.tick}
            </text>
          ))}
        </g>

        <g clipPath={`url(#${clipId})`}>
          {seamYear != null ? (
            <line className="history-seam" x1={x(seamYear)} x2={x(seamYear)}
                  y1={margin.top} y2={margin.top + innerHeight} opacity={1 - blend} />
          ) : null}

          {renderRows(predictionRows, 1 - blend, true)}
          {scenarioLayer ? renderRows(scenarioLayer.rows, blend, false) : null}


          {hover ? (
            <g className="chart-hover" aria-hidden="true">
              <line x1={x(hover.year)} x2={x(hover.year)} y1={margin.top} y2={margin.top + innerHeight} />
              {hover.points.map((point) => (
                <circle key={point.label || point.market} cx={x(hover.year)} cy={y(point.value)} r="4" fill={point.color} />
              ))}
            </g>
          ) : null}
        </g>

        {/* Labels are outside the clip, so hold them back until the sweep arrives */}
        {endLabels(predictionRows, (1 - blend) * labelReveal, false)}
        {scenarioLayer ? endLabels(scenarioLayer.rows, blend * labelReveal, true) : null}

        <rect className="chart-hitarea" x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} fill="transparent" />
      </svg>

      {hover ? (
        <div className="chart-tooltip" style={{ left: `${(x(hover.year) / w) * 100}%` }}>
          <b>{hover.year}</b>
          {hover.points.map((point) => (
            <div className="chart-tooltip-point" key={point.label || point.market}>
              <div className="chart-tooltip-main">
                <i style={{ background: point.color }} />
                <span>{point.label || series.markets.find((market) => market.code === point.market)?.name || point.market}</span>
                <strong>{exactFormat(point.value)}</strong>
              </div>
              {!wantScenario && singleCountry && point.low != null && point.high != null ? (
                <div className="chart-tooltip-range">
                  <span>Lower <b>{exactFormat(point.low)}</b></span>
                  <span>Upper <b>{exactFormat(point.high)}</b></span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="chart-legend">
        <span className="lk"><span className="sw" style={{ background: palette.muted }} /> Historical</span>
        {wantScenario ? (
          SCENARIO_PATHS.map((pth) => (
            <span className="lk" key={pth.key}>
              <span className="sw projected" style={{ '--legend-color': pth.color }} /> {pth.label}
            </span>
          ))
        ) : (
          <>
            <span className="lk"><span className="sw projected" style={{ '--legend-color': palette.muted }} /> {scenarioLabel} scenario</span>
            <span className="lk"><span className="sw interval" /> Confidence interval</span>
          </>
        )}
      </div>

      {/* The spread is often only a few percent, so state it in numbers rather
          than asking the reader to measure a sliver. */}
      {wantScenario && scenarioRange ? (
        <p className="scenario-readout">
          <b>{to} range</b>
          <span>{compactFormat(scenarioRange.low)} to {compactFormat(scenarioRange.high)}</span>
          <em>
            {scenarioRange.pct < 0.05
              ? 'the three scenarios are effectively identical here'
              : `spread of ${scenarioRange.pct.toFixed(1)}% around the main path`}
          </em>
          <i>Zoomed to {scenarioDomain.xFrom}–{to}; vertical axis does not start at zero</i>
        </p>
      ) : null}
    </div>
  );
}
