import { useEffect, useRef, useState } from 'react';
import FigureBlock from './FigureBlock';
import BehaviourCard from './BehaviourCard';
import SourceGrid from './SourceGrid';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Level2Argument({ arg, accent }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setShown(true); return; }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setShown(true)),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section id={`arg-${arg.n}`} className={'l2-arg' + (shown ? ' in' : '')} ref={ref}>
      <header className="l2-head">
        <span className="l2-index" style={{ color: accent }}>{String(arg.n).padStart(2, '0')}</span>
        <h3 style={{ '--accent': accent }}>{arg.title}</h3>
        <span className="l2-hairline" style={{ background: accent }} />
      </header>
      <p className="l2-overall">{arg.overall}</p>

      <div className="l2-figures">
        {arg.data.map((d, i) => (
          <FigureBlock key={i} finding={d.finding} figure={d.figure} />
        ))}
      </div>

      {arg.behaviours && arg.behaviours.length > 0 && (
        <div className="l2-behaviours">
          <div className="l2-behaviours-title">How the world responds</div>
          <div className="l2-behaviour-grid">
            {arg.behaviours.map((b, i) => <BehaviourCard key={i} b={b} accent={accent} />)}
          </div>
        </div>
      )}

      <SourceGrid sources={arg.sources} />
    </section>
  );
}
