import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ATTRACT = 230, MERGE = 118, EASE = 0.16;

// Redesigned constellation (build spec §6.3): balanced ring in the stage,
// gravity-combine, and — the key fix — during a drag only the two involved orbs
// move; every other orb dims and eases home so nothing collides.
const Constellation = forwardRef(function Constellation(
  { forces, onHover, onSelectSingle, onCombo, onClearInsight },
  ref
) {
  const stageRef = useRef(null);
  const orbRefs = useRef([]);
  const state = useRef([]); // [{id,force,x,y,tx,ty,hx,hy}]
  const drag = useRef(null);
  const merged = useRef(null);
  const settled = useRef(false);
  const raf = useRef(null);
  const reduce = useReducedMotion();

  const orbSize = () => (window.innerWidth <= 640 ? 112 : 150);

  const computeHomes = () => {
    const el = stageRef.current; if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    const oR = orbSize() / 2;
    const leadClear = w <= 900 ? 150 : 184; // keep the top orb below the lead copy
    const bottomClear = 74;                 // keep bottom orbs above the drag hint
    const cx = w / 2, cy = h / 2 + 28;
    let r = Math.min(w, h) * 0.32;
    r = Math.min(r, (w - 2 * oR - 40) / 2, cy - leadClear - oR, (h - bottomClear - cy) - oR);
    r = Math.max(92, r);
    forces.forEach((f, i) => {
      const a = -Math.PI / 2 + i * ((Math.PI * 2) / forces.length);
      const hx = cx + r * Math.cos(a), hy = cy + r * Math.sin(a);
      const s = state.current[i];
      if (s) { s.hx = hx; s.hy = hy; if (!drag.current && !settled.current) { s.tx = hx; s.ty = hy; } }
    });
  };

  // init state
  useEffect(() => {
    state.current = forces.map((f) => ({ id: f.id, force: f, x: 0, y: 0, tx: 0, ty: 0, hx: 0, hy: 0, phase: Math.random() * 6 }));
    computeHomes();
    state.current.forEach((s) => { s.x = s.tx = s.hx; s.y = s.ty = s.hy; });
    write();
    const onResize = () => computeHomes();
    window.addEventListener('resize', onResize);
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf.current); };
  }, []); // eslint-disable-line

  const write = () => {
    state.current.forEach((s, i) => {
      const el = orbRefs.current[i];
      if (el) { el.style.left = s.x + 'px'; el.style.top = s.y + 'px'; }
    });
  };

  const nearest = (o) => {
    let best = null, bd = 1e9;
    state.current.forEach((p) => { if (p === o) return; const d = Math.hypot(p.x - o.x, p.y - o.y); if (d < bd) { bd = d; best = p; } });
    return { o: best, d: bd };
  };

  const setLink = (a, b) => {
    const path = stageRef.current?.querySelector('#combo-link');
    if (!path) return;
    if (!a) { path.style.display = 'none'; return; }
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const px = -dy / d, py = dx / d, bow = Math.min(40, d * 0.18);
    path.setAttribute('d', `M${a.x} ${a.y} Q${mx + px * bow} ${my + py * bow} ${b.x} ${b.y}`);
    path.style.display = '';
  };

  const dimBystanders = (a, b) => {
    state.current.forEach((p, i) => {
      const el = orbRefs.current[i];
      if (!el) return;
      const involved = p === a || p === b;
      el.classList.toggle('dim', !involved);
      el.classList.toggle('near', involved && !!b);
    });
  };
  const undim = () => orbRefs.current.forEach((el) => el && el.classList.remove('dim', 'near', 'selected'));

  const updateDrag = (o) => {
    const n = nearest(o);
    merged.current = null;
    if (n.o && n.d < ATTRACT) {
      const ang = Math.atan2(n.o.y - o.y, n.o.x - o.x), stop = MERGE * 0.86;
      n.o.tx = o.x + Math.cos(ang) * stop;
      n.o.ty = o.y + Math.sin(ang) * stop;
      dimBystanders(o, n.o);
      setLink(o, n.o);
      if (n.d < MERGE) { merged.current = [o, n.o]; onCombo(o.force, n.o.force, true); }
      state.current.forEach((p) => { if (p !== o && p !== n.o) { p.tx = p.hx; p.ty = p.hy; } });
    } else {
      dimBystanders(o, null);
      setLink(null);
      state.current.forEach((p) => { if (p !== o) { p.tx = p.hx; p.ty = p.hy; } });
    }
  };

  const loop = (now) => {
    raf.current = requestAnimationFrame(loop);
    const t = now / 1000;
    if (drag.current) {
      updateDrag(drag.current.o);
    } else if (!settled.current && !reduce) {
      state.current.forEach((p) => { p.tx = p.hx + Math.sin(t * 0.6 + p.phase) * 6; p.ty = p.hy + Math.cos(t * 0.5 + p.phase) * 5; });
    }
    state.current.forEach((p) => { p.x += (p.tx - p.x) * EASE; p.y += (p.ty - p.y) * EASE; });
    write();
    if (drag.current && merged.current) setLink(merged.current[0], merged.current[1]);
  };

  const rel = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (i, e) => {
    e.preventDefault();
    settled.current = false;
    const o = state.current[i];
    const p = rel(e);
    drag.current = { o, sx: e.clientX, sy: e.clientY, moved: false, ox: o.x - p.x, oy: o.y - p.y };
    try { orbRefs.current[i].setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const o = drag.current.o, p = rel(e);
    if (Math.hypot(e.clientX - drag.current.sx, e.clientY - drag.current.sy) > 6) drag.current.moved = true;
    o.x = o.tx = p.x + drag.current.ox;
    o.y = o.ty = p.y + drag.current.oy;
    updateDrag(o);
    write();
  };
  const onUp = () => {
    if (!drag.current) return;
    const o = drag.current.o, wasDrag = drag.current.moved, pair = merged.current;
    drag.current = null; setLink(null);
    if (!wasDrag) { selectSingle(o); return; }
    if (pair) {
      settled.current = true;
      const el = stageRef.current;
      const cx = el.clientWidth / 2, cy = el.clientHeight / 2 + 6, gap = MERGE * 0.55;
      pair[0].tx = cx - gap; pair[0].ty = cy; pair[1].tx = cx + gap; pair[1].ty = cy;
      dimBystanders(pair[0], pair[1]);
      onCombo(pair[0].force, pair[1].force, false);
    } else { reset(); }
  };

  const selectSingle = (o) => {
    settled.current = false; undim();
    state.current.forEach((p) => { p.tx = p.hx; p.ty = p.hy; });
    orbRefs.current[state.current.indexOf(o)]?.classList.add('selected');
    onSelectSingle(o.force);
  };
  const reset = () => {
    settled.current = false; merged.current = null; setLink(null); undim();
    state.current.forEach((p) => { p.tx = p.hx; p.ty = p.hy; });
  };
  useImperativeHandle(ref, () => ({ reset }));

  return (
    <div
      className="hub-constellation"
      ref={stageRef}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerDown={(e) => { if (e.target === stageRef.current || e.target.tagName === 'svg' || e.target.id === 'combo-link') { reset(); onClearInsight(); } }}
    >
      <svg className="hub-links" aria-hidden="true">
        <path id="combo-link" fill="none" stroke="rgba(27,42,74,.55)" strokeWidth="1.6" strokeDasharray="7 7" style={{ display: 'none' }} />
      </svg>
      {forces.map((f, i) => (
        <div
          key={f.id}
          ref={(el) => (orbRefs.current[i] = el)}
          className="orb"
          tabIndex={0}
          role="button"
          aria-label={`${f.name} — ${f.live ? 'explore' : 'coming soon'}`}
          style={{ '--accent': f.color, width: orbSize(), height: orbSize(), marginTop: -orbSize() / 2, marginLeft: -orbSize() / 2 }}
          onPointerDown={(e) => onDown(i, e)}
          onMouseEnter={() => onHover(f.id)}
          onFocus={() => onHover(f.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSingle(state.current[i]); } }}
        >
          <span className="orb-dot" style={{ background: f.color }} />
          <span className="orb-name">{f.name}</span>
          <span className="orb-pill">{f.live ? 'Explore ▸' : 'Coming soon'}</span>
        </div>
      ))}
    </div>
  );
});

export default Constellation;
