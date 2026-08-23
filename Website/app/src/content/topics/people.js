// Topic 04 — PEOPLE. Transcribed from `Topic 4 - People.docx`.
// D141 (political polarisation) is reverse-coded in V-Dem; the registry
// description was corrected on 2026-08-17 and the chart inverts the axis so
// that "up" means more polarised. The data values were always correct.

const people = {
  id: 'people',
  name: 'People',
  accent: '#ba8030',
  status: 'live',

  level1: {
    kicker: 'Topic 04 · People',
    heroHeadline: 'Healthier, better educated, and angrier.',
    heroSub:
      'There is no single human future in 2040. There are two, and they are pulling apart. One world is old, shrinking and short of workers; the other is young, growing and short of jobs. Beneath that split, health, schooling and service coverage converge across countries almost everywhere, while civic space contracts in 27 of 34 countries and both protest and political violence rise.',
    behaviour:
      'If capability rises while the channels for expressing grievance narrow, the pressure does not disappear. It moves into migration, protest and politics that reject the existing settlement. The scarce resource is not human capital, but institutions able to absorb what human capital demands.',
    bridgeTitle: 'The 2040 human landscape',
    framing:
      'If capability rises while the channels for expressing grievance narrow, the pressure does not disappear. It moves into migration, protest and politics that reject the existing settlement. The scarce resource in 2040 is not human capital, but institutions able to absorb what human capital demands.',
  },

  level2: [
    {
      n: 1,
      title: 'Two demographic worlds are moving apart. This is the only topic where divergence is the headline.',
      overall:
        'Ageing is not a global condition; it is one half of a split. A quarter of our sample is entering deep ageing while another group still has median ages in the teens. Crucially, the demographic indicators that diverge describe direction: population growth, youth share and working-age growth. The two worlds are moving further apart rather than converging on a common path.',
      data: [
        {
          finding:
            'The world is splitting into old and young societies, not ageing together. The median-age gap between the oldest and youngest countries reaches 33 years.',
          figure: { type: 'HeatBars', dataKey: 'medianAgeBar' },
          sources: [
            { title: 'From youth bulges to graying societies: the demographic dynamics that are upending the world', publisher: 'The Conversation', date: 'Mar 2026', url: 'https://theconversation.com/from-youth-bulges-to-graying-societies-the-demographic-dynamics-that-are-upending-the-world-274276' },
            { title: "Japan's number of babies born marks record low for 10th straight year", publisher: 'Nikkei Asia', date: 'Feb 2026', url: 'https://asia.nikkei.com/economy/demography/japan-s-number-of-babies-born-marks-record-low-for-10th-straight-year' },
            { title: 'Can Africa turn its population boom into prosperity?', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/12/can-africa-turn-its-population-boom-into-prosperity' },
            { title: 'How African countries can continue to build on recent growth', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/africa-future-young-population/' },
            { title: 'Rapidly ageing populations will continue to put pressure on pension systems', publisher: 'OECD', date: 'Nov 2025', url: 'https://www.oecd.org/en/about/news/press-releases/2025/11/rapidly-ageing-populations-will-continue-to-put-pressure-on-pension-systems.html' },
            { title: 'What should be the top priorities for Africa in 2026?', publisher: 'Brookings Institution', date: 'Jan 2026', url: 'https://www.brookings.edu/articles/what-should-be-the-top-priorities-for-africa-in-2026/' },
          ],
        },
        {
          finding:
            'The deepest divide is future workforce growth. Some countries face shrinking labour pools while others keep adding young workers at speed.',
          figure: { type: 'DivergingBar', dataKey: 'demographicDispersion' },
          sources: [
            { title: "Miracle under threat: South Korea's birth rate collapse could undo decades of growth", publisher: 'CNBC', date: 'Sep 2025', url: 'https://www.cnbc.com/2025/09/27/south-koreas-birth-rate-collapse-threatens-growth.html' },
            { title: "A ladder of opportunity: unlocking jobs for today's African youth", publisher: 'World Bank', date: '2026', url: 'https://blogs.worldbank.org/en/africacan/a-ladder-of-opportunity-unlocking-jobs-for-todays-african-youth' },
            { title: "Investing in Africa's growing young population for prosperity", publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/investing-in-africas-growing-young-population-for-prosperity/' },
            { title: '5 assets Africa can turn into good jobs at scale', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/5-assets-africa-can-turn-into-good-jobs-at-scale/' },
            { title: 'Key Policy Insights — OECD Economic Surveys: Japan 2026', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/oecd-economic-surveys-japan-2026_54cc833d-en/full-report/key-policy-insights_e3384128.html' },
            { title: '7 facts about population in Sub-Saharan Africa', publisher: 'World Bank', date: '2026', url: 'https://blogs.worldbank.org/en/africacan/7-facts-about-population-in-sub-saharan-africa' },
          ],
        },
        {
          finding:
            'Population renewal becomes the exception. By 2040, nearly three quarters of the countries tracked have fertility below replacement level.',
          figure: { type: 'HeatBars', dataKey: 'fertilityCounters' },
          sources: [
            { title: 'Why lower fertility does not have to mean economic decline', publisher: 'UN News', date: 'Apr 2026', url: 'https://news.un.org/en/story/2026/04/1167315' },
            { title: "India's fertility rate falls below replacement level: Why it matters", publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/9/indias-fertility-rate-falls-below-replacement-level-why-it-matters' },
            { title: "South Korea's birth rate is rising – but the population is still shrinking", publisher: 'The Conversation', date: 'Feb 2026', url: 'https://theconversation.com/south-koreas-birth-rate-is-rising-but-the-population-is-still-shrinking-276924' },
            { title: "Asia's lowest birth rate is rising for the first time in a decade", publisher: 'South China Morning Post', date: '2026', url: 'https://www.scmp.com/news/asia/east-asia/article/3295745/first-time-decade-asias-lowest-birth-rate-rise' },
            { title: 'The real fertility crisis: the pursuit of reproductive agency in a changing world', publisher: 'United Nations Population Fund', date: '2026', url: 'https://www.unfpa.org/resources/real-fertility-crisis-pursuit-reproductive-agency-changing-world-highlights-brochure' },
            { title: 'Planning for and responding to demographic changes', publisher: 'United Nations Population Fund', date: '2026', url: 'https://www.unfpa.org/planning-and-responding-demographic-changes' },
          ],
        },
        {
          finding:
            'Deep ageing spreads beyond Japan and continental Europe. Canada, the UK and Poland join the group where at least one person in five is over 65.',
          figure: { type: 'HeatBars', dataKey: 'ageingCrossings' },
          sources: [
            { title: 'Old-age pensions — Restoring Public Finances', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/restoring-public-finances_fbcf9161-en/full-report/old-age-pensions_a94a0115.html' },
            { title: 'Jobs in East Asia and Pacific: Pathways to Prosperity', publisher: 'World Bank', date: '2026', url: 'https://www.worldbank.org/en/region/eap/brief/jobs-in-east-asia-and-pacific-pathways-to-prosperity' },
            { title: 'Ageing — OECD topic overview', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/topics/ageing.html' },
            { title: 'Ageing — United Nations Population Fund', publisher: 'United Nations Population Fund', date: '2026', url: 'https://www.unfpa.org/ageing' },
            { title: 'G20 background note on ageing and migration', publisher: 'International Monetary Fund', date: '2025', url: 'https://www.imf.org/-/media/files/research/imf-and-g20/2025/g20-background-note-on-aging-and-migration.pdf' },
            { title: 'Public pensions — OECD topic overview', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/topics/sub-issues/public-pensions.html' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Migration stops being a political choice and becomes an arithmetic one.',
          why: 'When one group of countries has shrinking workforces and another has youth bulges without jobs, labour moves regardless of policy preference. Yet the receiving countries with the deepest shortages have the least political room to say so openly.',
          evidence:
            "136 countries are now below replacement fertility and roughly 71% of the world's people live in below-replacement societies. China is projected to lose about 204 million people between 2024 and 2054, Japan 21 million and Russia 10 million, while all of Africa's growth continues.",
        },
      ],
    },

    {
      n: 2,
      title: 'Capability converges, but cohesion does not. The good news and the bad news are on different curves.',
      overall:
        'On almost everything to do with keeping people alive, healthy and schooled, the world is converging: the gap between the best and worst performers narrows. On everything to do with whether people can organise, be heard and settle disputes peacefully, it is widening. Human development succeeds while political containment fails.',
      data: [
        {
          finding:
            'On health and education, countries are catching up. The gaps in coverage, schooling and healthy life expectancy all narrow.',
          figure: { type: 'TimeBars', dataKey: 'capabilityFunnel' },
          sources: [
            { title: 'Global health gains face threat of reversal', publisher: 'World Health Organization', date: 'May 2026', url: 'https://www.who.int/news/item/13-05-2026-global-health-gains-face-threat-of-reversal' },
            { title: 'World health statistics 2026: monitoring health for the SDGs', publisher: 'World Health Organization', date: '2026', url: 'https://www.who.int/publications/i/item/9789240122482' },
            { title: '2026 Global Education Monitoring Report: Access and equity — Countdown to 2030', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/en/articles/2026-global-education-monitoring-report-access-and-equity-countdown-2030' },
            { title: 'More children out of school for the 7th year in a row, up to 273 million', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/en/articles/more-children-out-school-7th-year-row-273-million' },
            { title: 'South Asia has high out-of-school rates, yet learners who enter school continue through and succeed', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/en/articles/south-asia-has-high-out-school-rates-yet-learners-who-enter-school-continue-through-and-succeed' },
            { title: 'Monitoring education in the SDGs — 2026 GEM Report', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/reports/gem-report/en/2026-monitoring-sdg4' },
          ],
        },
        {
          finding:
            'On voice and social cohesion, countries move apart. People become healthier and better educated while their room to organise narrows.',
          figure: { type: 'TimeBars', dataKey: 'cohesionFunnel' },
          sources: [
            { title: 'CIVICUS Monitor Watchlist: March 2026', publisher: 'CIVICUS', date: 'Mar 2026', url: 'https://www.civicus.org/index.php/media-resources/news/8201-civicus-monitor-watchlist-march-2026' },
            { title: 'Watchlist March 2026', publisher: 'CIVICUS Monitor', date: 'Mar 2026', url: 'https://monitor.civicus.org/watchlist-march-2026/' },
            { title: 'Civic space faces constraints ahead of 2026 elections', publisher: 'CIVICUS Monitor', date: '2026', url: 'https://monitor.civicus.org/explore/civic-space-faces-constraints-ahead-of-2026-elections/' },
            { title: 'e-CIVICUS: 24 March 2026', publisher: 'CIVICUS', date: 'Mar 2026', url: 'https://civicus.org/index.php/media-resources/newsletters/8233-e-civicus-24-march-2026' },
            { title: 'CIVICUS Monitor: Global Findings', publisher: 'CIVICUS Monitor', date: '2026', url: 'https://monitor.civicus.org/globalfindings/' },
            { title: 'Bridging the equity gap: addressing out-of-school children — 2026 UNESCO GEM Report', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/en/articles/bridging-equity-gap-addressing-out-school-children-pakistan-2026-unesco-gem-report' },
          ],
        },
        {
          finding:
            'Maternal survival improves globally, but the gains go mainly to countries already doing well. Progress rises while inequality widens.',
          figure: { type: 'PairedBars', dataKey: 'maternalDumbbell' },
          sources: [
            { title: '251M children and youth still out of school, despite decades of progress', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/en/articles/251m-children-and-youth-still-out-school-despite-decades-progress-unesco-report' },
            { title: '2026 GEM Report: Equity and access', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/gem-report/en/publication/equity-and-access' },
            { title: 'Over a billion people living with mental health conditions — services require urgent scale-up', publisher: 'World Health Organization', date: 'Sep 2025', url: 'https://www.who.int/news/item/02-09-2025-over-a-billion-people-living-with-mental-health-conditions-services-require-urgent-scale-up' },
            { title: '2026 GEM Report — Global Education Monitoring Report', publisher: 'UNESCO', date: '2026', url: 'https://www.unesco.org/reports/gem-report/en/2026' },
            { title: 'Aid cuts threaten fragile progress in ending maternal deaths, UN agencies warn', publisher: 'UNICEF', date: '2026', url: 'https://www.unicef.org/press-releases/aid-cuts-threaten-fragile-progress-ending-maternal-deaths-un-agencies-warn' },
            { title: 'Aid cuts threaten fragile progress in ending maternal deaths', publisher: 'UN Population Fund', date: '2026', url: 'https://www.unfpa.org/press/aid-cuts-threaten-fragile-progress-ending-maternal-deaths-un-agencies-warn' },
          ],
        },
        {
          finding:
            'Mental health worsens on both level and inequality. Depression and anxiety rise as countries also pull further apart.',
          figure: { type: 'TrendLine', dataKey: 'mentalHealth' },
          sources: [
            { title: 'The global burden of mental and substance use disorders among adolescents and young adults', publisher: 'Molecular Psychiatry (Nature)', date: '2026', url: 'https://www.nature.com/articles/s41380-026-03503-9' },
            { title: 'Anxiety disorders — WHO fact sheet', publisher: 'World Health Organization', date: '2026', url: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders' },
            { title: 'Global Strategic Direction for Mental Health', publisher: 'World Health Organization', date: '2026', url: 'https://www.who.int/observatories/global-observatory-on-health-research-and-development/analyses-and-syntheses/mental-health/global-strategic-direction' },
            { title: 'Q&A: What does the new ACLED Conflict Index reveal about global political violence?', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/qa/qa-what-does-new-acled-conflict-index-reveal-about-global-political-violence' },
            { title: 'Mental health — WHO health topic', publisher: 'World Health Organization', date: '2026', url: 'https://www.who.int/health-topics/mental-health' },
            { title: 'Closing the global gap in adolescent mental health', publisher: 'Nature Medicine', date: '2026', url: 'https://www.nature.com/articles/s41591-024-02846-6' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Grievance becomes better-informed and better-organised.',
          why: 'Healthier, more educated and more connected populations do not become more compliant. They become better able to articulate what they are owed, which is precisely what makes narrowing civic space combustible.',
          evidence:
            'The capability set and the cohesion set move in opposite directions across the same countries over the same period.',
        },
      ],
    },

    {
      n: 3,
      title: 'Protest and political violence rise while the room to protest shrinks. The pressure has nowhere to go.',
      overall:
        "Three things move together in our data and they compound. Mobilisation rises, realised political violence rises faster, and the civic space that would normally channel the first away from the second contracts. This is the 'protest without reform' future, and it is the modal outcome across the sample rather than a feature of a few fragile states.",
      data: [
        {
          finding:
            'Protest becomes a mainstream feature of middle- and high-income societies, not a symptom confined to fragile states.',
          figure: { type: 'HeatBars', dataKey: 'protestBar' },
          sources: [
            { title: 'Corruption, Overreach, and Hardship: The Global Drivers of Protests in 2025', publisher: 'Carnegie Endowment for International Peace', date: 'Dec 2025', url: 'https://carnegieendowment.org/emissary/2025/12/global-protests-2025-genz-corruption-economy' },
            { title: 'Economic shockwaves from the Iran war fuel protests across South Asia', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/report/economic-shockwaves-iran-war-fuel-protests-across-south-asia' },
            { title: 'Tear gas fired at India workers demanding higher wages as living costs rise', publisher: 'Al Jazeera', date: 'Apr 2026', url: 'https://www.aljazeera.com/news/2026/4/13/tear-gas-fired-at-indian-workers-demanding-higher-wage-as-living-costs-rise' },
            { title: 'Several killed as Iran protests over rising cost of living spread', publisher: 'Al Jazeera', date: 'Jan 2026', url: 'https://www.aljazeera.com/news/2026/1/1/several-killed-as-iran-protests-over-rising-cost-of-living-spread' },
            { title: 'What we know about the protests sweeping Iran', publisher: 'Al Jazeera', date: 'Jan 2026', url: 'https://www.aljazeera.com/news/2026/1/12/what-we-know-about-the-protests-sweeping-iran' },
            { title: 'Global demonstrations in response to the Middle East crisis', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/infographic/global-demonstrations-response-middle-east-crisis' },
          ],
        },
        {
          finding:
            'Political violence grows faster than protest. The pressure is not only becoming more visible; in many countries it is becoming more lethal.',
          figure: { type: 'PanelTrends', dataKey: 'violenceVsProtest' },
          sources: [
            { title: 'Conflict Index & 2026 Watchlist', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/conflict-index-2026-watchlist' },
            { title: 'Conflict Watchlist 2026', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/series/conflict-watchlist-2026' },
            { title: 'Violence Targeting Local Officials: 2026 Annual Report', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/series/violence-targeting-local-officials-2026-annual-report' },
            { title: 'ACLED Conflict Index', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/series/acled-conflict-index' },
            { title: 'Ten Pivotal Cases for Global Democracy', publisher: 'Carnegie Endowment for International Peace', date: 'Dec 2025', url: 'https://carnegieendowment.org/emissary/2025/12/global-democracy-ten-pivotal-cases' },
            { title: 'Haiti Is in a Crisis of State Capacity', publisher: 'Carnegie Endowment for International Peace', date: 'Dec 2025', url: 'https://carnegieendowment.org/emissary/2025/12/haiti-crisis-state-capacity-gangs-weapons-drugs' },
          ],
        },
        {
          finding:
            'The space for peaceful dissent keeps closing. Assembly rights worsen in most countries and broader political voice never recovers.',
          figure: { type: 'TrendLine', dataKey: 'assemblyDecline' },
          sources: [
            { title: 'Democracy Report 2026: Unravelling the Democratic Era?', publisher: 'V-Dem Institute', date: '2026', url: 'https://v-dem.net/documents/75/V-Dem_Institute_Democracy_Report_2026_lowres.pdf' },
            { title: "Democratic Backsliding Reaches Western Democracies, with U.S. Decline 'Unprecedented'", publisher: 'V-Dem Institute', date: '2026', url: 'https://www.v-dem.net/news/press-release-democratic-backsliding-reaches-western-democracies-with-us-decline-unprecedented/' },
            { title: 'The Growing Shadow of Autocracy — Freedom in the World 2026', publisher: 'Freedom House', date: '2026', url: 'https://freedomhouse.org/report/freedom-world/2026/growing-shadow-autocracy' },
            { title: 'Restrictions to freedom of expression as democracy loses ground', publisher: 'V-Dem Institute', date: '2026', url: 'https://www.v-dem.net/news/press-release-restrictions-to-freedom-of-expression-as-democracy-loses-ground/' },
            { title: 'As Democracy Falters Worldwide, Authoritarians are Winning', publisher: 'Council on Foreign Relations', date: '2026', url: 'https://www.cfr.org/articles/freedom-houses-annual-report-shows-the-dire-state-of-democracy-worldwide' },
            { title: 'Turkey: Freedom in the World 2026 Country Report', publisher: 'Freedom House', date: '2026', url: 'https://freedomhouse.org/country/turkey/freedom-world/2026' },
          ],
        },
        {
          finding:
            'Polarisation becomes nearly universal. By 2040, only three countries avoid becoming more politically divided.',
          figure: { type: 'TrendLine', dataKey: 'polarisation' },
          sources: [
            { title: 'Global Protest Tracker', publisher: 'Carnegie Endowment for International Peace', date: '2026', url: 'https://carnegieendowment.org/features/global-protest-tracker' },
            { title: 'Global analysis — ACLED', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/global-analysis' },
            { title: 'Shrinking Welfare in the United States Will Bring Political and Social Consequences', publisher: 'Carnegie Endowment for International Peace', date: 'Jan 2026', url: 'https://carnegieendowment.org/china/posts/2026/01/shrinking-welfare-benefits-united-states' },
            { title: 'Democracy Reports — V-Dem', publisher: 'V-Dem Institute', date: '2026', url: 'https://www.v-dem.net/publications/democracy-reports/' },
            { title: 'Brief US government shutdown begins after funding deadline lapses', publisher: 'Al Jazeera', date: 'Jan 2026', url: 'https://www.aljazeera.com/news/2026/1/31/us-senate-approves-spending-package-but-short-government-shutdown-likely' },
            { title: 'News and publications — V-Dem', publisher: 'V-Dem Institute', date: '2026', url: 'https://www.v-dem.net/news/category/publications/' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Politics moves outside the institutions designed to hold it.',
          why: 'When mobilisation rises while assembly rights and civil-society space contract, people shift their grievances to channels that are less mediated and less reversible. These include street action, online organising and support for parties that reject the system rather than compete within it.',
          evidence:
            "V-Dem's 2025 Democracy Report found autocracies outnumbering democracies for the first time in over 20 years, with the average world citizen's level of democracy back to 1985 levels, and identified the United States as undergoing the fastest episode of autocratisation in its modern history.",
        },
      ],
    },

    {
      n: 4,
      title: 'Pressure rises where institutional capacity is weakest, and the same eight or so countries appear again.',
      overall:
        "Crossing social and economic pressure against the institutions meant to absorb it gives the same structure as the Planet topic's adaptation divide: a negative correlation of about −0.5, a stable set of quadrants, and a group of countries carrying maximum pressure with minimum capacity. Strikingly, the membership of that group overlaps heavily with Planet's 'exposed and unable' list.",
      data: [
        {
          finding:
            'Social pressure is highest where institutions are weakest. The countries most in need of shock absorbers are the least likely to have them.',
          figure: { type: 'QuadrantScatter', dataKey: 'pressureInstitutions' },
          sources: [
            { title: 'State Capacity and American Power', publisher: 'Carnegie Endowment for International Peace', date: 'Jun 2026', url: 'https://carnegieendowment.org/research/2026/06/state-capacity-and-american-power' },
            { title: 'Fragility, Conflict and Violence', publisher: 'World Bank', date: '2026', url: 'https://www.worldbank.org/ext/en/topic/fragility-conflict-and-violence' },
            { title: 'Fragility, Conflict, and Violence: Country Classifications', publisher: 'World Bank', date: '2026', url: 'https://www.worldbank.org/en/topic/fragilityconflictviolence/brief/classification-of-fragile-and-conflict-affected-situations' },
            { title: 'ACLED Conflict Index & 2026 Watchlist Virtual Launch', publisher: 'ACLED', date: '2026', url: 'https://acleddata.com/launch/acled-conflict-index-2026-watchlist-virtual-launch' },
            { title: 'How many people can the federal government lose before it crashes?', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/how-many-people-can-the-federal-government-lose-before-it-crashes/' },
            { title: 'Publications — CIVICUS Monitor', publisher: 'CIVICUS Monitor', date: '2026', url: 'https://monitor.civicus.org/publications/' },
          ],
        },
        {
          finding:
            'Eleven countries sit in the high-pressure, weak-institution danger zone. South Africa shows that pressure alone is not destiny when institutions can still absorb it.',
          figure: { type: 'DivergingBar', dataKey: 'pressureGap' },
          sources: [
            { title: 'Post-apartheid South Africa: 50 years after Soweto riots, what has changed?', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/16/post-apartheid-south-africa-50-years-after-soweto-riots-what-has-changed' },
            { title: 'Political violence in South Africa is driven by a power elite trying to establish dominance — new research', publisher: 'The Conversation', date: '2026', url: 'https://theconversation.com/political-violence-in-south-africa-is-driven-by-a-power-elite-trying-to-establish-dominance-new-research-280504' },
            { title: "Africa's Democratic Kaleidoscope: Trends to Watch in 2026", publisher: 'Carnegie Endowment for International Peace', date: 'Jan 2026', url: 'https://carnegieendowment.org/research/2026/01/africa-democracy-protest-elections-coups' },
            { title: 'Africa in 2026: Global uncertainty demands regional leadership', publisher: 'Chatham House', date: 'Jan 2026', url: 'https://www.chathamhouse.org/2026/01/africa-2026-global-uncertainty-demands-regional-leadership' },
            { title: 'Prospects for democratic resilience in Africa during uncertain times', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/prospects-for-democratic-resilience-in-africa-during-uncertain-times/' },
            { title: 'Improving democratic resilience in Africa: lessons from comparative case studies', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/improving-democratic-resilience-in-africa-lessons-from-comparative-case-studies/' },
          ],
        },
        {
          finding:
            "Climate risk and social fragility are the same map layered twice. Every country in Planet's worst-risk group also appears among People’s most pressured and institutionally weak.",
          figure: { type: 'VennThree', dataKey: 'planetPeopleOverlap' },
          sources: [
            { title: 'Global Appeal 2026', publisher: 'UNHCR', date: '2026', url: 'https://www.unhcr.org/publications/global-appeal-2026' },
            { title: 'No Escape: On the frontlines of climate change, conflict and forced displacement', publisher: 'UNHCR', date: '2026', url: 'https://www.unhcr.org/publications/no-escape-frontlines-climate-change-conflict-and-forced-displacement' },
            { title: 'As Money Goes out for Climate-Related Loss and Damage, Displaced Communities Stand to Benefit', publisher: 'Carnegie Endowment for International Peace', date: 'Jan 2026', url: 'https://carnegieendowment.org/russia-eurasia/posts/2026/01/loss-damage-fund-climate-displacement-mobility-migration' },
            { title: 'Climate change and displacement', publisher: 'UNHCR', date: '2026', url: 'https://www.unhcr.org/what-we-do/build-better-futures/climate-change-and-displacement' },
            { title: 'Rethinking state capacity: a practical framework for better policy implementation', publisher: 'World Bank', date: '2026', url: 'https://blogs.worldbank.org/en/governance/rethinking-state-capacity--a-practical-framework-for-better-poli' },
            { title: 'Effective governance and state capacity are key to economic development', publisher: 'World Bank', date: '2026', url: 'https://blogs.worldbank.org/en/governance/effective-governance-and-state-capacity-are-key-to-economic-deve' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Compound risk concentrates rather than spreads.',
          why: 'When climate exposure, youth bulges, weak services and narrow civic space stack up in the same countries, they compound one another. The same handful of states will generate a disproportionate share of the world\'s displacement, instability and emigration pressure through 2040.',
          evidence:
            'This cross-topic overlap is our own construction, computed from proxy sets that share no indicators.',
        },
      ],
    },
  ],

  level3: { defaultProxy: 'D103', defaultMarkets: ['JPN', 'NGA'] },
};

export default people;
