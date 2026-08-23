// Topic 05 — ECONOMY. Transcribed from `Topic 5 - Economy.docx`.
// Argument 5 is the framework's cross-topic result; it is also surfaced on the
// hub (see hub/CompoundRisk.jsx) and called out on Planet and People.

const economy = {
  id: 'economy',
  name: 'Economy',
  accent: '#6f6284',
  status: 'live',

  level1: {
    kicker: 'Topic 05 · Economy',
    heroHeadline: 'Integration holds. Shock absorption does not.',
    heroSub:
      'The global economy in 2040 is more integrated than the fragmentation narrative suggests and far more unequal in its ability to withstand shocks. Trade openness rises, tariffs fall and regional trade shares actually decline. What changes is who can absorb a shock. Financial resilience is the most consistently diverging question set in the entire framework.',
    behaviour:
      'If integration persists but shock absorption does not, the decisive variable is not exposure to the world economy but access to cheap money when things break. Balance-sheet strength becomes the real dividing line between countries, firms and households.',
    bridgeTitle: 'The 2040 economic landscape',
    framing:
      'If integration persists but shock absorption does not, then the decisive variable is not exposure to the world economy but access to cheap money when things break. Balance-sheet strength becomes the real dividing line between countries, firms and households, more important than growth or trade position.',
  },

  level2: [
    {
      n: 1,
      title: 'Globalisation holds as trade diversifies across blocs rather than consolidating within them.',
      overall:
        'On every aggregate measure we carry, integration holds or deepens. Trade openness rises, applied tariffs fall in 32 of 34 countries, intermediate-goods trade is flat and intra-regional trade share actually declines. Having now built the bloc-level measure the architecture always called for, the underlying composition tells a genuinely counter-intuitive story: 31 of 34 countries are becoming less concentrated in a single geopolitical trade bloc over 2025–2040, not more.',
      data: [
        {
          finding:
            'Globalisation keeps deepening beneath the political noise. Trade grows relative to economies and tariffs fall almost everywhere.',
          figure: { type: 'PanelTrends', dataKey: 'opennessTariffs' },
          sources: [
            { title: 'Global Trade Outlook and Statistics, March 2026', publisher: 'World Trade Organization', date: 'Mar 2026', url: 'https://www.wto.org/english/res_e/publications_e/gtos0326_e.htm' },
            { title: 'Middle East conflict weighs further on slowing trade outlook', publisher: 'World Trade Organization', date: 'Mar 2026', url: 'https://www.wto.org/english/news_e/news26_e/stat_19mar26_329_e.htm' },
            { title: 'AI investment and Middle East conflict shape outlook for global trade', publisher: 'WTO Blog', date: 'Mar 2026', url: 'https://www.wto.org/english/news_e/news26_e/blgrs_20mar26_332_e.htm' },
            { title: 'Frontloading, measured responses cushion tariff impact in 2025 but risk high for 2026', publisher: 'World Trade Organization', date: 'Aug 2025', url: 'https://www.wto.org/english/news_e/news25_e/tfore_08aug25_e.htm' },
            { title: 'WTO hikes global trade forecast for 2025; slowdown expected in 2026', publisher: 'CNBC', date: 'Oct 2025', url: 'https://www.cnbc.com/2025/10/07/wto-hikes-global-trade-forecast-for-2025-slowdown-expected-in-2026-.html' },
            { title: 'Global Trade Outlook and Statistics Update, October 2025', publisher: 'World Trade Organization', date: 'Oct 2025', url: 'https://www.wto.org/english/news_e/news25_e/stat_07oct25_e.pdf' },
          ],
        },
        {
          finding:
            'The world is not retreating into regional trade blocs. The share of trade staying inside its home region keeps falling, and supply chains are as international in 2040 as they are today.',
          figure: { type: 'TrendLine', dataKey: 'regionalisation' },
          sources: [
            { title: "Globalization's shift towards resilience and regions", publisher: 'World Economic Forum', date: 'Mar 2026', url: 'https://www.weforum.org/stories/2026/03/globalization-rebuilt-around-resilience-regions-and-intelligence/' },
            { title: 'AfCFTA Implementation: Learnings from Value Chains and Regional Blocs', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/publications/afcfta-implementation-learnings-from-value-chains-and-regional-blocs/' },
            { title: "China is rewiring its global supply chains — here's why", publisher: 'CNBC', date: 'Apr 2026', url: 'https://www.cnbc.com/video/2026/04/18/why-china-is-rewiring-its-global-supply-chains.html' },
            { title: 'Navigating trade in 2026: 5 strategic shifts in business decisions', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/navigating-trade-in-2026/' },
            { title: 'WTO Regional Trade Agreements gateway', publisher: 'World Trade Organization', date: '2026', url: 'https://www.wto.org/english/tratop_e/region_e/region_e.htm' },
            { title: 'Top trends redefining global trade in 2026 — Policy Insights', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/system/files/official-document/ditcinf2025d11_en.pdf' },
          ],
        },
        {
          finding:
            'Countries are spreading trade across more blocs, not consolidating into one. Diversification, not alignment, is the dominant response to geopolitical tension.',
          figure: { type: 'PairedBars', dataKey: 'blocHhi' },
          sources: [
            { title: 'Supply chain diversification away from China is progressing from talks to action, EU chamber says', publisher: 'CNBC', date: 'Dec 2025', url: 'https://www.cnbc.com/2025/12/10/supply-chain-diversification-away-from-china-is-progressing-from-talks-to-action-eu-chamber-says.html' },
            { title: 'Supply chain resilience — in China and everywhere else', publisher: 'McKinsey & Company', date: '2026', url: 'https://www.mckinsey.com/capabilities/operations/our-insights/operations-blog/supply-chain-resilience-in-china-and-everywhere-else' },
            { title: 'Trade and Development Board: global value chain restructuring', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/system/files/official-document/ciimem4d34_en.pdf' },
            { title: 'AfCFTA Implementation: Learnings from Value Chains and Regional Blocs (full report)', publisher: 'World Economic Forum', date: '2026', url: 'https://reports.weforum.org/docs/WEF_AfCFTA_Implementation_Learnings_from_Value_Chains_and_Regional_Blocs_2026.pdf' },
            { title: 'Global Review 2026 — Aid for Trade', publisher: 'World Trade Organization', date: '2026', url: 'https://www.wto.org/english/tratop_e/devel_e/a4t_e/global_review26_e/global_review26_e.htm' },
            { title: 'How supply chains need to adapt to a shifting global landscape', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/stories/2025/06/how-supply-chains-need-to-adapt-to-a-shifting-global-landscape/' },
          ],
        },
        {
          finding:
            'Countries stay connected, but on increasingly unequal terms. The most open economies keep opening while the least open slip back.',
          figure: { type: 'PanelTrends', dataKey: 'integrationSpread' },
          sources: [
            { title: 'Trade, poverty and inequalities — least developed countries', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/topic/least-developed-countries/trade-and-poverty-reduction' },
            { title: 'Recovery with Resilience: Diversifying Supply Chains to Reduce Risk in the Global Economy', publisher: 'CSIS', date: '2026', url: 'https://www.csis.org/analysis/recovery-resilience-diversifying-supply-chains-reduce-risk-global-economy' },
            { title: 'Building Resilient Global Supply Chains: The Geopolitics of the Indo-Pacific Region', publisher: 'CSIS', date: '2026', url: 'https://www.csis.org/analysis/building-resilient-global-supply-chains-geopolitics-indo-pacific-region' },
            { title: 'Boosting trade opportunities for least-developed countries', publisher: 'World Trade Organization', date: '2026', url: 'https://www.wto.org/english/res_e/publications_e/boottradeopp22_e.htm' },
            { title: 'Supply Chain Diversification and Resilience', publisher: 'International Monetary Fund', date: '2026', url: 'https://www.elibrary.imf.org/view/journals/001/2025/102/article-A001-en.xml' },
            { title: 'Global Trade Outlook and Statistics — March 2026 (full report)', publisher: 'World Trade Organization', date: 'Mar 2026', url: 'https://www.wto.org/english/res_e/booksp_e/gtos0326_e.pdf' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Firms hedge geography without reducing trade.',
          why: 'If aggregate openness holds while political risk rises, the rational response is not to trade less but to maintain supplier relationships across multiple blocs. This keeps trade volumes up while raising the cost of resilience.',
          evidence:
            "UNCTAD's January 2026 Global Trade Update describes trade volumes holding even as geopolitical fragmentation, digital and green transitions and tighter national regulation reshape the system. It is a pattern of rewiring without retreat.",
        },
      ],
    },

    {
      n: 2,
      title: 'China becomes the workshop of the world to a degree without modern precedent.',
      overall:
        'The concentration of manufacturing in a single country is the most extreme structural fact in this topic. By 2040, China reaches more than a third of world manufacturing value added, roughly two and a half times the United States. Japan, which previously held that position, falls to a twentieth of its 2000 share.',
      data: [
        {
          finding:
            'China becomes the workshop of the world on a scale no modern country has matched. By 2040 it produces more than a third of global manufacturing value.',
          figure: { type: 'StackedArea', dataKey: 'mfgArea' },
          sources: [
            { title: "Measuring China's Manufacturing Might", publisher: 'CSIS ChinaPower Project', date: '2026', url: 'https://chinapower.csis.org/tracker/china-manufacturing/' },
            { title: "China's Record Manufacturing Surplus", publisher: 'Council on Foreign Relations', date: '2026', url: 'https://www.cfr.org/articles/chinas-record-manufacturing-surplus' },
            { title: "'Made in China 2025' cements manufacturing dominance despite missed goals, US review finds", publisher: 'South China Morning Post', date: '2026', url: 'https://www.scmp.com/economy/china-economy/article/3333119/made-china-2025-cements-manufacturing-dominance-despite-missed-goals-us-review-finds' },
            { title: 'Manufacturing for Growth: strategies for driving growth and employment — China', publisher: 'World Economic Forum', date: '2026', url: 'https://reports.weforum.org/manufacturing-growth/china' },
            { title: "Four trends to watch as China's industrial policy evolves", publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/stories/trade-and-investment/china-industrial-policy-four-trends-to-watch/' },
            { title: "China's new restrictions on rare earth exports send a stark warning to the West", publisher: 'Chatham House', date: 'Oct 2025', url: 'https://www.chathamhouse.org/2025/10/chinas-new-restrictions-rare-earth-exports-send-stark-warning-west' },
          ],
        },
        {
          finding:
            'Production scale becomes economic scale. China converts manufacturing dominance into a larger share of world output and exports, while India builds a separate strength in services.',
          figure: { type: 'PanelTrends', dataKey: 'scaleShares' },
          sources: [
            { title: "China's annual trade surplus hits a record $1.2 trillion, even as exports to U.S. decline by 20%", publisher: 'CNBC', date: 'Jan 2026', url: 'https://www.cnbc.com/2026/01/14/china-trade-data-surplus-exports-imports-december-tariffs-tensions.html' },
            { title: "China's trade surges in first half of 2026, maintaining growth amid global tensions", publisher: 'South China Morning Post', date: '2026', url: 'https://www.scmp.com/economy/economic-indicators/article/3360451/chinas-trade-surges-june-maintaining-growth-streak-despite-global-tensions' },
            { title: 'Rebalancing Growth: China Economic Update', publisher: 'World Bank', date: 'Jul 2026', url: 'https://www.worldbank.org/en/news/press-release/2026/07/07/rebalancing-growth-china-economic-update' },
            { title: "The state of China's economy in 5 numbers", publisher: 'World Economic Forum', date: 'Jun 2026', url: 'https://weforum.org/stories/2026/06/the-state-of-china-economy-in-five-numbers' },
            { title: 'India goods exports rise in November despite U.S. tariffs', publisher: 'CNBC', date: 'Dec 2025', url: 'https://www.cnbc.com/2025/12/15/india-goods-exports-rise-despite-us-tariffs.html' },
            { title: 'Global manufacturing scorecard: how the US compares to 18 other nations', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/global-manufacturing-scorecard-how-the-us-compares-to-18-other-nations/' },
          ],
        },
        {
          finding:
            'What economies can actually do is pulling apart fastest on productivity. The gap between countries on total factor productivity widens by two-thirds, far more than on any other measure of capability.',
          figure: { type: 'DivergingBar', dataKey: 'productivitySplit' },
          sources: [
            { title: 'Productivity growth in a challenging global environment — OECD Compendium of Productivity Indicators 2026', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2026_734a5e68-en/full-report/productivity-growth-in-a-challenging-global-environment_d888e417.html' },
            { title: 'Labour productivity patterns across firm sizes — OECD Compendium of Productivity Indicators 2026', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2026_734a5e68-en/full-report/labour-productivity-patterns-across-firm-sizes_7edc4fb8.html' },
            { title: 'The best versus the rest: the global productivity slowdown and divergence across firms', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/the-global-forum-on-productivity-at-10_ca7295d9-en/full-report/the-best-versus-the-rest-the-global-productivity-slowdown-divergence-across-firms-and-the-role-of-public-policy_8e7447f5.html' },
            { title: 'OECD Compendium of Productivity Indicators 2026', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2026_734a5e68-en.html' },
            { title: 'Overview: Foundations for Growth and Competitiveness 2026', publisher: 'OECD', date: 'Apr 2026', url: 'https://www.oecd.org/en/publications/2026/04/foundations-for-growth-and-competitiveness-2026_f68a156b/full-report/overview_97442815.html' },
            { title: 'Environmentally adjusted multifactor productivity — OECD Compendium of Productivity Indicators 2026', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2026_734a5e68-en/full-report/environmentally-adjusted-multifactor-productivity_619b0eab.html' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Industrial policy becomes universal because the alternative is dependence.',
          why: 'When one country holds a third of world manufacturing, every other government treats domestic capacity as a security question rather than an efficiency question. That is why subsidy and procurement policies converge across otherwise unlike states.',
          evidence:
            'The post-2022 industrial-policy wave spans the US IRA and CHIPS Act, the EU Green Deal Industrial Plan, India\'s PLI schemes and Japanese and Korean semiconductor programmes.',
        },
      ],
    },

    {
      n: 3,
      title: "Financial resilience splits the world into two distinct speeds.",
      overall:
        'If one question in the framework has an unambiguous answer, it is this one. Six of eight financial-stability indicators diverge, more than any other question set in any topic. The countries with the largest debts are not the countries with the largest debt problems, and that asymmetry is the whole story: rich countries borrow more and pay less for it.',
      data: [
        {
          finding:
            'The world enters the next shock carrying far more debt than it did in 2000. Government debt climbs from 56.8% to 70.7% of GDP and private credit from 56.8% to 74.5%, while the average cost of servicing it falls.',
          figure: { type: 'PanelTrends', dataKey: 'bifurcation' },
          sources: [
            { title: 'Fiscal Monitor April 2026: Fiscal Policy under Pressure — High Debt, Rising Risks', publisher: 'International Monetary Fund', date: 'Apr 2026', url: 'https://www.imf.org/en/publications/fm/issues/2026/04/15/fiscal-monitor-april-2026' },
            { title: 'Fiscal Policy under Pressure: High Debt, Rising Risks — Chapter 1', publisher: 'International Monetary Fund', date: 'Apr 2026', url: 'https://www.imf.org/-/media/files/publications/fiscal-monitor/2026/april/english/ch1.pdf' },
            { title: 'Global Debt Report 2026', publisher: 'OECD', date: 'Mar 2026', url: 'https://www.oecd.org/en/publications/global-debt-report-2026_e9d80efd-en.html' },
            { title: 'Sovereign borrowing outlook — Global Debt Report 2026', publisher: 'OECD', date: 'Mar 2026', url: 'https://www.oecd.org/en/publications/global-debt-report-2026_e9d80efd-en/full-report/sovereign-borrowing-outlook_4470147b.html' },
            { title: 'IMF October 2025 Fiscal Monitor', publisher: 'International Monetary Fund', date: 'Oct 2025', url: 'https://mediacenter.imf.org/news/imf---october-2025-fiscal-monitor/s/a770da3b-295d-41ec-b133-41ba455e02b0' },
            { title: 'Fiscal Monitor: executive summary and chapter 1 overview', publisher: 'International Monetary Fund', date: 'Apr 2026', url: 'https://www.imf.org/-/media/files/publications/fiscal-monitor/2026/april/english/execsumch1-combined.pdf' },
          ],
        },
        {
          finding:
            'High public debt becomes normal, even among the strongest economies. The decisive question is no longer who owes the most, but who can afford it.',
          figure: { type: 'PairedBars', dataKey: 'debtBar' },
          sources: [
            { title: 'Chapter 1: Fiscal Policy Under Pressure — High Debt, Rising Risks', publisher: 'International Monetary Fund', date: 'Apr 2026', url: 'https://www.elibrary.imf.org/display/book/9798229042512/CH001.xml' },
            { title: 'Global Debt Report 2026 (full report)', publisher: 'OECD', date: 'Mar 2026', url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/03/global-debt-report-2026_59d2d627/e9d80efd-en.pdf' },
            { title: '2026 April Fiscal Monitor: Fiscal Policy under Pressure (full text)', publisher: 'International Monetary Fund', date: 'Apr 2026', url: 'https://www.imf.org/-/media/files/publications/fiscal-monitor/2026/april/english/text.pdf' },
            { title: 'China: OECD Economic Outlook, Volume 2026 Issue 1', publisher: 'OECD', date: 'Jun 2026', url: 'https://www.oecd.org/en/publications/2026/06/oecd-economic-outlook-volume-2026-issue-1_8be0dba6/full-report/china_6526c66b.html' },
            { title: "How China's Economy Can Pivot to Consumption-led Growth", publisher: 'International Monetary Fund', date: 'Feb 2026', url: 'https://www.imf.org/en/news/articles/2026/02/18/cf-how-chinas-economy-can-pivot-to-consumption-led-growth' },
            { title: 'Fiscal Monitor series', publisher: 'International Monetary Fund', date: '2026', url: 'https://www.imf.org/en/publications/fm' },
          ],
        },
        {
          finding:
            'The biggest borrowers do not carry the biggest burden. Weaker economies lose far more government revenue to interest even with smaller debt piles.',
          figure: { type: 'QuadrantScatter', dataKey: 'debtBurdenQuadrant' },
          sources: [
            { title: "Debt crisis: developing countries' external debt hits record $11.4 trillion", publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/debt-crisis-developing-countries-external-debt-hits-record-114-trillion' },
            { title: 'Developing countries are being priced out, in struggle for affordable finance', publisher: 'UN News', date: 'Mar 2026', url: 'https://news.un.org/en/story/2026/03/1167219' },
            { title: 'The rising cost of debt is squeezing development prospects in many countries', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/rising-cost-debt-squeezing-development-prospects-many-countries' },
            { title: 'Developing countries face record-high public debt burdens. Now is the time for reform', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/developing-countries-face-record-high-public-debt-burdens-now-time-reform' },
            { title: 'As debt costs rise, development funding comes under pressure', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/debt-costs-rise-development-funding-comes-under-pressure' },
            { title: 'Navigating the growing challenges of public and external debt', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/navigating-growing-challenges-public-and-external-debt' },
          ],
        },
        {
          finding:
            'Financial fragility lands on many of the same countries already exposed to climate and social pressure. Five countries sit in the danger zone across all three topics.',
          figure: { type: 'QuadrantScatter', dataKey: 'stressBuffers' },
          sources: [
            { title: "Global debt and climate crises are intertwined: here's how to tackle both", publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/global-debt-and-climate-crises-are-intertwined-heres-how-tackle-both' },
            { title: "Developing Countries Won't Beat the Climate Crisis Without Tackling Rising Debt", publisher: 'World Resources Institute', date: '2026', url: 'https://www.wri.org/insights/debt-climate-action-developing-countries' },
            { title: 'The debt and climate crises are escalating — it is time to tackle both', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/the-debt-and-climate-crises-are-escalating-it-is-time-to-tackle-both/' },
            { title: 'Debt-for-adaptation swaps: a financial tool to help climate-vulnerable nations', publisher: 'Brookings Institution', date: '2026', url: 'https://www.brookings.edu/articles/debt-for-adaptation-swaps-a-financial-tool-to-help-climate-vulnerable-nations/' },
            { title: 'Sovereign debt vulnerabilities in developing countries', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/publication/sovereign-debt-vulnerabilities-developing-countries' },
            { title: "What the World Bank's Country Climate and Development Reports tell us about the debt-climate nexus in low-income countries", publisher: 'World Resources Institute', date: '2026', url: 'https://www.wri.org/technical-perspectives/what-world-banks-country-climate-and-development-reports-tell-us-about-debt' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'The cost of capital becomes the main axis of national advantage.',
          why: 'When the same debt ratio costs one country 5% of revenue and another 35%, the ability to spend through a downturn rather than tighten into it stops being a function of prudence. It becomes a function of who you are. Countries respond by hoarding reserves, courting alternative lenders and accepting conditions they would otherwise refuse.',
          evidence:
            'Interest rates for developing-country borrowers have hovered near 10%, roughly double pre-2020 levels, while dollar strength raises servicing costs in local-currency terms. The World Bank puts the net transfer on developing-country external debt at −$741bn over 2022–24, the largest gap in more than 50 years.',
        },
      ],
    },

    {
      n: 4,
      title: 'Growth does not change how prosperity is shared. The distribution barely moves.',
      overall:
        'The prosperity question produces the flattest set of results in the framework. Employment ratios, wage-and-salaried share, household consumption, tax capacity and social spending are all classified stable, with dispersion changes under 4%. Whatever the world economy does between now and 2040, our data expect the share reaching households through work, wages and public services to look much as it does today.',
      data: [
        {
          finding:
            'Growth changes the size of economies, not how prosperity reaches households. Employment, wages, tax capacity and social spending barely move between now and 2040.',
          figure: { type: 'PanelTrends', dataKey: 'inertTable' },
          sources: [
            { title: 'Overview: Taxing Wages 2026', publisher: 'OECD', date: 'Apr 2026', url: 'https://www.oecd.org/en/publications/2026/04/taxing-wages-2026_d1f39986/full-report/overview_d93131c3.html' },
            { title: 'Growth and economic well-being: first quarter 2026', publisher: 'OECD', date: 'Aug 2026', url: 'https://www.oecd.org/en/data/insights/statistical-releases/2026/08/growth-and-economic-well-being-first-quarter-2026-oecd.html' },
            { title: 'Progressivity of labour taxation in OECD countries — Taxing Wages 2026', publisher: 'OECD', date: 'Apr 2026', url: 'https://www.oecd.org/en/publications/2026/04/taxing-wages-2026_d1f39986/full-report/progressivity-of-labour-taxation-in-oecd-countries_80dc82f1.html' },
            { title: 'Global employment stable but decent jobs in short supply', publisher: 'UN News', date: 'Jan 2026', url: 'https://news.un.org/en/story/2026/01/1166751' },
            { title: 'Global employment in 2026: a fragile stability', publisher: 'International Labour Organization', date: '2026', url: 'https://voices.ilo.org/podcast/global-employment-in-2026-a-fragile-stability' },
            { title: 'Employment and Social Trends 2026 (full report)', publisher: 'International Labour Organization', date: 'Jan 2026', url: 'https://researchrepository.ilo.org/view/pdfCoverPage?instCode=41ILO_INST&filePid=13147301370002676&download=true' },
          ],
        },
        {
          finding:
            'The labour-market problem is exclusion, not the global average. Unemployment barely moves overall while the gap between countries widens.',
          figure: { type: 'TrendLine', dataKey: 'unemploymentSpread' },
          sources: [
            { title: 'After post-pandemic improvement, youth unemployment is rising again', publisher: 'UN News', date: 'Aug 2026', url: 'https://news.un.org/en/story/2026/08/1168120' },
            { title: 'Global Employment Trends for Youth 2026: Back to the future (full report)', publisher: 'International Labour Organization', date: 'Aug 2026', url: 'https://www.ilo.org/sites/default/files/2026-08/9789220437612_PDFA_Web_ENG.pdf' },
            { title: 'Number of youth not in employment, education or training a cause for concern', publisher: 'International Labour Organization', date: '2026', url: 'https://www.ilo.org/node/666121' },
            { title: 'Youth employment — ILO topic overview', publisher: 'International Labour Organization', date: '2026', url: 'https://www.ilo.org/topics-and-sectors/youth-employment' },
            { title: 'Youth unemployment rises as young people face a harder road to decent work', publisher: 'International Labour Organization', date: '2026', url: 'https://www.ilo.org/resource/news/youth-unemployment-rises-young-people-face-harder-road-decent-work' },
            { title: 'Global Employment Trends for Youth 2026: Back to the future', publisher: 'International Labour Organization', date: '2026', url: 'https://www.ilo.org/publications/major-publications/global-employment-trends-youth-2026' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Expectations of redistribution outrun its delivery.',
          why: 'Tax capacity and social spending remain flat while capability and connectivity rise. The gap between what populations can demand and what fiscal systems actually deliver therefore widens, creating the same pressure that surfaces as protest in the People topic.',
          evidence:
            'Every prosperity-distribution indicator in our set is classified stable, against rising capability across Topics 2 and 4.',
        },
      ],
    },
  ],

  level3: { defaultProxy: 'D159', defaultMarkets: ['CHN', 'USA'] },
};

export default economy;
