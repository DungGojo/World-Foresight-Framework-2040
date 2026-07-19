import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTimeseries } from '../data/useTimeseries';
import FanChart from '../charts/FanChart';
import './Level3Explorer.css';

const SCENARIOS = [
  { key: 'main_scenario', label: 'Main' },
  { key: 'optimistic_scenario', label: 'Optimistic' },
  { key: 'pessimistic_scenario', label: 'Pessimistic' },
];

const STAT_LABELS = {
  change_direction: 'Direction',
  change_speed: 'Speed',
  uncertainty_level: 'Uncertainty',
};

const showStat = (key, value) => {
  if (value == null || value === '') return '—';
  if (key.startsWith('cagr_')) return `${(Number(value) * 100).toFixed(1)}%`;
  return String(value).toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
};

const hasDataFor = (data, proxyId, marketCode) => {
  const branches = data?.series?.[proxyId]?.[marketCode];
  return Boolean(branches && Object.values(branches).some((rows) => (
    Array.isArray(rows) && rows.some((point) => point?.[1] != null)
  )));
};

export default function Level3Explorer({
  mode = 'full',
  topicFilter = 'all',
  initialProxy = 'D1',
  initialMarkets = ['USA', 'CHN'],
  initialScenario = 'main_scenario',
  initialFrom = 2000,
  initialTo = 2040,
  onOpenFull,
}) {
  const data = useTimeseries();
  const [, setParams] = useSearchParams();
  const [proxy, setProxy] = useState(initialProxy);
  const [markets, setMarkets] = useState(initialMarkets);
  const [scenario, setScenario] = useState(initialScenario);
  const [q, setQ] = useState('');
  const [view, setView] = useState('chart');
  const compact = mode === 'compact';

  const availableProxies = useMemo(() => {
    if (!data) return [];
    return data.proxies.filter((item) => topicFilter === 'all' || item.topic === topicFilter);
  }, [data, topicFilter]);

  useEffect(() => {
    if (availableProxies.length && !availableProxies.some((item) => item.id === proxy)) {
      setProxy(availableProxies[0].id);
    }
  }, [availableProxies, proxy]);

  useEffect(() => {
    if (!data || !proxy) return;
    setMarkets((current) => {
      const next = current.filter((market) => hasDataFor(data, proxy, market));
      return next.length === current.length ? current : next;
    });
  }, [data, proxy]);

  const syncURL = (next) => {
    if (compact) return;
    const params = new URLSearchParams();
    params.set('proxy', next.proxy ?? proxy);
    params.set('markets', (next.markets ?? markets).join(','));
    params.set('scenario', next.scenario ?? scenario);
    setParams(params, { replace: true });
  };

  const filteredProxies = useMemo(() => availableProxies.filter((item) => (
    item.id === proxy || !q || item.name.toLowerCase().includes(q.toLowerCase())
  )), [availableProxies, proxy, q]);

  if (!data) return <div className="l3"><div className="l3-loading">Loading data…</div></div>;

  const proxyMeta = data.proxies.find((item) => item.id === proxy) || availableProxies[0] || {};
  const scenarioMeta = SCENARIOS.find((item) => item.key === scenario) || SCENARIOS[0];
  const marketHasData = (proxyId, marketCode) => hasDataFor(data, proxyId, marketCode);
  const changeProxy = (nextProxy) => {
    const nextMarkets = markets.filter((market) => marketHasData(nextProxy, market));
    setProxy(nextProxy);
    setMarkets(nextMarkets);
    syncURL({ proxy: nextProxy, markets: nextMarkets });
  };
  const toggleMarket = (market) => {
    const next = markets.includes(market) ? markets.filter((item) => item !== market) : [...markets, market];
    setMarkets(next);
    syncURL({ markets: next });
  };
  const statistics = markets.length === 1 ? data.statistics?.[proxy]?.[markets[0]] : null;
  const countryName = markets.length === 1 ? data.markets.find((item) => item.code === markets[0])?.name : null;

  const chart = (
    <div className="l3-chartwrap" role="tabpanel">
      <div className="l3-chart-heading">
        <div className="l3-title-group">
          <div className="l3-charttitle">{proxyMeta.name || proxy}</div>
          <span>{scenarioMeta.label} scenario</span>
          {statistics ? (
            <div className="l3-signal-inline" aria-label={`Historical signal for ${countryName}`}>
              {Object.entries(STAT_LABELS).map(([key, label]) => (
                <span className="l3-signal-item" key={key}><small>{label}</small><b>{showStat(key, statistics[key])}</b></span>
              ))}
            </div>
          ) : null}
          {!markets.length ? <p className="l3-selection-note">Select one country to reveal its historical signal and forecast range.</p> : null}
        </div>
        <span className="l3-chart-unit">{proxyMeta.unit || 'Value'}</span>
      </div>
      <FanChart
        series={data}
        proxy={proxy}
        markets={markets}
        scenario={scenario}
        scenarioLabel={scenarioMeta.label}
        yLabel={proxyMeta.unit}
        from={initialFrom}
        to={initialTo}
        height={compact ? 250 : 410}
        statistics={statistics}
      />
      {proxyMeta.description ? <p className="l3-desc">{proxyMeta.description}</p> : null}
    </div>
  );

  return (
    <div className={`l3${compact ? ' compact' : ''}${mode === 'global' ? ' global' : ''}`}>
      <div className="l3-controls">
        <div className="l3-field">
          <label>Indicator</label>
          <input className="l3-search" placeholder="Search indicators…" value={q} onChange={(event) => setQ(event.target.value)} />
          <select value={proxy} onChange={(event) => changeProxy(event.target.value)}>
            {filteredProxies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          {proxyMeta.unit ? <div className="l3-unit">Unit: {proxyMeta.unit}</div> : null}
        </div>

        <div className="l3-field">
          <label>Countries</label>
          <div className="l3-country-list" role="group" aria-label="Countries">
            {data.markets.map((market) => {
              const available = marketHasData(proxy, market.code);
              const checked = available && markets.includes(market.code);
              return (
                <label
                  key={market.code}
                  className={`l3-country-option${available ? '' : ' unavailable'}`}
                  title={available ? market.name : `No data for ${market.name} for this indicator`}
                >
                  <input type="checkbox" checked={checked} disabled={!available} onChange={() => toggleMarket(market.code)} />
                  <span>{market.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="l3-field">
          <label>Scenario</label>
          <div className="l3-scenarios">
            {SCENARIOS.map((item) => (
              <button key={item.key} className={`l3-seg${scenario === item.key ? ' on' : ''}`} onClick={() => { setScenario(item.key); syncURL({ scenario: item.key }); }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {compact ? <>{chart}<button className="btn" onClick={onOpenFull}>Open full data view</button></> : (
        <>
          <div className="l3-toolbar">
            <div className="l3-tabs" role="tablist" aria-label="Data view">
              {['chart', 'methodology'].map((tab) => (
                <button key={tab} className={view === tab ? 'on' : ''} onClick={() => setView(tab)} role="tab" aria-selected={view === tab}>
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {view === 'chart' ? chart : (
            <div className="l3-method" role="tabpanel">
              <div><span>Indicator</span><h3>{proxyMeta.name || proxy}</h3><p>{proxyMeta.description || 'Indicator documentation is being prepared.'}</p></div>
              <div><span>Source</span><h3>{proxyMeta.source || 'Framework data pipeline'}</h3><p>Historical observations are standardized before scenario modelling. Each future path is modelled separately and carries its own confidence interval.</p></div>
              <div><span>Unit</span><h3>{proxyMeta.unit || 'Index value'}</h3><p>The line joins the latest historical observation to the selected scenario so the trajectory remains continuous without inventing an extra observation.</p></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
