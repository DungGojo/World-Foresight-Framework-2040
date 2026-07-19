// Topic 01 — POWER. The quantitative claims are validated against the project
// analysis; explanatory responses and external sources are maintained here.

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
      'No single patron, currency, institution or technology standard can be assumed to win — so states, firms and individuals all hedge: a foot in both camps, more than one currency, both tech stacks. Refusing to choose becomes strategy.',
    framing:
      'The age of a single world leader ends — but nothing clean replaces it. Power in 2040 is contested (two giants, the US still narrowly ahead, China closing), diffuse (a large non-aligned majority that refuses to pick a side), and split by domain (economy vs security vs technology). Global rules hollow out while technology, money and force become the real currency of power.',
  },

  // ---- Level 2 — the four arguments ----
  level2: [
    {
      n: 1,
      title:
        "No hegemon: a two-giant standoff nobody commands, on a field that won't choose sides.",
      overall:
        'The unipolar era is over, but no new hegemon takes its place. Two giants tower over everyone — the US still the single largest through 2040, China closing but not overtaking — while below them the field is flat and mostly non-aligned. Neither giant can command the system.',
      data: [
        {
          finding:
            'Two giants, US still #1: share-of-world power US 25.2% → 24.9% → 24.7% vs China 19.9% → 20.5% → 20.8% (2025/2030/2040); the US leads all three anchor years and the gap only narrows from ~5 to ~4 points.',
          sourceTag: 'analyze_share_of_world · D1/D2/D4/D5',
          figure: { type: 'ShareLines', dataKey: 'shareLines', caption: 'Share of world power, US vs China, with the rest of the field faint behind.' },
        },
        {
          finding:
            "The West's majority is thinning: West (US + NATO/EU + Pacific allies) 51.8% → 50.6%, China + Russia 24% → 28%, India ~6%, rest of world ~19%.",
          sourceTag: 'bloc-share cell',
          figure: { type: 'BlocStack', dataKey: 'blocStack', caption: 'Share of world power by bloc, 2025→2040, sliding toward the 50% line.' },
        },
        {
          finding:
            "Below the two giants, the world won't pick sides: 14 states near the US, 7 non-aligned (around India), 6 near China, 3 near Russia — stable across anchors; only 6 sit truly in China's orbit.",
          sourceTag: 'cluster_to_anchor · D8_1-4 + D9_1-4',
          figure: { type: 'OrbitMap', dataKey: 'orbitMap', caption: 'Which pole each of 34 states sits nearest — with a large non-aligned cluster in the middle.' },
        },
      ],
      behaviours: [
        {
          title: 'Multi-alignment becomes strategy.',
          why: "When neither giant can reliably organise the whole system, choosing one camp creates avoidable economic and security costs. Governments instead join overlapping clubs, preserve several strategic relationships and keep room to change position as the issue changes.",
          evidence:
            'BRICS admitted Egypt, Ethiopia, Iran and the UAE in 2024, widening a forum built outside the Western-led order. Yet members such as the UAE, Egypt and India continue deep trade, investment or security relationships with the United States and Europe—evidence of hedging rather than a clean bloc switch.',
        },
      ],
      sources: [
        { title: 'The BRICS Summit 2024: An Expanding Alternative', publisher: 'Council on Foreign Relations', date: '7 Nov 2024', url: 'https://www.cfr.org/articles/the-brics-summit-2024-an-expanding-alternative' },
        { title: 'What Is the BRICS Group and Why Is It Expanding?', publisher: 'Council on Foreign Relations', date: '26 Jun 2025', url: 'https://www.cfr.org/backgrounders/what-brics-group-and-why-it-expanding' },
        { title: 'Turkey walks a tightrope between BRICS and the West', publisher: 'Associated Press', date: '13 Nov 2024', url: 'https://apnews.com/article/cc8c286853c0af2ebc6379954357cd3e' },
      ],
    },

    {
      n: 2,
      title: 'Loyalty splits by issue, not by bloc: China for money, the West for security.',
      overall:
        'The world does not divide into two clean blocs. Countries lean to China for trade and economic ties yet stay tied to the West for weapons, security and high-end technology — so alignment is issue-by-issue, and even America’s own allies permanently hedge.',
      data: [
        {
          finding:
            'Security stays West, economy tilts China: power-weighted world alignment stays net-West (+1.10 → +1.08) and ~72% of arms remain Western-supplied, even as China becomes the top trade partner for most of the Global South.',
          sourceTag: 'world_direction · D6/D7',
          figure: { type: 'IssueDials', dataKey: 'issueDials', caption: 'Two needles: security leans West, economy leans China.' },
        },
        {
          finding:
            'Power splits by domain, not by country: the US leads Military (37%) and Technology (42%); China leads industrial capacity (CINC 31% vs US 14%); GDP and trade are near-parity.',
          sourceTag: 'power_profile / share_detail',
          figure: { type: 'PowerRadar', dataKey: 'powerRadar', caption: 'US vs China across five domains of power.' },
        },
        {
          finding:
            'Even US allies hedge, and the UN drifts from Washington: US allies (Japan, Korea, Australia) lean West on votes but China on trade; on votes-with-the-global-majority the US is among the biggest outliers (~48%) while the Global South is most in consensus (~83%).',
          sourceTag: 'D8 vs D9 · D14',
          figure: { type: 'ConsensusBar', dataKey: 'consensusBar', caption: 'How often each votes with the global majority — the US near the bottom.' },
        },
      ],
      behaviours: [
        {
          title: 'Learn Mandarin — Chinese fluency becomes a career asset.',
          why: 'As commercial relationships with China deepen, language becomes practical infrastructure for sales, sourcing, engineering and diplomacy. Mandarin will not replace English globally, but it can create a measurable advantage in markets where Chinese capital, firms and supply chains are central.',
          evidence:
            'China is already the largest goods-trading partner for many emerging economies and a pivotal manufacturing hub. Education initiatives in countries including Saudi Arabia and across Africa show governments preparing students for that commercial reality, even while maintaining Western-facing institutions.',
        },
        {
          title: 'Chinese products and platforms become everyday defaults.',
          why: 'Economic alignment can spread through ordinary products before it appears in diplomacy. Competitive prices, fast product cycles and integrated manufacturing allow Chinese firms to become household defaults even in countries that remain strategically close to the West.',
          evidence:
            'Chinese manufacturers now account for the majority of global electric-car production and dominate many battery and component supply chains. The same reach is visible in consumer platforms and electronics, making dependence on Chinese ecosystems an everyday market outcome rather than a formal political choice.',
        },
      ],
      sources: [
        { title: 'Manufacturing and trade', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/manufacturing-and-trade' },
        { title: 'Trends in electric car markets', publisher: 'International Energy Agency', date: '2025', url: 'https://www.iea.org/reports/global-ev-outlook-2025/trends-in-electric-car-markets-2' },
        { title: 'Trade and Development Report 2025', publisher: 'UN Trade and Development', date: '2025', url: 'https://unctad.org/publication/trade-and-development-report-2025' },
      ],
    },

    {
      n: 3,
      title: 'The rules-based order hollows out, and a parallel system rises to fill the gap.',
      overall:
        'The UN-centred system does not collapse; it hollows out. Membership and treaty commitment stay high, but collective action retreats — and a junior, China/BRICS-led system grows alongside without yet replacing the incumbents.',
      data: [
        {
          finding:
            'Membership holds, muscle fades: of the global institutional series, 3 are rising and 10 flat at high levels with 0 declining — yet UN peacekeeping falls −47% (2025→2040) and ICJ compulsory-jurisdiction acceptance stays a minority at ~42%.',
          sourceTag: 'classify_trends · D10/D11/D12',
          figure: { type: 'TwoSpeed', dataKey: 'twoSpeed', caption: 'On paper the treaties hold; in practice collective muscle fades.' },
        },
        {
          finding:
            'A junior parallel system grows: BRICS New Development Bank + AIIB combined lending rose from ~$120B (2024) to ~$200B (2025) — still smaller than the Western-built institutions.',
          sourceTag: 'external (flagged data gap)',
          figure: { type: 'InstitutionsBars', dataKey: 'institutionsBars', caption: 'Incumbent institutions vs the smaller-but-rising parallel system.' },
        },
      ],
      behaviours: [
        {
          title: 'Route around weak global institutions.',
          why: 'When universal institutions cannot act quickly or enforce a shared decision, states still need finance, security coordination and crisis response. They therefore route specific problems through regional groups, temporary coalitions and development banks where fewer participants can agree.',
          evidence:
            'The Security Council remained divided across major conflicts in 2024 while veto use continued to constrain collective action. In parallel, AIIB reported USD 8.4 billion of project financing in 2024 and institutions such as the New Development Bank continued expanding a complementary financing channel.',
        },
        {
          title: 'Diversify money and pricing off the dollar.',
          why: 'The dollar remains the dominant international currency, but sanctions exposure and geopolitical rivalry turn exclusive dependence into a concentration risk. Firms and governments add local-currency settlement and alternative payment routes as insurance, not necessarily as a full replacement.',
          evidence:
            'SWIFT’s RMB Tracker shows the renminbi holding a meaningful role in trade finance and international payments, while bilateral local-currency settlement has expanded in politically exposed trade corridors. The pattern is gradual diversification around a still-dominant dollar system.',
        },
      ],
      sources: [
        { title: 'Highlights of Security Council Practice 2024', publisher: 'United Nations Security Council', date: '2024', url: 'https://main.un.org/securitycouncil/en/content/highlights-2024' },
        { title: 'AIIB reports USD 8.4 billion in 2024 project financing', publisher: 'Asian Infrastructure Investment Bank', date: '23 Jun 2025', url: 'https://www.aiib.org/en/news-events/news/2025/aiib-reports-usd84-billion-2024-project-financing-underscoring-long-term-impact-through-sustainable-development-bonds.html' },
        { title: 'Annual Report 2024', publisher: 'New Development Bank', date: '2025', url: 'https://www.ndb.int/wp-content/uploads/2025/12/NDB_AnnualReport2024_10Dec25.pdf' },
        { title: 'RMB Tracker — May 2025', publisher: 'SWIFT', date: 'May 2025', url: 'https://www.swift.com/sites/default/files/files/rmb-tracker_may-2025.pdf' },
      ],
    },

    {
      n: 4,
      title:
        'Power’s real currency becomes technology, economics and force, with a US-led tech race at the centre.',
      overall:
        'As rules fade, the material levers — technology, economics, resources and force — become how power is actually wielded. The single sharpest contest is a US-led technology race with China the only real challenger, and countries specialise into distinct power types.',
      data: [
        {
          finding:
            'Power drains from rules to material levers: world-total military +11%, economic +12%, resource +12% and technology +11% (2025→2040) all grow evenly, while the rules lever declines (peacekeeping −47%, ICJ ~42%, treaties flat).',
          sourceTag: 'base-unit world totals · D1/D2/D4/D13/D16',
          figure: { type: 'LeverSlope', dataKey: 'leverSlope', caption: 'Every material lever rises 2025→2040; only the rules lever slopes down.' },
        },
        {
          finding:
            'The decisive contest is a US-led tech race: 2040 technology world-share US 42% vs China 22% — roughly two-thirds of world R&D between them.',
          sourceTag: 'power_profile · D16',
          figure: { type: 'TechDominanceBar', dataKey: 'techDominanceBar', caption: 'Technology world-share in 2040 — a two-country race with a long tail.' },
        },
        {
          finding:
            'Countries specialise four ways: a technology elite of 5 (US, China, Germany, Japan, Korea), a force fringe of 4 (Russia, Israel, Pakistan, Ukraine), a resource/commodity bloc of 15 (Gulf, Australia, Canada, Brazil, Indonesia…), and an economic middle of 10 (France, UK, India, Mexico, Turkey…).',
          sourceTag: 'power_profile signatures',
          figure: { type: 'SignatureMap', dataKey: 'signatureMap', caption: 'Each country’s dominant lever — its power signature.' },
        },
      ],
      behaviours: [
        {
          title: 'Reorganise around the technology race.',
          why: 'Advanced chips, cloud infrastructure, AI models and technical standards increasingly determine both economic productivity and strategic autonomy. Governments subsidise domestic capacity while firms design products and supply chains that can survive tighter controls between US- and China-centred ecosystems.',
          evidence:
            'The United States and European Union have put large public programmes behind semiconductor capacity, while Asian economies continue their own industrial support. Export controls, sanctions and incompatible platform layers are already forcing companies to decide where critical technology is designed, fabricated and operated.',
        },
        {
          title: "Hedge production — 'China+1' and dual-system operating become default.",
          why: 'A single-country production footprint is vulnerable to tariffs, export controls, conflict and logistics shocks. Firms preserve access to China’s scale while building additional capacity elsewhere, creating a dual operating model rather than a simple exit from China.',
          evidence:
            'Investment patterns increasingly reward “plus-one” manufacturing hubs in Southeast Asia, India and Mexico. UNCTAD also reports that geopolitical alignment and industrial policy are redirecting capital toward strategic sectors, even as China remains embedded in global production networks.',
        },
      ],
      sources: [
        { title: 'CHIPS Incentives Award for Samsung', publisher: 'U.S. Department of Commerce', date: '20 Dec 2024', url: 'https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-award-samsung' },
        { title: 'European Chips Act enters into force', publisher: 'European Commission', date: '21 Sep 2023', url: 'https://digital-strategy.ec.europa.eu/en/news/digital-sovereignty-european-chips-act-enters-force' },
        { title: 'World Investment Report 2025', publisher: 'UN Trade and Development', date: '19 Jun 2025', url: 'https://unctad.org/publication/world-investment-report-2025' },
        { title: 'Manufacturing and trade', publisher: 'International Energy Agency', date: '2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/manufacturing-and-trade' },
      ],
    },
  ],

  // ---- Level 3 — data explorer defaults ----
  level3: { defaultProxy: 'D1', defaultMarkets: ['USA', 'CHN'] },
};

export default power;
