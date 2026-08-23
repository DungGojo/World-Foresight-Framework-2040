import { forces } from '../content/site';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import { useTopicLaunch } from '../hooks/useLaunch';
import SystemsMap from './SystemsMap';
import TopicRail from '../topic/TopicRail';
import '../topic/TopicPage.css';
import './Hub.css';

export default function ForcesPage() {
  const navigate = useSmoothNavigate();
  const launch = useTopicLaunch();
  return (
    <div className="forces-page page-shell">
      <div className="hub-header"><SiteHeader theme="light" active="forces" /></div>
      <main className="forces-section">
        <div className="page-container">
          <header className="forces-heading">
            <h1>Five forces.<br />One connected future.</h1>
          </header>
          <SystemsMap forces={forces} onOpenTopic={launch} onOpenData={() => navigate('/data')} />
        </div>
      </main>
      <TopicRail
        forces={forces}
        theme="light"
        title="Explore each force"
        subtitle={null}
        onOpen={launch}
      />
      <SiteFooter theme="light" />
    </div>
  );
}
