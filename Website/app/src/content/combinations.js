// How people, firms and states behave for every subset of the five forces —
// 31 combinations plus the empty state, keyed by force ids sorted alphabetically
// and joined with '|'. Sourced from Website/COMBINATION-BEHAVIOURS.md — singles
// reproduce each topic's own level1.behaviour, pairs are the original ten, and
// triples/quadruples/all-five are new. Every quantitative claim in a 'why' line
// traces to the pipeline (content/topics/*.js), validated by the anchor checks in
// scripts/build_data.py — no numbers were invented for this file.
export const COMBINATIONS = {
  // Economy
  "economy": {
    title: "Integration holds. Shock absorption does not.",
    behaviour: "If integration persists but shock absorption does not, the decisive variable is not exposure to the world economy but access to cheap money when things break. Balance-sheet strength becomes the real dividing line between countries, firms and households.",
    why: "Trade openness rises from 65.7% to 67.1% of GDP and applied tariffs fall in 32 of 34 countries, while current-account dispersion rises 53.9%, government debt dispersion 7.2% and interest burden 6.4%. Financial resilience is the most uniformly diverging question set in the whole framework.",
    evidence: "UNCTAD puts developing countries' external debt at a record US$11.4 trillion with US$847 billion of net interest paid in 2023, and 54 countries spending at least 10% of government revenue on interest. Borrowing costs run six to twelve times Germany's. (UNCTAD, Mar 2025)",
    signals: [
      { title: "Africa's public debt amid global headwinds", publisher: "Bank for International Settlements", date: "Aug 2026", url: "https://www.bis.org/publ/bisbull132.htm" },
      { title: "US capital demand for AI and defense fuels beginnings of a debt crisis", publisher: "Le Monde", date: "Aug 2026", url: "https://www.lemonde.fr/en/economy/article/2026/08/20/us-demand-for-capital-for-ai-and-defense-fuels-the-beginnings-of-a-debt-crisis_6756698_19.html" },
      { title: "Is global trade and financial fragmentation here to stay?", publisher: "World Economic Forum", date: "Jun 2026", url: "https://www.weforum.org/stories/financial-and-monetary-systems/is-global-trade-and-financial-fragmentation-here-to-stay/" },
      { title: "Fragmenting world worsens the finance squeeze on developing countries", publisher: "United Nations", date: "Apr 2026", url: "https://www.un.org/en/desa/fsdr-2026" },
      { title: "Global balance sheet 2026: Imbalance and divergence", publisher: "McKinsey Global Institute", date: "Jul 2026", url: "https://www.mckinsey.com/mgi/our-research/the-global-balance-sheet-2026-imbalance-and-divergence" },
    ],
  },
  // People
  "people": {
    title: "Healthier, better educated, and angrier.",
    behaviour: "If capability rises while the channels for expressing grievance narrow, the pressure does not disappear. It relocates, into migration, into protest, and into politics that reject the existing settlement. The scarce resource is not human capital; it is institutions able to absorb what human capital demands.",
    why: "Health, schooling and service coverage converge almost everywhere (UHC dispersion down 10.5%, upper-secondary completion up to 73.2%) while freedom of peaceful assembly falls in 27 of 34 countries, demonstrations rise from 31.6 to 35.3 per million and political-violence fatalities rise 34%.",
    evidence: "The 2025–26 youth protest wave (Nepal, Indonesia, Madagascar, Morocco, the Philippines, France, Bulgaria) was organised on Discord, TikTok and Telegram and brought down or forced back several governments, without changing the underlying fiscal settlement anywhere.",
    signals: [
      { title: "How Gen Z's anger became a global movement in 2025", publisher: "France 24", date: "Dec 2025", url: "https://www.france24.com/en/asia-pacific/20251227-we-won-t-stop-how-gen-z-s-anger-became-a-global-movement-in-2025" },
      { title: "How India's Gen Z movement dented Modi's political image", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/4358744e9d890b92ffdd2477bbd99e8a" },
      { title: "South Asia's Gen Z revolutions now face difficult realities", publisher: "Chatham House", date: "Jun 2026", url: "https://www.chathamhouse.org/2026/06/south-asias-gen-z-revolutions-now-face-difficult-realities" },
      { title: "Can Gen Z protests reshape governance in Africa?", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/can-gen-z-protests-reshape-governance-africa" },
      { title: "What Gen Z protests reveal about Kenya's democracy", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/what-gen-z-protests-reveal-about-kenyas-democracy/" },
    ],
  },
  // Planet
  "planet": {
    title: "Everyone adapts a little. Nobody changes place.",
    behaviour: "If the hazard is certain, your position in the queue is inherited and the transition is partial, then climate becomes a location and insurance problem rather than a policy one. Where you live, what you own there, and whether anyone will underwrite it become the decisions that matter.",
    why: "Exposure and adaptive capacity have the same −0.50 correlation in both 2025 and 2040. Vulnerability improves in 33 of 34 countries and coping capacity in 31, yet the dispersion of all three adaptation measures stays flat. Progress is widespread, but the hierarchy remains exactly the same. Days above 35°C rise in all 34 countries.",
    evidence: "UNEP's Adaptation Gap Report 2025, subtitled 'Running on Empty', puts developing-country adaptation needs at US$310–365 billion a year by 2035, compared with US$26 billion of international public adaptation finance in 2023. That leaves a gap of 12 to 14 times. (UNEP, Oct 2025)",
    signals: [
      { title: "Florida shows how coastal cities can adapt to rising seas and storms", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/5a96158c5188a0f51ff64a516fe22683" },
      { title: "How America is adapting to climate extremes", publisher: "Axios", date: "Aug 2026", url: "https://www.axios.com/2026/08/03/us-climate-change-adaptation-extreme-weather" },
      { title: "Strong El Niño expected to intensify", publisher: "World Meteorological Organization", date: "Jul 2026", url: "https://wmo.int/news/media-centre/strong-el-nino-expected-intensify" },
      { title: "The hidden links between heat, water and energy", publisher: "World Meteorological Organization", date: "May 2026", url: "https://wmo.int/media/news/hidden-links-between-heat-water-and-energy" },
      { title: "Earth's climate swings increasingly out of balance", publisher: "World Meteorological Organization", date: "Mar 2026", url: "https://wmo.int/news/media-centre/earths-climate-swings-increasingly-out-of-balance" },
    ],
  },
  // Power
  "power": {
    title: "No one runs the world in 2040.",
    behaviour: "No single patron, currency, institution or technology standard can be assumed to win. So states, firms and individuals hedge everything: a foot in both camps, more than one currency, both technology stacks. Refusing to choose becomes the strategy.",
    why: "US share of world power runs 25.2% (2025) to 24.7% (2040) against China's 19.9% to 20.7%; the US leads in every anchor year and in every scenario run, with the gap only narrowing from 5.3 to 4.0 points. Below the two giants the field will not pick sides. 15 hedgers against a single unambiguously West-aligned state by 2040.",
    evidence: "China's rare-earth export-licensing regime, in force since April 2025 and covering 61% of mined supply and 91% of refining capacity, showed that leverage in this world sits in chokepoints rather than overall size, and that both giants control some of them. (S&P Global, Jan 2026)",
    signals: [
      { title: "China's Rare Earth Export Controls and Security Exceptions", publisher: "Institute of Geoeconomics", date: "Jul 2026", url: "https://instituteofgeoeconomics.org/en/research/2026070202/" },
      { title: "What Is the BRICS Group and Why Is It Expanding?", publisher: "Council on Foreign Relations", date: "Jun 2025", url: "https://www.cfr.org/backgrounders/what-brics-group-and-why-it-expanding" },
      { title: "Rare earth export restrictions one year later", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/rare-earth-export-restrictions-one-year-later" },
      { title: "Why the West keeps losing critical mineral assets to China", publisher: "CSIS", date: "Jun 2026", url: "https://www.csis.org/analysis/why-west-keeps-losing-critical-mineral-assets-china" },
      { title: "US and others turn to Brazil for rare earths as competition with China intensifies", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/d247150492581197cfa9614c9437c4c2" },
    ],
  },
  // Technology
  "tech": {
    title: "Universally available, narrowly owned.",
    behaviour: "When access is universal but capability is not, the scarce goods become skills, ownership and trust. The rational moves are to own rather than use, to build provenance into anything that matters, and to assume that whatever you can do with the network, your government can do to you.",
    why: "Internet use converges from a 34-country mean of 81.6% to 90.5% with dispersion down 47%, while secure servers per million keep a 326x top-to-bottom-decile ratio and only 8 of 30 countries collect more intellectual-property rent than they pay. Access is a solved problem; ownership is not.",
    evidence: "Freedom House recorded a 15th consecutive annual decline in global internet freedom, driven by both authoritarian repression and backsliding in democracies. The ownership gap and the control gap are widening at the same time. (Freedom House, Freedom on the Net)",
    signals: [
      { title: "Three factors reshaping the internet at an inflection point", publisher: "World Economic Forum", date: "Jul 2026", url: "https://www.weforum.org/stories/artificial-intelligence/dynamics-reshaping-the-internet-inflection-point/" },
      { title: "How to bridge the global AI divide", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/how-to-bridge-the-global-ai-divide/" },
      { title: "What US and Chinese AI dominance means for the world", publisher: "Rest of World", date: "Jun 2026", url: "https://restofworld.org/2026/ai-divide-america-china-world/" },
      { title: "Is AI sovereignty possible? Balancing autonomy and interdependence", publisher: "Brookings", date: "Feb 2026", url: "https://www.brookings.edu/articles/is-ai-sovereignty-possible-balancing-autonomy-and-interdependence/" },
      { title: "Greece seeks to put humanity ahead of AI in its constitution", publisher: "Associated Press", date: "May 2026", url: "https://apnews.com/article/a9d0c3963bfffefd370a1e224895ee60" },
    ],
  },
  // People + Economy
  "economy|people": {
    title: "Who Gets the Growth",
    behaviour: "Expectations outrun delivery. Capability and connectivity keep rising while tax capacity and social spending stay flat, and the gap surfaces as political pressure rather than as consumption.",
    why: "Every distributional indicator in the Economy topic returns the verdict 'stable': employment-to-population 58.6% to 58.8%, tax revenue 14.4% to 14.6% of GDP, social expenditure 23.8% to 24.3%. Meanwhile People finds capability converging upward across health and education, and polarisation rising in 31 of 34 countries. Growth happens; the split does not change.",
    evidence: "The 2025–26 protest wave (Nepal, Madagascar, Morocco, Indonesia, France, Bulgaria) was triggered by budgets, allowances and cost of living rather than by ideology, and several governments fell without any change to the fiscal settlement that caused it.",
    signals: [
      { title: "The 2025 Surge in Gen Z Protests Is Continuing in 2026", publisher: "European Democracy Hub", date: "2026", url: "https://europeandemocracyhub.epd.eu/the-2025-surge-in-global-protests-is-continuing-in-2026/" },
      { title: "Gen Z helped topple governments around the world in 2025", publisher: "The Globe and Mail", date: "Dec 2025", url: "https://www.theglobeandmail.com/world/article-gen-z-protests-2025-social-media-nepal-peru-indonesia-madagascar/" },
      { title: "What Gen Z protests reveal about Kenya's democracy", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/what-gen-z-protests-reveal-about-kenyas-democracy/" },
      { title: "How India's Gen Z movement dented Modi's political image", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/4358744e9d890b92ffdd2477bbd99e8a" },
      { title: "Africa's public debt amid global headwinds", publisher: "Bank for International Settlements", date: "Aug 2026", url: "https://www.bis.org/publ/bisbull132.htm" },
    ],
  },
  // Planet + Economy
  "economy|planet": {
    title: "Pricing a Hotter World",
    behaviour: "Physical risk enters the cost of capital. Insurance availability, rather than emissions policy, becomes the mechanism that actually moves activity away from exposed places.",
    why: "Planet finds exposure knowable, unequal and static; Economy finds financial resilience the most uniformly diverging question set in the framework. The two intersect where capital is dearest. In 2040, the interest burden is heaviest in Egypt (36% of revenue), India (32%), Kenya (30%) and Bangladesh (21%), the same countries carrying the worst exposure-to-capacity gaps.",
    evidence: "California's insurer of last resort grew 152% to more than 684,000 policies by March 2026; France raised its CatNat surcharge from 12% to 20% in January 2025; and EIOPA reports 75% of European natural-catastrophe losses have historically gone uninsured. (Insurance Journal, Jun 2026)",
    signals: [
      { title: "How Climate Change Is Creating Uninsurable Areas Across Europe", publisher: "Insurance Journal", date: "Jun 2026", url: "https://www.insurancejournal.com/news/international/2026/06/02/871921.htm" },
      { title: "Insurance Protection Gaps in a Changing Climate", publisher: "EIOPA", date: "Apr 2026", url: "https://www.eiopa.europa.eu/insurance-protection-gaps-changing-climate-2026-04-16_en" },
      { title: "Natural-Disaster Insurance Gap Now Tops $420B Globally", publisher: "Claims Journal", date: "Jun 2026", url: "https://www.claimsjournal.com/news/national/2026/06/03/337953.htm" },
      { title: "A proposal for a US federal property reinsurer", publisher: "Brookings", date: "Mar 2026", url: "https://www.brookings.edu/articles/a-proposal-for-a-us-federal-property-reinsurer/" },
      { title: "The significance of the World Bank's climate retreat", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/the-significance-of-the-world-banks-climate-retreat/" },
    ],
  },
  // Power + Economy
  "economy|power": {
    title: "The Sanctions Decade",
    behaviour: "Balance sheets get arranged for political risk rather than for return. Firms hold redundant banking relationships and settlement routes on the assumption that access can be withdrawn.",
    why: "Power finds the rules lever declining (UN peacekeeping down 47% to 166,000 personnel by 2040, ICJ compulsory jurisdiction stuck at ~42%) while the material levers all grow 10–12%. Economy finds bloc concentration falling in 31 of 34 countries: firms are diversifying across blocs rather than decoupling from them, which is what hedging against access risk looks like in the data.",
    evidence: "China's rare-earth licensing regime and successive rounds of US advanced-computing export controls both worked through access rather than tariffs. In 2026, dual-use controls aimed at Japan showed the same tool being used between countries that were not clearly allied with either camp. (S&P Global, Jan 2026)",
    signals: [
      { title: "Revision to License Review Policy for Advanced Computing Commodities", publisher: "US Federal Register", date: "Jan 2026", url: "https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities" },
      { title: "China Export Control Actions Signal Active Enforcement for Rare Earths", publisher: "Morgan Lewis", date: "Jul 2026", url: "https://www.morganlewis.com/pubs/2026/07/recent-china-export-control-actions-signal-active-enforcement-for-rare-earths-and-strategic-minerals" },
      { title: "New momentum, old problems in transatlantic export controls", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/new-momentum-old-problems-transatlantic-export-control-considerations" },
      { title: "The US-China trade truce has not solved the gallium problem", publisher: "CSIS", date: "May 2026", url: "https://www.csis.org/analysis/us-china-trade-truce-has-not-solved-gallium-problem" },
      { title: "Trade and financial fragmentation spreads beyond rivals as costs mount", publisher: "World Economic Forum", date: "Jun 2026", url: "https://www.weforum.org/press/2026/06/trade-and-financial-fragmentation-spreads-beyond-rivals-as-costs-mount/" },
    ],
  },
  // Technology + Economy
  "economy|tech": {
    title: "The Automation Squeeze",
    behaviour: "Gains accrue to owners rather than operators, so the durable position is holding intellectual property, standards and platforms rather than capacity or hours.",
    why: "The labour income share is a genuine non-finding, staying nearly flat at 50.2% to 50.4% and falling in only 14 of 34 countries. What does move is ownership and productivity: total factor productivity is the fastest-diverging indicator in the Economy topic (+64.4%), and 2040 net IP income is +$128bn for the US against −$45bn for China and −$17bn for India.",
    evidence: "India is the clearest case: the world's largest exporter of digital labour (+$226bn in digitally delivered services) and simultaneously a large net importer of intellectual property. High revenue, low ownership. (World Foresight Framework, D-series; corroborated by WTO digital-trade data)",
    signals: [
      { title: "Do Job Postings Show Early Labor-Market Effects of AI?", publisher: "New York Fed", date: "May 2026", url: "https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/" },
      { title: "AI investment boom risks widening the global development divide", publisher: "UNCTAD", date: "May 2026", url: "https://unctad.org/news/ai-investment-boom-risks-widening-global-development-divide" },
      { title: "AI reshapes the global labour market as skills change accelerates", publisher: "PwC", date: "Jun 2026", url: "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html" },
      { title: "How AI may reshape career pathways to better jobs", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/" },
      { title: "AI is plowing through the workplace, but its impact is uneven", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/929986c149d415cd2ef4dc3eaf66ca8c" },
    ],
  },
  // Planet + People
  "people|planet": {
    title: "The Great Relocation",
    behaviour: "Where you live becomes the decision carrying the most risk. Households and insurers price heat, water and storm exposure directly, and movement follows habitability as much as opportunity.",
    why: "All eight countries in Planet's 'exposed and unable' quadrant also sit in People's 'pressured and brittle' quadrant. This is a strict subset, not merely a correlation. By 2040, the UAE sees 190 days above 35°C a year, Nigeria 149 and Pakistan 126. In addition, 21 of 34 countries are above 25% water stress, and the count does not change between 2025 and 2040.",
    evidence: "The ILO projects 2.2% of global working hours (about 80 million full-time job equivalents) lost to heat stress by 2030, rising to roughly 5% in southern Asia and western Africa, with agriculture carrying 60% of the loss. Habitability is already showing up as lost income before it shows up as migration. (ILO)",
    signals: [
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "How cities in Africa are adapting to intense and deadly heat", publisher: "Le Monde", date: "Jun 2026", url: "https://www.lemonde.fr/en/le-monde-africa/article/2026/06/26/how-cities-in-africa-are-adapting-to-intense-and-deadly-heat_6754886_124.html" },
      { title: "Florida shows how coastal cities can adapt to rising seas and storms", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/5a96158c5188a0f51ff64a516fe22683" },
      { title: "Making care services part of climate adaptation planning and finance", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/care-services-climate-adaptation-finance/" },
      { title: "Strong El Niño expected to intensify", publisher: "World Meteorological Organization", date: "Jul 2026", url: "https://wmo.int/news/media-centre/strong-el-nino-expected-intensify" },
    ],
  },
  // Power + People
  "people|power": {
    title: "Borders & Belonging",
    behaviour: "Migration stops being framed as a favour and becomes a negotiation. Passports, visas and diaspora ties turn into instruments of statecraft, and belonging is bargained over rather than assumed.",
    why: "A 33-year median-age gap separates Japan (49.6) from DR Congo (16.1), eight countries have shrinking working-age populations, and working-age population growth is the fastest-diverging indicator in the People topic (+22.8%). Power finds hedging the modal posture with no single guarantor. So labour supply becomes something to trade rather than something to regulate.",
    evidence: "Japan set a target of 1.23 million foreign workers under its labour-migration programmes, and Germany, Korea, Spain and Italy all expanded recruitment or regularisation schemes into 2026. The arithmetic is moving faster than the politics. (The Japan Times, Dec 2025)",
    signals: [
      { title: "Japan aims to take in 1.23M foreign workers under labor migration programs", publisher: "The Japan Times", date: "Dec 2025", url: "https://www.japantimes.co.jp/news/2025/12/23/japan/society/foreign-worker-cap/" },
      { title: "Refugee numbers drop for first time in a decade, but millions remain trapped", publisher: "UN News", date: "Jun 2026", url: "https://news.un.org/en/story/2026/06/1167693" },
      { title: "Why Europe's labour needs clash with its migration policy", publisher: "Euronews", date: "Jun 2026", url: "https://www.euronews.com/my-europe/2026/06/11/why-europes-labour-needs-clash-with-its-migration-policy" },
      { title: "As France faces demographic decline, immigration becomes an economic necessity", publisher: "Le Monde", date: "Jun 2026", url: "https://www.lemonde.fr/en/france/article/2026/06/11/as-france-faces-demographic-decline-immigration-emerges-as-both-political-and-economic-necessity_6754368_7.html" },
      { title: "Is the EU's labour market reaching a turning point?", publisher: "European Commission", date: "May 2026", url: "https://economy-finance.ec.europa.eu/economic-forecast-and-surveys/economic-forecasts/spring-2026-economic-forecast-slowdown-growth-energy-shock-drives-inflation/eus-labour-market-reaching-turning-point_en" },
    ],
  },
  // Technology + People
  "people|tech": {
    title: "Living With Machines",
    behaviour: "Work reorganises around what cannot be automated. Individuals invest in judgement, credentials and provenance, while assuming that anything they do online is observed.",
    why: "Technology finds the scissors: government social-media monitoring worsens in 25 of 34 countries and improves in none, while citizens' use of social media to organise offline political action improves in 29 of 34 and worsens in none. People finds the same populations getting healthier and better educated. Capability and observability rise together.",
    evidence: "The New York Fed found in May 2026 that job postings show no clear divergence between junior and senior roles in AI-exposed occupations, and that vacancy declines predate ChatGPT. So far the behaviour change is anticipatory, running well ahead of the measured displacement. (Liberty Street Economics, May 2026)",
    signals: [
      { title: "Repression and Backsliding Drive a 15th Year of Internet-Freedom Decline", publisher: "Freedom House", date: "Nov 2025", url: "https://freedomhouse.org/article/new-report-persistent-authoritarian-repression-and-backsliding-democracies-drive-15th" },
      { title: "What US and Chinese AI dominance means for the world", publisher: "Rest of World", date: "Jun 2026", url: "https://restofworld.org/2026/ai-divide-america-china-world/" },
      { title: "How AI may reshape career pathways to better jobs", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/" },
      { title: "AI is plowing through the workplace, but its impact is uneven", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/929986c149d415cd2ef4dc3eaf66ca8c" },
      { title: "Three factors reshaping the internet at an inflection point", publisher: "World Economic Forum", date: "Jul 2026", url: "https://www.weforum.org/stories/artificial-intelligence/dynamics-reshaping-the-internet-inflection-point/" },
    ],
  },
  // Power + Planet
  "planet|power": {
    title: "Climate as Leverage",
    behaviour: "Climate exposure turns into leverage. Countries that can adapt trade finance and market access for alignment; countries that cannot press their vulnerability as a claim.",
    why: "Emissions concentrate as power diffuses: the emissions HHI rises from 1,129 (2000) to 1,782 (2040), cutting the effective number of emitters from 8.9 to 5.6, with China at 38.0% of the 34-country total. None of the eight 'exposed and unable' countries is among the top per-capita emitters. The responsibility map and the damage map do not overlap, which is exactly what makes it negotiable.",
    evidence: "The EU's Carbon Border Adjustment Mechanism entered its definitive regime in 2026 over sustained objections from low- and middle-income exporters, turning a climate instrument into a trade-access instrument. (European Commission; IEEP, 2025)",
    signals: [
      { title: "CBAM Definitive Regime", publisher: "European Commission", date: "Jan 2026", url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en" },
      { title: "COP30: Key outcomes agreed at the UN climate talks in Belem", publisher: "Carbon Brief", date: "Nov 2025", url: "https://www.carbonbrief.org/cop30-key-outcomes-agreed-at-the-un-climate-talks-in-belem" },
      { title: "COP30 Outcome: What It Means and What's Next", publisher: "IISD", date: "Nov 2025", url: "https://www.iisd.org/articles/insight/cop-30-outcome-what-it-means-and-whats-next" },
      { title: "Trade war to cooperation: China's strategies toward the EU carbon border mechanism", publisher: "Review of World Economics", date: "Mar 2026", url: "https://link.springer.com/article/10.1007/s10290-026-00635-6" },
      { title: "Start of the definitive period of the EU carbon border mechanism", publisher: "European Commission", date: "Jan 2026", url: "https://trade.ec.europa.eu/access-to-markets/en/news/start-definitive-period-cbam-eu" },
    ],
  },
  // Technology + Planet
  "planet|tech": {
    title: "Compute vs. Carbon",
    behaviour: "The energy cost of intelligence becomes strategic. Where you can build compute depends on where you can find power, and the two start competing for the same grid.",
    why: "Planet finds that the energy transition is mainly happening in transport. EV sales share rises from 20.3% to 59.5%, while renewables' share of final energy stays at 22.6% and power carbon intensity falls only from 395 to 390 gCO₂/kWh. New compute therefore lands on a grid that is barely decarbonising, while Technology finds data centres concentrated in a US-owned layer representing 36.7% of world revenue in 2040.",
    evidence: "The IEA's Electricity 2026 forecasts 3.6% annual demand growth to 2030 (around 50% faster than the previous decade) with more than 2,500 GW of projects stuck in connection queues and roughly half of US demand growth attributable to data centres. (IEA, Feb 2026)",
    signals: [
      { title: "AI Data Centers: The Impact on Electric Bills, Water and More", publisher: "Consumer Reports", date: "2026", url: "https://www.consumerreports.org/data-centers/ai-data-centers-impact-on-electric-bills-water-and-more-a1040338678/" },
      { title: "Data center backlash signals a fight over AI power", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/data-center-backlash-signals-a-fight-over-ai-power/" },
      { title: "The future of data centers", publisher: "Brookings", date: "Nov 2025", url: "https://www.brookings.edu/articles/the-future-of-data-centers/" },
      { title: "The hidden links between heat, water and energy", publisher: "World Meteorological Organization", date: "May 2026", url: "https://wmo.int/media/news/hidden-links-between-heat-water-and-energy" },
      { title: "Climate change threatens Asia's water and power systems", publisher: "Associated Press", date: "Dec 2025", url: "https://apnews.com/article/7afe48891f15a50058531ef350b2c952" },
    ],
  },
  // Power + Technology
  "power|tech": {
    title: "The Splinternet Generation",
    behaviour: "People and firms learn to run two of everything (two clouds, two supply chains, two compliance regimes) and choosing a technology stack becomes a political act rather than a technical one.",
    why: "Power finds technology the decisive contested lever, with a 2040 world share of 42% for the US against 22% for China and roughly two-thirds of world R&D between them. Technology finds the layers owned separately: the US holds 41.7% of world R&D spending and 36.7% of data-centre revenue, while China holds 37.5% of medium/high-tech manufacturing and 35.7% of high-tech exports. Neither side can build the other's layer quickly.",
    evidence: "The EU's 2026 tech-sovereignty package and the Chips Act 2.0 debate put a third rulebook alongside the American and Chinese ones. So 'which stack' is now a three-way question for most firms, not a two-way one. (European Commission / Bruegel, 2026)",
    signals: [
      { title: "Strengthening Europe's Tech Sovereignty", publisher: "European Commission", date: "Jun 2026", url: "https://commission.europa.eu/news-and-media/news/strengthening-europes-tech-sovereignty-2026-06-03_en" },
      { title: "Tech Sovereignty Package: An Overview", publisher: "Bird & Bird", date: "Jun 2026", url: "https://www.twobirds.com/en/insights/2026/tech-sovereignty-package-an-overview" },
      { title: "Administration Policies on Advanced AI Chips Codified", publisher: "Mayer Brown", date: "Jan 2026", url: "https://www.mayerbrown.com/en/insights/publications/2026/01/administration-policies-on-advanced-ai-chips-codified" },
      { title: "Europe unveils tech sovereignty package amid reliance on US tech", publisher: "CNBC", date: "Jun 2026", url: "https://www.cnbc.com/2026/06/03/europe-tech-sovereignty-us-tech-reliance.html" },
      { title: "National security implications of building frontier AI data centers overseas", publisher: "Brookings", date: "Aug 2026", url: "https://www.brookings.edu/articles/the-national-security-implications-of-building-frontier-ai-data-centers-overseas/" },
    ],
  },
  // Planet + People + Economy
  "economy|people|planet": {
    title: "Where the Money Isn't",
    behaviour: "The places absorbing the most physical and demographic pressure are the ones paying the most for money. Adaptation, schooling and health compete directly with the interest bill, and the shortfall is made up privately. By households, by remittances, or not at all.",
    why: "The 2040 interest burden is heaviest in Egypt (36% of government revenue), India (32%), Kenya (30%), Brazil (30%) and Bangladesh (21%). None of them on the top-debt list, which is Japan, Italy, the US, France and the UK. Planet's 'exposed and unable' eight and People's 'pressured and brittle' eleven are largely the same countries, and five of them sit in the worst quadrant of all three topics.",
    evidence: "UNCTAD records developing-country external debt at US$11.4 trillion and US$847 billion of net interest in 2023, with 3.3 billion people living in countries that spend more on debt service than on health or education combined. (UNCTAD, Mar 2025)",
    signals: [
      { title: "UNCTAD urges reforms on global debt architecture amid rising distress", publisher: "UNCTAD", date: "2025", url: "https://unctad.org/news/unctad-urges-reforms-global-debt-architecture-amid-rising-distress" },
      { title: "The COP30 Mutirao Decision and the Global Finance Sector", publisher: "UNEP FI", date: "Dec 2025", url: "https://www.unepfi.org/themes/climate-change/the-cop30-mutirao-decision-and-what-it-means-for-the-global-finance-sector/" },
      { title: "Making care services part of climate adaptation planning and finance", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/care-services-climate-adaptation-finance/" },
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "The significance of the World Bank's climate retreat", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/the-significance-of-the-world-banks-climate-retreat/" },
    ],
  },
  // Power + People + Economy
  "economy|people|power": {
    title: "The Squeezed Middle Votes",
    behaviour: "Domestic politics reorganises around distribution rather than around foreign policy, and governments that cannot deliver materially buy time with identity and border politics instead. Voters stop rewarding aggregate growth and start punishing the gap between what they can articulate and what arrives.",
    why: "Economy finds tax revenue (14.4% to 14.6% of GDP) and social spending (23.8% to 24.3%) essentially frozen while capability converges upward. Power finds the middle powers squeezed hardest (ranks 3–10 fall from 37.1% of world power in 2000 to 29.5% in 2040) so the countries with rising expectations have the least room to spend their way out.",
    evidence: "Freedom House's 2026 report records a 20th consecutive year of global decline, with the United States down 3 points in 2025 and 12 since 2005, and Bulgaria and Italy also falling. The erosion is now concentrated in the middle powers, not only at the periphery. (Freedom House, Mar 2026)",
    signals: [
      { title: "Democratic backsliding reaches western democracies", publisher: "University of Gothenburg", date: "Mar 2026", url: "https://www.gu.se/en/news/democratic-backsliding-reaches-western-democracies-with-us-decline-unprecedented" },
      { title: "Global freedom declined for a 20th consecutive year", publisher: "Freedom House", date: "Mar 2026", url: "https://freedomhouse.org/article/new-report-global-freedom-declined-20th-consecutive-year-2025" },
      { title: "What Gen Z protests reveal about Kenya's democracy", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/what-gen-z-protests-reveal-about-kenyas-democracy/" },
      { title: "Africa's public debt amid global headwinds", publisher: "Bank for International Settlements", date: "Aug 2026", url: "https://www.bis.org/publ/bisbull132.htm" },
      { title: "South Asia's Gen Z revolutions now face difficult realities", publisher: "Chatham House", date: "Jun 2026", url: "https://www.chathamhouse.org/2026/06/south-asias-gen-z-revolutions-now-face-difficult-realities" },
    ],
  },
  // Technology + People + Economy
  "economy|people|tech": {
    title: "The Credential Treadmill",
    behaviour: "People keep re-qualifying. Degrees, certificates and portfolios depreciate faster than they can be earned, hiring shifts toward demonstrated output and provenance, and the anxiety arrives years ahead of any measurable job losses.",
    why: "Technology reports a genuine non-finding (the labour income share is flat at 50.2% to 50.4%) alongside ICT-graduate dispersion up 39% and labour-productivity-growth dispersion up 154%. Economy finds unemployment flat in level (5.46% to 5.40%) but diverging (+8.0%). The aggregate holds; the distribution spreads. That combination produces individual defensive behaviour without a visible collective shock.",
    evidence: "The New York Fed found in May 2026 that fewer than 10% of workers sit in occupations with meaningful AI exposure, that vacancy declines in exposed occupations began before ChatGPT, and that firms mostly plan retraining rather than headcount cuts. The treadmill is being driven by expectation, not yet by data. (Liberty Street Economics, May 2026)",
    signals: [
      { title: "AI's Impact on Labor and Hiring", publisher: "New York Fed", date: "Aug 2026", url: "https://libertystreeteconomics.newyorkfed.org/2026/08/ais-impact-on-labor-and-hiring/" },
      { title: "How AI may reshape career pathways to better jobs", publisher: "Brookings", date: "Apr 2026", url: "https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/" },
      { title: "AI reshapes the global labour market as skills change accelerates", publisher: "PwC", date: "Jun 2026", url: "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html" },
      { title: "Getting to all-of-the-above: A framework for AI's impacts on workers", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/ai-workforce-policy-framework/" },
      { title: "AI is plowing through the workplace, but its impact is uneven", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/929986c149d415cd2ef4dc3eaf66ca8c" },
    ],
  },
  // Power + Planet + Economy
  "economy|planet|power": {
    title: "The Green Border",
    behaviour: "Climate policy arrives dressed as trade policy. Carbon rules at the border, minerals licensing and finance conditionality do the work that emissions treaties did not, and firms reorganise around where their carbon and their minerals are counted rather than where production is cheapest.",
    why: "Planet finds emissions concentrating (HHI 1,657 to 1,782; China at 38.0% of the 34-country total) while critical-mineral import dependence diverges (+12.9%) even as the average falls. Economy finds tariffs falling in 32 of 34 countries. So the friction has to move somewhere, and it moves to standards. Power finds the rules lever declining while resource and economic levers grow 12%.",
    evidence: "The EU's CBAM definitive regime began in 2026 over sustained developing-country objection; China's rare-earth export controls, in force since April 2025, run the identical logic in the other direction. Both are climate-adjacent instruments used as leverage. (European Commission; S&P Global)",
    signals: [
      { title: "Start of the Definitive Period of the CBAM", publisher: "European Commission", date: "Jan 2026", url: "https://trade.ec.europa.eu/access-to-markets/en/news/start-definitive-period-cbam-eu" },
      { title: "Supply concentration and export restrictions put mineral security at risk", publisher: "International Energy Agency", date: "Jul 2026", url: "https://www.iea.org/news/supply-concentration-export-restrictions-and-declining-investment-put-critical-mineral-security-at-risk" },
      { title: "EU CBAM Enters Compliance Phase and Outlines Path Ahead", publisher: "ICAP", date: "2026", url: "https://icapcarbonaction.com/en/news/eu-cbam-enters-compliance-phase-and-outlines-path-ahead" },
      { title: "Rare earth export restrictions one year later", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/rare-earth-export-restrictions-one-year-later" },
      { title: "Trade war to cooperation: China's strategies toward the EU carbon border mechanism", publisher: "Review of World Economics", date: "Mar 2026", url: "https://link.springer.com/article/10.1007/s10290-026-00635-6" },
    ],
  },
  // Technology + Planet + Economy
  "economy|planet|tech": {
    title: "The Underwriter Sets the Rules",
    behaviour: "Insurers and lenders, not regulators, decide what gets built where. Risk models priced off satellite and sensor data become the binding constraint on development, and withdrawal of cover (quiet, commercial and unappealable) moves capital faster than any emissions policy.",
    why: "Planet finds physical exposure static, knowable and inversely related to capacity; Economy finds shock absorption the most uniformly diverging outcome in the framework; Technology makes the risk legible in near-real time and privately owned. Together they move the adjustment mechanism out of policy and into underwriting.",
    evidence: "California's FAIR Plan grew 152% to over 684,000 policies by March 2026 and German insurers warned premiums could double within a decade, while EIOPA reports 75% of European natural-catastrophe losses have historically gone uninsured. The retreat is happening on two continents at once. (Insurance Journal, Jun 2026)",
    signals: [
      { title: "The Natural Catastrophe Protection Gap", publisher: "Swiss Re Institute", date: "2026", url: "https://www.swissre.com/institute/research/topics-and-risk-dialogues/climate-and-natural-catastrophe-risk/growing-exposure/Natcat-protection-gap.html" },
      { title: "How Climate Change Is Creating Uninsurable Areas Across Europe", publisher: "Insurance Journal", date: "Jun 2026", url: "https://www.insurancejournal.com/news/international/2026/06/02/871921.htm" },
      { title: "A proposal for a US federal property reinsurer", publisher: "Brookings", date: "Mar 2026", url: "https://www.brookings.edu/articles/a-proposal-for-a-us-federal-property-reinsurer/" },
      { title: "Florida shows how coastal cities can adapt to rising seas and storms", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/5a96158c5188a0f51ff64a516fe22683" },
      { title: "The significance of the World Bank's climate retreat", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/the-significance-of-the-world-banks-climate-retreat/" },
    ],
  },
  // Power + Technology + Economy
  "economy|power|tech": {
    title: "Two of Everything",
    behaviour: "Running duplicate systems stops being contingency planning and becomes the operating model: two clouds, two chip supply lines, two payment rails, two compliance teams. The cost is carried permanently, and it shows up as thinner margins rather than as smaller trade volumes.",
    why: "Economy finds openness rising to 67.1% of GDP and bloc concentration falling in 31 of 34 countries. Firms hedge geography without trading less. Power finds 10 of 32 states voting with one giant and earning with the other, up from 8 in 2025. Technology finds each layer of the stack owned by a different country. Nobody can consolidate, so everybody duplicates.",
    evidence: "Between the EU's 2026 tech-sovereignty package, successive US advanced-computing export controls and China's rare-earth licensing regime covering 91% of world refining, a manufacturer selling into all three markets now maintains three compliance regimes as a permanent cost of doing business. (S&P Global; European Commission, 2026)",
    signals: [
      { title: "BIS Revises Export Review Policy for Advanced AI Chips", publisher: "Morgan Lewis", date: "Jan 2026", url: "https://www.morganlewis.com/pubs/2026/01/bis-revises-export-review-policy-for-advanced-ai-chips-destined-for-china-and-macau" },
      { title: "Shifting Away from Dependency: The EU's Tech Sovereignty Package", publisher: "Freshfields", date: "Jun 2026", url: "https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/shifting-away-from-dependency-the-eus-tech-sovereignty-package-102n7kn" },
      { title: "USMCA 2026 and economic security: Technology, trade and national security converge", publisher: "CSIS", date: "2026", url: "https://www.csis.org/analysis/usmca-2026-and-economic-security-convergence-technology-trade-and-national-security" },
      { title: "Trade and financial fragmentation spreads beyond rivals as costs mount", publisher: "World Economic Forum", date: "Jun 2026", url: "https://www.weforum.org/press/2026/06/trade-and-financial-fragmentation-spreads-beyond-rivals-as-costs-mount/" },
      { title: "National security implications of building frontier AI data centers overseas", publisher: "Brookings", date: "Aug 2026", url: "https://www.brookings.edu/articles/the-national-security-implications-of-building-frontier-ai-data-centers-overseas/" },
    ],
  },
  // Power + Planet + People
  "people|planet|power": {
    title: "Vulnerability Becomes a Claim",
    behaviour: "Exposed countries stop asking for help and start pricing it. Climate exposure, youth numbers and control over departure points become a single negotiating position, while receiving states pay in visas, finance and market access rather than aid.",
    why: "Planet's eight 'exposed and unable' countries are a strict subset of People's eleven 'pressured and brittle' ones. Nigeria, Pakistan, Egypt, Iran, Bangladesh, Ethiopia, Kenya and India appear on both lists. Power finds the West's share sliding from 51.8% toward 50.5% with hedging the modal posture, so these states have more leverage than their weight suggests and more than one buyer for it.",
    evidence: "UNEP's adaptation-finance gap of 12–14 times (US$310–365 billion of annual need by 2035 against US$26 billion delivered in 2023) has turned adaptation finance into a standing demand at every trade and climate negotiation rather than a humanitarian appeal. (UNEP, Oct 2025)",
    signals: [
      { title: "COP30 closes with agreement to step up support for developing countries", publisher: "United Nations", date: "Nov 2025", url: "https://www.un.org/en/climatechange/cop30" },
      { title: "One in 70 people worldwide is forcibly displaced: UNHCR", publisher: "Al Jazeera", date: "Jun 2026", url: "https://www.aljazeera.com/news/2026/6/11/one-in-70-people-worldwide-is-forcibly-displaced-unhcr" },
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "How cities in Africa are adapting to intense and deadly heat", publisher: "Le Monde", date: "Jun 2026", url: "https://www.lemonde.fr/en/le-monde-africa/article/2026/06/26/how-cities-in-africa-are-adapting-to-intense-and-deadly-heat_6754886_124.html" },
      { title: "Refugee numbers drop for first time in a decade, but millions remain trapped", publisher: "UN News", date: "Jun 2026", url: "https://news.un.org/en/story/2026/06/1167693" },
    ],
  },
  // Technology + Planet + People
  "people|planet|tech": {
    title: "Adaptation You Buy Yourself",
    behaviour: "Adaptation becomes a consumer purchase before it becomes a public programme. Households buy cooling, filtration, water storage and air-quality data; those who cannot simply work through the heat. The result is a visible, purchasable divide in daily comfort inside the same city.",
    why: "Planet finds heat days rising in 34 of 34 countries, zero countries meeting the WHO PM2.5 guideline of 5 µg/m³ at any anchor year, and nine still above 35 µg/m³ throughout. A chronic story, not a catastrophic one. Technology finds access converging (81.6% to 90.5% internet use, dispersion down 47%) while capability diverges. Everyone can see the risk; only some can buy out of it.",
    evidence: "The ILO puts heat-stress losses at 2.2% of global working hours by 2030 (about 80 million full-time jobs and US$2.4 trillion) concentrated in agriculture (60% of the loss) and construction, and at roughly 5% of hours in southern Asia and western Africa. (ILO)",
    signals: [
      { title: "Earth's climate swings increasingly out of balance", publisher: "World Meteorological Organization", date: "Mar 2026", url: "https://wmo.int/news/media-centre/earths-climate-swings-increasingly-out-of-balance" },
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "AI Data Centers: The Impact on Electric Bills, Water and More", publisher: "Consumer Reports", date: "2026", url: "https://www.consumerreports.org/data-centers/ai-data-centers-impact-on-electric-bills-water-and-more-a1040338678/" },
      { title: "How cities in Africa are adapting to intense and deadly heat", publisher: "Le Monde", date: "Jun 2026", url: "https://www.lemonde.fr/en/le-monde-africa/article/2026/06/26/how-cities-in-africa-are-adapting-to-intense-and-deadly-heat_6754886_124.html" },
      { title: "The hidden links between heat, water and energy", publisher: "World Meteorological Organization", date: "May 2026", url: "https://wmo.int/media/news/hidden-links-between-heat-water-and-energy" },
    ],
  },
  // Power + Technology + People
  "people|power|tech": {
    title: "Identity Becomes Infrastructure",
    behaviour: "Proving who you are turns into a precondition for ordinary life online, at borders and in payments. People carry state-issued digital identities into private platforms, states gain a lever they did not previously have, and the populations best equipped to organise are also the easiest to observe.",
    why: "Technology finds state control worsening in 25 of 34 countries and improving in none, while citizen capability to organise online improves in 29 of 34. The scissors, not the slide. People finds assembly freedom falling in 27 of 34 countries. Power finds no external check: peacekeeping down 47%, ICJ compulsory jurisdiction at ~42%, and the rules lever the only one in the framework that declines.",
    evidence: "The European Commission pushed member states toward platform age verification tied to the EU digital identity wallet by end-2026, while the UK, Australia and more than twenty US states legislated their own checks. Identity infrastructure is arriving fastest in the democracies, not the autocracies. (European Commission; Freedom House)",
    signals: [
      { title: "A Common Approach for EU-wide Age Verification Technologies", publisher: "European Commission", date: "2025", url: "https://digital-strategy.ec.europa.eu/en/library/commission-sets-out-common-approach-eu-wide-age-verification-technologies" },
      { title: "After 20 Years of Global Decline, These Basic Freedoms Have Been Hit Hardest", publisher: "Freedom House", date: "Mar 2026", url: "https://freedomhouse.org/article/after-20-years-global-decline-these-basic-freedoms-have-been-hit-hardest" },
      { title: "Identity and the Web", publisher: "W3C", date: "Jun 2026", url: "https://www.w3.org/reports/identity-web-impact/" },
      { title: "How age verification could hard-wire identity surveillance", publisher: "Observer", date: "Aug 2026", url: "https://observer.com/2026/08/age-verification-privacy-digital-identity/" },
      { title: "First your age, next your identity: Privacy flaws in EU age-verification apps", publisher: "TechRadar", date: "Jul 2026", url: "https://www.techradar.com/vpn/vpn-privacy-security/first-your-age-next-your-identity-inside-the-hack-that-broke-the-eu-age-verification-apps-privacy-promises" },
    ],
  },
  // Power + Technology + Planet
  "planet|power|tech": {
    title: "The Grid Becomes the Chokepoint",
    behaviour: "Where compute can be built stops being a question of capital and becomes a question of electricity and permission. States court data centres with grid access and cheap power, then attach conditions (local jurisdiction, model access, export rules) and firms plan capacity around interconnection queues rather than around demand.",
    why: "Technology's most concentrated layer is R&D (2040 HHI 2,353, an effective four players) and data-centre revenue is 36.7% US-held; Planet finds the grid barely moving, with renewables' share of final energy flat at 22.6% and carbon intensity falling only 395 to 390 gCO₂/kWh; Power finds technology the decisive contested lever at 42% US against 22% China. New demand, an unchanged grid, and a strategic race for the same asset.",
    evidence: "The IEA counts more than 2,500 GW of projects waiting in connection queues and expects required grid investment to rise about 50% from US$400 billion a year by 2030. Around half of US electricity-demand growth to 2030 comes from data centres. The binding constraint on AI is now an electrical one. (IEA, Electricity 2026)",
    signals: [
      { title: "Data Center Moratorium Bills Are Spreading in 2026", publisher: "Good Jobs First", date: "Mar 2026", url: "https://goodjobsfirst.org/data-center-moratorium-bills-are-spreading-in-2026/" },
      { title: "Data center moratoriums are not a substitute for oversight", publisher: "Brookings", date: "2026", url: "https://www.brookings.edu/articles/data-center-moratoriums-are-not-a-substitute-for-oversight/" },
      { title: "The EU's Tech Sovereignty Package and European Digital Power", publisher: "Digital Watch Observatory", date: "Jun 2026", url: "https://dig.watch/updates/the-eus-tech-sovereignty-package-and-the-future-of-european-digital-power" },
      { title: "Data center backlash signals a fight over AI power", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/data-center-backlash-signals-a-fight-over-ai-power/" },
      { title: "The hidden links between heat, water and energy", publisher: "World Meteorological Organization", date: "May 2026", url: "https://wmo.int/media/news/hidden-links-between-heat-water-and-energy" },
    ],
  },
  // Power + Planet + People + Economy
  "economy|people|planet|power": {
    title: "The Compound Frontier",
    behaviour: "A small, identifiable group of countries carries climate exposure, youth pressure, weak institutions and expensive money all at once, and generates a disproportionate share of the world's displacement, instability and emigration. Everyone else stops treating them as a development question and starts planning around them as a permanent condition.",
    why: "This is the framework's strongest cross-topic result. All eight of Planet's 'exposed and unable' countries also sit in People's 'pressured and brittle' quadrant, and five of them sit in the worst quadrant of Economy's financial-stress test as well. The overlap does not loosen between 2025 and 2040. The correlation between pressure and institutional capacity moves only from −0.49 to −0.46 over fifteen years.",
    evidence: "Nigeria, Pakistan, Egypt, Ethiopia, Kenya and Bangladesh also appear across the ILO's heat-loss projections, UNCTAD's interest-burden ranking and UNHCR's origin-country data. That is the finding: it is one map, not four overlapping ones.",
    signals: [
      { title: "Africa's public debt amid global headwinds", publisher: "Bank for International Settlements", date: "Aug 2026", url: "https://www.bis.org/publ/bisbull132.htm" },
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "Can Gen Z protests reshape governance in Africa?", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/can-gen-z-protests-reshape-governance-africa" },
      { title: "One in 70 people worldwide is forcibly displaced: UNHCR", publisher: "Al Jazeera", date: "Jun 2026", url: "https://www.aljazeera.com/news/2026/6/11/one-in-70-people-worldwide-is-forcibly-displaced-unhcr" },
      { title: "Making care services part of climate adaptation planning and finance", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/care-services-climate-adaptation-finance/" },
    ],
  },
  // Technology + Planet + People + Economy
  "economy|people|planet|tech": {
    title: "Private Adaptation, Public Absence",
    behaviour: "With no force organising a collective response, adaptation becomes private. Households buy cooling and cover, firms buy risk data and redundancy, and workers buy credentials. The state's role narrows to picking up whatever markets decline to price, usually after the withdrawal has already happened.",
    why: "Planet's transition is partial and sectoral; Economy finds shock absorption diverging sharply while tax capacity stays flat; Technology makes both risk and capability individually purchasable; People finds institutions, not human capital, the binding constraint. Remove Power and there is no actor in the combination whose job is coordination.",
    evidence: "The pattern is already visible in UNEP's 12-to-14-times adaptation-finance gap, California's insurer of last resort growing 152% to 684,000 policies by March 2026, and France raising its CatNat surcharge from 12% to 20%. Public provision is arriving only after private withdrawal. (UNEP, Oct 2025; Insurance Journal, Jun 2026)",
    signals: [
      { title: "The significance of the World Bank's climate retreat", publisher: "Brookings", date: "Jul 2026", url: "https://www.brookings.edu/articles/the-significance-of-the-world-banks-climate-retreat/" },
      { title: "How Climate Change Is Creating Uninsurable Areas Across Europe", publisher: "Insurance Journal", date: "Jun 2026", url: "https://www.insurancejournal.com/news/international/2026/06/02/871921.htm" },
      { title: "Making care services part of climate adaptation planning and finance", publisher: "Brookings", date: "Jun 2026", url: "https://www.brookings.edu/articles/care-services-climate-adaptation-finance/" },
      { title: "How one Indian textile worker copes with extreme heat", publisher: "Associated Press", date: "Jun 2026", url: "https://apnews.com/article/3fd96aa31437eef62b9120af23d96634" },
      { title: "Florida shows how coastal cities can adapt to rising seas and storms", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/5a96158c5188a0f51ff64a516fe22683" },
    ],
  },
  // Power + Technology + People + Economy
  "economy|people|power|tech": {
    title: "The Legitimacy Squeeze",
    behaviour: "Governments are asked to deliver more, with the same fiscal space, to better-informed populations, using tools that increasingly amount to visibility and control. Compliance rises and trust does not, and politics relocates outside the institutions built to contain it.",
    why: "Economy finds tax and social spending frozen; People finds capability rising while assembly freedom falls in 27 of 34 countries and polarisation rises in 31 of 34; Technology finds state monitoring worsening near-universally; Power finds the middle powers squeezed and the multilateral layer thinning. Every one of the four raises expectation or lowers the capacity to meet it.",
    evidence: "Freedom House's 2026 report records a 20th consecutive year of decline (54 countries down against 35 up, and 59 now rated Not Free against 45 in 2005) with media freedom, personal expression and due process the worst-hit rights. (Freedom House, Mar 2026)",
    signals: [
      { title: "Global Freedom Declined for a 20th Consecutive Year in 2025", publisher: "Freedom House", date: "Mar 2026", url: "https://freedomhouse.org/article/new-report-global-freedom-declined-20th-consecutive-year-2025" },
      { title: "Global Internet Freedom Declines for 15th Consecutive Year", publisher: "Tech Policy Press", date: "Nov 2025", url: "https://www.techpolicy.press/global-internet-freedom-declines-for-15th-consecutive-year/" },
      { title: "Democratic backsliding reaches western democracies", publisher: "University of Gothenburg", date: "Mar 2026", url: "https://www.gu.se/en/news/democratic-backsliding-reaches-western-democracies-with-us-decline-unprecedented" },
      { title: "How Gen Z movements shared tactics and challenges", publisher: "Waging Nonviolence", date: "Jan 2026", url: "https://wagingnonviolence.org/2026/01/how-gen-z-movements-shared-tactics-and-challenges/" },
      { title: "How India's Gen Z movement dented Modi's political image", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/4358744e9d890b92ffdd2477bbd99e8a" },
    ],
  },
  // Power + Technology + Planet + Economy
  "economy|planet|power|tech": {
    title: "The Machinery Without the Mandate",
    behaviour: "Energy, capital, chips and minerals get arranged into a working system by states and firms without much reference to the populations living inside it. It is coordinated, it is efficient, and it has no constituency. Which is precisely what makes it fragile in a way its designers do not measure.",
    why: "Power finds every material lever growing (military +11%, economic +12%, resource +12%, technology +10%) while the rules lever declines. Economy finds integration holding while trade policy diverges. Planet finds the transition confined to transport, and Technology finds ownership concentrating. The four forces coordinate through contracts and standards rather than consent, while People, the force that would supply that consent, is not selected.",
    evidence: "The 2026 round of chip, minerals and carbon-border rules (the EU tech-sovereignty package, CBAM's definitive regime, China's rare-earth licensing) was written almost entirely through executive and regulatory channels rather than legislative ones. (European Commission; S&P Global, 2026)",
    signals: [
      { title: "CBAM Legislation and Guidance", publisher: "European Commission", date: "2026", url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en" },
      { title: "Rare earth export restrictions one year later", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/rare-earth-export-restrictions-one-year-later" },
      { title: "New momentum, old problems in transatlantic export controls", publisher: "CSIS", date: "Apr 2026", url: "https://www.csis.org/analysis/new-momentum-old-problems-transatlantic-export-control-considerations" },
      { title: "Strengthening Europe's Tech Sovereignty", publisher: "European Commission", date: "Jun 2026", url: "https://commission.europa.eu/news-and-media/news/strengthening-europes-tech-sovereignty-2026-06-03_en" },
      { title: "National security implications of building frontier AI data centers overseas", publisher: "Brookings", date: "Aug 2026", url: "https://www.brookings.edu/articles/the-national-security-implications-of-building-frontier-ai-data-centers-overseas/" },
    ],
  },
  // Power + Technology + Planet + People
  "people|planet|power|tech": {
    title: "Capable, Watched, and Staying Put",
    behaviour: "Populations that can see their own risk, organise around it, and are observed while doing so mostly still cannot leave. Pressure accumulates inside borders instead of crossing them, and states answer with control rather than with capacity. Because control is the cheaper of the two.",
    why: "Planet finds exposure inherited and unchanged; People finds capability converging while civic space contracts in 27 of 34 countries and political violence rises 34%; Technology finds monitoring worsening in 25 of 34 countries and improving in none; Power finds no external enforcer, with peacekeeping down 47% and the rules lever the only declining one in the framework. Nothing in that set relieves pressure. Only the economy could, and it is not in this combination.",
    evidence: "UNHCR counted 41.6 million refugees in 2026, a 3% fall and the first decline in a decade. Driven substantially by returns to Afghanistan and Syria and by resettlement arrivals more than halving to 81,800, rather than by conditions improving. Most displacement stayed internal. (UNHCR / UN News, Jun 2026)",
    signals: [
      { title: "One in 70 people worldwide is forcibly displaced: UNHCR", publisher: "Al Jazeera", date: "Jun 2026", url: "https://www.aljazeera.com/news/2026/6/11/one-in-70-people-worldwide-is-forcibly-displaced-unhcr" },
      { title: "A 'New Normal': Tracking the Rise of Global Conflict", publisher: "Lowy Institute", date: "Dec 2025", url: "https://www.lowyinstitute.org/the-interpreter/new-normal-tracking-rise-global-conflict" },
      { title: "WMO confirms 2025 was one of the warmest years on record", publisher: "World Meteorological Organization", date: "Mar 2026", url: "https://wmo.int/news/media-centre/wmo-confirms-2025-was-one-of-warmest-years-record" },
      { title: "Refugee numbers drop for first time in a decade, but millions remain trapped", publisher: "UN News", date: "Jun 2026", url: "https://news.un.org/en/story/2026/06/1167693" },
      { title: "Identity and the Web", publisher: "W3C", date: "Jun 2026", url: "https://www.w3.org/reports/identity-web-impact/" },
    ],
  },
  // Power + Technology + Planet + People + Economy
  "economy|people|planet|power|tech": {
    title: "Everyone Hedges. Nothing Moves.",
    behaviour: "With all five forces in play, the dominant behaviour is insurance rather than commitment. States hedge alignment, firms hedge geography, households hedge location and skills, and workers hedge credentials. Because everyone is hedging simultaneously, the system as a whole becomes extremely hard to move. The world of 2040 ends up looking far more like 2025 than 2025 looks like 2000.",
    why: "Every topic returns the same shape: the level improves and the distribution does not. Power's great redistribution is 95% complete and diffusion stopped around 2010. Planet's exposure-to-capacity correlation is identical in 2040 and 2025. People's capability converges while cohesion diverges. Economy's aggregates are stable while resilience splits. Technology's access converges while ownership concentrates. Averages improve; hierarchies hold. That is the framework's single most consistent finding, and it is what makes hedging rational for everyone at once.",
    evidence: "Read 2025–26 as one story rather than five: a 20th consecutive year of declining global freedom, a record US$11.4 trillion of developing-country external debt, an adaptation-finance gap of 12–14 times, over 2,500 GW stuck in grid queues, and a youth protest wave that changed several governments without changing a single settlement.",
    signals: [
      { title: "Global Risks 2026: Top Risks in an Age of Disorder", publisher: "World Economic Forum", date: "Jan 2026", url: "https://www.weforum.org/stories/2026/01/global-risks-2026-top-10-two-and-ten-year-horizon/" },
      { title: "Africa's public debt amid global headwinds", publisher: "Bank for International Settlements", date: "Aug 2026", url: "https://www.bis.org/publ/bisbull132.htm" },
      { title: "Fossil-fuel CO2 emissions to set new record in 2025", publisher: "Carbon Brief", date: "Nov 2025", url: "https://www.carbonbrief.org/analysis-fossil-fuel-co2-emissions-to-set-new-record-in-2025-as-land-sink-recovers" },
      { title: "Trade and financial fragmentation spreads beyond rivals as costs mount", publisher: "World Economic Forum", date: "Jun 2026", url: "https://www.weforum.org/press/2026/06/trade-and-financial-fragmentation-spreads-beyond-rivals-as-costs-mount/" },
      { title: "How India's Gen Z movement dented Modi's political image", publisher: "Associated Press", date: "Aug 2026", url: "https://apnews.com/article/4358744e9d890b92ffdd2477bbd99e8a" },
    ],
  },
};

export const EMPTY_COMBINATION = {
  title: "Five forces, one system.",
  behaviour: "Nothing is selected, so nothing is claimed. Pick one force to see the question it asks and the behaviour it drives, or keep adding forces to build a combination. Up to all five. Every combination has a different answer, because the forces constrain each other rather than simply adding up.",
};

const comboKey = (ids) => [...ids].sort().join('|');

// Any number of forces, 0-5. Returns the empty-state entry for an empty selection.
export function combination(ids) {
  if (!ids || ids.length === 0) return EMPTY_COMBINATION;
  return COMBINATIONS[comboKey(ids)] || null;
}
