import { forces } from '../content/site';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import SystemsMap from './SystemsMap';
import './Hub.css';

export default function ForcesPage() {
  const navigate = useSmoothNavigate();

  return (
    <div className="forces-page page-shell">
      <div className="hub-header"><SiteHeader theme="light" active="forces" /></div>
      <main className="forces-section">
        <div className="page-container">
          <header className="forces-heading">
            <h1>Five forces.<br />One connected future.</h1>
            <p>The forces are separated for analysis, but the future emerges from their interaction. Begin with one, or connect two to see how both flow into World 2040.</p>
          </header>
          <SystemsMap forces={forces} onOpenTopic={(force) => navigate(force.href)} onOpenData={() => navigate('/data')} />
        </div>
      </main>
      <SiteFooter theme="light" />
    </div>
  );
}
