import { useState } from 'react';
import { scaleLinear, line as d3line, area as d3area, format } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { legend, palette } from '../theme';
import './chart.css';

const FALLBACK = ['#9e2b25', '#1b2a4a', '#b07a34', '#2e7d6b', '#4a5d73', '#6d6a63'];
const colorFor = (market, index) => legend[market] || FALLBACK[index % FALLBACK.length];
const axisFormat = format('~s');
const clip = (rows, from, to) => (rows || []).filter((row) => row[0] >= from && row[0] <= to);
const exactFormat = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
const percentFormat = (value) => value == null || value === '' ? '—' : `${(Number(value) * 100).toFixed(1)}%`;

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

export default function FanChart({
  series,
  proxy,
  markets,
  scenario = 'main_scenario',
  scenarioLabel = 'Main',
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

  const rowsByMarket = markets.map((market) => {
    const history = clip(proxySeries?.[market]?.historical, from, to);
    const projection = clip(proxySeries?.[market]?.[scenario], from, to);
    const row = { market, history, projection, connected: joinAtHistory(history, projection) };
    return { ...row, tooltip: tooltipRows(row) };
  });

  const values = [];
  rowsByMarket.forEach((row) => {
    row.history.forEach(([, value]) => value != null && values.push(value));
    row.projection.forEach(([, value, low, high]) => {
      if (value != null) values.push(value);
      if (low != null) values.push(low);
      if (high != null) values.push(high);
    });
  });

  if (!markets.length) {
    return <div className="chart"><div className="chart-empty">Please select a country to explore this indicator.</div></div>;
  }

  if (!proxySeries || !values.length) {
    return <div className="chart"><div className="chart-empty">No data is available for this selection.</div></div>;
  }

  const yMin = Math.min(0, Math.min(...values));
  const yMax = Math.max(...values);
  const x = scaleLinear().domain([from, to]).range([margin.left, margin.left + innerWidth]);
  const y = scaleLinear().domain(yMin === yMax ? [yMin - 1, yMax + 1] : [yMin, yMax]).nice().range([margin.top + innerHeight, margin.top]);
  const line = d3line().defined((row) => row[1] != null).x((row) => x(row[0])).y((row) => y(row[1]));
  const area = d3area().defined((row) => row[1] != null && row[2] != null).x((row) => x(row[0])).y0((row) => y(row[1])).y1((row) => y(row[2]));
  const yTicks = y.ticks(5);
  const latestHistorical = Math.max(...rowsByMarket.flatMap((row) => row.history.map((point) => point[0])));
  const xTicks = [from, Number.isFinite(latestHistorical) ? latestHistorical : null, 2030, to]
    .filter((tick, index, all) => tick != null && tick >= from && tick <= to && all.indexOf(tick) === index);

  const handlePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * w;
    if (svgX < margin.left || svgX > margin.left + innerWidth) return setHover(null);
    const target = x.invert(svgX);
    const availableYears = [...new Set(rowsByMarket.flatMap((row) => row.tooltip.map((point) => point.year)))];
    const year = availableYears.reduce((best, candidate) => Math.abs(candidate - target) < Math.abs(best - target) ? candidate : best, availableYears[0]);
    const points = rowsByMarket.map((row, index) => {
      if (!row.tooltip.length) return null;
      const point = row.tooltip.reduce((best, candidate) => Math.abs(candidate.year - year) < Math.abs(best.year - year) ? candidate : best, row.tooltip[0]);
      return point ? { market: row.market, value: point.value, low: point.low, high: point.high, color: colorFor(row.market, index) } : null;
    }).filter(Boolean);
    setHover({ year, points });
  };

  return (
    <div className="chart fan-chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img" aria-label={`${scenarioLabel} scenario for ${proxy}`} onPointerMove={handlePointer} onPointerLeave={() => setHover(null)}>
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
          {yTicks.map((tick) => <line key={tick} x1={margin.left} x2={margin.left + innerWidth} y1={y(tick)} y2={y(tick)} />)}
        </g>
        <g className="axis">
          {yTicks.map((tick) => <text key={tick} x={margin.left - 9} y={y(tick)} dy="0.32em" textAnchor="end">{axisFormat(tick)}</text>)}
          {yLabel ? <text className="axis-title" transform={`translate(15 ${margin.top + innerHeight / 2}) rotate(-90)`} textAnchor="middle">{yLabel}</text> : null}
        </g>
        <g className="axis">
          <line x1={margin.left} x2={margin.left + innerWidth} y1={margin.top + innerHeight} y2={margin.top + innerHeight} />
          {xTicks.map((tick) => <text key={tick} x={x(tick)} y={margin.top + innerHeight + 20} textAnchor="middle">{tick}</text>)}
        </g>
        {Number.isFinite(latestHistorical) ? <line className="history-seam" x1={x(latestHistorical)} x2={x(latestHistorical)} y1={margin.top} y2={margin.top + innerHeight} /> : null}

        {rowsByMarket.map((row, index) => {
          const color = colorFor(row.market, index);
          const interval = intervalAtHistory(row.history, row.projection);
          const last = row.projection[row.projection.length - 1] || row.history[row.history.length - 1];
          const seam = row.history[row.history.length - 1];
          return (
            <g key={row.market}>
              {interval.length ? <path d={area(interval)} fill={color} opacity={markets.length === 1 ? .16 : .07} /> : null}
              {row.history.length ? <path d={line(row.history)} fill="none" stroke={color} strokeWidth="2" /> : null}
              {row.connected.length ? <path d={line(row.connected)} fill="none" stroke={color} strokeWidth="2" strokeDasharray="6 4" /> : null}
              {seam ? <circle cx={x(seam[0])} cy={y(seam[1])} r="3" fill={color} stroke="var(--paper)" strokeWidth="1.5" /> : null}
              {last ? <text className="end-label" x={x(last[0]) + 7} y={y(last[1])} dy="0.32em" fill={color}>{row.market}</text> : null}
            </g>
          );
        })}

        {hover ? (
          <g className="chart-hover" aria-hidden="true">
            <line x1={x(hover.year)} x2={x(hover.year)} y1={margin.top} y2={margin.top + innerHeight} />
            {hover.points.map((point) => <circle key={point.market} cx={x(hover.year)} cy={y(point.value)} r="4" fill={point.color} />)}
          </g>
        ) : null}
        <rect className="chart-hitarea" x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} fill="transparent" />
      </svg>

      {hover ? (
        <div className="chart-tooltip" style={{ left: `${(x(hover.year) / w) * 100}%` }}>
          <b>{hover.year}</b>
          {hover.points.map((point) => (
            <div className="chart-tooltip-point" key={point.market}>
              <div className="chart-tooltip-main"><i style={{ background: point.color }} /><span>{series.markets.find((market) => market.code === point.market)?.name || point.market}</span><strong>{exactFormat(point.value)}</strong></div>
              {markets.length === 1 && point.low != null && point.high != null ? (
                <div className="chart-tooltip-range"><span>Lower <b>{exactFormat(point.low)}</b></span><span>Upper <b>{exactFormat(point.high)}</b></span></div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="chart-legend">
        <span className="lk"><span className="sw" style={{ background: palette.muted }} /> Historical</span>
        <span className="lk"><span className="sw projected" style={{ '--legend-color': palette.muted }} /> {scenarioLabel} scenario</span>
        <span className="lk"><span className="sw interval" /> Confidence interval</span>
      </div>
    </div>
  );
}
