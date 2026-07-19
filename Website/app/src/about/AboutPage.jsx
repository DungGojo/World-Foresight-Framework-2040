import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page page-shell">
      <SiteHeader theme="light" active="about" />
      <main>
        <section className="about-hero page-container">
          <h1>An independent framework for thinking beyond the next headline.</h1>
          <div>
            <p>World Foresight Framework is a personal research project by Nguyen Viet Dung. It brings historical data, transparent projections and argument-led visual storytelling into one place.</p>
            <p>The aim is not to declare one inevitable future. It is to make assumptions visible, compare plausible paths, and help readers see how five large systems interact.</p>
          </div>
        </section>

        <section className="about-method page-container">
          <h2>Method in brief</h2>
          <div className="about-method-grid">
            <article><span>01</span><h3>Collect</h3><p>Build comparable historical series across 34 countries and global aggregates.</p></article>
            <article><span>02</span><h3>Project</h3><p>Use bounded, damped trends and uncertainty intervals rather than unconstrained extrapolation.</p></article>
            <article><span>03</span><h3>Stress-test</h3><p>Compare main, optimistic and pessimistic scenarios across the same evidence base.</p></article>
            <article><span>04</span><h3>Interpret</h3><p>Apply transparent analytical functions and turn their outputs into arguments and visual stories.</p></article>
          </div>
        </section>
      </main>
      <SiteFooter theme="light" />
    </div>
  );
}
