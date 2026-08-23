// Topic 02 — TECHNOLOGY. Transcribed from `Topic 2 - Technology.docx`.
// Note the topic id is `tech`, matching site.json and the asset directories.

const tech = {
  id: 'tech',
  name: 'Technology',
  accent: '#3f6f91',
  status: 'live',

  level1: {
    kicker: 'Topic 02 · Technology',
    heroHeadline: 'Universally available, narrowly owned.',
    heroSub:
      'Getting online stops being the main question as internet use approaches saturation and mobile data becomes almost free. Meanwhile, the ability to build technology and collect the returns from it is more concentrated than at any point since 2010. Production has moved decisively to China, but ownership has not moved at all.',
    behaviour:
      'When access is universal but capability is not, the scarce goods become skills, ownership and trust. The rational moves are to own rather than use, to build provenance into anything that matters, and to assume that whatever you can do with the network, your government can do to you.',
    bridgeTitle: 'The 2040 technology landscape',
    framing:
      'The same tools that make citizens more able to organise make states more able to watch them: both curves rise together, which is why 2040 is neither the "empowered individual" future nor the "managed society" future but both at once, split by country. When access is universal but capability is not, the scarce goods become skills, ownership and trust.',
  },

  level2: [
    {
      n: 1,
      title: 'China builds it, America owns it and India staffs it. The technology stack splits three ways.',
      overall:
        'There is no single technology leader. China leads the production of technology by a wide and stable margin, the United States leads the invention and the infrastructure, and India leads the delivery of technology services. Each is dominant in a different layer, and none is dominant in the others.',
      data: [
        {
          finding:
            "China's technology-production lead is already here, not a future crossover. It moved ahead of the US in the 2010s and keeps that advantage through 2040.",
          figure: { type: 'ShareLines', dataKey: 'techShareLines' },
          sources: [
            { title: 'From Apple to Ford: How Chinese tech is becoming harder for global companies to ignore', publisher: 'CNBC', date: 'Aug 2026', url: 'https://www.cnbc.com/2026/08/14/china-tech-global-appeal-apple-ford-catl-deepseek.html' },
            { title: 'The China Connection: U.S.-China tech rivalry heats up — in other countries', publisher: 'CNBC', date: 'Jun 2026', url: 'https://www.cnbc.com/2026/06/29/cnbcs-the-china-connection-newsletter-us-tech-rivalry-heats-up.html' },
            { title: "America's Technology Long Game", publisher: 'CSIS', date: 'Jan 2026', url: 'https://www.csis.org/analysis/americas-technology-long-game' },
            { title: 'Can India catch up with the US, Taiwan and China in the global chip race?', publisher: 'Al Jazeera', date: 'Dec 2025', url: 'https://www.aljazeera.com/economy/2025/12/18/can-india-catch-up-with-the-us-taiwan-and-china-in-the-global-chip-race' },
            { title: "Competing with China's Public R&D Model: Lessons and Risks for U.S. Innovation Strategy", publisher: 'CSIS', date: 'Sep 2025', url: 'https://www.csis.org/analysis/competing-chinas-public-rd-model-lessons-and-risks-us-innovation-strategy' },
            { title: "China's reported chip breakthrough comes with some big caveats", publisher: 'CNBC', date: 'Jul 2026', url: 'https://www.cnbc.com/2026/07/28/china-chipmaking-duv-tool-asml-explained.html' },
          ],
        },
        {
          finding:
            'There is no single technology champion. The US leads invention and infrastructure, China leads physical production, and India leads technology services.',
          figure: { type: 'LayerStack', dataKey: 'layerStack' },
          sources: [
            { title: "Inside India: India's 'back offices' are evolving into leadership hubs for global companies", publisher: 'CNBC', date: 'Nov 2025', url: 'https://www.cnbc.com/2025/11/06/cnbcs-inside-india-newsletter-indias-back-offices-are-evolving-into-leadership-hubs-for-global-companies.html' },
            { title: 'India at Davos 2026: Growth is no longer the question', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/india-at-davos-2026-growth-is-no-longer-the-question/' },
            { title: "India's Press Note 3 Gamble: Opening the FDI Door to China", publisher: 'Carnegie Endowment for International Peace', date: 'Apr 2026', url: 'https://carnegieendowment.org/research/2026/04/indias-press-note-3-gamble-opening-the-fdi-door-to-china' },
            { title: "Semiconductor Clusters in the Making: India's Push for Global Competitiveness", publisher: 'CSIS', date: 'Sep 2025', url: 'https://www.csis.org/analysis/semiconductor-clusters-making-indias-push-global-competitiveness' },
            { title: "AI is slowly impacting India's economy; export-led service sector must adapt quickly", publisher: 'CNBC', date: 'Aug 2026', url: 'https://www.cnbc.com/video/2026/08/04/indias-it-services-industry-is-export-oriented.html' },
            { title: "China's Localization Drive in Semiconductors Gains Impetus from Allied Chip Export Controls", publisher: 'CSIS', date: 'Mar 2026', url: 'https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls' },
          ],
        },
        {
          finding:
            'Where a country competes matters as much as how strong it is. R&D is a tight club; IT services leave room for roughly twice as many serious competitors.',
          figure: { type: 'RankedBar', dataKey: 'layerConcentration' },
          sources: [
            { title: 'End of Year Edition: Global R&D Spending Grew Again in 2024, Inching Closer to the USD 3 Trillion Mark', publisher: 'WIPO', date: 'Dec 2025', url: 'https://www.wipo.int/en/web/global-innovation-index/w/blogs/2025/end-of-year-edition' },
            { title: 'AI data center boom is leaving consumer electronics short of chips', publisher: 'The Conversation', date: 'May 2026', url: 'https://theconversation.com/ai-data-center-boom-is-leaving-consumer-electronics-short-of-chips-even-though-they-dont-use-the-same-kinds-277069' },
            { title: 'Alphabet resets the bar for AI infrastructure spending', publisher: 'CNBC', date: 'Feb 2026', url: 'https://www.cnbc.com/2026/02/04/alphabet-resets-the-bar-for-ai-infrastructure-spending.html' },
            { title: "Hyperscalers' aggressive AI spending is rattling their stocks", publisher: 'CNBC', date: 'Jul 2026', url: 'https://www.cnbc.com/2026/07/27/hyperscalers-aggressive-ai-spending-is-rattling-their-stocks-but-the-bull-market-is-hinging-on-it.html' },
            { title: "Meta's push into cloud computing means Wall Street has to prepare for lower margins", publisher: 'CNBC', date: 'Jul 2026', url: 'https://www.cnbc.com/2026/07/02/metas-push-into-cloud-excites-wall-street-despite-lower-margins.html' },
            { title: "Why AI disruption isn't a major threat to India's booming office market", publisher: 'South China Morning Post', date: 'Feb 2026', url: 'https://www.scmp.com/opinion/asia-opinion/article/3344296/why-ai-disruption-isnt-major-threat-indias-booming-office-market' },
          ],
        },
        {
          finding:
            'The R&D leader changes with the yardstick. The US leads at market exchange rates, but China leads after adjusting for what research money buys locally.',
          figure: { type: 'MethodCompare', dataKey: 'rdTwoMethod' },
          sources: [
            { title: 'OECD overall R&D growth stable; government R&D budgets decline and reorient towards defence', publisher: 'OECD', date: 'Mar 2026', url: 'https://www.oecd.org/en/data/insights/statistical-releases/2026/03/oecd-overall-rd-growth-stable-government-rd-budgets-decline-and-reorient-towards-defence.html' },
            { title: 'China surpasses US in research spending – the consequences extend far beyond scientific ranking', publisher: 'The Conversation', date: 'Apr 2026', url: 'https://theconversation.com/china-surpasses-us-in-research-spending-the-consequences-extend-far-beyond-scientific-ranking-and-clout-280543' },
            { title: 'Why China is winning in tech — and what the US is overlooking', publisher: 'Brookings Institution', date: 'Apr 2026', url: 'https://www.brookings.edu/articles/why-china-is-winning-in-tech-and-what-the-us-is-overlooking/' },
            { title: 'Global Innovation Index 2025: Switzerland, Sweden, US, Korea and Singapore Top Ranking; China Enters Top 10', publisher: 'WIPO', date: 'Sep 2025', url: 'https://www.wipo.int/pressroom/en/articles/2025/article_0009.html' },
            { title: 'As China ups its basic research game, the US will have to look sharp', publisher: 'South China Morning Post', date: 'Aug 2026', url: 'https://www.scmp.com/opinion/comment/article/3363513/china-ups-its-basic-research-game-us-will-have-look-sharp' },
            { title: 'Top hyperscalers set to boost 2026 AI spending by 70% to $600 billion', publisher: 'CNBC', date: 'Feb 2026', url: 'https://www.cnbc.com/2026/02/12/top-hyperscalers-to-boost-ai-capex-to-600-billion-stocks-that-benefit.html' },
          ],
        },
      ],
      behaviours: [
        {
          title: "Specialise into a layer rather than chasing 'tech' generally.",
          why: 'National and corporate advantage is layer-specific and durable, so the returns go to picking a layer where your economy already has share rather than attempting the full stack.',
          evidence:
            "Chinese firms raised R&D spending by 537% over the past decade against 150% for US firms and 32% for the rest of the world; China's 'new three' green-tech exports hit a record 58.3% of exports in Q1 2026, while the US retained the lead in frontier compute infrastructure.",
        },
      ],
    },

    {
      n: 2,
      title: 'Access converges while capability diverges. The divide moves up the ladder.',
      overall:
        'The digital divide of the 2000s was about who could get online, and it closes almost completely by 2040. The new divide is about what people can do once they are there: their skills, the depth of local infrastructure and their ability to produce rather than consume. Every access measure converges, while almost every capability measure diverges.',
      data: [
        {
          finding:
            'Basic connectivity stops dividing countries. Internet use approaches saturation and mobile data becomes cheaper almost everywhere.',
          figure: { type: 'PanelTrends', dataKey: 'accessFunnel' },
          sources: [
            { title: "ITU's Facts and Figures 2025: 6 billion people now online", publisher: 'International Telecommunication Union', date: 'Nov 2025', url: 'https://www.itu.int/en/mediacentre/Pages/PR-2025-11-17-Facts-and-Figures.aspx' },
            { title: "Progress and Gaps: Key Findings from ITU's Facts and Figures 2025", publisher: 'UN DESA', date: '2025', url: 'https://social.desa.un.org/world-summit-2025/blog/progress-and-gaps-key-findings-from-itus-facts-and-figures-2025' },
            { title: 'Bridging the Digital Divide: Digital Infrastructure Driving Jobs and Economic Growth', publisher: 'World Bank', date: 'May 2026', url: 'https://www.worldbank.org/en/results/2026/05/15/bridging-digital-divide-infrastructure-jobs-growth' },
            { title: 'The global internet gap: What the data tells us', publisher: 'World Bank', date: 'Jul 2026', url: 'https://blogs.worldbank.org/en/opendata/the-global-internet-gap--what-the-data-tells-us' },
            { title: 'Global Cybersecurity Outlook 2026: The trends reshaping cybersecurity', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/publications/global-cybersecurity-outlook-2026/in-full/3-the-trends-reshaping-cybersecurity/' },
            { title: "Inside India: AI is exposing cracks in India's growth story as it hits high-paying IT jobs", publisher: 'CNBC', date: 'Apr 2026', url: 'https://www.cnbc.com/2026/04/30/ai-threat-indias-growth-story-jobs.html' },
          ],
        },
        {
          finding:
            'The new digital divide is the ability to build, not connect. Skills, infrastructure and value capture pull countries further apart even as access converges.',
          figure: { type: 'DivergingBar', dataKey: 'dispersionSlope' },
          sources: [
            { title: 'Can the UN close the global AI gap?', publisher: 'Chatham House', date: 'Aug 2026', url: 'https://www.chathamhouse.org/2026/08/can-un-close-global-ai-gap' },
            { title: 'AI Offers Lifeline to Developing Economies in an Era of Weak Growth', publisher: 'World Bank', date: 'Aug 2026', url: 'https://www.worldbank.org/en/news/press-release/2026/08/04/ai-offers-lifeline-to-developing-economies-in-an-era-of-weak-growth' },
            { title: 'Strengthening AI Foundations: Emerging Opportunities for Developing Countries', publisher: 'World Bank', date: 'Nov 2025', url: 'https://www.worldbank.org/en/news/factsheet/2025/11/21/strengthening-ai-foundations-emerging-opportunities-for-developing-countries' },
            { title: 'From Divide to Delivery: How AI Can Serve the Global South', publisher: 'CSIS', date: 'Oct 2025', url: 'https://www.csis.org/analysis/divide-delivery-how-ai-can-serve-global-south' },
            { title: 'How middle powers can weather US and Chinese AI dominance: Strategy meets reality', publisher: 'Chatham House', date: 'Feb 2026', url: 'https://www.chathamhouse.org/2026/02/how-middle-powers-can-weather-us-and-chinese-ai-dominance/03-strategy-meets-reality' },
            { title: 'Chinese AI models are gaining ground with U.S. companies as OpenAI, Anthropic costs surge', publisher: 'CNBC', date: 'Jul 2026', url: 'https://www.cnbc.com/2026/07/07/chinese-ai-models-costs-us-openai-anthropic.html' },
          ],
        },
        {
          finding:
            'Better averages hide a stubborn last mile. Typical gender and urban–rural gaps shrink, while the worst-connected countries barely improve.',
          figure: { type: 'PanelTrends', dataKey: 'gapDumbbell' },
          sources: [
            { title: 'The gender digital divide — Facts and Figures 2025', publisher: 'International Telecommunication Union', date: 'Oct 2025', url: 'https://www.itu.int/itu-d/reports/statistics/2025/10/15/ff25-the-gender-digital-divide/' },
            { title: 'Internet use — Facts and Figures 2025', publisher: 'International Telecommunication Union', date: 'Oct 2025', url: 'https://www.itu.int/itu-d/reports/statistics/2025/10/15/ff25-internet-use/' },
            { title: 'The Mobile Gender Gap Report 2026', publisher: 'GSMA', date: 'Jun 2026', url: 'https://www.gsma.com/wp-content/uploads/2026/06/The-Mobile-Gender-Gap-Report-2026.pdf' },
            { title: "China just 'months' behind U.S. AI models, Google DeepMind CEO says", publisher: 'CNBC', date: 'Jan 2026', url: 'https://www.cnbc.com/2026/01/16/google-deepmind-china-ai-demis-hassabis.html' },
            { title: 'Limiting access to top AI models in the U.S. could hand China an opening as capability gap narrows', publisher: 'CNBC', date: 'Jun 2026', url: 'https://www.cnbc.com/video/2026/06/29/ai-limits-in-the-u-s-hand-china-an-opening-as-capability-gap-narrows.html' },
            { title: 'Chinese AI has leveled up, and brought renewed focus on the open weight model shift', publisher: 'CNBC', date: 'Jul 2026', url: 'https://www.cnbc.com/2026/07/17/moonshot-ai-kimi-k3-model-openai-anthropic-china.html' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Invest in skills and provenance, not connectivity.',
          why: 'Once access is largely solved, the returns move to what the ITU calls the second divide: the ability to use, evaluate and build. Connectivity programmes stop being the main constraint, and training and local capacity take their place.',
          evidence:
            '73.8% of the world was online by 2026 with ~2.6 billion still offline, 96% of them in low- and middle-income countries. 1 GB of data costs 8.6% of monthly income in least-developed countries against a 2% affordability target, and the ITU estimates a third of the global population lacks basic digital skills.',
        },
      ],
    },

    {
      n: 3,
      title: 'Production moved to China, but the returns did not. Value stays where the intellectual property is owned.',
      overall:
        "The most striking gap in this topic is between where things are made and where the money is collected. China is the largest producer of technology on almost every physical measure and the largest net payer of intellectual-property rent in the world. The 'winner-takes-most' future is real, but the winner is defined by ownership, not by output.",
      data: [
        {
          finding:
            'Making technology and owning it are different sources of power. China leads production but still pays for foreign ideas; the US remains the largest collector of intellectual-property rent.',
          figure: { type: 'DivergingBar', dataKey: 'ipBalance' },
          sources: [
            { title: "Translating IP Into Revenue: China's Changing Place in the Global IP Landscape", publisher: 'CSIS', date: 'Mar 2026', url: 'https://www.csis.org/blogs/trustee-china-hand/translating-ip-revenue-chinas-changing-place-global-ip-landscape' },
            { title: 'World Intellectual Property Report 2026: Executive summary', publisher: 'WIPO', date: '2026', url: 'https://www.wipo.int/web-publications/world-intellectual-property-report-2026/en/executive-summary.html' },
            { title: 'World Intellectual Property Indicators: Global Patent and Design Filings Reach New Records in 2024', publisher: 'WIPO', date: 'Nov 2025', url: 'https://www.wipo.int/en/web/ip-statistics/w/news/2025/world-intellectual-property-indicators-global-patent-and-design-filings-reach-new-records-in-2024-trademarks-flat' },
            { title: 'China dominates global patent race with record filings', publisher: 'South China Morning Post', date: 'Nov 2025', url: 'https://www.scmp.com/news/china/article/3332555/china-dominates-global-patent-race-record-filings' },
            { title: 'PCT Yearly Review 2026', publisher: 'WIPO', date: '2026', url: 'https://www.wipo.int/edocs/pubdocs/en/wipo-pub-901-2026-en-patent-cooperation-treaty-yearly-review-2026.pdf' },
            { title: 'World Intellectual Property Indicators 2025: Patents highlights', publisher: 'WIPO', date: 'Nov 2025', url: 'https://www.wipo.int/web-publications/world-intellectual-property-indicators-2025-highlights/en/patents-highlights.html' },
          ],
        },
        {
          finding:
            'India shows the difference between service strength and ownership: it exports digital labour at scale while importing other countries’ intellectual property.',
          figure: { type: 'QuadrantScatter', dataKey: 'rentQuadrant' },
          sources: [
            { title: 'Global Trade Update (January 2026): Top trends redefining global trade in 2026', publisher: 'UN Trade and Development (UNCTAD)', date: 'Jan 2026', url: 'https://unctad.org/publication/global-trade-update-january-2026-top-trends-redefining-global-trade-2026' },
            { title: 'Trade in Value Added — Country notes: India', publisher: 'OECD', date: 'Jun 2026', url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/06/trade-in-value-added-country-notes_b71e7fb9/india_af59602f/d9085309-en.pdf' },
            { title: 'Global Trade Update (March 2026): Reforming trade rules to drive development', publisher: 'UN Trade and Development (UNCTAD)', date: 'Mar 2026', url: 'https://unctad.org/publication/global-trade-update-march-2026-reforming-trade-rules-drive-development' },
            { title: 'IP Facts and Figures 2025: Patents and utility models', publisher: 'WIPO', date: 'Nov 2025', url: 'https://www.wipo.int/web-publications/ip-facts-and-figures-2025/en/patents-and-utility-models.html' },
            { title: 'International trade as an engine for development — Financing for Sustainable Development Report 2026', publisher: 'UN DESA', date: 'Apr 2026', url: 'https://financing.desa.un.org/sites/default/files/2026-04/FSDR2026_ChIV3_InDepthTrade.pdf' },
            { title: 'Global Trade Update (April 2026): Global trade growth continues, but fragility rises', publisher: 'UN Trade and Development (UNCTAD)', date: 'Apr 2026', url: 'https://unctad.org/publication/global-trade-update-april-2026-global-trade-growth-continues-fragility-rises' },
          ],
        },
        {
          finding:
            'Export growth does not guarantee domestic gain. High-value economies keep more of what they sell, while assembly economies fall further behind.',
          figure: { type: 'TrendLine', dataKey: 'valueCapture' },
          sources: [
            { title: 'Services trade surges, but developing countries risk falling behind', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/services-trade-surges-developing-countries-risk-falling-behind' },
            { title: 'Services are transforming least developed economies — but jobs and productivity lag behind', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/press-material/services-are-transforming-least-developed-economies-jobs-and-productivity-lag-behind' },
            { title: 'Unlocking the power of services trade for development', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/news/unlocking-power-services-trade-development' },
            { title: 'Manufacturing trouble: UNCTAD report examines emerging tensions in the trading system', publisher: 'UN Trade and Development (UNCTAD)', date: '2026', url: 'https://unctad.org/press-material/manufacturing-trouble-unctad-report-examines-emerging-tensions-trading-system' },
            { title: 'Global Economic and Financial Implications of Artificial Intelligence: Lessons from a Scenario Planning Exercise', publisher: 'International Monetary Fund', date: '2026', url: 'https://www.elibrary.imf.org/view/journals/068/2026/002/article-A001-en.xml' },
            { title: 'Trade in Value Added — Country notes: China', publisher: 'OECD', date: '2026', url: 'https://www.oecd.org/en/publications/trade-in-value-added-country-notes_f5cbfae2-en/china_267926aa-en.html' },
          ],
        },
        {
          finding:
            "Automation does not visibly reduce labour's share of income in this forecast. The global split between wages and profits barely moves through 2040.",
          figure: { type: 'TrendLine', dataKey: 'labourShare' },
          sources: [
            { title: "Is AI really coming for our jobs and wages? Past predictions of a 'robot apocalypse' offer some clues", publisher: 'The Conversation', date: 'Nov 2025', url: 'https://theconversation.com/is-ai-really-coming-for-our-jobs-and-wages-past-predictions-of-a-robot-apocalypse-offer-some-clues-269068' },
            { title: 'Employment and Social Trends 2026', publisher: 'International Labour Organization', date: 'Jan 2026', url: 'https://www.ilo.org/publications/flagship-reports/employment-and-social-trends-2026' },
            { title: 'Global job quality stagnates despite resilient growth', publisher: 'International Labour Organization', date: 'Jan 2026', url: 'https://www.ilo.org/resource/news/global-job-quality-stagnates-despite-resilient-growth' },
            { title: 'New Jobs Creation in the AI Age', publisher: 'International Monetary Fund', date: '2026', url: 'https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf' },
            { title: 'These 3 charts show how AI is affecting wages, job quality and hiring decisions', publisher: 'World Economic Forum', date: 'Feb 2026', url: 'https://www.weforum.org/stories/2026/02/ai-improving-wages-job-quality/' },
            { title: 'AI growth acceleration versus distributional fairness', publisher: 'Brookings Institution', date: 'May 2026', url: 'https://www.brookings.edu/articles/ai-growth-acceleration-versus-distributional-fairness/' },
          ],
        },
      ],
      behaviours: [
        {
          title: "Own the asset, don't operate it.",
          why: 'The data say output moves easily and rent does not, so the durable position is holding intellectual property, standards and platforms rather than capacity. For individuals the analogue is equity and credentials over hours.',
          evidence:
            'Only 8 of the 30 countries with data collect more intellectual-property rent than they pay by 2040. The US collects a net $128bn, while China runs the largest deficit on the list at −$45bn despite being the largest producer of technology on almost every physical measure. Over the same period, the share of export value kept at home rises for the eight highest-value economies (83% → 86%) and falls for the eight assembly economies (58% → 48%).',
        },
      ],
    },

    {
      n: 4,
      title: 'State control and citizen capability rise together. This is a widening gap, not a shared decline.',
      overall:
        'The usual framing asks whether technology empowers people or controls them. Our data say it does both, simultaneously and almost everywhere. Every measure of what a government can do to its citizens online gets worse; every measure of what citizens can do with the network gets better. And they behave differently: control diverges across countries, capability converges.',
      data: [
        {
          finding:
            'Technology strengthens citizens and governments at the same time. People become better at organising while states become better at watching and restricting them.',
          figure: { type: 'DivergingBar', dataKey: 'controlCapability' },
          sources: [
            { title: 'Freedom on the Net 2025: An Uncertain Future for the Global Internet', publisher: 'Freedom House', date: 'Nov 2025', url: 'https://freedomhouse.org/report/freedom-net/2025/uncertain-future-global-internet' },
            { title: 'Persistent Authoritarian Repression and Backsliding in Democracies Drive 15th Consecutive Year of Decline in Global Internet Freedom', publisher: 'Freedom House', date: 'Nov 2025', url: 'https://freedomhouse.org/article/new-report-persistent-authoritarian-repression-and-backsliding-democracies-drive-15th' },
            { title: 'Gen Z Protests Across Asia Offer a Delicate but Renewed Democratic Order', publisher: 'Carnegie Endowment for International Peace', date: 'Mar 2026', url: 'https://carnegieendowment.org/research/2026/03/gen-z-protests-across-asia' },
            { title: "'Televising our revolution': India's Gen Z flips Modi's social media game", publisher: 'Al Jazeera', date: 'Jul 2026', url: 'https://www.aljazeera.com/features/2026/7/23/televising-our-revolution-indias-gen-z-flips-modis-social-media-game' },
            { title: '2026 elections and internet shutdowns watch', publisher: 'Access Now', date: '2026', url: 'https://www.accessnow.org/campaign/2026-elections-and-internet-shutdowns-watch/' },
            { title: "Iran's internet shutdown signals a new stage of digital isolation", publisher: 'Chatham House', date: 'Jan 2026', url: 'https://www.chathamhouse.org/2026/01/irans-internet-shutdown-signals-new-stage-digital-isolation' },
          ],
        },
        {
          finding:
            'Citizen capability is becoming universal; state control is becoming the dividing line. Countries converge on what people can do and diverge on what governments allow.',
          figure: { type: 'DivergingBar', dataKey: 'scissors' },
          sources: [
            { title: 'The Promises and Pitfalls of the Social Media–Fueled Gen-Z Protests Across Asia', publisher: 'Carnegie Endowment for International Peace', date: 'Sep 2025', url: 'https://carnegieendowment.org/emissary/2025/09/social-media-gen-z-protests-nepal-indonesia-promises-pitfalls' },
            { title: 'Kenya braces for return of Gen Z protests – how did they begin?', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/features/2026/6/24/kenya-braces-for-return-of-gen-z-protests-how-did-they-begin' },
            { title: 'Digital Dissent in Morocco: A Sociological Analysis of the Generation Z Movement', publisher: 'Carnegie Endowment for International Peace', date: 'Mar 2026', url: 'https://carnegieendowment.org/sada/2026/03/digital-dissent-in-morocco-a-sociological-analysis-of-the-generation-z-movement' },
            { title: 'How Global Gen Z Protests Have Shocked and Transformed Governments', publisher: 'Council on Foreign Relations', date: 'Nov 2025', url: 'https://www.cfr.org/articles/how-global-gen-z-protests-have-shocked-and-transformed-governments' },
            { title: 'Young people around the world are leading protests against their governments', publisher: 'The Conversation', date: 'Oct 2025', url: 'https://theconversation.com/young-people-around-the-world-are-leading-protests-against-their-governments-266950' },
            { title: "Why have India's Gen Z protesters called for a march to parliament?", publisher: 'Al Jazeera', date: 'Jul 2026', url: 'https://www.aljazeera.com/features/2026/7/19/why-have-indias-gen-z-protesters-called-for-a-march-to-parliament' },
          ],
        },
        {
          finding:
            'The digital world splits into three regimes, not two: open, controlled and a contested middle. The middle matters most because it contains much of the world’s population growth.',
          figure: { type: 'QuadrantScatter', dataKey: 'regimeQuadrant' },
          sources: [
            { title: "What the CJP protests reveal about India's next generation", publisher: 'Al Jazeera', date: 'Aug 2026', url: 'https://www.aljazeera.com/opinions/2026/8/6/what-the-cjp-protests-reveal-about-indias-next-generation' },
            { title: "'My father is in RSS': India's Gen Z confronts Modi-loving parents at home", publisher: 'Al Jazeera', date: 'Aug 2026', url: 'https://www.aljazeera.com/news/2026/8/11/my-father-is-in-rss-indias-gen-z-confronts-modi-loving-parents-at-home' },
            { title: 'Global Economic Prospects, June 2026: AI and the developing world', publisher: 'World Bank', date: 'Jun 2026', url: 'https://thedocs.worldbank.org/en/doc/2b672b3b0415d6b66c45b66579db4ef5-0050012026/related/GEP-Jun-2026-Box-1-1.pdf' },
            { title: 'Global Risks Report 2026: Global risks in-depth (misinformation and state control)', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://reports.weforum.org/docs/WEF_Global_Risks_Report_2026.pdf' },
            { title: 'Freedom on the Net 2025 (full report)', publisher: 'Freedom House', date: 'Nov 2025', url: 'https://freedomhouse.org/sites/default/files/2025-11/Freedom_on_the_Net_2025_Digital.pdf' },
            { title: 'The Consolidation of Digital Authoritarianism and the Looming Threat of Artificial Intelligence', publisher: 'Freedom House', date: 'Nov 2025', url: 'https://freedomhouse.org/event/consolidation-digital-authoritarianism-and-looming-threat-artificial-intelligence' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Assume surveillance; build for verifiability.',
          why: 'With monitoring, filtering and state disinformation all worsening in a majority of countries and no indicator improving broadly, the reasonable default for citizens, journalists and firms is to treat online activity as observed and to invest in provenance, encryption and offline fallbacks.',
          evidence:
            'Freedom House recorded a 15th consecutive annual decline in global internet freedom in 2025. Conditions deteriorated in 27 countries and improved in 17, while citizens in at least 57 of the 72 countries covered were arrested or imprisoned for online expression, a record high. Our own finding of 27 of 34 countries worsening matches that count almost exactly.',
        },
      ],
    },
  ],

  level3: { defaultProxy: 'D16', defaultMarkets: ['USA', 'CHN'] },
};

export default tech;
