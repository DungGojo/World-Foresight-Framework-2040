import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTimeseries } from '../data/useTimeseries';
import catalog from '../data/catalog.json';
import FanChart from '../charts/FanChart';
import './Level3Explorer.css';

// Everything is read on the main scenario. For a single country the chart offers
// a view switch instead: the prediction (main path with its confidence interval),
// or the three modelled paths zoomed to the forecast window.
const SCENARIO_LABEL = 'Main';
const VIEWS = [
  { key: 'interval', label: 'Prediction' },
  { key: 'scenarios', label: 'Possible futures' },
];

// Country groupings for the picker — same regions as the framework page.
const REGIONS = [
  { name: 'Americas', codes: ['USA', 'CAN', 'MEX', 'BRA', 'ARG'] },
  { name: 'Europe', codes: ['DEU', 'FRA', 'GBR', 'ITA', 'NLD', 'POL', 'RUS', 'TUR', 'UKR'] },
  { name: 'East & Southeast Asia', codes: ['CHN', 'JPN', 'KOR', 'IDN', 'VNM', 'AUS'] },
  { name: 'South Asia', codes: ['IND', 'PAK', 'BGD'] },
  { name: 'Middle East & Gulf', codes: ['SAU', 'ARE', 'IRN', 'ISR', 'EGY'] },
  { name: 'Africa', codes: ['NGA', 'ZAF', 'ETH', 'KEN', 'COD'] },
  { name: 'Central Asia', codes: ['KAZ'] },
  { name: 'Global', codes: ['GLO'] },
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

// Switching indicator drops any selected country the new indicator has no data
// for, which can empty the selection entirely and leave the reader staring at a
// blank chart with no hint of what to click. Land on something readable
// instead: the world aggregate where the indicator carries one, then the
// largest economies, then whatever it does cover.
const PREFERRED_MARKETS = ['GLO', 'USA', 'CHN', 'RUS'];

const pickDefaultMarkets = (data, proxyId) => {
  const preferred = PREFERRED_MARKETS.find((code) => hasDataFor(data, proxyId, code));
  if (preferred) return [preferred];
  const covered = (data?.markets || []).find((market) => hasDataFor(data, proxyId, market.code));
  return covered ? [covered.code] : [];
};

export default function Level3Explorer({
  mode = 'full',
  topic = 'power',
  initialProxy = 'D1',
  initialMarkets = ['USA', 'CHN'],
  initialFrom = 2000,
  initialTo = 2040,
  onOpenFull,
}) {
  const compact = mode === 'compact';
  const [searchParams, setParams] = useSearchParams();
  // Seed from the URL on first render (only when it's the one being kept in
  // sync — a compact/embedded explorer shares the page's URL with something
  // else) so a reload lands back on the indicator/countries it left off on
  // instead of silently resetting to the defaults.
  const [proxy, setProxy] = useState(() => (
    compact ? initialProxy : (searchParams.get('proxy') || initialProxy)
  ));
  const [markets, setMarkets] = useState(() => {
    if (compact) return initialMarkets;
    const raw = searchParams.get('markets');
    if (raw === null) return initialMarkets;
    return raw.split(',').filter(Boolean);
  });
  const [q, setQ] = useState('');
  const [view, setView] = useState('chart');
  const [chartView, setChartView] = useState('interval');
  const scenario = 'main_scenario';

  // `topic='all'` searches every indicator through the small catalog and pulls
  // the owning topic's series file only once an indicator is chosen — so the
  // explorer covers all 190 without loading ~12 MB of series up front.
  const searchAll = topic === 'all';
  const catalogProxies = catalog.proxies;
  const owningTopic = searchAll
    ? (catalogProxies.find((item) => item.id === proxy)?.topic || 'power')
    : topic;
  const loaded = useTimeseries(owningTopic);
  const data = useMemo(() => {
    if (!searchAll) return loaded;
    // The catalog supplies the full indicator and market lists up front, so the
    // search box, indicator list and country picker stay live and clickable
    // even while the owning topic's series file is still in flight — only the
    // chart itself (which needs `series`) has to wait. Switching proxies
    // quickly across topics would otherwise blank out the entire picker on
    // every switch and silently drop clicks made while it was gone.
    return { ...(loaded || {}), proxies: catalogProxies, markets: catalog.markets };
  }, [loaded, searchAll, catalogProxies]);

  // Each timeseries file is already scoped to one topic by build_data.py
  // (a proxy tagged for two topics appears in both files), so no filtering here.
  const availableProxies = useMemo(() => (data ? data.proxies : []), [data]);

  useEffect(() => {
    if (availableProxies.length && !availableProxies.some((item) => item.id === proxy)) {
      setProxy(availableProxies[0].id);
    }
  }, [availableProxies, proxy]);

  const syncURL = (next) => {
    if (compact) return;
    const params = new URLSearchParams();
    params.set('proxy', next.proxy ?? proxy);
    params.set('markets', (next.markets ?? markets).join(','));
    setParams(params, { replace: true });
  };

  const seriesLoaded = Boolean(data?.series?.[proxy]);
  useEffect(() => {
    if (!seriesLoaded) return;
    const next = markets.filter((market) => hasDataFor(data, proxy, market));
    if (next.length === markets.length) return;
    // A proxy picked while its topic file was still loading (so changeProxy
    // couldn't check it yet) lands here once it arrives. If none of the
    // previously-selected countries survive, fall back rather than leaving
    // the chart with an empty selection — but only when there *was* a
    // selection; an explicit "Clear all" should stay cleared.
    let resolved = next;
    if (next.length === 0 && markets.length > 0) {
      const fallback = pickDefaultMarkets(data, proxy);
      if (fallback.length) resolved = fallback;
    }
    setMarkets(resolved);
    syncURL({ markets: resolved });
    // `markets` is intentionally a dep — it's how a resolved value gets
    // re-checked (and found already-stable) on the next render, converging
    // in one extra pass rather than looping. `syncURL`/`compact` close over
    // per-render values that don't need to retrigger this check themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, proxy, seriesLoaded, markets]);

  const filteredProxies = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return availableProxies;
    return availableProxies.filter((item) => (
      item.name.toLowerCase().includes(needle) || item.id.toLowerCase().includes(needle)
    ));
  }, [availableProxies, q]);

  if (!data) return <div className="l3"><div className="l3-loading">Loading data…</div></div>;

  const proxyMeta = data.proxies.find((item) => item.id === proxy) || availableProxies[0] || {};
  const marketHasData = (proxyId, marketCode) => hasDataFor(data, proxyId, marketCode);
  // Flex the chart's start year to whichever selected country has the
  // earliest observation for this indicator, instead of pinning every chart
  // to `initialFrom` (2000) — most indicators don't have full history back
  // that far for every market, and pinning it just wastes the left side of
  // the chart on a flat/empty run for markets that start later.
  const proxySeries = data.series?.[proxy];
  const dataStartYears = markets
    .map((market) => proxySeries?.[market]?.historical?.[0]?.[0])
    .filter((year) => year != null);
  const chartFrom = dataStartYears.length ? Math.min(...dataStartYears) : initialFrom;
  const changeProxy = (nextProxy) => {
    // Keep the current countries if the new indicator lives in a topic whose
    // series file has not arrived yet; the effect above prunes once it has.
    const known = Boolean(data.series?.[nextProxy]);
    let nextMarkets = known
      ? markets.filter((market) => marketHasData(nextProxy, market))
      : markets;
    // Don't leave the chart with nothing selected just because none of the
    // previously-chosen countries carry this indicator (e.g. switching from a
    // trade proxy to one only Global/USA report) — land on a sensible default
    // instead of a blank "select a country" chart. An explicit "Clear all"
    // (markets already empty before the switch) is left alone.
    if (known && markets.length > 0 && nextMarkets.length === 0) {
      nextMarkets = pickDefaultMarkets(data, nextProxy);
    }
    setProxy(nextProxy);
    setMarkets(nextMarkets);
    syncURL({ proxy: nextProxy, markets: nextMarkets });
  };
  const toggleMarket = (market) => {
    const next = markets.includes(market) ? markets.filter((item) => item !== market) : [...markets, market];
    setMarkets(next);
    syncURL({ markets: next });
  };

  // Regions only offer the countries that (a) exist in this dataset and (b) have
  // data for the current indicator — except while that indicator's own series
  // file is still loading, when there is nothing to check yet: filtering on it
  // then would empty out the whole country picker for a moment on every switch
  // into a not-yet-loaded topic, rather than just leaving the chart to show its
  // own loading state.
  const regionGroups = REGIONS.map((region) => ({
    name: region.name,
    markets: region.codes
      .map((code) => data.markets.find((m) => m.code === code))
      .filter(Boolean)
      .filter((m) => !seriesLoaded || marketHasData(proxy, m.code)),
  })).filter((region) => region.markets.length > 0);

  const toggleRegion = (region) => {
    const codes = region.markets.map((m) => m.code);
    const allOn = codes.every((code) => markets.includes(code));
    const next = allOn
      ? markets.filter((code) => !codes.includes(code))
      : [...new Set([...markets, ...codes])];
    setMarkets(next);
    syncURL({ markets: next });
  };
  const statistics = markets.length === 1 ? data.statistics?.[proxy]?.[markets[0]] : null;
  const singleCountry = markets.length === 1;
  const activeChartView = singleCountry ? chartView : 'interval';
  const countryName = markets.length === 1 ? data.markets.find((item) => item.code === markets[0])?.name : null;

  const chart = (
    <div className="l3-chartwrap" role="tabpanel">
      <div className="l3-chart-heading">
        <div className="l3-title-group">
          <div className="l3-charttitle">{proxyMeta.name || proxy}</div>
          {statistics ? (
            <div className="l3-signal-inline" aria-label={`Historical signal for ${countryName}`}>
              {Object.entries(STAT_LABELS).map(([key, label]) => (
                <span className="l3-signal-item" key={key}><small>{label}</small><b>{showStat(key, statistics[key])}</b></span>
              ))}
            </div>
          ) : null}
          {!markets.length ? <p className="l3-selection-note">Select one country to reveal its historical signal and forecast range.</p> : null}
        </div>
        <div className="l3-chart-aside">
          {singleCountry && (
            <div className="l3-viewswitch" role="group" aria-label="Forecast view">
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  className={`l3-seg${chartView === v.key ? ' on' : ''}`}
                  aria-pressed={chartView === v.key}
                  onClick={() => setChartView(v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <span className="l3-chart-unit">{proxyMeta.unit || 'Value'}</span>
        </div>
      </div>
      {seriesLoaded ? (
        <FanChart
          series={data}
          proxy={proxy}
          markets={markets}
          scenario={scenario}
          scenarioLabel={SCENARIO_LABEL}
          mode={activeChartView}
          yLabel={proxyMeta.unit}
          from={chartFrom}
          to={initialTo}
          height={compact ? 250 : 410}
          statistics={statistics}
        />
      ) : (
        // The indicator's own topic file is still in flight (a fresh switch
        // into a topic not loaded yet this session) — distinct from FanChart's
        // "no data for this selection" message, which would otherwise flash
        // here for a moment and read as a dead end rather than a pending load.
        <div className="chart"><div className="chart-empty">Loading chart…</div></div>
      )}
      {proxyMeta.description ? <p className="l3-desc">{proxyMeta.description}</p> : null}
    </div>
  );

  return (
    <div className={`l3${compact ? ' compact' : ''}${mode === 'global' ? ' global' : ''}`}>
      <div className="l3-controls">
        <div className="l3-field">
          <label>Indicator <em>{filteredProxies.length} of {availableProxies.length}</em></label>
          <input
            className="l3-search"
            placeholder="Search all indicators…"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
          <div className="l3-proxy-list" role="listbox" aria-label="Indicators">
            {filteredProxies.length === 0 ? (
              <p className="l3-noresults">No indicator matches “{q}”.</p>
            ) : filteredProxies.map((item) => (
              <button
                key={item.id}
                role="option"
                aria-selected={item.id === proxy}
                className={`l3-proxy-option${item.id === proxy ? ' on' : ''}`}
                onClick={() => changeProxy(item.id)}
                title={item.name}
              >
                <b>{item.name}</b>
                <span>{item.id}</span>
              </button>
            ))}
          </div>
          {proxyMeta.unit ? <div className="l3-unit">Unit: {proxyMeta.unit}</div> : null}
        </div>

        <div className="l3-field l3-field-countries">
          <label>
            Countries <em>{markets.length} selected</em>
            {markets.length > 0 && (
              <button className="l3-clear" onClick={() => { setMarkets([]); syncURL({ markets: [] }); }}>
                Clear all
              </button>
            )}
          </label>
          <div className="l3-region-grid" role="group" aria-label="Countries by region">
            {regionGroups.map((region) => {
              const codes = region.markets.map((m) => m.code);
              const allOn = codes.every((code) => markets.includes(code));
              const someOn = !allOn && codes.some((code) => markets.includes(code));
              return (
                <div className="l3-region" key={region.name}>
                  <button
                    className={`l3-region-head${allOn ? ' on' : ''}${someOn ? ' partial' : ''}`}
                    onClick={() => toggleRegion(region)}
                    aria-pressed={allOn}
                    title={allOn ? `Deselect all in ${region.name}` : `Select all in ${region.name}`}
                  >
                    <i aria-hidden="true" />
                    <span>{region.name}</span>
                  </button>
                  <div className="l3-region-countries">
                    {region.markets.map((market) => (
                      <label
                        key={market.code}
                        className={`l3-country-option${markets.includes(market.code) ? ' on' : ''}`}
                        title={market.name}
                      >
                        <input
                          type="checkbox"
                          checked={markets.includes(market.code)}
                          onChange={() => toggleMarket(market.code)}
                        />
                        <span>{market.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {compact ? <>{chart}<button className="btn" onClick={onOpenFull}>Open full data view</button></> : (
        <>
          <div className="l3-toolbar">
            <div className="l3-tabs" role="tablist" aria-label="Data view">
              {[['chart', 'Chart'], ['methodology', 'Information']].map(([tab, label]) => (
                <button key={tab} className={view === tab ? 'on' : ''} onClick={() => setView(tab)} role="tab" aria-selected={view === tab}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {view === 'chart' ? chart : (
            <div className="l3-method" role="tabpanel">
              <div><span>Indicator</span><h3>{proxyMeta.name || proxy}</h3><p>{proxyMeta.description || 'Indicator documentation is being prepared.'}</p></div>
              <div><span>Source</span><h3>{proxyMeta.source || 'Framework data pipeline'}</h3><p>Historical observations are standardized before scenario modelling. Each future path is modelled separately and carries its own confidence interval.</p></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
