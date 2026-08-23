import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { forces } from '../content/site';
import { asset } from '../lib/assets';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ForceGlyph from '../components/ForceGlyph';
import ArrowIcon from '../components/ArrowIcon';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import './Hub.css';

const forceReasons = {
  power: {
    question: 'Who decides?',
    text: 'Power determines who can set rules, mobilise resources and shape the choices available to everyone else. Tracking its distribution reveals whether the world is concentrating, fragmenting or learning to operate without a single centre.',
  },
  tech: {
    question: 'What changes what is possible?',
    text: 'Technology changes the speed and scale of every other force. It redistributes productive capacity, strategic advantage and access to opportunity long before institutions have time to adapt.',
  },
  planet: {
    question: 'What limits can no one negotiate away?',
    text: 'Climate, energy, food and water define the physical boundary of every future. Planetary pressure turns distant risks into immediate constraints on security, migration and growth.',
  },
  people: {
    question: 'How do societies themselves change?',
    text: 'Population, ageing, migration and urbanisation reshape demand, labour and political legitimacy. People are not simply affected by the future; their movement and choices actively create it.',
  },
  economy: {
    question: 'How is value organised?',
    text: 'The economy connects capital, production, trade and resilience. It shows where opportunities accumulate, where vulnerabilities travel and how quickly shocks move between countries.',
  },
};

// The topic accents are tuned for light backgrounds; on this dark page they read
// almost black, so the force rows use lifted variants.
const forceAccentOnDark = {
  power: '#db938d', tech: '#8bafc9', planet: '#a5ba8a', people: '#debd90', economy: '#b2abbf',
};

const countryRegions = [
  { name: 'Americas', countries: [['United States', 'us'], ['Canada', 'ca'], ['Mexico', 'mx'], ['Brazil', 'br'], ['Argentina', 'ar']] },
  { name: 'Europe', countries: [['Germany', 'de'], ['France', 'fr'], ['United Kingdom', 'gb'], ['Italy', 'it'], ['Russia', 'ru'], ['Turkey', 'tr'], ['Poland', 'pl'], ['Netherlands', 'nl'], ['Ukraine', 'ua']] },
  { name: 'East & Southeast Asia', countries: [['China', 'cn'], ['Japan', 'jp'], ['South Korea', 'kr'], ['Indonesia', 'id'], ['Australia', 'au'], ['Vietnam', 'vn']] },
  { name: 'South Asia', countries: [['India', 'in'], ['Pakistan', 'pk'], ['Bangladesh', 'bd']] },
  { name: 'Middle East & Gulf', countries: [['Saudi Arabia', 'sa'], ['United Arab Emirates', 'ae'], ['Iran', 'ir'], ['Israel', 'il'], ['Egypt', 'eg']] },
  { name: 'Africa', countries: [['Nigeria', 'ng'], ['South Africa', 'za'], ['Ethiopia', 'et'], ['Kenya', 'ke'], ['DR Congo', 'cd']] },
  { name: 'Central Asia', countries: [['Kazakhstan', 'kz']] },
];

const method = [
  { n: '01', title: 'Historical evidence', text: 'Comparable country series establish how each force has changed since 2000, including breaks, volatility and missingness.' },
  { n: '02', title: 'Bounded projections', text: 'Damped trend models extend each series to 2040 while preventing short-term movements from becoming implausible straight lines.' },
  { n: '03', title: 'Three scenarios', text: 'Main, optimistic and pessimistic paths separate alternative futures from the confidence interval around each estimate.' },
  { n: '04', title: 'Challengeable arguments', text: 'Analytical functions combine indicators into claims whose evidence, assumptions and external sources remain visible.' },
];

function CountryAtlas() {
  return (
    <section className="country-atlas" aria-labelledby="countries-title">
      <header className="section-heading country-atlas-heading">
        <h2 id="countries-title">Countries in focus</h2>
      </header>
      <div className="region-list">
        {countryRegions.map((region) => (
          <article className="region-row" key={region.name}>
            <header><h3>{region.name}</h3></header>
            <div className="region-countries">
              {region.countries.map(([name, code]) => (
                <div className="country-token" key={code} title={name}>
                  <img src={asset(`assets/flags/${code}.svg`)} alt="" aria-hidden="true" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Hub() {
  const location = useLocation();
  const navigate = useSmoothNavigate();
  const [storyArrival] = useState(() => Boolean(location.state?.fromStory));

  return (
    <div className={`hub-page page-shell${storyArrival ? ' story-arrival' : ''}`}>
      <div className="hub-header"><SiteHeader theme="dark" active="framework" /></div>
      <main className="framework-intro">
        <div className="framework-stars" aria-hidden="true" />

        <section className="framework-hero page-container">
          <div className="framework-copy">
            <h1>How the framework reads a changing world.</h1>
            <p>World Foresight Framework does not promise one prediction. It follows evidence across countries, tests three future paths and examines what happens when the forces shaping 2040 collide.</p>
            <div className="framework-actions">
              <button className="framework-cta" onClick={() => navigate('/')}>
                <span>Replay the story</span><ArrowIcon />
              </button>
              <button className="framework-cta primary" onClick={() => navigate('/forces')}>
                <span>Explore forces</span><ArrowIcon />
              </button>
            </div>
          </div>
          <div className="scope-graphic" aria-label="Framework scope: 34 countries, 190 indicators and three scenarios">
            <div className="scope-rings" aria-hidden="true"><i /><i /><i /></div>
            <div className="scope-core"><b>34</b><span>countries</span></div>
            <div className="scope-stat s-one"><b>190</b><span>indicators</span></div>
            <div className="scope-stat s-two"><b>3</b><span>scenarios</span></div>
            <div className="scope-stat s-three"><b>2000–2040</b><span>evidence horizon</span></div>
          </div>
        </section>

        <section id="why-five" className="why-forces page-container" aria-labelledby="why-title">
          <header className="section-heading why-heading">
            <h2 id="why-title">Why these five?</h2>
            <p>Each force answers a different part of the same question. Together they describe who decides, what changes, what constrains us, how societies evolve and how material life is organised.</p>
          </header>
          <div className="why-force-list">
            {forces.map((force, index) => (
              <article className="why-force-row" key={force.id} style={{ '--accent': forceAccentOnDark[force.id] || force.color }}>
                <span className="why-force-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="why-force-icon"><ForceGlyph id={force.id} /></span>
                <h3>{force.name}</h3>
                <div><b>{forceReasons[force.id].question}</b><p>{forceReasons[force.id].text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <div className="page-container"><CountryAtlas /></div>

        <section className="methodology page-container" aria-labelledby="method-title">
          <header className="section-heading methodology-heading">
            <h2 id="method-title">How this foresight is built</h2>
          </header>
          <div className="method-strip">
            {method.map((item, index) => (
              <article className="method-step" key={item.n}>
                <span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p>{index < method.length - 1 ? <ArrowIcon /> : null}
              </article>
            ))}
          </div>
        </section>

      </main>

      <SiteFooter theme="dark" />
    </div>
  );
}
