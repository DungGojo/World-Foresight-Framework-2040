// Topic 01 — POWER. Re-synced from `Topic 1 - Power.docx` (five Level-2
// arguments). Quantitative claims are validated against the pipeline by the
// anchor checks in scripts/build_data.py; explanatory responses and external
// sources are maintained here.

const power = {
  id: 'power',
  name: 'Power',
  accent: '#b43a31',
  status: 'live',

  // ---- Level 1 — the big picture (cinematic hero) ----
  level1: {
    kicker: 'Topic 01 · Power',
    heroHeadline: 'No one runs the world in 2040.',
    heroSub:
      'No single patron, currency, institution or technology standard can be assumed to win. So states, firms and individuals all hedge: a foot in both camps, more than one currency, both tech stacks. Refusing to choose becomes strategy.',
    behaviour:
      'No single patron, currency, institution or technology standard can be assumed to win. As a result, states, firms and individuals hedge everything: a foot in both camps, more than one currency, both technology stacks. Refusing to choose becomes the strategy.',
    bridgeTitle: 'The 2040 power landscape',
    framing:
      'The age of a single world leader ends, but nothing clean replaces it, and the replacement has already happened. Power in 2040 is contested (two giants, the US still narrowly ahead, China closing), diffuse (a large majority that refuses to pick a side), and split by domain (economy vs security vs technology).',
  },

  // ---- Level 2 — the five arguments ----
  level2: [
    {
      n: 1,
      title: "No hegemon: a two-giant standoff nobody commands, on a field that won't choose sides.",
      overall:
        'The unipolar era is over, but no new hegemon takes its place. Two giants tower over everyone: the US still the single largest through 2040, China closing but not overtaking, while below them the field is flat and mostly non-aligned. Neither giant can command the system.',
      data: [
        {
          finding:
            "China keeps closing the gap, but the US remains the world's leading power through 2040. The lead narrows, never disappears.",
          figure: { type: 'ShareLines', dataKey: 'shareLines' },
          sources: [
            { title: "'Surprising' how quickly China's military is closing gap with US: analyst Lyle Goldstein", publisher: 'South China Morning Post', date: 'Aug 2026', url: 'https://www.scmp.com/news/china/military/article/3362782/surprising-how-quickly-chinas-military-closing-gap-us-analyst-lyle-goldstein' },
            { title: 'The closing window of opportunity for US global technology leadership', publisher: 'Brookings Institution', date: 'Jun 2026', url: 'https://www.brookings.edu/articles/the-closing-window-of-opportunity-for-us-global-technology-leadership/' },
            { title: 'Nuclear Weapons and the Future of American Power', publisher: 'Carnegie Endowment for International Peace', date: 'Jul 2026', url: 'https://carnegieendowment.org/research/2026/07/nuclear-weapons-and-the-future-of-american-power' },
            { title: "What's next for US–China relations?", publisher: 'World Economic Forum', date: 'May 2026', url: 'https://www.weforum.org/stories/2026/05/us-china-relations-trump-xi-summit-areas-cooperation/' },
            { title: 'It may take a generation for a stable new world order to emerge', publisher: 'Chatham House', date: 'Sep 2025', url: 'https://www.chathamhouse.org/2025/09/it-may-take-generation-stable-new-world-order-emerge' },
            { title: 'Visualizing 2026: Five Foreign Policy Trends to Watch', publisher: 'Council on Foreign Relations', date: 'Dec 2025', url: 'https://www.cfr.org/articles/visualizing-2026-five-foreign-policy-trends-watch' },
          ],
        },
        {
          finding:
            'Only the top two are beyond dispute. Change how power is counted and the US and China stay first, while every country below them reshuffles.',
          figure: { type: 'RankSwap', dataKey: 'rankSwap' },
          sources: [
            { title: 'The World Has Only Four Great Powers—and They Might Not Be Who You Think', publisher: 'Foreign Policy', date: 'Jun 2026', url: 'https://foreignpolicy.com/2026/06/02/great-powers-four-united-states-china-russia-great-britain-france-germany/' },
            { title: 'US-China head-to-head: Explained in 11 maps and charts', publisher: 'Al Jazeera', date: 'May 2026', url: 'https://www.aljazeera.com/news/2026/5/13/us-china-head-to-head-explained-in-11-maps-and-charts' },
            { title: 'Middle Powers Take Center Stage', publisher: 'Council on Foreign Relations', date: 'May 2026', url: 'https://www.cfr.org/articles/middle-powers-take-center-stage' },
            { title: 'Global Risks Report 2026', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/publications/global-risks-report-2026/digest/' },
            { title: '7 reasons the old order broke — and how it might be repaired', publisher: 'World Economic Forum', date: 'Apr 2026', url: 'https://www.weforum.org/stories/2026/04/7-reasons-old-order-broke-middle-powers-might-define-the-new-one/' },
            { title: "A new world order isn't coming, it's already here — and this is what it looks like", publisher: 'The Conversation', date: 'Sep 2025', url: 'https://theconversation.com/a-new-world-order-isnt-coming-its-already-here-and-this-is-what-it-looks-like-264622' },
          ],
        },
        {
          finding:
            'None of our scenarios changes who leads or who follows: the US remains ahead of China, and the top eight powers keep the same order through 2040.',
          figure: { type: 'ScenarioBullet', dataKey: 'scenarioBullet' },
          sources: [
            { title: 'Who holds the advantage? Three perspectives on the US-China military balance', publisher: 'Brookings Institution', date: 'Jul 2026', url: 'https://www.brookings.edu/articles/who-holds-the-advantage-three-perspectives-on-the-us-china-military-balance/' },
            { title: 'Surveying the Experts: The State of U.S.-China Relations Entering 2026', publisher: 'CSIS ChinaPower Project', date: 'Jan 2026', url: 'https://chinapower.csis.org/survey-experts-us-china-relations-2026/' },
            { title: 'What Americans Think About American Power Today', publisher: 'Carnegie Endowment for International Peace', date: 'Jan 2026', url: 'https://carnegieendowment.org/research/2026/01/what-americans-think-about-american-power-today' },
            { title: "The United States Doesn't Need to Fear China's Economy", publisher: 'Foreign Policy', date: 'May 2026', url: 'https://foreignpolicy.com/2026/05/13/china-economy-us-trade-negotiations-trump-visit/' },
            { title: 'China Now Outranks the United States in Global Favorability. What Happened?', publisher: 'Council on Foreign Relations', date: 'Jul 2026', url: 'https://www.cfr.org/articles/china-now-outranks-the-united-states-in-global-favorability-what-happened' },
            { title: "Trump and Xi won't reset the China–US rivalry, so other nations must prepare", publisher: 'Chatham House', date: 'Oct 2025', url: 'https://www.chathamhouse.org/2025/10/trump-and-xi-wont-reset-china-us-rivalry-so-other-nations-must-prepare' },
          ],
        },
        {
          finding:
            "The US-led bloc keeps a majority of world power, but only just. Its share slips to 50.5% by 2040 as China and Russia edge upward.",
          figure: { type: 'StackedColumns', dataKey: 'blocStack' },
          sources: [
            { title: "China and Russia's strategic duo endures – but its limits are clear", publisher: 'Chatham House', date: 'May 2026', url: 'https://www.chathamhouse.org/2026/05/china-and-russias-strategic-duo-endures-its-limits-are-clear' },
            { title: 'The New Transatlantic Bargain', publisher: 'Council on Foreign Relations', date: 'May 2026', url: 'https://www.cfr.org/articles/the-new-transatlantic-bargain' },
            { title: 'CRINK Security Ties: Growing Cooperation, Anchored by China and Russia', publisher: 'CSIS', date: 'Sep 2025', url: 'https://www.csis.org/analysis/crink-security-ties-growing-cooperation-anchored-china-and-russia' },
            { title: "The CRINK: Inside the new bloc supporting Russia's war against Ukraine", publisher: 'Atlantic Council', date: 'Oct 2025', url: 'https://www.atlanticcouncil.org/content-series/russia-tomorrow/the-crink-inside-the-new-bloc-supporting-russias-war-against-ukraine/' },
            { title: 'The world in 2026', publisher: 'Chatham House', date: 'Dec 2025', url: 'https://www.chathamhouse.org/publications/the-world-today/2025-12/world-2026' },
            { title: "From evil to upheaval and beyond: How the 'axis' metaphor shaped modern geopolitics", publisher: 'The Conversation', date: 'Dec 2025', url: 'https://theconversation.com/from-evil-to-upheaval-and-beyond-how-the-axis-metaphor-shaped-modern-geopolitics-268146' },
          ],
        },
        {
          finding:
            'Many countries refuse a clean choice between the giants. The largest camp leans toward the US, but a substantial middle stays non-aligned, and that pattern barely moves.',
          figure: { type: 'OrbitMap', dataKey: 'orbitMap' },
          sources: [
            { title: 'The Middle Power Moment', publisher: 'Carnegie Endowment for International Peace', date: 'Jan 2026', url: 'https://carnegieendowment.org/research/2026/01/the-middle-power-moment' },
            { title: 'After the rupture: Middle powers and the construction of new order', publisher: 'European Council on Foreign Relations', date: 'Feb 2026', url: 'https://ecfr.eu/publication/after-the-rupture-middle-powers-and-the-construction-of-new-order/' },
            { title: "Middle Powers Can't Build a New Global Order, But They Can Support One", publisher: 'Foreign Policy', date: 'Aug 2026', url: 'https://foreignpolicy.com/2026/08/11/middle-powers-international-order-mark-carney-vision/' },
            { title: 'How middle powers can weather US and Chinese AI dominance', publisher: 'Chatham House', date: 'Feb 2026', url: 'https://www.chathamhouse.org/2026/02/how-middle-powers-can-weather-us-and-chinese-ai-dominance' },
            { title: 'In the Middle East and North Africa, America and China Converge More Than They Diverge', publisher: 'Carnegie Endowment for International Peace', date: 'Jul 2026', url: 'https://carnegieendowment.org/research/2026/07/middle-east-north-africa-united-states-china-trade-military-diplomacy' },
            { title: "Is it wiser for middle powers 'not to take sides' in face of US-China rivalry?", publisher: 'South China Morning Post', date: 'Jul 2026', url: 'https://www.scmp.com/news/china/diplomacy/article/3359399/it-wiser-middle-powers-not-take-sides-face-us-china-rivalry' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Multi-alignment becomes strategy.',
          why: "In a leaderless, two-giant world the payoff is belonging to both camps' clubs at once rather than betting on a winner. Governments join overlapping forums, preserve several strategic relationships and keep room to change position as the issue changes.",
          evidence:
            'BRICS expanded in 2024 to admit Egypt, Ethiopia, Iran and the UAE, with a dozen more invited. Those same states kept their Western ties intact, choosing to hedge rather than switch blocs.',
        },
      ],
    },

    {
      n: 2,
      title: 'The great power shift already happened: 2040 is the plateau, not the turning point.',
      overall:
        "Almost every headline about a changing world order describes a change that is behind us. Between 2000 and 2025 the US lost 6.4 points of world power share and China gained 11.8; between 2025 and 2040 the US loses another 0.5 and China gains another 0.8. The interesting question for 2040 is therefore not 'who rises' but 'who has to live with the settlement', and the answer is the traditional middle powers.",
      data: [
        {
          finding:
            "The great-power shift is mostly behind us. The US–China balance changed dramatically before 2025 and barely moves over the next fifteen years.",
          figure: { type: 'ShareLines', dataKey: 'shareLinesLong' },
          sources: [
            { title: 'China economic growth target set below 5% for the first time at key meeting', publisher: 'Al Jazeera', date: 'Mar 2026', url: 'https://www.aljazeera.com/news/2026/3/5/china-economic-growth-target-set-below-5-for-the-first-time-at-key-meeting' },
            { title: "China dials down growth ambitions with decades-low target. Here's why", publisher: 'CNBC', date: 'Mar 2026', url: 'https://www.cnbc.com/2026/03/06/china-economy-gdp-growth-target-lowest-in-decades-tariffs-deflation-.html' },
            { title: "China's New Chapter: Rebalancing and Unleashing Market Forces", publisher: 'International Monetary Fund', date: 'Mar 2026', url: 'https://www.imf.org/en/news/articles/2026/03/21/sp032226-chinas-new-chapter-rebalancing-and-unleashing-market-forces' },
            { title: "As Chinese economy slows, experts say there will be 'problems for Beijing'", publisher: 'Al Jazeera', date: 'Jul 2026', url: 'https://www.aljazeera.com/economy/2026/7/17/as-chinese-economy-slows-experts-say-there-will-be-problems-for-beijing' },
            { title: 'With a shrinking population, China needs new drivers of growth', publisher: 'The Conversation', date: 'May 2026', url: 'https://theconversation.com/with-a-shrinking-population-china-needs-new-drivers-of-growth-consumer-spending-has-yet-to-fill-the-gap-281342' },
            { title: 'The World Reorders: The Complications of a Return to Spheres of Influence', publisher: 'Council on Foreign Relations', date: 'Jan 2026', url: 'https://www.cfr.org/articles/the-world-reorders-the-complications-of-a-return-to-spheres-of-influence' },
          ],
        },
        {
          finding:
            "The middle powers—not the West as a whole—lose the most ground. The countries ranked below the two giants are steadily squeezed from both ends.",
          figure: { type: 'StackedColumns', dataKey: 'concentrationBands' },
          sources: [
            { title: 'Can Europe Compete with the United States and China?', publisher: 'Carnegie Endowment for International Peace', date: 'May 2026', url: 'https://carnegieendowment.org/europe/posts/2026/05/can-europe-compete-with-the-united-states-and-china' },
            { title: 'Davos 2026: How middle powers are reading the global moment', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/davos-2026-how-middle-powers-are-reading-the-global-moment/' },
            { title: 'How Middle Powers Can Overcome U.S.-China Competition', publisher: 'Foreign Policy', date: 'Feb 2026', url: 'https://foreignpolicy.com/2026/02/03/us-china-middle-powers-diplomacy-competition-trade-industry-critical-minerals/' },
            { title: 'Can Middle Powers Build a Global Coalition?', publisher: 'Foreign Policy', date: 'Mar 2026', url: 'https://foreignpolicy.com/2026/03/23/middle-powers-mark-carney-global-south/' },
            { title: 'The State of Global Governance: Middle Powers and the Search for Stability', publisher: 'Council on Foreign Relations', date: 'Dec 2025', url: 'https://www.cfr.org/articles/state-global-governance-middle-powers-and-search-stability' },
            { title: 'What role is China playing in global geopolitical transformations?', publisher: 'Al Jazeera', date: 'Jan 2026', url: 'https://www.aljazeera.com/news/2026/1/26/what-role-is-china-playing-in-global-geopolitical-transformations' },
          ],
        },
        {
          finding:
            'Multipolarity was a one-time shift, not a continuing trend. The number of countries that meaningfully shape global power rose around 2010 and has stayed flat since.',
          figure: { type: 'TrendLine', dataKey: 'effectivePowers' },
          sources: [
            { title: 'Global Risks Report 2026: Global risks in-depth', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/publications/global-risks-report-2026/in-full/global-risks-report-2026-chapter-2/' },
            { title: 'How to upgrade globalization for our age of turmoil', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/global-risks/https-www-weforum-org-stories-2026-01-globalization-geopolitics-fragmentation-risk/' },
            { title: '6 experts on the economic and geopolitical paradoxes to watch in 2026', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/experts-economic-and-geopolitical-paradoxes-to-watch/' },
            { title: "Multipolar Dreams, Bipolar Realities: India's Great Power Future", publisher: 'Carnegie Endowment for International Peace', date: 'Oct 2025', url: 'https://carnegieendowment.org/research/2025/10/multipolar-dreams-bipolar-realities-indias-great-power-future' },
            { title: "Managing Divergence: India's BRICS Presidency in 2026", publisher: 'Carnegie Endowment for International Peace', date: 'Jun 2026', url: 'https://carnegieendowment.org/india/research/2026/06/managing-divergence-indias-brics-presidency-in-2026' },
            { title: 'The Future of American Strategy: Weaponizing Interdependence', publisher: 'Council on Foreign Relations', date: 'May 2026', url: 'https://www.cfr.org/articles/the-future-of-american-strategy-weaponizing-interdependence' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Stop waiting for the transition and start operating inside it.',
          why: 'Strategies built on an expected crossover, whether a Chinese overtake, a Western collapse or a decisive realignment, are betting on a change our data says has already been priced in. The advantage goes to actors who treat the current split as the durable state of the world rather than a temporary phase.',
          evidence:
            'The middle-power response shows up in what they buy rather than what they weigh. German military spending rose 24% in 2025 to $114bn, or 2.3% of GDP, passing 2% for the first time since 1990. Japan reached 1.4% of GDP, its highest military burden since 1958, after starting its build-up in 2022.',
        },
      ],
    },

    {
      n: 3,
      title: 'Loyalty splits by issue, not by bloc: China for money, the West for security.',
      overall:
        "The world does not divide into two clean blocs. Countries lean to China for trade and economic ties yet stay tied to the West for weapons, security and high-end technology. ",
      data: [
        {
          finding:
            'Countries increasingly trade with China while relying on the West for security.',
          figure: { type: 'IssueDials', dataKey: 'issueDials' },
          sources: [
            { title: 'Global arms flows jump nearly 10 per cent as European demand soars', publisher: 'SIPRI', date: 'Mar 2026', url: 'https://www.sipri.org/media/press-release/2026/global-arms-flows-jump-nearly-10-cent-european-demand-soars' },
            { title: 'Global military spending rise continues as European and Asian expenditures surge', publisher: 'SIPRI', date: '2026', url: 'https://www.sipri.org/media/press-release/2026/global-military-spending-rise-continues-european-and-asian-expenditures-surge' },
            { title: 'Between Washington and Beijing: How Europe fits into US-China strategic competition', publisher: 'Brookings Institution', date: 'Sep 2025', url: 'https://www.brookings.edu/articles/between-washington-and-beijing-how-europe-fits-into-us-china-strategic-competition/' },
            { title: 'Taiwan hopes US arms sale package can be approved soon, president says', publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/18/taiwan-hopes-us-arms-sale-package-can-be-approved-soon-president-says' },
            { title: "India's Multialignment and Democratization of the International Order", publisher: 'Council on Foreign Relations', date: 'May 2026', url: 'https://www.cfr.org/articles/indias-multialignment-and-democratization-of-the-international-order' },
            { title: 'Future of China trade policy as US-China relations evolve', publisher: 'World Economic Forum', date: 'Jun 2026', url: 'https://www.weforum.org/stories/2026/06/china-trade-policy-us-relations/' },
          ],
        },
        {
          finding:
            'Alignment has split into two tracks: a growing group votes with one giant but trades mainly with the other.',
          figure: { type: 'SplitTracks', dataKey: 'splitCountries' },
          sources: [
            { title: 'The Global Alignment Index: Tracking Support for U.S., Chinese, and Russian Leadership', publisher: 'CSIS', date: 'Nov 2025', url: 'https://www.csis.org/analysis/global-alignment-index-tracking-support-us-chinese-and-russian-leadership' },
            { title: "Indonesia's multi-alignment dilemma under Prabowo", publisher: 'Lowy Institute', date: 'Feb 2026', url: 'https://www.lowyinstitute.org/the-interpreter/indonesia-s-multi-alignment-dilemma-under-prabowo' },
            { title: "Strategic Ambiguity: Erdoğan's Turkey in a Multipolar World", publisher: 'CSIS', date: 'Dec 2025', url: 'https://www.csis.org/analysis/strategic-ambiguity-erdogans-turkey-multipolar-world' },
            { title: 'Post U.S.-China Summit: Managed Instability', publisher: 'Carnegie Endowment for International Peace', date: 'May 2026', url: 'https://carnegieendowment.org/posts/2026/05/post-us-china-summit-and-managed-instability' },
            { title: "Trump's Tariffs Are Part of a Bigger U.S. Shift on Trade", publisher: 'Foreign Policy', date: 'Apr 2026', url: 'https://foreignpolicy.com/2026/04/06/trump-china-washington-trade/' },
            { title: "China's economic statecraft has been exposed by US attacks on Iran and Venezuela", publisher: 'Chatham House', date: 'Mar 2026', url: 'https://www.chathamhouse.org/2026/03/chinas-economic-statecraft-has-been-exposed-us-attacks-iran-and-venezuela' },
          ],
        },
        {
          finding:
            'Hedging is the default foreign policy. By 2040, more countries balance between the giants than commit clearly to either side.',
          figure: { type: 'PostureFlags', dataKey: 'posture' },
          sources: [
            { title: 'Southeast Asia hedges as trust in Washington wanes', publisher: 'East Asia Forum', date: 'Jul 2026', url: 'https://eastasiaforum.org/2026/07/01/southeast-asia-hedges-as-trust-in-washington-wanes/' },
            { title: 'Most in Asean prefer China over US as partner in poll, Trump cited as biggest concern', publisher: 'South China Morning Post', date: 'Apr 2026', url: 'https://www.scmp.com/week-asia/politics/article/3349247/most-asean-prefer-china-over-us-partner-poll-trump-cited-biggest-concern' },
            { title: 'The U.S. Is Pushing Southeast Asia Toward China. The Iran War Made It Worse.', publisher: 'Council on Foreign Relations', date: 'Apr 2026', url: 'https://www.cfr.org/articles/the-u-s-is-pushing-southeast-asia-toward-china-the-iran-war-made-it-worse' },
            { title: "What is 'strategic autonomy' – and why is everyone suddenly reaching for it?", publisher: 'The Conversation', date: 'Jun 2026', url: 'https://theconversation.com/what-is-strategic-autonomy-and-why-is-everyone-suddenly-reaching-for-it-283825' },
            { title: 'Beijing profits from US drift in Southeast Asia', publisher: 'East Asia Forum', date: 'May 2026', url: 'https://eastasiaforum.org/2026/05/16/beijing-profits-from-us-drift-in-southeast-asia/' },
            { title: 'The State of Southeast Asia: 2026 Survey Report', publisher: 'ISEAS – Yusof Ishak Institute', date: '2026', url: 'https://www.iseas.edu.sg/media/latest-news/iseas-in-the-news-state-of-southeast-asia-2026-survey-report/' },
          ],
        },
        {
          finding:
            'No country leads every kind of power. The US owns the military and technology edge; China owns the industrial one; trade weight is almost exactly matched.',
          figure: { type: 'PowerRadar', dataKey: 'powerRadar' },
          sources: [
            { title: "China's High-Tech Drive in 10 Charts", publisher: 'CSIS', date: 'Apr 2026', url: 'https://www.csis.org/analysis/chinas-high-tech-drive-10-charts' },
            { title: 'The AI race: US and China defence sectors emerge as key battlegrounds', publisher: 'South China Morning Post', date: 'Feb 2026', url: 'https://www.scmp.com/news/us/diplomacy/article/3342412/us-and-china-defence-sectors-emerge-key-battlegrounds-race-ai' },
            { title: 'Out of Ammo: A Two-Year Sprint to Rebuild the American Arsenal and Deter China', publisher: 'Council on Foreign Relations', date: 'Aug 2026', url: 'https://www.cfr.org/reports/out-of-ammo-a-two-year-sprint-to-rebuild-the-american-arsenal-and-deter-china' },
            { title: "Trump wants the U.S. shipbuilding industry to be great again. Here's what it will take", publisher: 'CNBC', date: 'Dec 2025', url: 'https://www.cnbc.com/2025/12/14/trump-america-shipbuilding-china-competition.html' },
            { title: 'Competing AI strategies for the US and China', publisher: 'Brookings Institution', date: 'Apr 2026', url: 'https://www.brookings.edu/articles/competing-ai-strategies-for-the-us-and-china/' },
            { title: "Securing America's Critical Minerals Supply", publisher: 'Carnegie Endowment for International Peace', date: 'Oct 2025', url: 'https://carnegieendowment.org/research/2025/10/securing-americas-critical-minerals-supply' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Learn Mandarin. Chinese fluency becomes a career asset.',
          why: 'As China becomes the largest economic pole and the top trade partner for most of the Global South, Chinese fluency pays the way the 20th century paid for English. It will not replace English globally, but it creates measurable advantage where Chinese capital, firms and supply chains are central.',
          evidence:
            'The Chinese-language-learning market is roughly $7.4bn and set to roughly double this decade; Mandarin course enrolment across Africa rose 21%, and Saudi Arabia added Mandarin to its school curriculum.',
        },
        {
          title: 'Chinese products and platforms become everyday defaults.',
          why: 'Economic alignment spreads through ordinary products before it appears in diplomacy. Competitive prices, fast product cycles and integrated manufacturing let Chinese firms become household defaults even in countries that remain strategically close to the West.',
          evidence:
            'BYD is the world\'s largest EV maker; Temu and Shein overtook Amazon as the most-downloaded shopping apps; TikTok led 2024 app downloads; Hisense is South Africa\'s top TV brand.',
        },
      ],
    },

    {
      n: 4,
      title: 'The rules-based order hollows out as consensus drifts away from Washington.',
      overall:
        'The UN-centred system does not collapse; it hollows out. Membership and treaty commitment stay high, but collective action retreats. And the drift away from the old Western consensus is uniform rather than polarising: the whole distribution slides, it does not split.',
      data: [
        {
          finding:
            'Global institutions keep their members but lose their ability to act. Participation and legal commitments keep climbing while peacekeeping, the system\u2019s main collective muscle, collapses.',
          figure: { type: 'TwoSpeed', dataKey: 'twoSpeed' },
          sources: [
            { title: 'Peacekeeping in peril amid plummeting troop numbers and geopolitical deadlock: New SIPRI report', publisher: 'SIPRI', date: 'May 2026', url: 'https://www.sipri.org/media/press-release/2026/peacekeeping-peril-amid-plummeting-troop-numbers-and-geopolitical-deadlock-new-sipri-report' },
            { title: 'UN peacekeeping missions under strain as funding cuts and new threats grow', publisher: 'UN News', date: 'Apr 2026', url: 'https://news.un.org/en/story/2026/04/1167312' },
            { title: 'Guterres urges renewed commitment to multilateralism on UN Charter Day', publisher: 'UN News', date: 'Jun 2026', url: 'https://news.un.org/en/story/2026/06/1167820' },
            { title: "What's in store for the future of multilateralism?", publisher: 'World Economic Forum', date: 'Apr 2026', url: 'https://www.weforum.org/stories/2026/04/future-of-multilateralism/' },
            { title: 'What is minilateralism and why does it matter in 2026?', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/minilateralism-and-will-2026-be-the-year-size-doesnt-matter/' },
            { title: 'Fifth Committee Considers Proposed $5.23 Billion Peacekeeping Budget amid Ongoing UN Liquidity Crisis', publisher: 'UN Meetings Coverage', date: '2026', url: 'https://press.un.org/en/2026/gaab4510.doc.htm' },
          ],
        },
        {
          finding:
            'The world is drifting away from shared consensus, not splitting into two voting blocs. Countries move apart at roughly the same pace.',
          figure: { type: 'TrendLine', dataKey: 'consensusDrift' },
          sources: [
            { title: 'A UN Resolution Urging Reparatory Justice Wins Backing Without Western Support', publisher: 'PassBlue', date: 'Mar 2026', url: 'https://passblue.com/2026/03/25/a-un-resolution-urging-reparatory-justice-wins-backing-without-western-support/' },
            { title: 'UN General Assembly adopts landmark resolution to strengthen the work of the UN system', publisher: 'UN News', date: 'Mar 2026', url: 'https://news.un.org/en/story/2026/03/1167232' },
            { title: 'Reflections on the Eightieth UN General Assembly', publisher: 'Council on Foreign Relations', date: 'Sep 2025', url: 'https://www.cfr.org/articles/reflections-eightieth-un-general-assembly' },
            { title: "Bangladesh's top diplomat elected UN General Assembly leader in tight race", publisher: 'Al Jazeera', date: 'Jun 2026', url: 'https://www.aljazeera.com/news/2026/6/3/bangladeshs-rahman-elected-un-general-assembly-president-in-tight-race' },
            { title: 'Can the Next UN Chief Fix a Broken Security Council and an Empty Bank Account?', publisher: 'PassBlue', date: 'Jul 2026', url: 'https://passblue.com/2026/07/24/can-the-next-un-chief-fix-a-broken-security-council-and-an-empty-bank-account/' },
            { title: 'Electing the Next UN Secretary-General: A Final Test for Multilateralism', publisher: 'PassBlue', date: 'Sep 2025', url: 'https://passblue.com/2025/09/21/electing-the-next-un-secretary-general-a-final-test-for-multilateralism/' },
          ],
        },
        {
          finding:
            'The US is becoming the diplomatic outlier. By 2040, only Israel votes with the global majority less often.',
          figure: { type: 'Dumbbell', dataKey: 'consensusBar' },
          sources: [
            { title: "Washington Fails Once Again to Redefine 'Gender' at UN Gathering", publisher: 'PassBlue', date: 'Mar 2026', url: 'https://passblue.com/2026/03/19/washington-fails-once-again-to-redefine-gender-at-un-gathering/' },
            { title: "The US Wants to Reshape the UN's Gender Equality Agenda. It's Doing So Alone.", publisher: 'PassBlue', date: 'Dec 2025', url: 'https://passblue.com/2025/12/30/the-us-wants-to-reshape-the-uns-social-agenda-its-doing-so-alone/' },
            { title: 'How Volker Turk won a new term as UN rights chief despite US, Israel opposition', publisher: 'Al Jazeera', date: 'Jul 2026', url: 'https://www.aljazeera.com/news/2026/7/25/how-volker-turk-won-a-new-term-as-un-rights-chief-despite-israel-opposition' },
            { title: 'Washington Fails to Block Cuba-Embargo Debate at the UN', publisher: 'PassBlue', date: 'Jul 2026', url: 'https://passblue.com/2026/07/07/washington-fails-to-block-cuba-embargo-debate-at-the-un/' },
            { title: "UN passes resolution naming slave trade 'gravest crime against humanity'", publisher: 'Al Jazeera', date: 'Mar 2026', url: 'https://www.aljazeera.com/news/2026/3/25/un-passes-resolution-naming-slave-trade-gravest-crime-against-humanity' },
            { title: 'Security Council: US votes against resolution on Gaza ceasefire', publisher: 'UN News', date: 'Sep 2025', url: 'https://news.un.org/en/story/2025/09/1165881' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Route around weak global institutions.',
          why: 'A paralysed, low-trust incumbent system cannot deliver, so states and firms self-help through regional bodies, ad-hoc coalitions and parallel banks where fewer participants need to agree.',
          evidence:
            'Trust in the UN fell in 23 of 27 countries surveyed, and the Security Council saw its most vetoes since 1986 in 2024. In parallel, AIIB reported $8.4bn of project financing in 2024.',
        },
        {
          title: 'Diversify money and pricing beyond the dollar, but do not overstate the shift.',
          why: 'With two co-equal giants and no single guarantor, settling only in USD becomes a concentration risk. The shift is real in trade finance and marginal in payments.',
          evidence:
            'The renminbi reached 8.0% of SWIFT trade finance by value in June 2026, placing second behind the dollar. Yet the dollar still held 81.2% of trade finance, and the renminbi ranked only fifth in overall global payments at 3.10% in July 2026.',
        },
      ],
    },

    {
      n: 5,
      title: "Technology, economics and force become the real currency of power, with a US-led tech race at the centre.",
      overall:
        'As rules fade, material levers such as technology, economics, resources and force become the main ways power is wielded. The sharpest contest is a US-led technology race in which China is the only real challenger, while countries specialise into distinct power types.',
      data: [
        {
          finding:
            'Material leverage keeps gaining ground while rule-based leverage shrinks. Force, money, resources and technology matter more precisely because institutions matter less.',
          figure: { type: 'DivergingBar', dataKey: 'leverSlope' },
          sources: [
            { title: 'Is the Prohibition on the Use of Force Collapsing?', publisher: 'Carnegie Endowment for International Peace', date: 'Aug 2025', url: 'https://carnegieendowment.org/research/2025/08/is-the-prohibition-on-the-use-of-force-collapsing' },
            { title: '2026 begins with an increasingly autocratic United States rising on the global stage', publisher: 'The Conversation', date: 'Jan 2026', url: 'https://theconversation.com/2026-begins-with-an-increasingly-autocratic-united-states-rising-on-the-global-stage-271670' },
            { title: 'Conflict-Driven Chokepoint Disruptions', publisher: 'Council on Foreign Relations', date: 'Jul 2026', url: 'https://www.cfr.org/reports/conflict-driven-chokepoint-disruptions' },
            { title: 'Davos 2026: Special address by Mark Carney, Prime Minister of Canada', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/stories/forum-institutional/davos-2026-special-address-by-mark-carney-prime-minister-of-canada/' },
            { title: 'Watch List 2026 – Spring Edition', publisher: 'International Crisis Group', date: '2026', url: 'https://www.crisisgroup.org/euw/global/watch-list-2026-spring-edition' },
            { title: 'UN Security Council votes to wind down UNIFIL mission in Lebanon after 2026', publisher: 'Al Jazeera', date: 'Aug 2025', url: 'https://www.aljazeera.com/news/2025/8/28/un-security-council-renews-unifil-mission-in-lebanon-until-end-of-2026' },
          ],
        },
        {
          finding:
            'Technology is the sharpest two-country contest—and the clearest US advantage. By 2040, the US holds almost twice China’s technology strength.',
          figure: { type: 'TechDominanceBar', dataKey: 'techDominanceBar' },
          sources: [
            { title: 'China is gaining ground in AI. But the U.S. still has a major advantage', publisher: 'CNBC', date: 'Aug 2026', url: 'https://www.cnbc.com/2026/08/07/china-us-ai-race-hugging-face-models.html' },
            { title: 'Op-ed: The U.S. lead over China in AI is all but gone. We need a change in national strategy', publisher: 'CNBC', date: 'Aug 2026', url: 'https://www.cnbc.com/2026/08/02/ai-model-competition-us-china.html' },
            { title: 'The United States Is Betting the House on Winning the Artificial Intelligence Race With China', publisher: 'Foreign Policy', date: 'Aug 2026', url: 'https://foreignpolicy.com/2026/08/04/united-states-artificial-intelligence-race-china-openai-anthropic-donald-trump-elon-musk/' },
            { title: 'How China Is Winning the Global AI Race', publisher: 'Foreign Policy', date: 'May 2026', url: 'https://foreignpolicy.com/2026/05/07/artificial-intelligence-ai-china-us-west-race-silicon-valley-global/' },
            { title: "China's secret weapon in AI race with US? Lots of cheap energy", publisher: 'Al Jazeera', date: 'May 2026', url: 'https://www.aljazeera.com/economy/2026/5/28/chinas-secret-weapon-in-ai-race-with-us-lots-of-cheap-energy' },
            { title: 'The China Connection: Money or power? The key to winning the AI race', publisher: 'CNBC', date: 'Aug 2026', url: 'https://www.cnbc.com/2026/08/17/money-or-power-the-key-to-winning-the-us-china-ai-race.html' },
          ],
        },
        {
          finding:
            'Most countries do not become all-round powers; they specialise. Technology, military force, resources and economic weight produce four distinct national power models.',
          figure: { type: 'SignatureMap', dataKey: 'signatureMap' },
          sources: [
            { title: 'Global energy in 2026: Growth, resilience and competition', publisher: 'World Economic Forum', date: 'Dec 2025', url: 'https://www.weforum.org/stories/2025/12/global-energy-2026-growth-resilience-and-competition/' },
            { title: 'Malaysia joins the industrial clusters initiative – what that means', publisher: 'World Economic Forum', date: 'Jan 2026', url: 'https://www.weforum.org/stories/2026/01/industrial-clusters-are-key-to-growth-in-malaysia/' },
            { title: 'How South Africa is moving up the manufacturing value chain', publisher: 'World Economic Forum', date: 'May 2026', url: 'https://www.weforum.org/stories/2026/05/with-industrial-clusters-south-africa-moving-up-manufacturing-value-chain/' },
            { title: 'To secure critical minerals supply governments need to take a stake in industry', publisher: 'Chatham House', date: 'Mar 2026', url: 'https://www.chathamhouse.org/2026/03/secure-critical-minerals-supply-governments-need-take-stake-industry' },
            { title: 'Energy Transition Index 2026: Energy security', publisher: 'World Economic Forum', date: '2026', url: 'https://www.weforum.org/publications/energy-transition-index-2026/in-full/4-energy-security-energy-transition-index-2026/' },
            { title: 'Making Critical Minerals Bankable: Policy Tools to Unlock Investment', publisher: 'World Economic Forum', date: '2026', url: 'https://reports.weforum.org/docs/WEF_Making_Critical_Minerals_Bankable_2026.pdf' },
          ],
        },
        {
          finding:
            "The soft-power race is converging at the top. The US improves slowest, allowing the UK, China and Japan to catch or slightly pass it by 2040.",
          figure: { type: 'Dumbbell', dataKey: 'softPowerSlope' },
          sources: [
            { title: 'US sees steepest decline out of all 193 nation brands in Global Soft Power Index 2026', publisher: 'Brand Finance', date: '2026', url: 'https://brandfinance.com/press-releases/us-sees-steepest-decline-out-of-all-193-nation-brands-in-global-soft-power-index-2026' },
            { title: 'Global Soft Power Index 2026: China now ranks higher than the US in global reputation', publisher: 'Brand Finance', date: '2026', url: 'https://brandfinance.com/press-releases/brand-finance-global-soft-power-index-2026-china-now-ranks-higher-than-the-us-in-global-reputation' },
            { title: 'Global Soft Power Index 2026: Japan overtakes the UK to rank 3rd globally', publisher: 'Brand Finance', date: '2026', url: 'https://brandfinance.com/press-releases/brand-finance-global-soft-power-index-2026-japan-overtakes-the-uk-to-rank-3rd-globally' },
            { title: 'Global Soft Power Index 2026: A global mood shift', publisher: 'Brand Finance', date: '2026', url: 'https://brandfinance.com/insights/global-soft-power-index-2026-executive-summary' },
            { title: "Donald Trump Is Ending America's Soft Power", publisher: 'Foreign Policy', date: 'May 2026', url: 'https://foreignpolicy.com/2026/05/04/trump-soft-power-usa/' },
            { title: 'Global Soft Power Index 2026: The UAE maintains 10th place as Western nations decline', publisher: 'Brand Finance', date: '2026', url: 'https://brandfinance.com/press-releases/brand-finance-global-soft-power-index-2026-the-uae-maintains-10th-place-as-western-nations-decline' },
          ],
        },
      ],
      behaviours: [
        {
          title: 'Reorganise around the technology race.',
          why: "Technology is the decisive, most-contested lever, so states pursue 'tech sovereignty' and firms and individuals increasingly have to pick a US or Chinese stack.",
          evidence:
            "State chip investment surges across the US CHIPS Act, the EU Chips Act and Japanese, Korean and Chinese programmes, while Huawei sanctions and HarmonyOS split the software stack.",
        },
        {
          title: "Hedge production as 'China+1' and dual-system operations become the default.",
          why: 'A contested, leaderless two-giant world punishes betting on one side, so firms build across both systems and workers gain in the "plus-one" hubs.',
          evidence:
            '94% of EMEA firms report cutting China-sourcing dependence; Apple is shifting China production from roughly 95% toward 75%; Vietnam drew about $25bn of FDI in 2024.',
        },
      ],
    },
  ],

  // ---- Level 3 — data explorer defaults ----
  level3: { defaultProxy: 'D1', defaultMarkets: ['USA', 'CHN'] },
};

export default power;
