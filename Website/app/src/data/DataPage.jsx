import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Level3Explorer from '../topic/Level3Explorer';
import './DataPage.css';

export default function DataPage() {
  return (
    <div className="data-page page-shell">
      <SiteHeader theme="light" active="data" />
      <main className="data-main page-container">
        <header className="data-heading">
          <div>
            <h1>Explore the data</h1>
          </div>
        </header>

        <section className="data-workspace" aria-label="Data explorer">
          {/* One explorer across every topic — the catalog covers all 190
              indicators and the owning topic's series load on selection. */}
          <Level3Explorer
            mode="global"
            topic="all"
            initialProxy="D1"
            initialMarkets={['USA', 'CHN']}
          />
        </section>
      </main>
      <SiteFooter theme="light" />
    </div>
  );
}
