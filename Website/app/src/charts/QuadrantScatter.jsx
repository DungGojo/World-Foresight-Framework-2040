import { scaleLinear } from 'd3';
import { useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { flagSrc } from '../lib/flags';
import { palette } from '../theme';
import './chart.css';

// Generic two-axis quadrant plot: the shape behind Planet's exposure/capacity,
// People's pressure/institutions, Economy's stress/buffers and debt-vs-burden,
// Technology's rent and regime maps, and the cross-topic compound-risk panels.
// Matches the output of Analysis_Functions/quadrant.quadrant_map():
// { xLabel, yLabel, split|splitX|splitY, points:[{market,name,x,y,quadrant}] }.
const FLAG = 20;

const CLUSTER_COLORS = {
  open: palette.planet, controlled: palette.power, contested: palette.people,
};

// Corner washes read as a verdict, so they are named by tone rather than by
// position: green where both measures are favourable, red where neither is, and
// a neutral amber on the mixed corners. `fig.quadrantTones` overrides the
// default for figures whose bad corner is not the high-x/low-y one.
const TONE_WASH = { good: palette.planet, bad: palette.power, mixed: palette.people };
const DEFAULT_TONES = { '01': 'good', '10': 'bad', '11': 'mixed', '00': 'mixed' };

function relationshipLabel(value) {
  const strength = Math.abs(value) >= 0.45 ? 'Clear' : 'Moderate';
  return `${strength} inverse pattern`;
}


// Convex hull (monotone chain) around a cluster's points, padded outward from
// its centroid so the shaded region reads as a territory rather than a tight
// wrapper. Used to show membership groups that are not defined by the axes.
function hull(points, pad = 26) {
  if (points.length < 3) {
    const cx = points.reduce((t, p) => t + p[0], 0) / points.length;
    const cy = points.reduce((t, p) => t + p[1], 0) / points.length;
    return points.map(([x, y]) => [x + Math.sign(x - cx || 1) * pad, y + Math.sign(y - cy || 1) * pad]);
  }
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (src) => {
    const out = [];
    for (const p of src) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  const h = [...build(pts), ...build([...pts].reverse())];
  const cx = h.reduce((t, p) => t + p[0], 0) / h.length;
  const cy = h.reduce((t, p) => t + p[1], 0) / h.length;
  return h.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy) || 1;
    return [x + ((x - cx) / d) * pad, y + ((y - cy) / d) * pad];
  });
}

