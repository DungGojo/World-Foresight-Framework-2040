import { useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getTopic } from '../content/topics';
import { forceById, forces } from '../content/site';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import Level1Hero from './Level1Hero';
import Level2Argument from './Level2Argument';
import TopicRail from './TopicRail';
import LeftRail from './LeftRail';
import ComingSoonTopic from './ComingSoonTopic';
import { useTopicLaunch } from '../hooks/useLaunch';
import './TopicPage.css';


export default function TopicPage() {
  const { topicId } = useParams();
  const topic = getTopic(topicId);
  const force = forceById[topicId];
  const navigate = useSmoothNavigate();
  const launch = useTopicLaunch();
  const location = useLocation();
  // Read once on mount: the arrival animation belongs to this entry, not to
  // every later re-render (or to a back-navigation that restores the state).
  const [arriving] = useState(() => Boolean(location.state?.fromForces));
  // Contents rail is collapsible so the reading column can take the full
  // width; the shell animates its grid column to match (TopicPage.css).
  const [railOpen, setRailOpen] = useState(false);

  if (!force) {
    return (
      <div className="topic-missing">
        <p>This topic does not exist.</p>
        <button className="btn" onClick={() => navigate('/forces')}>Back to the five forces</button>
      </div>
    );
  }

  if (!topic) return <ComingSoonTopic force={force} />;

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`topic-page${arriving ? ' topic-arrival' : ''}`} style={{ '--accent': topic.accent }}>
      <SiteHeader theme="dark" active="forces" />
      <div className="topic-shell">
        <LeftRail
          topic={topic}
          accent={topic.accent}
          onNav={goTo}
          onBack={() => navigate('/forces')}
          onData={() => navigate('/data')}
          open={railOpen}
          onToggle={() => setRailOpen((v) => !v)}
        />
      <main className="topic-body">
        <Level1Hero topic={topic} />

        <div className="l2-bridge">
          <span>{topic.name} in perspective</span>
          <h2>{topic.level1.bridgeTitle || `The 2040 ${topic.name.toLowerCase()} landscape`}</h2>
          <p>{topic.level1.framing}</p>
        </div>

        <section id="arguments" className="l2-wrap">
          {topic.level2.map((arg) => (
            <Level2Argument key={arg.n} arg={arg} accent={topic.accent} topicId={topic.id} />
          ))}
        </section>

        <TopicRail forces={forces} currentId={topic.id} onOpen={launch} />

        <SiteFooter theme="dark" />
      </main>
      </div>
    </div>
  );
}
