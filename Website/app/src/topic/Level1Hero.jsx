import { useEffect, useState } from 'react';
import { forceById } from '../content/site';
import { asset } from '../lib/assets';
import { darkAccentGradient } from '../theme';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Level 1 — cinematic full-viewport hero (build spec §7.3). Ambient force imagery
// (cycling, Ken-Burns) under a strong dark scrim; falls back to the accent gradient.
export default function Level1Hero({ topic }) {
  const l1 = topic.level1;
  const force = forceById[topic.id];
  const imgs = force?.ambient || [];
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [ok, setOk] = useState({}); // which ambient images actually loaded

  useEffect(() => {
    if (reduce || imgs.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % imgs.length), 6500);
    return () => clearInterval(t);
  }, [reduce, imgs.length]);

  // probe images so we only show ones that exist (else pure gradient)
  useEffect(() => {
    imgs.forEach((src, idx) => {
      const im = new Image();
      im.onload = () => setOk((o) => ({ ...o, [idx]: true }));
      im.src = asset(src);
    });
  }, []); // eslint-disable-line

  return (
    <section id="overview" className="l1-hero" style={{ background: darkAccentGradient(topic.accent) }}>
      <div className="l1-ambient">
        {imgs.map((src, idx) => (
          ok[idx] ? (
            <img
              key={idx}
              src={asset(src)}
              alt=""
              className={'l1-amb-img' + (idx === i ? ' on' : '') + (reduce ? ' noanim' : '')}
              aria-hidden="true"
            />
          ) : null
        ))}
      </div>
      <div className="l1-scrim" />
      <div className="l1-content">
        <div className="l1-kicker"><span className="dot" style={{ background: topic.accent }} />{l1.kicker}</div>
        <h1 className="l1-headline">{l1.heroHeadline}</h1>
        <p className="l1-sub">{l1.heroSub}</p>
      </div>
    </section>
  );
}
