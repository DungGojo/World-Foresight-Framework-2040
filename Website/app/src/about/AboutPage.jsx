import { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ArrowIcon from '../components/ArrowIcon';
import { asset } from '../lib/assets';
import './AboutPage.css';

// ---------------------------------------------------------------------------
// EDIT ME — author details.
// Leave a `url` empty and that link simply does not render, so this is safe to
// ship half-filled. Drop a portrait at public/assets/about/portrait.png and it
// replaces the initials automatically.
// ---------------------------------------------------------------------------
const AUTHOR = {
  name: 'Nguyen Viet Dung',
  role: '',            // e.g. 'Economics student · Hanoi'
  portrait: 'assets/about/portrait.png',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/dung-nguyen-viet-dsai-ntu/' }, // e.g. 'https://www.linkedin.com/in/your-name/'
    { label: 'Email', url: 'mailto:D230006@e.ntu.edu.sg' },
  ],
  // Draft copy — rewrite freely. Written from what the framework actually does.
  bio: [
    'I built World Foresight Framework because most writing about the future either picks one dramatic outcome or hedges until it says nothing. I wanted something in between: a structured way to ask how the world could look in 2040 and to show the evidence behind every claim.',
    'The project follows 190 indicators across 34 countries from 2000 to 2040, organised into five forces: power, technology, planet, people and economy. Every projection is bounded rather than extrapolated, every argument names the data behind it, and the limits of the model are stated rather than hidden.',
  ],
  closing: 'The future is difficult to predict, but it is not beyond our influence. By combining evidence with human judgement, I believe we can better understand what may come and help shape it in a more positive direction. I would genuinely value other perspectives on this work, so please feel free to reach out on LinkedIn or by email.',
};

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export default function AboutPage() {
  const [hasPortrait, setHasPortrait] = useState(false);
  const links = AUTHOR.links.filter((l) => l.url);

  // Probe the portrait so the block falls back to initials until the file exists.
  useEffect(() => {
    if (!AUTHOR.portrait) return;
    const img = new Image();
    img.onload = () => setHasPortrait(true);
    img.src = asset(AUTHOR.portrait);
  }, []);

  return (
    <div className="about-page page-shell">
      <SiteHeader theme="light" active="about" />
      <main>
        <section className="about-hero page-container">
          <h1>An independent framework for thinking beyond the next headline.</h1>
          <div className="about-intro">
            <p>
              The aim is not to declare one inevitable future. It is to make assumptions
              visible, compare plausible paths, and help readers see how five large systems
              interact.
            </p>
          </div>
        </section>

        <section className="about-author page-container" aria-labelledby="author-title">
          <div className="author-card">
            <div className="author-portrait" aria-hidden={!hasPortrait}>
              {hasPortrait
                ? <img src={asset(AUTHOR.portrait)} alt={AUTHOR.name} />
                : <span>{initials(AUTHOR.name)}</span>}
            </div>
            <div className="author-body">
              <span className="author-kicker">Who made this</span>
              <h2 id="author-title">{AUTHOR.name}</h2>
              {AUTHOR.role ? <p className="author-role">{AUTHOR.role}</p> : null}
              {AUTHOR.bio.map((para, i) => <p key={i}>{para}</p>)}
              <p className="author-closing">{AUTHOR.closing}</p>
              {links.length > 0 && (
                <div className="author-links">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{l.label}</span><ArrowIcon />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter theme="light" />
    </div>
  );
}