// A rounded path through the hull vertices, so the region has soft edges.
function blob(h) {
  if (h.length < 3) return '';
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(h[h.length - 1], h[0]).join(',')}`;
  for (let i = 0; i < h.length; i++) {
    const next = mid(h[i], h[(i + 1) % h.length]);
    d += ` Q${h[i].join(',')} ${next.join(',')}`;
  }
  return `${d} Z`;
}

export default function QuadrantScatter({ fig, accent = palette.power, compact = false }) {
  const [ref, { width }] = useResizeObserver();
  const [hover, setHover] = useState(null);
  if (!fig || !fig.points?.length) {
    return <div className="chart"><div className="chart-empty">Data unavailable.</div></div>;
  }

  const H = compact ? 280 : 400;
  const m = compact
    ? { top: 16, right: 16, bottom: 38, left: 44 }
    : { top: 22, right: 22, bottom: 48, left: 56 };
  const w = Math.max(width, 280), iw = w - m.left - m.right, ih = H - m.top - m.bottom;

  const splitX = fig.splitX ?? fig.split ?? 50;
  const splitY = fig.splitY ?? fig.split ?? 50;
  const xs = fig.points.map((p) => p.x), ys = fig.points.map((p) => p.y);
  const padX = (Math.max(...xs) - Math.min(...xs)) * 0.08 || 5;
  const padY = (Math.max(...ys) - Math.min(...ys)) * 0.08 || 5;
  const x = scaleLinear()
    .domain([Math.min(...xs, splitX) - padX, Math.max(...xs, splitX) + padX])
    .range([m.left, m.left + iw]);
  const y = scaleLinear()
    .domain([Math.min(...ys, splitY) - padY, Math.max(...ys, splitY) + padY])
    .range([m.top + ih, m.top]);

  const highlight = new Set(fig.highlight || []);
  const byCluster = fig.colorBy === 'quadrant';
  const dotColor = (p) => {
    if (byCluster) return CLUSTER_COLORS[p.quadrant] || palette.muted;
    if (highlight.has(p.market) || p.highlight) return accent;
    return palette.muted;
  };

  // corner labels: keys are `${x_high}${y_high}` as 1/0, matching quadrant_map
  const corners = fig.quadrants
    ? [
        { k: '01', tx: m.left + 8, ty: m.top + 14, anchor: 'start' },
        { k: '11', tx: m.left + iw - 8, ty: m.top + 14, anchor: 'end' },
        { k: '00', tx: m.left + 8, ty: m.top + ih - 8, anchor: 'start' },
        { k: '10', tx: m.left + iw - 8, ty: m.top + ih - 8, anchor: 'end' },
      ].filter((c) => fig.quadrants[c.k])
    : [];

  // Which corner is the bad one differs by figure: on exposure-vs-capacity it is
  // high-x/low-y, on debt-vs-burden it is high on both. `fig.worstKey` names it.
  const worstKey = fig.worstKey || '10';
  // fig.flags: true flags every point; a number flags only that many of the most
  // extreme ones and leaves the rest as dots, so a scatter whose middle bunches
  // at the origin does not turn into a pile of overlapping badges.
  const useFlags = fig.flags && !compact;
  const flagSet = (() => {
    if (!useFlags) return null;
    if (fig.flags === true) return null; // null = flag everything
    const ranked = [...fig.points].sort((a, b) =>
      (Math.abs(b.x - splitX) + Math.abs(b.y - splitY)) - (Math.abs(a.x - splitX) + Math.abs(a.y - splitY)));
    return new Set(ranked.slice(0, fig.flags).map((p) => p.market));
  })();

  return (
    <div className="chart quadrant-chart" ref={ref}>
      <svg viewBox={`0 0 ${w} ${H}`} role="img"
           aria-label={`${fig.xLabel} against ${fig.yLabel}`}>
        {/* corner washes — green where both measures are favourable, red where
            neither is, and a neutral tint on the mixed corners */}
        {fig.quadrants && (fig.quadrantTone !== false) && [
          { k: '11', x0: x(splitX), y0: m.top, x1: m.left + iw, y1: y(splitY) },
          { k: '01', x0: m.left, y0: m.top, x1: x(splitX), y1: y(splitY) },
          { k: '00', x0: m.left, y0: y(splitY), x1: x(splitX), y1: m.top + ih },
          { k: '10', x0: x(splitX), y0: y(splitY), x1: m.left + iw, y1: m.top + ih },
        ].filter((q) => fig.quadrants[q.k]).map((q) => {
          const tone = (fig.quadrantTones || DEFAULT_TONES)[q.k] || 'mixed';
          const c = TONE_WASH[tone];
          return (
            <rect key={q.k} x={q.x0} y={q.y0} width={Math.max(q.x1 - q.x0, 0)}
                  height={Math.max(q.y1 - q.y0, 0)} fill={c}
                  opacity={tone === 'mixed' ? 0.06 : 0.1} />
          );
        })}
        <g className="grid">
          {x.ticks(5).map((t) => (
            <line key={`vx${t}`} x1={x(t)} x2={x(t)} y1={m.top} y2={m.top + ih} />
          ))}
          {y.ticks(5).map((t) => (
            <line key={`hy${t}`} x1={m.left} x2={m.left + iw} y1={y(t)} y2={y(t)} />
          ))}
        </g>

        {/* split lines */}
        <line x1={x(splitX)} x2={x(splitX)} y1={m.top} y2={m.top + ih}
              stroke={palette.ink} strokeDasharray="4 4" opacity={0.35} />
        <line x1={m.left} x2={m.left + iw} y1={y(splitY)} y2={y(splitY)}
              stroke={palette.ink} strokeDasharray="4 4" opacity={0.35} />

        {/* cluster territories. `clusterBands` draws them as vertical bands on
            the x-axis, which is right when the groups separate on one measure;
            otherwise a soft hull is wrapped around each group's points. */}
        {byCluster && fig.clusters && fig.clusterBands && fig.clusterBands.map((b) => {
          const x0 = b.from == null ? m.left : x(b.from);
          const x1 = b.to == null ? m.left + iw : x(b.to);
          const col = CLUSTER_COLORS[b.key] || palette.muted;
          return (
            <g key={`band-${b.key}`} pointerEvents="none">
              <rect x={x0} y={m.top} width={Math.max(x1 - x0, 0)} height={ih}
                    fill={col} opacity={0.09} />
              {b.from != null && (
                <line x1={x0} x2={x0} y1={m.top} y2={m.top + ih} stroke={col}
                      strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="6 5" />
              )}
            </g>
          );
        })}

        {byCluster && fig.clusters && !fig.clusterBands && Object.keys(fig.clusters).map((key) => {
          const pts = fig.points.filter((p) => p.quadrant === key).map((p) => [x(p.x), y(p.y)]);
          if (pts.length < 2) return null;
          const h = hull(pts);
          const cx = h.reduce((t, p) => t + p[0], 0) / h.length;
          const cy = Math.max(Math.min(...h.map((q) => q[1])) - 6, m.top + 10);
          const col = CLUSTER_COLORS[key] || palette.muted;
          return (
            <g key={`hull-${key}`} pointerEvents="none">
              <path d={blob(h)} fill={col} opacity={0.1} stroke={col} strokeOpacity={0.42}
                    strokeWidth={1.5} strokeDasharray="7 6" />
              <text x={cx} y={cy} textAnchor="middle" className="cluster-label" fill={col}>
                {fig.clusters[key].label}
                <tspan className="cluster-count" dx="6">{fig.clusters[key].count}</tspan>
              </text>
            </g>
          );
        })}

        {corners.map((c) => (
          <text key={c.k} className="quadrant-label" x={c.tx} y={c.ty} textAnchor={c.anchor}
                fill={c.k === worstKey ? accent : palette.muted}>
            {fig.quadrants[c.k]}
          </text>
        ))}

        {fig.points.map((p) => {
          const on = hover === p.market;
          const big = highlight.has(p.market) || p.highlight || on;
          // `fig.flags` swaps the dots for country flags — an ISO code is a
          // lookup task, a flag is recognised. Names come in on hover.
          const src = useFlags && (!flagSet || flagSet.has(p.market) || big)
            ? flagSrc(p.market) : null;
          if (src) {
            const r = (on ? FLAG + 6 : big ? FLAG + 2 : FLAG) / 2;
            return (
              <g key={p.market} className="scatter-flag" tabIndex={0} role="button"
                 aria-label={p.name || p.market}
                 onMouseEnter={() => setHover(p.market)} onMouseLeave={() => setHover(null)}
                 onFocus={() => setHover(p.market)} onBlur={() => setHover(null)}
                 onClick={() => setHover((h) => (h === p.market ? null : p.market))}>
                <circle cx={x(p.x)} cy={y(p.y)} r={r + 4} fill="transparent" />
                <circle cx={x(p.x)} cy={y(p.y)} r={r + 1.5} fill={dotColor(p)}
                        opacity={on ? 0.55 : big ? 0.3 : 0.16} />
                <image href={src} x={x(p.x) - r} y={y(p.y) - r} width={r * 2} height={r * 2} />
                <circle cx={x(p.x)} cy={y(p.y)} r={r} fill="none"
                        stroke={on ? dotColor(p) : palette.panel} strokeWidth={on ? 2 : 1} />
              </g>
            );
          }
          return (
            <g key={p.market}
               onMouseEnter={() => setHover(p.market)} onMouseLeave={() => setHover(null)}>
              <circle cx={x(p.x)} cy={y(p.y)} r={on ? 7 : big ? 5 : 3.5}
                      fill={dotColor(p)} opacity={big ? 0.92 : 0.5}
                      stroke={p.borderline ? palette.panel : 'none'}
                      strokeWidth={p.borderline ? 1.5 : 0}
                      strokeDasharray={p.borderline ? '2 2' : undefined} />
              {big && !compact && (
                <text className="scatter-label" x={x(p.x) + 8} y={y(p.y)} dy="0.32em"
                      fill={dotColor(p)}>{p.market}</text>
              )}
            </g>
          );
        })}

        {/* name of the hovered / tapped country, above its marker */}
        {useFlags && hover && (() => {
          const p = fig.points.find((q) => q.market === hover);
          if (!p) return null;
          return (
            <text className="orbit-callout" pointerEvents="none" textAnchor="middle"
                  x={Math.min(Math.max(x(p.x), m.left + 40), m.left + iw - 40)}
                  y={y(p.y) - FLAG / 2 - 9}>{p.name || p.market}</text>
          );
        })()}

        <g className="axis">
          {x.ticks(5).map((t) => (
            <text key={t} x={x(t)} y={m.top + ih + 16} textAnchor="middle">{t}</text>
          ))}
          {y.ticks(5).map((t) => (
            <text key={t} x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{t}</text>
          ))}
          <text className="axis-title" x={m.left + iw / 2} y={H - 6} textAnchor="middle">
            {fig.xLabel} →
          </text>
          <text className="axis-title" transform={`rotate(-90 12 ${m.top + ih / 2})`}
                x={12} y={m.top + ih / 2} textAnchor="middle">
            {fig.yLabel} →
          </text>
        </g>
      </svg>

      {hover && (() => {
        const p = fig.points.find((q) => q.market === hover);
        return (
          <div className="quadrant-readout">
            <b>{p.name}</b>
            <span>{fig.xLabel}: <strong>{p.x}</strong></span>
            <span>{fig.yLabel}: <strong>{p.y}</strong></span>
            {p.quadrant && <em>{p.quadrant}{p.borderline ? ' · borderline' : ''}</em>}
          </div>
        );
      })()}

      <div className="chart-legend">
        {typeof fig.correlation === 'number' && !fig.hideStats && (
          <span className="lk">{relationshipLabel(fig.correlation)} <strong>({fig.correlation.toFixed(2)})</strong></span>
        )}
        {fig.compare && !fig.hideStats && (
          <span className="lk">
            Same pattern in {fig.compare.year} <strong>({fig.compare.correlation.toFixed(2)})</strong>
          </span>
        )}
        {byCluster && Object.entries(fig.clusters || {}).map(([k, c]) => (
          <span className="lk" key={k}>
            <span className="sw dot" style={{ background: CLUSTER_COLORS[k] }} /> {c.label} ({c.count})
          </span>
        ))}
        {!fig.hideStats && fig.points.some((p) => p.borderline) && (
          <span className="lk"><span className="sw dot ring" /> borderline (within 5 pts of the split)</span>
        )}
      </div>
      {fig.note && <p className="chart-note">{fig.note}</p>}
    </div>
  );
}
