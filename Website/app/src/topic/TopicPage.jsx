import { useParams } from 'react-router-dom';
import { getTopic } from '../content/topics';
import { forceById, forces } from '../content/site';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import Level1Hero from './Level1Hero';
import Level2Argument from './Level2Argument';
import TopicRail from './TopicRail';
import ComingSoonTopic from './ComingSoonTopic';
import './TopicPage.css';

export default function TopicPage() {
  const { topicId } = useParams();
  const topic = getTopic(topicId);
  const force = forceById[topicId];
  const navigate = useSmoothNavigate();

  if (!force) {
    return (
      <div className="topic-missing">
        <p>This topic does not exist.</p>
        <button className="btn" onClick={() => navigate('/forces')}>Back to the five forces</button>
      </div>
    );
  }

  if (!topic) return <ComingSoonTopic force={force} />;

  return (
    <div className="topic-page" style={{ '--accent': topic.accent }}>
      <SiteHeader theme="dark" active="forces" />
      <main className="topic-body">
        <Level1Hero topic={topic} />

        <div className="l2-bridge">
          <span>Power in perspective</span>
          <h2>The 2040 power landscape</h2>
          <p>{topic.level1.framing}</p>
        </div>

        <section id="arguments" className="l2-wrap">
          {topic.level2.map((arg) => <Level2Argument key={arg.n} arg={arg} accent={topic.accent} />)}
        </section>

        <TopicRail forces={forces} currentId={topic.id} onOpen={(next) => navigate(next.href)} />

        <SiteFooter theme="dark" />
      </main>
    </div>
  );
}
