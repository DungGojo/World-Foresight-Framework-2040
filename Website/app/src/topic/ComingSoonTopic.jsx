import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ForceGlyph from '../components/ForceGlyph';
import ArrowIcon from '../components/ArrowIcon';
import TopicRail from './TopicRail';
import { forces } from '../content/site';
import useSmoothNavigate from '../hooks/useSmoothNavigate';

const questions = {
  tech: 'How will intelligent systems redistribute capability, work and control?',
  planet: 'Can adaptation move quickly enough for a hotter, more constrained world?',
  people: 'How will ageing, migration and belonging reshape the social contract?',
  economy: 'Will the global economy integrate, fracture or reorganize around resilience?',
};

export default function ComingSoonTopic({ force }) {
  const navigate = useSmoothNavigate();
  return (
    <div className="coming-topic" style={{ '--accent': force.color }}>
      <SiteHeader theme="dark" active="forces" />
      <main className="coming-topic-main">
        <div className="coming-orbits" aria-hidden="true"><i /><i /><i /></div>
        <span className="coming-icon"><ForceGlyph id={force.id} /></span>
        <div className="coming-status">In development</div>
        <h1>{force.name}</h1>
        <h2>{questions[force.id]}</h2>
        <p>{force.teaser}</p>
        <div className="coming-actions">
          <button className="btn on-dark" onClick={() => navigate('/forces')}>Back to the five forces</button>
          <button className="coming-power" onClick={() => navigate('/topic/power')}>Explore the live Power topic <ArrowIcon /></button>
        </div>
      </main>
      <TopicRail forces={forces} currentId={force.id} onOpen={(next) => navigate(next.href)} />
      <SiteFooter theme="dark" />
    </div>
  );
}
