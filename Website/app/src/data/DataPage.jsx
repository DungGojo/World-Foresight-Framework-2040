import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Level3Explorer from '../topic/Level3Explorer';
import ForceGlyph from '../components/ForceGlyph';
import './DataPage.css';

export default function DataPage() {
  const [topic, setTopic] = useState('all');
  return (
    <div className="data-page page-shell">
      <SiteHeader theme="light" active="data" />
      <main className="data-main page-container">
        <header className="data-heading">
          <div>
            <h1>Explore the data</h1>
            <p>Compare the countries, indicators and scenarios behind the framework.</p>
          </div>
          <div className="data-availability">
            <span><ForceGlyph id="power" />Power data is live</span>
            <p>Technology, Planet, People and Economy are coming soon.</p>
          </div>
        </header>

        <div className="data-topicbar">
          <span>Topic</span>
          <button aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>All</button>
          <button aria-pressed={topic === 'power'} onClick={() => setTopic('power')}><ForceGlyph id="power" />Power</button>
          <button disabled>Technology</button><button disabled>Planet</button><button disabled>People</button><button disabled>Economy</button>
        </div>

        <section className="data-workspace" aria-label="Power data explorer">
          <Level3Explorer mode="global" topicFilter={topic} initialProxy="D1" initialMarkets={['USA', 'CHN']} />
        </section>
      </main>
      <SiteFooter theme="light" />
    </div>
  );
}
