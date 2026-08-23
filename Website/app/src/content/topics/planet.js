// Topic 03 — PLANET. Transcribed from `Topic 3 - Planet.docx`.
// This topic has the widest gap between what the model can and cannot do: every
// physical LEVEL below is externally sourced and labelled as such; everything
// from our own pipeline is a share, a rank, a dispersion or a relationship.

const planet = {
  id: 'planet',
  name: 'Planet',
  accent: '#647b45',
  status: 'live',

  level1: {
    kicker: 'Topic 03 · Planet',
    heroHeadline: 'Everyone adapts a little. Nobody changes place.',
    heroSub:
      "The planet's physical trajectory is not in doubt, nor is it set by anything in this dataset. On current policies, the world is tracking toward roughly 2.6°C by 2100. What our data can settle is the distributional question, and the answer is uncomfortable: the countries facing the most physical pressure are systematically the ones least able to absorb it, and the relationship is exactly as strong in 2040 as in 2025.",
    behaviour:
      'If the hazard is certain, your position in the queue is inherited and the transition is partial, then climate becomes a location and insurance problem rather than a policy one. Where you live, what you own there, and whether anyone will underwrite it become the decisions that matter.',
    bridgeTitle: 'The 2040 planetary landscape',
    framing:
      'Responsibility narrows as emissions concentrate in fewer countries even while the damage spreads. The energy transition also turns out to be mostly a transport transition, with the rest of the system barely moving. If the hazard is certain, each country inherits its position in the queue and the transition remains partial, then the rational response is to treat climate as a location and insurance problem rather than a policy problem.',
  },

  level2: [
    {
      n: 1,
      title: 'The adaptation divide is fixed. Exposure rises as capacity falls, and the relationship does not move.',
      overall:
        'Hazard is not destiny, but hazard combined with weak capacity can be. Comparing physical exposure with adaptive capacity across the 34 countries reveals a clear negative relationship and a group of eight countries that are both highly exposed and poorly equipped. Most importantly, the picture is identical in 2040 and 2025. Fifteen years of broad improvement leaves the ranking untouched.',
      data: [
        {
          finding:
            "Climate danger and the ability to cope are moving in opposite directions. The most exposed countries are usually the least prepared, and that pattern does not improve by 2040.",
          figure: { type: 'QuadrantScatter', dataKey: 'exposureCapacity' },
          sources: [
            { title: 'Adaptation Gap Report 2025', publisher: 'UN Environment Programme', date: '2025', url: 'https://www.unep.org/resources/adaptation-gap-report-2025' },
            { title: "'Yawning gap' remains between climate adaptation funds and funding pledges", publisher: 'UN News', date: 'Oct 2025', url: 'https://news.un.org/en/story/2025/10/1166212' },
            { title: 'Adaptation is moving up the climate agenda. COP30 must get serious about financing it', publisher: 'World Economic Forum', date: 'Nov 2025', url: 'https://www.weforum.org/stories/2025/11/finance-climate-adaptation-cop30/' },
            { title: 'Belém COP30 delivers climate finance boost and a pledge to plan fossil fuel transition', publisher: 'UN News', date: 'Nov 2025', url: 'https://news.un.org/en/story/2025/11/1166433' },
            { title: "Here's what happened at COP30 and what comes next", publisher: 'World Economic Forum', date: 'Dec 2025', url: 'https://www.weforum.org/stories/2025/12/what-happened-cop30-whats-next/' },
            { title: "COP30: Outcomes, Disappointments and What's Next", publisher: 'World Resources Institute', date: 'Nov 2025', url: 'https://www.wri.org/insights/cop30-outcomes-next-steps' },
          ],
        },
        {
          finding:
            'Eight countries carry the worst mix of exposure and weak capacity. Nigeria faces the widest gap between climate pressure and the ability to respond.',
          figure: { type: 'DivergingBar', dataKey: 'exposureGap' },
          sources: [
            { title: "Africa's climate finance rules are growing, but they're weakly enforced — new research", publisher: 'The Conversation', date: 'Jan 2026', url: 'https://theconversation.com/africas-climate-finance-rules-are-growing-but-theyre-weakly-enforced-new-research-270990' },
            { title: 'African countries gear up for major push on climate innovation, financing and climate change laws', publisher: 'The Conversation', date: 'Oct 2025', url: 'https://theconversation.com/african-countries-gear-up-for-major-push-on-climate-innovation-climate-financing-and-climate-change-laws-265708' },
            { title: "Reaching $120 Billion in International Adaptation Finance Is Possible — Here's What It Takes", publisher: 'World Resources Institute', date: 'Nov 2025', url: 'https://www.wri.org/insights/tripling-adaptation-finance-goal' },
            { title: 'Climate shocks accelerating as El Niño threat looms over already vulnerable regions', publisher: 'UN News', date: 'Jun 2026', url: 'https://news.un.org/en/story/2026/06/1167753' },
            { title: 'Record El Niño threatens to unleash floods across East Africa and Asia', publisher: 'Al Jazeera', date: 'Jul 2026', url: 'https://www.aljazeera.com/news/2026/7/14/record-el-nino-threatens-to-unleash-floods-across-east-africa-and-asia' },
            { title: "Are African 'water wars' on the horizon as AU puts the issue on its agenda?", publisher: 'Al Jazeera', date: 'Feb 2026', url: 'https://www.aljazeera.com/news/2026/2/13/are-african-water-wars-on-the-horizon-as-au-puts-the-issue-on-its-agenda' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Climate risk gets priced into where people live and what they can insure.',
          why: 'When exposure is knowable, unequal and static, adjustment happens through property values, insurance availability and migration rather than through emissions policy. The effects arrive first where capacity is lowest.',
          evidence:
            'This argument rests on our own composite indices; the Gulf states are the instructive exception, scoring maximum exposure but landing in "exposed but capable" because they have the fiscal room to engineer around it.',
        },
      ],
    },

    {
      n: 2,
      title: 'Responsibility concentrates while damage spreads.',
      overall:
        'The moral geometry of the problem gets worse. Emissions are becoming the business of fewer and fewer countries: the effective number of significant emitters falls from about nine to under six, while the physical consequences fall hardest on countries that emit little. Per-capita emissions show no convergence at all.',
      data: [
        {
          finding:
            'Responsibility for global emissions is narrowing to fewer countries. China becomes the dominant source while the US share falls sharply.',
          figure: { type: 'StackedArea', dataKey: 'emissionsArea' },
          sources: [
            { title: 'CO2 emissions — Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026/co2-emissions' },
            { title: 'Emissions — Electricity 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/electricity-2026/emissions' },
            { title: "Analysis: China's CO2 climbs 2% in early 2026 due to 'wasted' wind and solar", publisher: 'Carbon Brief', date: 'Jun 2026', url: 'https://www.carbonbrief.org/analysis-chinas-co2-climbs-2-in-early-2026-due-to-wasted-wind-and-solar' },
            { title: "UNEP: New country climate plans 'barely move needle' on expected warming", publisher: 'Carbon Brief', date: 'Nov 2025', url: 'https://www.carbonbrief.org/unep-new-country-climate-plans-barely-move-needle-on-expected-warming' },
            { title: "Despite Some Progress, Countries' New Climate Plans Largely Fall Short", publisher: 'World Resources Institute', date: 'Nov 2025', url: 'https://www.wri.org/insights/assessing-2025-ndcs' },
            { title: 'Experts: What to expect from China on energy and climate action in 2026', publisher: 'Carbon Brief', date: '2026', url: 'https://www.carbonbrief.org/experts-what-to-expect-from-china-on-energy-and-climate-action-in-2026/' },
          ],
        },
        {
          finding:
            'The lifestyle gap behind emissions does not close. The eight highest emitters still produce about 16 times more per person than the eight lowest, barely changed from today.',
          figure: { type: 'PairedBars', dataKey: 'perCapitaSlope' },
          sources: [
            { title: 'Richest 1% have blown through their fair share of carbon emissions for 2026 in just 10 days', publisher: 'Oxfam International', date: 'Jan 2026', url: 'https://www.oxfam.org/en/press-releases/richest-1-have-blown-through-their-fair-share-carbon-emissions-2026-just-10-days' },
            { title: "Analysis: Fossil-fuel CO2 emissions to set new record in 2025, as land sink 'recovers'", publisher: 'Carbon Brief', date: 'Nov 2025', url: 'https://www.carbonbrief.org/analysis-fossil-fuel-co2-emissions-to-set-new-record-in-2025-as-land-sink-recovers' },
            { title: 'Analysis: Coal power drops in China and India for first time in 52 years after clean-energy records', publisher: 'Carbon Brief', date: 'Jan 2026', url: 'https://www.carbonbrief.org/analysis-coal-power-drops-in-china-and-india-for-first-time-in-52-years-after-clean-energy-records' },
            { title: 'Two thirds of climate funding for Global South is loans as rich countries profiteer from escalating climate crisis', publisher: 'Oxfam International', date: 'Oct 2025', url: 'https://www.oxfam.org/en/press-releases/two-thirds-climate-funding-global-south-loans-rich-countries-profiteer-escalating' },
            { title: "Analysis: China's CO2 emissions have now been 'flat or falling' for 21 months", publisher: 'Carbon Brief', date: '2026', url: 'https://www.carbonbrief.org/analysis-chinas-co2-emissions-have-now-been-flat-or-falling-for-21-months' },
            { title: 'Global coal demand expected to decline in coming years', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/news/global-coal-demand-expected-to-decline-in-coming-years' },
          ],
        },
        {
          finding:
            'The countries that will be hit hardest are not the ones causing it. Not one of the eight facing the worst exposure with the least capacity to adapt appears among the eight highest emitters per person.',
          figure: { type: 'FlagColumns', dataKey: 'responsibilitySplit' },
          sources: [
            { title: "Africa's Greater Horn region is facing a looming polycrisis fuelled by conflict, prices, climate and disease", publisher: 'The Conversation', date: 'Jul 2026', url: 'https://theconversation.com/africas-greater-horn-region-is-facing-a-looming-polycrisis-fueled-by-conflict-prices-climate-and-disease-286071' },
            { title: "Q&A: Five key climate questions for China's next 'five-year plan'", publisher: 'Carbon Brief', date: '2026', url: 'https://www.carbonbrief.org/qa-five-key-climate-questions-for-chinas-next-five-year-plan' },
            { title: "COP30 Laid a Path to $1.3 Trillion in Climate Finance. What's Next?", publisher: 'World Resources Institute', date: 'Nov 2025', url: 'https://www.wri.org/technical-perspectives/cop30-progress-1-3-trillion' },
            { title: '6 Opportunities for Sustainable Finance in 2026', publisher: 'World Resources Institute', date: '2026', url: 'https://www.wri.org/technical-perspectives/6-opportunities-sustainable-finance-2026' },
            { title: 'Global Climate Action Agenda at COP30: Final Report', publisher: 'UN Framework Convention on Climate Change', date: '2026', url: 'https://unfccc.int/sites/default/files/resource/COP30%20Action%20Agenda_Final%20Report.docx.pdf' },
            { title: 'Closing the Adaptation Finance Gap in Fragile and Conflict-Affected Settings', publisher: 'World Bank', date: '2026', url: 'https://blogs.worldbank.org/en/dev4peace/closing-the-adaptation-finance-gap-in-fragile-and-conflict-affected-settings' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Loss-and-damage politics hardens rather than resolves.',
          why: 'When contribution concentrates in a handful of large emitters and vulnerability concentrates in a different set of countries with little leverage, the distributional argument becomes structural rather than negotiable, and shows up in trade policy, border adjustment and finance conditionality.',
          evidence:
            'The two distributions barely intersect in our own data, which is what makes the argument structural rather than a bargaining position.',
        },
      ],
    },

    {
      n: 3,
      title: 'The transition is happening in transport. One sector moves while the wider energy system stands still.',
      overall:
        'The clean-energy story people tell is true of vehicles and almost nothing else. Electric-vehicle adoption is the single fastest-moving and fastest-converging indicator in the entire topic. Renewable share of final energy, fossil share of electricity and power-sector carbon intensity are all close to flat. Capacity is being built at record pace without shifting the composition of what the world actually consumes.',
      data: [
        {
          finding:
            'The clean-energy transition is really a vehicle transition. EV adoption accelerates and converges while the wider energy system barely changes.',
          figure: { type: 'PanelTrends', dataKey: 'transitionIndexed' },
          sources: [
            { title: 'Executive summary — Global EV Outlook 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/executive-summary' },
            { title: 'Trends in electric cars — Global EV Outlook 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/trends-in-electric-cars' },
            { title: 'Technology: Electric vehicles — Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026/technology-electric-vehicles' },
            { title: "Six charts show how clean power was world's largest source of new energy in 2025", publisher: 'Carbon Brief', date: 'Jun 2026', url: 'https://www.carbonbrief.org/six-charts-show-how-clean-power-was-worlds-largest-source-of-new-energy-in-2025' },
            { title: 'Manufacturing and trade — Global EV Outlook 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/manufacturing-and-trade' },
            { title: 'Executive summary — Electric Car Markets in a Time of Uncertainty', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/electric-car-markets-in-a-time-of-uncertainty/executive-summary' },
          ],
        },
        {
          finding:
            'Few countries cross from adding clean energy to replacing fossil fuels. By 2040, only four get half their total energy from renewables.',
          figure: { type: 'PairedBars', dataKey: 'transitionThresholds' },
          sources: [
            { title: 'Supply — Electricity 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/electricity-2026/supply' },
            { title: 'Electricity supply — Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026/electricity-supply' },
            { title: "IEA: Renewables will be world's top power source 'by 2026'", publisher: 'Carbon Brief', date: '2026', url: 'https://www.carbonbrief.org/iea-renewables-will-be-worlds-top-power-source-by-2026' },
            { title: 'Key findings — Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026/key-findings' },
            { title: '2. Overall results — Energy Transition Index 2026', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/publications/energy-transition-index-2026/in-full/2-overall-results-energy-transition-index-2026/' },
            { title: 'Fragmentation in the Global Energy Transition as Geopolitical Risks Surge', publisher: 'World Economic Forum', date: 'Jun 2026', url: 'https://www.weforum.org/press/2026/06/fragmentation-in-the-global-energy-transition-as-geopolitical-risks-surge/' },
          ],
        },
        {
          finding:
            'Building renewables is not the same as replacing fossil fuels. Clean capacity is growing much faster than its share of the energy people actually use.',
          figure: { type: 'PanelTrends', dataKey: 'capacityVsSubstitution' },
          sources: [
            { title: 'Global trends — Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026/global-trends' },
            { title: 'Global Energy Review 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-energy-review-2026' },
            { title: 'Introduction — Energy Transition Index 2026', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/publications/energy-transition-index-2026/in-full/introduction-energy-transition-index-2026/' },
            { title: 'Industrial clusters can help power the energy transition', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/stories/energy-transition/industrial-clusters-asean-low-carbon/' },
            { title: 'Boosting energy investment for supply security and diversity', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/stories/energy-transition/faster-permitting-policy-certainty-energy-security-costs/' },
            { title: "The electric endgame: Europe's clean path out of vassalage", publisher: 'European Council on Foreign Relations', date: '2026', url: 'https://ecfr.eu/publication/the-electric-endgame-europes-clean-path-out-of-vassalage/' },
          ],
        },
        {
          finding:
            'The energy transition swaps fuel dependence for mineral dependence. The global average looks stable while the most exposed countries become more vulnerable.',
          figure: { type: 'TrendLine', dataKey: 'mineralDependence' },
          sources: [
            { title: 'Executive summary — Global Critical Minerals Outlook 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary' },
            { title: 'Outlook — Global Critical Minerals Outlook 2026', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-critical-minerals-outlook-2026/outlook' },
            { title: 'Global Trade Update (June 2026): The shifting dynamics of critical minerals trade', publisher: 'UN Trade and Development (UNCTAD)', date: 'Jun 2026', url: 'https://unctad.org/publication/global-trade-update-june-2026-shifting-dynamics-critical-minerals-trade' },
            { title: 'Critical minerals are reshaping global trade as demand surges', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/critical-minerals-are-reshaping-global-trade-demand-surges' },
            { title: 'Supply concentration, export restrictions and declining investment put critical mineral security at risk', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/news/supply-concentration-export-restrictions-and-declining-investment-put-critical-mineral-security-at-risk' },
            { title: 'How Gulf investments are responding to the US-China critical minerals competition', publisher: 'Atlantic Council', date: '2026', url: 'https://www.atlanticcouncil.org/blogs/menasource/how-gulf-investments-are-responding-to-the-us-china-critical-minerals-competition/' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Electrify what moves; keep paying for what heats.',
          why: 'The transition arrives sector by sector, so households and firms see rapid change in vehicles and almost none in heating, industry or aviation. Fossil exposure therefore remains in bills and supply chains long after the car becomes electric.',
          evidence:
            "The IEA's Global EV Outlook 2026 puts global electric car sales at 23 million in 2026, about 28% of all new cars. Its projection of roughly 50% of global car sales by 2035 is consistent with our 2040 figure. Over the same period, the renewable share of total final energy consumption has moved only a few points.",
        },
      ],
    },

    {
      n: 4,
      title: 'Chronic conditions matter more than catastrophes. The livability story is about everyday life getting worse.',
      overall:
        "This topic's day-to-day content is not disaster; it is the slow normalisation of conditions that used to be exceptional. Extreme heat is already extreme in a dozen countries and rises everywhere. Air pollution stops improving. Water stress and food insecurity affect a large, stable and unimproving share of the sample. These are permanent operating conditions, not events.",
      data: [
        {
          finding:
            'Extreme heat becomes a permanent operating condition, not an occasional shock. Every country gets hotter, and today’s hottest places deteriorate fastest.',
          figure: { type: 'HeatBars', dataKey: 'heatBar' },
          sources: [
            { title: 'Deaths, disruptions across Europe: What you should know about the heatwave', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/24/deaths-disruptions-across-europe-what-you-should-know-about-the-heatwave' },
            { title: 'More than 1,300 deaths in Europe amid heatwave: What can countries do?', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/29/more-than-1300-deaths-in-europe-amid-heatwave-what-can-countries-do' },
            { title: 'France records hottest-ever day as 40 drown trying to escape heatwave', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/23/about-20-drown-in-france-trying-to-escape-heatwave-sweeping-much-of-europe' },
            { title: 'Extreme heat is breaking records worldwide: UN weather agency', publisher: 'UN News', date: 'Aug 2025', url: 'https://news.un.org/en/story/2025/08/1165597' },
            { title: 'Western Europe has hottest June on record', publisher: 'World Meteorological Organization', date: '2026', url: 'https://wmo.int/media/news/western-europe-has-hottest-june-record' },
            { title: "Guest post: France's June heatwave caused more than 2,700 heat-related deaths", publisher: 'Carbon Brief', date: '2026', url: 'https://www.carbonbrief.org/guest-post-frances-june-heatwave-caused-more-than-2700-heat-related-deaths' },
          ],
        },
        {
          finding:
            'Clean air remains out of reach across the entire sample. Not one country meets the WHO guideline through 2040.',
          figure: { type: 'HeatBars', dataKey: 'pm25Bar' },
          sources: [
            { title: "Pakistan world's most polluted country in 2025: Report", publisher: 'Al Jazeera', date: 'Mar 2026', url: 'https://www.aljazeera.com/news/2026/3/24/pakistan-worlds-most-polluted-country-in-2025-report' },
            { title: 'WHO Ambient Air Quality Database (update June 2026)', publisher: 'World Health Organization', date: 'Jun 2026', url: 'https://www.who.int/publications/m/item/who-ambient-air-quality-database-(update-jun-2026)' },
            { title: 'A new roadmap towards improving air quality indexes', publisher: 'World Health Organization', date: 'Jan 2026', url: 'https://www.who.int/europe/news/item/26-01-2026-a-new-roadmap-towards-improving-air-quality-indexes' },
            { title: "Summer's silent killer: why the world's heatwaves are a global health emergency", publisher: 'The Conversation', date: '2026', url: 'https://theconversation.com/summers-silent-killer-why-the-worlds-heatwaves-are-a-global-health-emergency-285849' },
            { title: 'European heatwave linked to 1,000 excess deaths in France', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/28/european-heatwave-causes-1000-excess-deaths-in-france' },
            { title: 'Record-breaking heat and extreme weather continue', publisher: 'World Meteorological Organization', date: '2026', url: 'https://wmo.int/media/news/record-breaking-heat-and-extreme-weather-continue' },
          ],
        },
        {
          finding:
            'Water and food stress become chronic rather than temporary. The number of affected countries does not improve at all by 2040.',
          figure: { type: 'CounterStrip', dataKey: 'stressCounters' },
          sources: [
            { title: 'Worsening hunger could push millions closer to famine in 13 global hotspots', publisher: 'UN News', date: 'Jun 2026', url: 'https://news.un.org/en/story/2026/06/1167742' },
            { title: 'Hunger Hotspots: FAO–WFP early warnings on acute food insecurity, June to November 2026 outlook', publisher: 'World Food Programme', date: 'Jun 2026', url: 'https://www.wfp.org/publications/hunger-hotspots-fao-wfp-early-warnings-acute-food-insecurity-june-november-2026' },
            { title: 'Global Report on Food Crises 2026', publisher: 'World Food Programme', date: '2026', url: 'https://www.wfp.org/publications/global-report-food-crises-grfc' },
            { title: 'Acute food insecurity and malnutrition remain alarmingly high as crises deepen, UN, EU and partners warn', publisher: 'UNICEF', date: '2026', url: 'https://www.unicef.org/press-releases/acute-food-insecurity-and-malnutrition-remain-alarmingly-high-crises-deepen-un-eu' },
            { title: 'Hunger Map 2026', publisher: 'Food and Agriculture Organization', date: '2026', url: 'https://www.fao.org/interactive/hunger-map/en/' },
            { title: 'Acute food insecurity and malnutrition remain alarmingly high as crises deepen', publisher: 'World Food Programme', date: '2026', url: 'https://www.wfp.org/news/acute-food-insecurity-and-malnutrition-remain-alarmingly-high-crises-deepen-un-eu-and-partners' },
          ],
        },
        {
          finding:
            'Biodiversity is not merely stuck; it keeps deteriorating. Extinction risk rises while the gap between healthier and weaker ecosystems widens.',
          figure: { type: 'TrendLine', dataKey: 'redList' },
          sources: [
            { title: 'Arctic seals threatened by climate change, birds decline globally — IUCN Red List', publisher: 'IUCN', date: 'Oct 2025', url: 'https://iucn.org/press-release/202510/arctic-seals-threatened-climate-change-birds-decline-globally-iucn-red-list' },
            { title: 'Mounting risks threaten survival of wild European pollinators — IUCN Red List', publisher: 'IUCN', date: 'Oct 2025', url: 'https://iucn.org/press-release/202510/mounting-risks-threaten-survival-wild-european-pollinators-iucn-red-list' },
            { title: 'IUCN Red List: 60 years of success', publisher: 'IUCN', date: 'Oct 2025', url: 'https://iucn.org/sites/default/files/2025-10/red-list-60-years-of-success-report-03.10.25.pdf' },
            { title: 'Models used for Red List assessments underestimate climate-related extinction risk of range-shifting species', publisher: 'Nature Ecology & Evolution', date: '2026', url: 'https://www.nature.com/articles/s41559-026-03125-y' },
            { title: 'COP30 nature agenda: modest wins, missed opportunities, and the urgent case for coherent action', publisher: 'ODI', date: '2026', url: 'https://odi.org/en/insights/cop30-nature-agenda-modest-wins-missed-opportunities-and-the-urgent-case-for-coherent-action/' },
            { title: 'Cropped, 11 February 2026: Biodiversity and business risks, deep-sea mining tensions', publisher: 'Carbon Brief', date: 'Feb 2026', url: 'https://www.carbonbrief.org/cropped-11-february-2026-aftershocks-of-us-withdrawals-biodiversity-and-business-risks-deep-sea-mining-tensions/' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Adaptation becomes domestic and individual: cooling, filtration, water storage.',
          why: 'When a hazard is chronic rather than acute, people move from emergency measures to permanent household and building infrastructure such as air conditioning, air purifiers and water tanks. Those adaptations raise energy demand and emissions in turn.',
          evidence:
            'Only 14% of global cities met the WHO PM2.5 guideline in 2025 and over 90% of the world\'s population lives above it, sustaining demand for household air filtration. Cooling demand growth is the clearest example of the adaptation-emissions feedback.',
        },
      ],
    },
  ],

  level3: { defaultProxy: 'D62', defaultMarkets: ['CHN', 'USA', 'IND'] },
};

export default planet;
