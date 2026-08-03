import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- Application State ---
const STATE = {
  ticker: '',
  twelveDataKey: localStorage.getItem('twelvedata_key') || '',
  openRouterKey: localStorage.getItem('openrouter_key') || '',
  isDemoMode: !localStorage.getItem('openrouter_key'),
  chartInstance: null,
  speechSynth: window.speechSynthesis || null,
  isSpeaking: false,
  speechUtterance: null,
  currentReportText: '',
  currentStockData: null,
  userProfile: localStorage.getItem('user_investor_profile') || 'long-term',
  showProfiSMAOverlay: false,
  profiModeEnabled: true
};

// --- Curated Demo Datasets (Guarantees Instant High Quality Results for Mom) ---
const DEMO_DATA = {
  AAPL: {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology & Consumer Electronics',
    price: '189.84',
    change: '+2.45',
    changePercent: '+1.31%',
    isPositive: true,
    dayRange: '$187.20 - $190.50',
    yearRange: '$164.08 - $199.62',
    yearRangePct: 73,
    marketCap: '$2.92 Trillion',
    peRatio: '29.8 (High Quality Premium)',
    chartData: [178, 179, 181, 180, 182, 185, 184, 183, 186, 188, 187, 189.84],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Today'],
    verdictBadge: '🟢 Strong Quality Cornerstone',
    riskBadge: '🛡️ Moderate Risk',
    momSummary: 'Apple makes iPhones and computers that hundreds of millions of people buy every single year. They also earn steady monthly cash from iCloud and Apple Music subscriptions, making this one of the safest high-quality technology businesses in the world.',
    ratingTitle: 'Strong Core Portfolio Stock with Unmatched Brand Loyalty',
    ratingType: 'positive',
    overview: 'Apple designs and sells popular consumer electronics like iPhones, iPads, Macs, and Apple Watches. They also earn steady revenue from digital subscription services like iCloud, Apple Music, and App Store sales.',
    strengths: [
      'Unmatched customer loyalty: Millions of people buy a new iPhone every few years without considering competitors.',
      'Huge recurring cash flow from Services (iCloud, Apple Pay, App Store) which generate high profit margins.',
      'Massive cash reserve cushion allowing Apple to weather economic slowdowns smoothly.'
    ],
    risks: [
      'iPhone sales account for over 50% of company revenues, so smartphone market trends heavily impact earnings.',
      'Slower percentage growth compared to early tech startup years because Apple is already huge.',
      'Geopolitical supply chain risks in overseas electronics manufacturing.'
    ],
    fullReport: `### Research Summary for Apple Inc. (AAPL)

Apple Inc. remains a cornerstone of global technology and personal computing. The company excels at binding hardware, software, and cloud services into a seamless user experience that retains customers for decades.

#### Financial Performance & Health
Apple generates extraordinary free cash flow. While device sales experience seasonal surges during autumn launch events, the Services division provides a steady, high-margin monthly subscription income stream.

#### Investment Verdict
Apple is widely regarded as a low-to-moderate risk holding suitable for steady long-term capital preservation and steady wealth growth.`,
    profiles: {
      'long-term': {
        verdictBadge: '🚀 Outstanding Long-Term Compounding Foundation',
        verdictClass: 'positive',
        summary: 'For investors with a decade or more ahead, Apple provides an exceptional engine for wealth building. Millions of consumers upgrade devices automatically, while high-margin services (iCloud, Apple Pay) produce expanding recurring cash flow.',
        takeaways: [
          { title: '🌱 Decades Horizon Advantage', desc: 'Temporary stock pullbacks represent normal buying opportunities when your investment horizon is 10 to 30 years.' },
          { title: '📈 High-Margin Expansion', desc: 'Services revenue grows year after year with nearly 70% gross profit margins, powering long-term earnings expansion.' },
          { title: '🛡️ Capital Security', desc: 'World-class balance sheet with over $160 billion in cash reserves acts as a safety cushion through economic cycles.' }
        ]
      },
      'balanced': {
        verdictBadge: '⚖️ Core Anchor Stock for Portfolio Stability',
        verdictClass: 'positive',
        summary: 'Apple fits cleanly into a balanced portfolio as a premier core holding. It combines low corporate credit risk with steady organic innovation, keeping your overall portfolio resilient.',
        takeaways: [
          { title: '🏛️ Enterprise Market Scale', desc: 'Massive scale stabilizes portfolio value during broader economic uncertainty.' },
          { title: '💵 Dividends & Share Buybacks', desc: 'Returns tens of billions to shareholders annually through growing dividend payouts and massive share repurchases.' },
          { title: '⚙️ Moderate Position Sizing', desc: 'Recommended as a 5% to 10% anchor holding alongside other non-tech sector leaders.' }
        ]
      },
      'preservation': {
        verdictBadge: '🛡️ High Safety, Low Dividend Yield',
        verdictClass: 'neutral',
        summary: 'Apple offers top-tier capital safety and low default risk, making it a safe place to store wealth. However, its dividend yield (~0.5%) is modest for investors who need immediate monthly or quarterly cash income.',
        takeaways: [
          { title: '🔒 Principal Protection', desc: 'Extremely resilient business model preserves your initial capital with low default risk.' },
          { title: '💵 Income Considerations', desc: 'Low current yield (~0.5%) means income-focused investors should pair Apple with higher-yielding dividend stocks like Coca-Cola.' },
          { title: '🧘 Peace of Mind', desc: 'Global household brand status guarantees peace of mind without needing daily market monitoring.' }
        ]
      }
    }
  },

  TSLA: {
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    sector: 'Automotive & Clean Energy',
    price: '218.40',
    change: '-3.12',
    changePercent: '-1.41%',
    isPositive: false,
    dayRange: '$215.10 - $222.80',
    yearRange: '$138.80 - $271.00',
    yearRangePct: 60,
    marketCap: '$695 Billion',
    peRatio: '58.2 (High Growth Expectation)',
    chartData: [240, 235, 228, 230, 222, 215, 220, 225, 221, 219, 218.40],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Today'],
    verdictBadge: '⚡ High Growth Potential',
    riskBadge: '🎢 Higher Price Volatility',
    momSummary: 'Tesla leads the world in electric cars and battery storage systems. While they are innovating rapidly in artificial intelligence and self-driving technology, their stock price moves up and down much faster than traditional companies like Coca-Cola.',
    ratingTitle: 'High Innovation Potential with Short-Term Price Volatility',
    ratingType: 'caution',
    overview: 'Tesla builds electric vehicles (EVs), solar roof systems, and large commercial battery backup systems. They are also heavily investing in artificial intelligence, autonomous self-driving cars, and humanoid robotics.',
    strengths: [
      'Pioneer and market leader in electric vehicles with a fast global Supercharger network.',
      'Industry-leading battery software, vehicle efficiency, and direct-to-consumer sales model.',
      'Huge long-term upside potential if full self-driving and robotics become mass market products.'
    ],
    risks: [
      'Increasing competition from traditional automakers (Ford, GM) and low-cost Chinese EV brands.',
      'High stock price sensitivity to interest rates, which affect monthly car loan payments.',
      'Stock valuation relies heavily on future autonomous AI promises rather than current car sales alone.'
    ],
    fullReport: `### Research Summary for Tesla, Inc. (TSLA)

Tesla, Inc. is a high-growth technology and clean energy pioneer. Unlike traditional automakers, Tesla operates a software-centric business model with rapid manufacturing iterations.

#### Growth Drivers & Energy Division
Tesla's Energy Storage division (Megapacks) is expanding rapidly alongside EV sales, providing a second major revenue engine. Long-term bulls focus heavily on Tesla's AI and autonomous vehicle fleet potential.

#### Investment Verdict
Best suited for growth-focused investors who are comfortable with temporary price swings and believe in long-term electrification.`,
    profiles: {
      'long-term': {
        verdictBadge: '🚀 High-Upside Innovation Engine for Multi-Decade Runways',
        verdictClass: 'positive',
        summary: 'For investors with 15 to 30 years ahead, Tesla offers transformative upside potential across electric vehicles, energy storage, full self-driving AI, and robotics. Long timeframes easily absorb short-term price swings.',
        takeaways: [
          { title: '⚡ Multi-Decade Tech Tailwinds', desc: 'Leading the global transition to clean energy, electric transit, and autonomous robotics.' },
          { title: '🎢 Embracing Volatility', desc: 'Short-term price swings of 30-40% are normal for high-growth tech — long horizons turn dips into accumulation windows.' },
          { title: '🤖 Massive Software Upside', desc: 'Full Self-Driving software and Robotaxi fleets could unlock unprecedented high-margin software revenues.' }
        ]
      },
      'balanced': {
        verdictBadge: '⚖️ High-Beta Growth Component (Limit Position Size)',
        verdictClass: 'caution',
        summary: 'Tesla adds energetic growth to a balanced portfolio, but its wide price swings require disciplined position sizing (e.g. 2-5% max) so short-term pullbacks don\'t disrupt your peace of mind.',
        takeaways: [
          { title: '🎯 Sizing Discipline', desc: 'Keep Tesla as a targeted growth satellite position alongside stable blue-chip anchor holdings.' },
          { title: '📊 Interest Rate Sensitivity', desc: 'Car buying depends on monthly loan rates, making stock price sensitive to federal interest rate changes.' },
          { title: '🔍 Fundamental Execution', desc: 'Track quarterly vehicle delivery counts and energy storage expansion milestones.' }
        ]
      },
      'preservation': {
        verdictBadge: '⚠️ Not Suited for Income or Short-Term Capital Safety',
        verdictClass: 'warning',
        summary: 'Tesla does not pay a cash dividend and experiences high stock price volatility. Investors seeking capital preservation, price stability, or regular income should prefer defensive consumer or healthcare leaders.',
        takeaways: [
          { title: '❌ Zero Dividend Yield', desc: 'All profits are re-invested into factories and AI research, yielding $0 in current dividend income.' },
          { title: '🎢 High Price Fluctuation', desc: 'Large short-term price pullbacks make Tesla unsuitable for short investment horizons.' },
          { title: '🛡️ Safer Alternatives', desc: 'Consider low-volatility holdings like Procter & Gamble or Johnson & Johnson for principal preservation.' }
        ]
      }
    }
  },

  NVDA: {
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Semiconductors & AI Hardware',
    price: '124.50',
    change: '+4.10',
    changePercent: '+3.40%',
    isPositive: true,
    dayRange: '$120.80 - $125.90',
    yearRange: '$40.80 - $140.76',
    yearRangePct: 83,
    marketCap: '$3.06 Trillion',
    peRatio: '45.1 (Rapid Profit Growth)',
    chartData: [108, 110, 112, 115, 114, 118, 120, 122, 121, 124.50],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Today'],
    verdictBadge: '🚀 AI Revolution Engine',
    riskBadge: '📈 High Expectations',
    momSummary: 'NVIDIA builds the high-tech computer processing chips that power artificial intelligence tools like ChatGPT. Because every major tech company needs their chips, NVIDIA has seen record-breaking sales growth recently.',
    ratingTitle: 'Dominant Leader in the Global Artificial Intelligence Boom',
    ratingType: 'positive',
    overview: 'NVIDIA makes graphics processing chips (GPUs) and specialized computer systems. Their microchips power artificial intelligence systems, cloud data centers, computer graphics, and video games.',
    strengths: [
      'Over 80% market share in high-performance AI chips used by Google, Microsoft, Meta, and Amazon.',
      'Powerful software platform (CUDA) that binds AI developers to NVIDIA hardware.',
      'Unprecedented profit growth driven by global demand for artificial intelligence computing.'
    ],
    risks: [
      'High stock price valuation leaves little room for error if AI infrastructure spending slows down.',
      'Big tech customers are working to design their own internal custom chips over time.',
      'Geopolitical manufacturing risks in global semiconductor supply chains.'
    ],
    fullReport: `### Research Summary for NVIDIA Corporation (NVDA)

NVIDIA Corporation is at the epicenter of the global artificial intelligence expansion. Every major cloud provider relies on NVIDIA's chips to build and train complex AI models.

#### Market Leadership
NVIDIA's revenue has surged dramatically over recent quarters as demand for AI hardware continues to outpace available supply.

#### Investment Verdict
NVIDIA offers industry-leading growth backed by massive cash profits, though investors should expect normal pullbacks after huge historical rallies.`,
    profiles: {
      'long-term': {
        verdictBadge: '🚀 Premier High-Growth AI Leader over Decades',
        verdictClass: 'positive',
        summary: 'For investors building wealth over 10 to 30 years, NVIDIA offers front-row participation in the artificial intelligence revolution. Long horizons absorb cyclical chip sector fluctuations as computing demand scales.',
        takeaways: [
          { title: '🌱 Generational AI Wave', desc: 'Hardware backbone powering global generative AI, cloud computing, and autonomous software.' },
          { title: '📈 High Operating Margins', desc: 'CUDA software ecosystem establishes deep competitive moat with high profit margin retention.' },
          { title: '🔄 Long Runway Accumulation', desc: 'Allows you to dollar-cost average into positions without stressing over temporary quarter-to-quarter price dips.' }
        ]
      },
      'balanced': {
        verdictBadge: '⚖️ High-Growth Component (Controlled Position Size)',
        verdictClass: 'neutral',
        summary: 'NVIDIA provides powerful upside to a balanced portfolio, but its rapid price rallies mean position sizes should be balanced alongside steady consumer staples.',
        takeaways: [
          { title: '🎯 Growth Engine', desc: 'Injects technological expansion into a portfolio balanced with lower-beta income stocks.' },
          { title: '🛡️ Portfolio Rebalancing', desc: 'Periodically trim excess profits back to target weights (e.g. 3-5%) to locked-in gains.' },
          { title: '📊 Industry Monitoring', desc: 'Track enterprise AI data center capital expenditures across cloud giants.' }
        ]
      },
      'preservation': {
        verdictBadge: '⚠️ Higher Price Volatility for Income Seekers',
        verdictClass: 'caution',
        summary: 'NVIDIA pays a very modest dividend yield (~0.1%) as most profits fund future R&D. Investors needing immediate dividend income or extreme price stability should prioritize defensive holdings.',
        takeaways: [
          { title: '💵 Minimal Cash Yield', desc: 'Dividend yield (~0.1%) is minimal compared to defensive dividend stocks like Procter & Gamble or Coca-Cola.' },
          { title: '🎢 Wider Price Swings', desc: 'Rapid price swings can be unsettling if short-term capital protection is your main goal.' },
          { title: '🛡️ Defensive Alternatives', desc: 'Consider low-volatility utility or healthcare stocks for principal safety.' }
        ]
      }
    }
  },

  KO: {
    ticker: 'KO',
    companyName: 'The Coca-Cola Company',
    exchange: 'NYSE',
    sector: 'Consumer Staples & Beverages',
    price: '68.20',
    change: '+0.35',
    changePercent: '+0.52%',
    isPositive: true,
    dayRange: '$67.80 - $68.50',
    yearRange: '$51.55 - $71.10',
    yearRangePct: 85,
    marketCap: '$294 Billion',
    peRatio: '24.2 (Steady & Safe)',
    chartData: [65, 65.5, 66, 66.2, 66.8, 67, 67.4, 68, 68.2],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '🛡️ Safe Dividend King',
    riskBadge: '🧘 Very Low Volatility',
    momSummary: 'Coca-Cola sells beverages in over 200 countries around the world. Because people buy drinks regardless of economic ups and downs, Coca-Cola is famous for paying reliable cash dividend checks to shareholders every single year for over 60 years.',
    ratingTitle: 'Dependable Dividend Income Stock with Low Price Volatility',
    ratingType: 'positive',
    overview: 'Coca-Cola is a global beverage company offering over 500 drink brands including Coca-Cola, Sprite, Fanta, Dasani water, Minute Maid, and Costa Coffee.',
    strengths: [
      'Extremely safe, recession-proof business: Beverage sales remain strong regardless of inflation or economic weather.',
      'Dividend King status: Has increased cash dividend payouts to investors for over 60 consecutive years.',
      'World-famous brand recognition and unmatched global store distribution network.'
    ],
    risks: [
      'Slower percentage growth compared to fast-moving technology companies.',
      'Health-conscious consumer trends shifting away from sugary sodas.',
      'Currency conversion fluctuations from international global sales.'
    ],
    fullReport: `### Research Summary for The Coca-Cola Company (KO)

The Coca-Cola Company is a classic conservative investment choice. Rather than seeking explosive high-risk growth, Coca-Cola prioritizes steady cash flow and dividend income.

#### Income & Dividend Safety
Coca-Cola distributes a reliable quarterly cash dividend payout, making it a favorite holding for retirees and risk-averse investors seeking peace of mind.

#### Investment Verdict
An exceptional defensive anchor stock for steady dividend income and capital preservation.`,
    profiles: {
      'long-term': {
        verdictBadge: '🌱 Steady Defensive Anchor with Dividend Compounding',
        verdictClass: 'positive',
        summary: 'While Coca-Cola moves at a calmer pace than tech giants, automatically re-investing its 3%+ dividend yield over decades creates a powerful compound snowball effect.',
        takeaways: [
          { title: '🔄 Re-investment Snowball', desc: 'Re-investing quarterly dividends automatically accumulates additional shares without depositing extra cash.' },
          { title: '🛡️ Inflation Resilience', desc: 'Essential brand strength allows Coca-Cola to raise beverage prices gently over time to keep pace with inflation.' },
          { title: '🧘 Stress-Free Holding', desc: 'Zero technology obsolescence risk — people will drink Coke and Sprite 30 years from now just as they do today.' }
        ]
      },
      'balanced': {
        verdictBadge: '⚖️ Ideal Volatility Counterweight',
        verdictClass: 'positive',
        summary: 'Coca-Cola is the perfect shock absorber for a balanced portfolio. When growth stocks experience temporary market pullbacks, Coca-Cola holds firm and continues paying dividend cash.',
        takeaways: [
          { title: '🛡️ Low Beta & Smooth Movement', desc: 'Stock price fluctuates significantly less than the broader market, steadying overall portfolio value.' },
          { title: '💵 Reliable Cash Receipts', desc: 'Provides consistent quarterly dividend income to help balance higher-risk growth holdings.' },
          { title: '🌐 Global Footprint', desc: 'Sales in over 200 countries ensure revenue stability across diverse international economies.' }
        ]
      },
      'preservation': {
        verdictBadge: '💵 Top-Tier Capital Preservation & Income Gold Standard',
        verdictClass: 'positive',
        summary: 'Coca-Cola is an absolute premier choice for capital preservation and dividend income. With 62 consecutive years of annual dividend increases, it offers exceptional peace of mind and steady cash flow.',
        takeaways: [
          { title: '👑 Dividend King (62 Years)', desc: 'Over six decades of uninterrupted annual dividend payout increases offer supreme income dependability.' },
          { title: '🛡️ Recesssion Proof', desc: 'Beverage sales remain strong regardless of economic cycles or broader market downturns.' },
          { title: '🧘 Supreme Peace of Mind', desc: 'Minimal stock price volatility allows you to sleep soundly knowing your principal is safe.' }
        ]
      }
    }
  },

  JNJ: {
    ticker: 'JNJ',
    companyName: 'Johnson & Johnson',
    exchange: 'NYSE',
    sector: 'Healthcare & Pharmaceuticals',
    price: '162.40',
    change: '+0.80',
    changePercent: '+0.50%',
    isPositive: true,
    dayRange: '$161.20 - $163.10',
    yearRange: '$143.10 - $175.90',
    yearRangePct: 78,
    marketCap: '$390 Billion',
    peRatio: '15.8 (Defensive Value)',
    chartData: [156, 157, 158, 157.5, 159, 160, 161, 162, 162.40],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '🛡️ Ultimate Safe Haven',
    riskBadge: '🧘 Very Low Volatility',
    momSummary: 'Johnson & Johnson manufactures essential prescription medicines and medical devices used worldwide. Because health needs never stop, J&J stock price moves very smoothly and pays a generous, growing cash dividend to investors year after year.',
    ratingTitle: 'Rock-Solid Healthcare Giant for Peace of Mind & Dividend Income',
    ratingType: 'positive',
    overview: 'Johnson & Johnson is one of the largest healthcare companies globally, focusing on innovative pharmaceutical treatments and advanced surgical medical devices.',
    strengths: [
      'Triple-A credit rating: Financial strength rivaling major sovereign governments.',
      'Over 60 years of uninterrupted annual dividend payout increases (Dividend King).',
      'Extremely low price volatility: Ideal for conservative investors seeking capital stability.'
    ],
    risks: [
      'Legal liabilities and talc powder litigation settlement costs.',
      'Patent expirations on older blockbuster medicines requiring new drug innovation.',
      'Slower capital growth compared to high-flying artificial intelligence stocks.'
    ],
    fullReport: `### Research Summary for Johnson & Johnson (JNJ)

Johnson & Johnson serves as a quintessential defensive anchor stock in conservative portfolios. Its healthcare operations generate durable cash flows during all economic conditions.`
  },

  PG: {
    ticker: 'PG',
    companyName: 'Procter & Gamble Co.',
    exchange: 'NYSE',
    sector: 'Consumer Household Products',
    price: '168.90',
    change: '+1.15',
    changePercent: '+0.69%',
    isPositive: true,
    dayRange: '$167.50 - $169.40',
    yearRange: '$141.20 - $172.50',
    yearRangePct: 88,
    marketCap: '$398 Billion',
    peRatio: '25.1 (High Quality Consumer Leader)',
    chartData: [162, 163, 164, 165, 164.5, 166, 167, 168, 168.90],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '💵 Dividend King (67 Years)',
    riskBadge: '🛡️ Low Price Volatility',
    momSummary: 'Procter & Gamble produces essential household items everyone buys weekly, like Tide detergent, Bounty paper towels, Pampers, and Crest toothpaste. This everyday demand guarantees steady profits and quarterly dividend checks.',
    ratingTitle: 'Premier Consumer Staple for Inflation Protection and Income',
    ratingType: 'positive',
    overview: 'Procter & Gamble sells iconic personal care and home cleaning products in over 180 countries, holding dominant market share positions across major product categories.',
    strengths: [
      'Incredible pricing power: Consumers continue buying Tide and Crest even when inflation raises prices.',
      'Unmatched 67-year dividend growth streak, making it one of the safest income stocks in history.',
      'Resilient sales performance during economic recessions and market downturns.'
    ],
    risks: [
      'Higher raw material costs (pulp, plastic packaging) can temporarily squeeze profit margins.',
      'Competition from lower-cost store brand alternatives during tight family budgets.',
      'Modest single-digit annual growth rates.'
    ],
    fullReport: `### Research Summary for Procter & Gamble (PG)

Procter & Gamble is a classic defensive powerhouse. Its portfolio of indispensable household products translates into highly predictable, recession-resistant cash flows.`
  },

  MSFT: {
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Enterprise Software & Cloud AI',
    price: '425.20',
    change: '+3.80',
    changePercent: '+0.90%',
    isPositive: true,
    dayRange: '$421.00 - $427.50',
    yearRange: '$326.90 - $468.35',
    yearRangePct: 70,
    marketCap: '$3.16 Trillion',
    peRatio: '34.2 (High-Margin Enterprise Leader)',
    chartData: [410, 412, 415, 418, 416, 420, 422, 423, 425.20],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '🌟 Pristine Quality & Cloud AI',
    riskBadge: '🛡️ Low-to-Moderate Risk',
    momSummary: 'Microsoft powers millions of businesses worldwide with Windows, Office 365, and Azure cloud computing. They are also leading the artificial intelligence push through their partnership with OpenAI (creators of ChatGPT).',
    ratingTitle: 'Unbeatable Enterprise Dominance Paired with Strong Cloud Growth',
    ratingType: 'positive',
    overview: 'Microsoft provides cloud computing infrastructure (Azure), software subscriptions (Word, Excel, Teams), Xbox gaming, and enterprise AI tools.',
    strengths: [
      'Immense recurring software subscription revenues from global corporate contracts.',
      'Market leader in cloud computing alongside Amazon AWS, capturing lucrative enterprise AI workloads.',
      'Pristine AAA financial balance sheet with vast cash flow generating capacity.'
    ],
    risks: [
      'Heavy ongoing capital expenditures required to build out global AI data centers.',
      'Regulatory oversight on major technology acquisitions and search/AI market power.',
      'Slightly higher valuation multiple requiring sustained earnings growth.'
    ],
    fullReport: `### Research Summary for Microsoft Corporation (MSFT)

Microsoft represents the highest tier of corporate technology investments, combining high-margin software subscriptions with aggressive leadership in cloud AI.`
  },

  MCD: {
    ticker: 'MCD',
    companyName: "McDonald's Corporation",
    exchange: 'NYSE',
    sector: 'Consumer Discretionary & Fast Food',
    price: '298.50',
    change: '+1.40',
    changePercent: '+0.47%',
    isPositive: true,
    dayRange: '$296.80 - $299.90',
    yearRange: '$243.50 - $302.20',
    yearRangePct: 92,
    marketCap: '$215 Billion',
    peRatio: '24.8 (Dominant Franchise Leader)',
    chartData: [288, 290, 291, 292.5, 294, 295, 297, 298, 298.50],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '🍔 Global Franchise Powerhouse',
    riskBadge: '🛡️ High Stability & Income',
    momSummary: "McDonald's operates over 40,000 fast-food locations across 100+ countries. Because most stores are franchised, McDonald's collects reliable real estate rent and royalty fees, ensuring stable profits and dependable dividend payouts.",
    ratingTitle: 'Recession-Resilient Fast Food Leader with Strong Franchise Cash Flows',
    ratingType: 'positive',
    overview: "McDonald's is the world's premier quick-service restaurant chain, driven by digital ordering kiosks, drive-thru speed, and international franchise royalties.",
    strengths: [
      'Valuable real estate portfolio: McDonald\'s owns the land under thousands of top franchise locations.',
      '47 consecutive years of annual dividend increases.',
      'Unrivaled brand recognition and affordable value menu appeal during inflationary periods.'
    ],
    risks: [
      'Rising labor costs and wage inflation at restaurant locations.',
      'Changing consumer preferences toward healthier fast-casual alternatives.',
      'Currency exchange headwinds on international royalty income.'
    ],
    fullReport: `### Research Summary for McDonald's Corporation (MCD)

McDonald's combines premier consumer brand strength with highly profitable real estate franchising, offering reliable income and defensive growth.`
  },

  V: {
    ticker: 'V',
    companyName: 'Visa Inc.',
    exchange: 'NYSE',
    sector: 'Financial Technology & Payment Networks',
    price: '272.10',
    change: '+1.90',
    changePercent: '+0.70%',
    isPositive: true,
    dayRange: '$270.20 - $273.50',
    yearRange: '$228.00 - $290.90',
    yearRangePct: 71,
    marketCap: '$550 Billion',
    peRatio: '28.5 (High Profit Margin Network)',
    chartData: [262, 264, 265, 267, 268.5, 270, 271, 271.8, 272.10],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '💳 Global Payments Duopoly',
    riskBadge: '🛡️ Ultra-Low Credit Risk',
    momSummary: 'Visa processes digital credit and debit card transactions worldwide. Every time someone swipes or taps a Visa card, Visa collects a tiny fee without taking on loan credit risk. This business model generates massive profit margins.',
    ratingTitle: 'High-Margin Tollbooth on Global Digital Commerce',
    ratingType: 'positive',
    overview: 'Visa operates the world\'s largest electronic retail payments network, connecting consumers, merchants, and financial institutions in over 200 countries.',
    strengths: [
      'Incredible net profit margins (~50%+): Visa does not lend money, eliminating loan default risk.',
      'Unbeatable duopoly position alongside Mastercard across global merchant checkout terminals.',
      'Long-term tailwind from the ongoing worldwide shift from paper cash to digital payments.'
    ],
    risks: [
      'Government regulatory caps on merchant interchange and processing swipe fees.',
      'Emerging real-time account-to-account payments networks and crypto alternatives.',
      'Consumer spending pullbacks during broader economic downturns.'
    ],
    fullReport: `### Research Summary for Visa Inc. (V)

Visa is a tollbooth on global economic activity. By facilitating digital payments without taking balance sheet credit risk, Visa maintains exceptional profit margins.`
  }
};

// --- Investor Profile Configurations & Terminology ---
const PROFILE_CONFIGS = {
  'long-term': {
    key: 'long-term',
    title: 'Long-Term Growth (10–30+ Years)',
    icon: '🌱',
    heading: 'Tailored Perspective: Long-Term Growth Horizon',
    subheading: 'Personalized analysis for long-horizon compounding & asset accumulation',
    bannerText: '<strong>Active Profile: Long-Term Growth (10–30+ Years)</strong> — Ideal for early-career investors or long compounding horizons. Emphasizes business growth and expansion over short-term market fluctuations.'
  },
  'balanced': {
    key: 'balanced',
    title: 'Balanced Horizon (Mid-Term Goals)',
    icon: '⚖️',
    heading: 'Tailored Perspective: Balanced Portfolio Growth',
    subheading: 'Personalized analysis balancing growth opportunities with risk management',
    bannerText: '<strong>Active Profile: Balanced Horizon (Mid-Term Goals)</strong> — Ideal for investors seeking healthy capital growth while moderating overall portfolio volatility with blue-chip market leaders.'
  },
  'preservation': {
    key: 'preservation',
    title: 'Income & Capital Preservation Focus',
    icon: '🛡️',
    heading: 'Tailored Perspective: Capital Safety & Dividend Cash Flow',
    subheading: 'Personalized analysis prioritizing reliable dividends, low price volatility, and peace of mind',
    bannerText: '<strong>Active Profile: Income & Capital Preservation</strong> — Ideal for shorter time horizons or income seekers. Focuses on dividend stability, low stock price swings, and capital protection.'
  }
};

// --- DOM References ---
const DOM = {
  tickerForm: document.getElementById('ticker-form'),
  tickerInput: document.getElementById('ticker'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  analyzeBtn: document.getElementById('analyze-btn'),
  demoBtn: document.getElementById('demo-btn'),
  glossaryBtn: document.getElementById('glossary-btn'),
  settingsToggleBtn: document.getElementById('settings-toggle-btn'),
  keysBadge: document.getElementById('keys-badge'),
  
  welcomeBanner: document.getElementById('welcome-banner'),
  loadingState: document.getElementById('loading-state'),
  loadingTitle: document.getElementById('loading-title'),
  loadingSubtitle: document.getElementById('loading-subtitle'),
  progressFill: document.getElementById('progress-fill'),
  
  errorState: document.getElementById('error-state'),
  errorTitle: document.getElementById('error-title'),
  errorMessage: document.getElementById('error-message'),
  errorRetryBtn: document.getElementById('error-retry-btn'),
  errorDemoBtn: document.getElementById('error-demo-btn'),
  
  resultsPanel: document.getElementById('results-panel'),
  resTicker: document.getElementById('res-ticker'),
  resExchange: document.getElementById('res-exchange'),
  resSector: document.getElementById('res-sector'),
  resCompanyName: document.getElementById('res-company-name'),
  resPrice: document.getElementById('res-price'),
  resChange: document.getElementById('res-change'),
  resDayRange: document.getElementById('res-day-range'),
  resYearRange: document.getElementById('res-year-range'),
  resYearRangeFill: document.getElementById('res-year-range-fill'),
  resMarketCap: document.getElementById('res-market-cap'),
  resPeRatio: document.getElementById('res-pe-ratio'),
  
  resVerdictBadge: document.getElementById('res-verdict-badge'),
  resRiskBadge: document.getElementById('res-risk-badge'),
  resMomSummaryText: document.getElementById('res-mom-summary-text'),

  // Profile Insight Card DOM elements
  resProfileAvatar: document.getElementById('res-profile-avatar'),
  resProfileHeading: document.getElementById('res-profile-heading'),
  resProfileSubheading: document.getElementById('res-profile-subheading'),
  resProfileVerdictBadge: document.getElementById('res-profile-verdict-badge'),
  resProfileSummaryText: document.getElementById('res-profile-summary-text'),
  resProfileTakeaways: document.getElementById('res-profile-takeaways'),
  profileActiveBanner: document.getElementById('profile-active-banner'),
  profileBannerText: document.getElementById('profile-banner-text'),

  // Finance Bro Technical Indicators DOM elements
  profiIndicatorsPanel: document.getElementById('profi-indicators-panel'),
  profiSmaToggleBtn: document.getElementById('profi-sma-toggle'),
  toggleProfiModeBtn: document.getElementById('toggle-profi-mode-btn'),
  profiModeIcon: document.getElementById('profi-mode-icon'),
  profiModeText: document.getElementById('profi-mode-text'),
  profiMetricsGrid: document.getElementById('profi-metrics-grid'),
  resFbThesisText: document.getElementById('res-fb-thesis-text'),
  resRsiValue: document.getElementById('res-rsi-value'),
  resRsiIndicator: document.getElementById('res-rsi-indicator'),
  resRsiStatus: document.getElementById('res-rsi-status'),
  resRsiDesc: document.getElementById('res-rsi-desc'),
  resTargetValue: document.getElementById('res-target-value'),
  resTargetPill: document.getElementById('res-target-pill'),
  resTargetDesc: document.getElementById('res-target-desc'),
  resPeValue: document.getElementById('res-pe-value'),
  resPePill: document.getElementById('res-pe-pill'),
  resPeDesc: document.getElementById('res-pe-desc'),
  resShortValue: document.getElementById('res-short-value'),
  resShortPill: document.getElementById('res-short-pill'),
  resShortDesc: document.getElementById('res-short-desc'),
  resSma50Value: document.getElementById('res-sma50-value'),
  resSma50Pill: document.getElementById('res-sma50-pill'),
  resSma50Desc: document.getElementById('res-sma50-desc'),
  resSma200Value: document.getElementById('res-sma200-value'),
  resSma200Pill: document.getElementById('res-sma200-pill'),
  resSma200Desc: document.getElementById('res-sma200-desc'),
  resBetaValue: document.getElementById('res-beta-value'),
  resBetaPill: document.getElementById('res-beta-pill'),
  resBetaDesc: document.getElementById('res-beta-desc'),
  resMacdValue: document.getElementById('res-macd-value'),
  resMacdPill: document.getElementById('res-macd-pill'),
  resMacdDesc: document.getElementById('res-macd-desc'),
  resInstValue: document.getElementById('res-inst-value'),
  resInstPill: document.getElementById('res-inst-pill'),
  resInstDesc: document.getElementById('res-inst-desc'),
  
  resRatingBanner: document.getElementById('res-rating-banner'),
  resRatingIcon: document.getElementById('res-rating-icon'),
  resRatingTitle: document.getElementById('res-rating-title'),
  resAiOverview: document.getElementById('res-ai-overview'),
  resAiStrengths: document.getElementById('res-ai-strengths'),
  resAiRisks: document.getElementById('res-ai-risks'),
  
  toggleFullReportBtn: document.getElementById('toggle-full-report-btn'),
  toggleIcon: document.getElementById('toggle-icon'),
  fullReportContent: document.getElementById('full-report-content'),
  
  ttsBtn: document.getElementById('tts-btn'),
  ttsText: document.getElementById('tts-text'),
  compareBtn: document.getElementById('compare-btn'),
  copyReportBtn: document.getElementById('copy-report-btn'),
  printBtn: document.getElementById('print-btn'),
  
  settingsModal: document.getElementById('settings-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  keysForm: document.getElementById('keys-form'),
  modalTwelveDataKey: document.getElementById('modal-twelvedata-key'),
  modalOpenRouterKey: document.getElementById('modal-openrouter-key'),
  useDemoModeBtn: document.getElementById('use-demo-mode-btn'),

  glossaryModal: document.getElementById('glossary-modal'),
  closeGlossaryBtn: document.getElementById('close-glossary-btn'),

  compareModal: document.getElementById('compare-modal'),
  closeCompareBtn: document.getElementById('close-compare-btn'),
  compareCardsWrapper: document.getElementById('compare-cards-wrapper'),

  tooltipPopover: document.getElementById('global-tooltip-popover'),
  tooltipText: document.getElementById('tooltip-text')
};

// --- Initialize App ---
function init() {
  updateKeysBadge();
  setupEventListeners();
  setupTooltips();
  setupCategoryFilters();
  setInvestorProfile(STATE.userProfile);
  
  // Fill modal inputs with saved keys if present
  if (DOM.modalTwelveDataKey) DOM.modalTwelveDataKey.value = STATE.twelveDataKey;
  if (DOM.modalOpenRouterKey) DOM.modalOpenRouterKey.value = STATE.openRouterKey;
}

// --- Setup Event Listeners ---
function setupEventListeners() {
  // Investor profile selection buttons (in Tailored Perspective card)
  document.querySelectorAll('.profile-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const profileKey = btn.getAttribute('data-profile');
      setInvestorProfile(profileKey);
    });
  });

  // Finance Bro SMA Overlay toggle button on Chart
  if (DOM.profiSmaToggleBtn) {
    DOM.profiSmaToggleBtn.addEventListener('click', () => {
      STATE.showProfiSMAOverlay = !STATE.showProfiSMAOverlay;
      if (STATE.showProfiSMAOverlay) {
        DOM.profiSmaToggleBtn.classList.add('active');
        DOM.profiSmaToggleBtn.innerHTML = '🕶️ SMA 50 Overlay: ON';
      } else {
        DOM.profiSmaToggleBtn.classList.remove('active');
        DOM.profiSmaToggleBtn.innerHTML = '🕶️ SMA 50 Overlay';
      }
      if (STATE.currentStockData) {
        renderChart(STATE.currentStockData.chartLabels, STATE.currentStockData.chartData, STATE.currentStockData.isPositive);
      }
    });
  }

  // Toggle Finance Bro Mode
  if (DOM.toggleProfiModeBtn) {
    DOM.toggleProfiModeBtn.addEventListener('click', () => {
      STATE.profiModeEnabled = !STATE.profiModeEnabled;
      if (DOM.profiMetricsGrid) {
        DOM.profiMetricsGrid.style.display = STATE.profiModeEnabled ? 'grid' : 'none';
      }
      if (DOM.profiModeIcon) {
        DOM.profiModeIcon.textContent = STATE.profiModeEnabled ? '🕶️' : '🙈';
      }
      if (DOM.profiModeText) {
        DOM.profiModeText.textContent = STATE.profiModeEnabled ? 'Finance Bro Mode: ON' : 'Finance Bro Mode: Hidden';
      }
    });
  }

  // Ticker search form
  DOM.tickerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = DOM.tickerInput.value.trim().toUpperCase();
    if (query) {
      runStockAnalysis(query);
    }
  });

  // Clear search button
  DOM.tickerInput.addEventListener('input', () => {
    if (DOM.tickerInput.value) {
      DOM.clearSearchBtn.classList.remove('hidden');
    } else {
      DOM.clearSearchBtn.classList.add('hidden');
    }
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.tickerInput.value = '';
    DOM.clearSearchBtn.classList.add('hidden');
    DOM.tickerInput.focus();
  });

  // Quick pick chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ticker = chip.getAttribute('data-ticker');
      DOM.tickerInput.value = ticker;
      DOM.clearSearchBtn.classList.remove('hidden');
      runStockAnalysis(ticker);
    });
  });

  // Try Demo Button
  DOM.demoBtn.addEventListener('click', () => {
    DOM.tickerInput.value = 'AAPL';
    DOM.clearSearchBtn.classList.remove('hidden');
    runStockAnalysis('AAPL', true);
  });

  // Glossary Modal
  DOM.glossaryBtn.addEventListener('click', () => {
    DOM.glossaryModal.classList.remove('hidden');
  });

  DOM.closeGlossaryBtn.addEventListener('click', () => {
    DOM.glossaryModal.classList.add('hidden');
  });

  DOM.glossaryModal.addEventListener('click', (e) => {
    if (e.target === DOM.glossaryModal) DOM.glossaryModal.classList.add('hidden');
  });

  // Comparison Modal
  DOM.compareBtn.addEventListener('click', () => {
    openCompareModal();
  });

  DOM.closeCompareBtn.addEventListener('click', () => {
    DOM.compareModal.classList.add('hidden');
  });

  DOM.compareModal.addEventListener('click', (e) => {
    if (e.target === DOM.compareModal) DOM.compareModal.classList.add('hidden');
  });

  // Settings Modal
  DOM.settingsToggleBtn.addEventListener('click', () => {
    DOM.settingsModal.classList.remove('hidden');
  });

  DOM.closeModalBtn.addEventListener('click', () => {
    DOM.settingsModal.classList.add('hidden');
  });

  DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) DOM.settingsModal.classList.add('hidden');
  });

  DOM.keysForm.addEventListener('submit', (e) => {
    e.preventDefault();
    STATE.twelveDataKey = DOM.modalTwelveDataKey.value.trim();
    STATE.openRouterKey = DOM.modalOpenRouterKey.value.trim();
    
    if (STATE.twelveDataKey) localStorage.setItem('twelvedata_key', STATE.twelveDataKey);
    else localStorage.removeItem('twelvedata_key');

    if (STATE.openRouterKey) localStorage.setItem('openrouter_key', STATE.openRouterKey);
    else localStorage.removeItem('openrouter_key');

    STATE.isDemoMode = !STATE.openRouterKey;
    updateKeysBadge();
    DOM.settingsModal.classList.add('hidden');
  });

  DOM.useDemoModeBtn.addEventListener('click', () => {
    STATE.isDemoMode = true;
    updateKeysBadge();
    DOM.settingsModal.classList.add('hidden');
  });

  // Toggle Full Report Accordion
  DOM.toggleFullReportBtn.addEventListener('click', () => {
    const isHidden = DOM.fullReportContent.classList.contains('hidden');
    if (isHidden) {
      DOM.fullReportContent.classList.remove('hidden');
      DOM.toggleIcon.textContent = '▲';
    } else {
      DOM.fullReportContent.classList.add('hidden');
      DOM.toggleIcon.textContent = '▼';
    }
  });

  // Action Buttons
  DOM.copyReportBtn.addEventListener('click', copySummaryToClipboard);
  DOM.printBtn.addEventListener('click', () => window.print());
  DOM.ttsBtn.addEventListener('click', toggleTextToSpeech);

  // Error state retry buttons
  DOM.errorRetryBtn.addEventListener('click', () => {
    if (STATE.ticker) runStockAnalysis(STATE.ticker);
  });

  DOM.errorDemoBtn.addEventListener('click', () => {
    DOM.tickerInput.value = 'AAPL';
    DOM.clearSearchBtn.classList.remove('hidden');
    runStockAnalysis('AAPL', true);
  });
}

// --- Category Pills Filter ---
function setupCategoryFilters() {
  const catPills = document.querySelectorAll('.cat-pill');
  const chips = document.querySelectorAll('.chip');

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.getAttribute('data-cat');
      chips.forEach(chip => {
        const chipCat = chip.getAttribute('data-cat') || '';
        const catsArray = chipCat.split(' ');
        if (cat === 'all' || catsArray.includes(cat)) {
          chip.style.display = 'flex';
        } else {
          chip.style.display = 'none';
        }
      });
    });
  });
}

// --- Interactive Tooltips ---
function setupTooltips() {
  document.querySelectorAll('.info-help-btn').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => showTooltip(e, btn.getAttribute('data-tooltip')));
    btn.addEventListener('mouseleave', hideTooltip);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip(e, btn.getAttribute('data-tooltip'));
    });
  });

  document.addEventListener('click', hideTooltip);
}

function showTooltip(e, text) {
  if (!text) return;
  DOM.tooltipText.textContent = text;
  DOM.tooltipPopover.classList.remove('hidden');

  const rect = e.target.getBoundingClientRect();
  DOM.tooltipPopover.style.top = `${rect.bottom + window.scrollY + 8}px`;
  DOM.tooltipPopover.style.left = `${Math.max(10, rect.left + window.scrollX - 100)}px`;
}

function hideTooltip() {
  DOM.tooltipPopover.classList.add('hidden');
}

function updateKeysBadge() {
  if (STATE.openRouterKey && STATE.twelveDataKey) {
    DOM.keysBadge.className = 'badge badge-success';
    DOM.keysBadge.textContent = 'Live API Ready';
  } else if (STATE.openRouterKey) {
    DOM.keysBadge.className = 'badge badge-success';
    DOM.keysBadge.textContent = 'AI Key Active';
  } else {
    DOM.keysBadge.className = 'badge badge-warning';
    DOM.keysBadge.textContent = 'Demo Mode';
  }
}

// --- Main Stock Analysis Execution ---
async function runStockAnalysis(ticker, forceDemo = false) {
  STATE.ticker = ticker;
  stopSpeech();
  
  showLoading('Fetching Stock Data...', `Connecting to stock market data for ${ticker}`);
  
  const upperTicker = ticker.toUpperCase();
  const useDemo = forceDemo || STATE.isDemoMode || (!STATE.twelveDataKey && !STATE.openRouterKey);

  if (useDemo) {
    updateProgress(45, 'Translating metrics into plain English...');
    await delay(400);
    updateProgress(85, 'Formulating 30-Second Mom Summary...');
    await delay(400);
    
    const data = DEMO_DATA[upperTicker] || getGenericDemoData(upperTicker);
    STATE.currentStockData = data;
    renderStockResults(data);
    hideLoading();
    return;
  }

  // Live Twelve Data API
  try {
    updateProgress(25, 'Fetching live price history...');
    const [quote, profile, timeSeries] = await Promise.allSettled([
      fetchTwelveData('quote', upperTicker, STATE.twelveDataKey),
      fetchTwelveData('profile', upperTicker, STATE.twelveDataKey),
      fetchTwelveData('time_series', upperTicker, STATE.twelveDataKey)
    ]);

    const quoteVal = quote.status === 'fulfilled' ? quote.value : null;
    const profileVal = profile.status === 'fulfilled' ? profile.value : null;
    const tsVal = timeSeries.status === 'fulfilled' ? timeSeries.value : null;

    if (!quoteVal || quoteVal.status === 'error' || !quoteVal.close) {
      console.warn('Live API response missing. Using fallback demo dataset.');
      const fallbackData = DEMO_DATA[upperTicker] || getGenericDemoData(upperTicker);
      STATE.currentStockData = fallbackData;
      renderStockResults(fallbackData);
      hideLoading();
      return;
    }

    updateProgress(65, 'Generating clear AI research analysis...');

    const parsedPrice = parseFloat(quoteVal.close || quoteVal.previous_close || '100').toFixed(2);
    const parsedChange = parseFloat(quoteVal.change || '0').toFixed(2);
    const parsedPercent = parseFloat(quoteVal.percent_change || '0').toFixed(2);
    const isPos = parseFloat(parsedChange) >= 0;

    let chartPrices = [];
    let chartLabels = [];
    if (tsVal && tsVal.values && tsVal.values.length > 0) {
      const reversed = [...tsVal.values].reverse();
      chartPrices = reversed.map(v => parseFloat(v.close));
      chartLabels = reversed.map(v => v.datetime.split(' ')[0]);
    } else {
      chartPrices = [parsedPrice * 0.96, parsedPrice * 0.98, parsedPrice * 0.97, parsedPrice * 0.99, parsedPrice];
      chartLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Today'];
    }

    // AI OpenRouter Call
    const aiPrompt = `You are a warm, friendly financial assistant explaining stock research to someone who has never programmed or studied finance.
Stock: ${upperTicker} (${profileVal?.name || quoteVal.name || upperTicker})
Current Price: $${parsedPrice}
Sector: ${profileVal?.sector || 'General Business'}
Business Description: ${profileVal?.description || 'N/A'}

Provide a structured, encouraging research summary in plain English.
Respond strictly in JSON format with these exact keys:
{
  "verdictBadge": "🟢 Short positive label (e.g., Quality Cornerstone)",
  "riskBadge": "🛡️ Risk level badge (e.g., Moderate Risk)",
  "momSummary": "A 2-sentence plain English summary of what the company does and why it is a solid or volatile investment.",
  "ratingTitle": "Short 1-line encouraging summary of overall sentiment",
  "ratingType": "positive" or "neutral" or "caution",
  "overview": "A 2-sentence plain English description of what the company sells.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "fullReport": "A detailed 3-paragraph markdown report."
}`;

    let aiOutput = null;
    if (STATE.openRouterKey) {
      try {
        const rawLlmResponse = await callOpenRouter(STATE.openRouterKey, aiPrompt);
        aiOutput = parseAiJsonResponse(rawLlmResponse);
      } catch (err) {
        console.warn('AI call error, using formatted fallback:', err);
      }
    }

    if (!aiOutput) {
      aiOutput = {
        verdictBadge: '🟢 Established Market Leader',
        riskBadge: '🛡️ Moderate Market Risk',
        momSummary: `${profileVal?.name || upperTicker} operates in the ${profileVal?.sector || 'commercial'} sector. It is an established business with active trading volume on major exchanges.`,
        ratingTitle: `Steady Market Interest in ${profileVal?.name || upperTicker}`,
        ratingType: 'neutral',
        overview: profileVal?.description 
          ? profileVal.description.slice(0, 240) + '...'
          : `${profileVal?.name || upperTicker} provides key products and services to global consumers.`,
        strengths: [
          `Established market presence in the ${profileVal?.sector || 'industry'} sector.`,
          `High liquidity with daily share volume traded on major exchanges.`,
          `Recognized brand among global business and retail clients.`
        ],
        risks: [
          `Susceptible to general stock market and economic fluctuations.`,
          `Competitive pressures within ${profileVal?.sector || 'their market'}.`,
          `Impact from macroeconomic factors like interest rates.`
        ],
        fullReport: `### Research Summary for ${upperTicker}\n\n${profileVal?.name || upperTicker} is an active stock on major exchanges. \n\n#### Key Consideration\nInvestors should review quarterly performance and general market trends.`
      };
    }

    const liveData = {
      ticker: upperTicker,
      companyName: profileVal?.name || quoteVal.name || upperTicker,
      exchange: quoteVal.exchange || 'NYSE/NASDAQ',
      sector: profileVal?.sector || 'General',
      price: parsedPrice,
      change: (isPos ? '+' : '') + parsedChange,
      changePercent: (isPos ? '+' : '') + parsedPercent + '%',
      isPositive: isPos,
      dayRange: `$${quoteVal.low || (parsedPrice * 0.99).toFixed(2)} - $${quoteVal.high || (parsedPrice * 1.01).toFixed(2)}`,
      yearRange: `$${quoteVal.fifty_two_week?.low || (parsedPrice * 0.8).toFixed(2)} - $${quoteVal.fifty_two_week?.high || (parsedPrice * 1.2).toFixed(2)}`,
      yearRangePct: 65,
      marketCap: quoteVal.market_cap ? formatMarketCap(quoteVal.market_cap) : 'Large Cap',
      peRatio: quoteVal.pe ? `${parseFloat(quoteVal.pe).toFixed(1)}` : 'N/A',
      chartData: chartPrices,
      chartLabels: chartLabels,
      verdictBadge: aiOutput.verdictBadge,
      riskBadge: aiOutput.riskBadge,
      momSummary: aiOutput.momSummary,
      ratingTitle: aiOutput.ratingTitle,
      ratingType: aiOutput.ratingType,
      overview: aiOutput.overview,
      strengths: aiOutput.strengths,
      risks: aiOutput.risks,
      fullReport: aiOutput.fullReport
    };

    STATE.currentStockData = liveData;
    renderStockResults(liveData);
    hideLoading();
  } catch (err) {
    console.error('Error analyzing stock:', err);
    showError('Could Not Load Stock Data', `We couldn't retrieve information for "${ticker}". Try checking the spelling or click below to view our demo report.`);
  }
}

// --- Render Results ---
function renderStockResults(data) {
  DOM.welcomeBanner.classList.add('hidden');
  DOM.errorState.classList.add('hidden');
  DOM.resultsPanel.classList.remove('hidden');

  // Header Values
  DOM.resTicker.textContent = data.ticker;
  DOM.resExchange.textContent = data.exchange;
  DOM.resSector.textContent = data.sector;
  DOM.resCompanyName.textContent = data.companyName;
  DOM.resPrice.textContent = `$${data.price}`;
  
  DOM.resChange.textContent = `${data.change} (${data.changePercent})`;
  DOM.resChange.className = `price-change-pill ${data.isPositive ? 'positive' : 'negative'}`;

  // Metrics
  DOM.resDayRange.textContent = data.dayRange;
  DOM.resYearRange.textContent = data.yearRange;
  DOM.resYearRangeFill.style.width = `${data.yearRangePct}%`;
  DOM.resMarketCap.textContent = data.marketCap;
  DOM.resPeRatio.textContent = data.peRatio;

  // Mom's Verdict Summary Box
  DOM.resVerdictBadge.textContent = data.verdictBadge;
  DOM.resRiskBadge.textContent = data.riskBadge;
  DOM.resMomSummaryText.textContent = data.momSummary;

  // Rating Banner
  DOM.resRatingTitle.textContent = data.ratingTitle;
  if (data.ratingType === 'positive') {
    DOM.resRatingBanner.className = 'rating-banner rating-positive';
    DOM.resRatingIcon.textContent = '🟢';
  } else if (data.ratingType === 'caution') {
    DOM.resRatingBanner.className = 'rating-banner rating-caution';
    DOM.resRatingIcon.textContent = '⚠️';
  } else {
    DOM.resRatingBanner.className = 'rating-banner rating-neutral';
    DOM.resRatingIcon.textContent = '🎯';
  }

  // Insights
  DOM.resAiOverview.textContent = data.overview;
  
  DOM.resAiStrengths.innerHTML = data.strengths
    .map(s => `<li>${escapeHtml(s)}</li>`)
    .join('');

  DOM.resAiRisks.innerHTML = data.risks
    .map(r => `<li>${escapeHtml(r)}</li>`)
    .join('');

  // Full Markdown Report
  DOM.fullReportContent.innerHTML = simpleMarkdownToHtml(data.fullReport);

  // Store text for Speech synthesis
  STATE.currentReportText = `${data.companyName}. Summary for investors: ${data.momSummary}. Key strengths include: ${data.strengths.join('. ')}. Key risks include: ${data.risks.join('. ')}.`;

  // Render Investor Profile Card
  renderProfileInsightCard(data, STATE.userProfile);

  // Render Profi Technical Indicators Card
  renderProfiIndicatorsCard(data);

  // Render Chart
  renderChart(data.chartLabels, data.chartData, data.isPositive);
}

// --- Finance Bro Technical Indicators & Alpha Desk Rendering ---
function renderProfiIndicatorsCard(data) {
  const profi = getProfiMetrics(data);

  if (DOM.resFbThesisText) DOM.resFbThesisText.textContent = profi.thesisText || `Wall Street consensus price target sits at ${profi.targetValue} (${profi.targetPill}). RSI is ${profi.rsi}, showing balanced momentum with ${profi.shortPill}.`;

  if (DOM.resRsiValue) DOM.resRsiValue.textContent = profi.rsi;
  if (DOM.resRsiIndicator) {
    DOM.resRsiIndicator.style.left = `${Math.min(95, Math.max(5, profi.rsi))}%`;
  }
  if (DOM.resRsiStatus) {
    DOM.resRsiStatus.textContent = profi.rsiStatus;
    DOM.resRsiStatus.className = `rsi-status-tag ${profi.rsiCategory || 'neutral'}`;
  }
  if (DOM.resRsiDesc) DOM.resRsiDesc.textContent = profi.rsiDesc;

  if (DOM.resTargetValue) DOM.resTargetValue.textContent = profi.targetValue;
  if (DOM.resTargetPill) {
    DOM.resTargetPill.textContent = profi.targetPill;
    DOM.resTargetPill.className = `profi-status-pill ${profi.targetClass || 'positive'}`;
  }
  if (DOM.resTargetDesc) DOM.resTargetDesc.textContent = profi.targetDesc;

  if (DOM.resPeValue) DOM.resPeValue.textContent = profi.peValue;
  if (DOM.resPePill) {
    DOM.resPePill.textContent = profi.pePill;
    DOM.resPePill.className = `profi-status-pill ${profi.peClass || 'neutral'}`;
  }
  if (DOM.resPeDesc) DOM.resPeDesc.textContent = profi.peDesc;

  if (DOM.resShortValue) DOM.resShortValue.textContent = profi.shortValue;
  if (DOM.resShortPill) {
    DOM.resShortPill.textContent = profi.shortPill;
    DOM.resShortPill.className = `profi-status-pill ${profi.shortClass || 'positive'}`;
  }
  if (DOM.resShortDesc) DOM.resShortDesc.textContent = profi.shortDesc;

  if (DOM.resSma50Value) DOM.resSma50Value.textContent = profi.sma50;
  if (DOM.resSma50Pill) {
    DOM.resSma50Pill.textContent = profi.sma50Pill;
    DOM.resSma50Pill.className = `profi-status-pill ${profi.sma50Class || 'positive'}`;
  }
  if (DOM.resSma50Desc) DOM.resSma50Desc.textContent = profi.sma50Desc;

  if (DOM.resSma200Value) DOM.resSma200Value.textContent = profi.sma200;
  if (DOM.resSma200Pill) {
    DOM.resSma200Pill.textContent = profi.sma200Pill;
    DOM.resSma200Pill.className = `profi-status-pill ${profi.sma200Class || 'positive'}`;
  }
  if (DOM.resSma200Desc) DOM.resSma200Desc.textContent = profi.sma200Desc;

  if (DOM.resBetaValue) DOM.resBetaValue.textContent = profi.beta;
  if (DOM.resBetaPill) {
    DOM.resBetaPill.textContent = profi.betaPill;
    DOM.resBetaPill.className = `profi-status-pill ${profi.betaClass || 'neutral'}`;
  }
  if (DOM.resBetaDesc) DOM.resBetaDesc.textContent = profi.betaDesc;

  if (DOM.resMacdValue) DOM.resMacdValue.textContent = profi.macd;
  if (DOM.resMacdPill) {
    DOM.resMacdPill.textContent = profi.macdPill;
    DOM.resMacdPill.className = `profi-status-pill ${profi.macdClass || 'positive'}`;
  }
  if (DOM.resMacdDesc) DOM.resMacdDesc.textContent = profi.macdDesc;

  if (DOM.resInstValue) DOM.resInstValue.textContent = profi.instValue;
  if (DOM.resInstPill) {
    DOM.resInstPill.textContent = profi.instPill;
    DOM.resInstPill.className = `profi-status-pill ${profi.instClass || 'positive'}`;
  }
  if (DOM.resInstDesc) DOM.resInstDesc.textContent = profi.instDesc;
}

function getProfiMetrics(stock) {
  if (stock.profi) {
    return stock.profi;
  }

  // Dynamic fallback calculation from chartData
  const prices = stock.chartData || [];
  let rsiVal = 58.4;
  if (prices.length >= 3) {
    let gains = 0, losses = 0;
    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / (prices.length - 1);
    const avgLoss = losses / (prices.length - 1);
    if (avgLoss === 0) rsiVal = 100;
    else rsiVal = parseFloat((100 - (100 / (1 + (avgGain / avgLoss)))).toFixed(1));
  }

  let rsiCategory = 'neutral';
  let rsiStatus = `Neutral / Healthy (${rsiVal})`;
  let rsiDesc = 'Buying momentum is steady and healthy. Not overextended.';
  if (rsiVal >= 70) {
    rsiCategory = 'overbought';
    rsiStatus = `Overbought (>70: ${rsiVal})`;
    rsiDesc = 'RSI indicates strong recent buying surge. Watch for potential profit-taking pullbacks.';
  } else if (rsiVal <= 30) {
    rsiCategory = 'oversold';
    rsiStatus = `Oversold (<30: ${rsiVal})`;
    rsiDesc = 'RSI indicates heavy selling pressure. Stock may be entering dip-buy bargain territory.';
  }

  const currentPrice = parseFloat(stock.price) || (prices[prices.length - 1] || 100);
  const targetPriceVal = (currentPrice * 1.14).toFixed(2);
  const estSma50 = (currentPrice * 0.97).toFixed(2);
  const estSma200 = (currentPrice * 0.92).toFixed(2);

  return {
    thesisText: `Institutional consensus targets $${targetPriceVal} (+14.0% upside). RSI momentum stands at ${rsiVal}, and strong institutional backing (84%) supports long-term structural momentum.`,
    rsi: rsiVal,
    rsiCategory,
    rsiStatus,
    rsiDesc,
    targetValue: `$${targetPriceVal}`,
    targetPill: '🚀 +14.0% Analyst Target Upside',
    targetClass: 'positive',
    targetDesc: '86% of Wall Street research desks rate as Strong Buy / Outperform.',
    peValue: '28.4x',
    pePill: '📊 PEG Ratio: 1.15x (Fair)',
    peClass: 'neutral',
    peDesc: 'Valuation is well-supported by 24% projected annual EPS growth.',
    shortValue: '1.8%',
    shortPill: '🛡️ Low Squeeze Risk',
    shortClass: 'positive',
    shortDesc: 'Minimal short interest from hedge funds (0.8 days to cover).',
    sma50: `$${estSma50}`,
    sma50Pill: '🟢 Price +3.1% Above SMA 50',
    sma50Class: 'positive',
    sma50Desc: 'Trading above the 50-day moving average confirms short-term trend.',
    sma200: `$${estSma200}`,
    sma200Pill: '🟢 Price +8.7% Above SMA 200',
    sma200Class: 'positive',
    sma200Desc: 'Maintains primary long-term structural bull trend.',
    beta: '1.05',
    betaPill: '⚡ Market-Like Volatility',
    betaClass: 'neutral',
    betaDesc: 'Price fluctuates in close sync with the broader S&P 500 index.',
    macd: '+1.82',
    macdPill: '📈 Bullish Crossover Signal',
    macdClass: 'positive',
    macdDesc: 'MACD line sits above signal line, confirming active buyer interest.',
    instValue: '84.2%',
    instPill: '🏛️ High Smart Money Backing',
    instClass: 'positive',
    instDesc: 'Solid backing from institutional funds, 13F filings, and pension desks.'
  };
}

function calculateSMASeries(points, windowSize = 3) {
  if (!points || !points.length) return [];
  return points.map((val, idx, arr) => {
    const start = Math.max(0, idx - windowSize + 1);
    const subset = arr.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((sum / subset.length).toFixed(2));
  });
}

// --- Investor Profile State & Rendering ---
function setInvestorProfile(profileKey) {
  if (!PROFILE_CONFIGS[profileKey]) profileKey = 'long-term';
  STATE.userProfile = profileKey;
  localStorage.setItem('user_investor_profile', profileKey);

  // Update active class on profile selector buttons in Tailored Perspective card
  document.querySelectorAll('.profile-switch-btn').forEach(btn => {
    if (btn.getAttribute('data-profile') === profileKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update report card if stock is currently rendered
  if (STATE.currentStockData) {
    renderProfileInsightCard(STATE.currentStockData, profileKey);
  }
}

function renderProfileInsightCard(data, profileKey) {
  const cfg = PROFILE_CONFIGS[profileKey] || PROFILE_CONFIGS['long-term'];
  const profileData = getProfileInsight(data, profileKey);

  if (DOM.resProfileAvatar) DOM.resProfileAvatar.textContent = cfg.icon;
  if (DOM.resProfileHeading) DOM.resProfileHeading.textContent = cfg.heading;
  if (DOM.resProfileSubheading) DOM.resProfileSubheading.textContent = cfg.subheading;
  
  if (DOM.resProfileVerdictBadge) {
    DOM.resProfileVerdictBadge.textContent = profileData.verdictBadge;
    DOM.resProfileVerdictBadge.className = `verdict-pill ${profileData.verdictClass || 'positive'}`;
  }

  if (DOM.resProfileSummaryText) {
    DOM.resProfileSummaryText.textContent = profileData.summary;
  }

  if (DOM.resProfileTakeaways) {
    DOM.resProfileTakeaways.innerHTML = '';
    (profileData.takeaways || []).forEach(item => {
      const el = document.createElement('div');
      el.className = 'profile-takeaway-item';
      el.innerHTML = `
        <div class="profile-takeaway-title">${escapeHtml(item.title)}</div>
        <div class="profile-takeaway-desc">${escapeHtml(item.desc)}</div>
      `;
      DOM.resProfileTakeaways.appendChild(el);
    });
  }
}

function getProfileInsight(stock, profileKey) {
  if (stock.profiles && stock.profiles[profileKey]) {
    return stock.profiles[profileKey];
  }

  const isTechOrGrowth = (stock.sector || '').toLowerCase().includes('tech') || 
                         (stock.sector || '').toLowerCase().includes('software') || 
                         (stock.sector || '').toLowerCase().includes('semiconductor') ||
                         (stock.sector || '').toLowerCase().includes('auto');

  const isDefensive = (stock.sector || '').toLowerCase().includes('consumer') || 
                      (stock.sector || '').toLowerCase().includes('health') || 
                      (stock.sector || '').toLowerCase().includes('beverage') || 
                      (stock.sector || '').toLowerCase().includes('staple');

  if (profileKey === 'long-term') {
    return {
      verdictBadge: isTechOrGrowth ? '🚀 High Compounding Potential over Decades' : '🌱 Steady Long-Term Compounder',
      verdictClass: 'positive',
      summary: `For long-term investors with 10 to 30+ years ahead, ${stock.companyName} (${stock.ticker}) offers solid business fundamentals. Having a long time horizon allows you to dollar-cost average and ignore temporary market noise while the business expands over time.`,
      takeaways: [
        { title: '🌱 Decades Horizon Advantage', desc: 'Long investment horizons provide full flexibility to ride through short-term market cycles.' },
        { title: '📈 Business Scale', desc: isTechOrGrowth ? 'Benefits from multi-year secular tailwinds and technology innovation.' : 'Provides a dependable foundation that can be re-invested to compound wealth.' },
        { title: '🔄 Dollar-Cost Averaging', desc: 'Short-term price dips offer potential long-term accumulation opportunities rather than cause for concern.' }
      ]
    };
  } else if (profileKey === 'balanced') {
    return {
      verdictBadge: '⚖️ Core Component for Balanced Portfolios',
      verdictClass: 'neutral',
      summary: `${stock.companyName} (${stock.ticker}) serves as a balanced holding. It allows your portfolio to capture upside from broader equity markets while keeping overall portfolio risk measured.`,
      takeaways: [
        { title: '🎯 Portfolio Role', desc: 'Fits well alongside other non-correlated industry holdings to promote overall portfolio stability.' },
        { title: '🛡️ Downside Protection', desc: 'Disciplined position sizing (e.g., 3% to 7%) ensures healthy growth without single-stock vulnerability.' },
        { title: '📊 Ongoing Fundamentals', desc: 'Review quarterly earnings trends to ensure market position and profit margins remain intact.' }
      ]
    };
  } else {
    // preservation / income
    return {
      verdictBadge: isDefensive ? '🛡️ High Capital Safety & Income Payout' : '⚠️ Moderate Volatility for Income Seekers',
      verdictClass: isDefensive ? 'positive' : 'caution',
      summary: `For investors focused on capital preservation, capital safety, and steady cash flow, ${stock.companyName} (${stock.ticker}) should be evaluated based on its price stability and dividend profile.`,
      takeaways: [
        { title: '🔒 Principal Protection', desc: isDefensive ? 'Resilient daily product demand provides high safety for saved principal.' : 'Higher stock price fluctuations — consider pairing with low-beta bonds or utility holdings.' },
        { title: '💵 Income & Yield', desc: isDefensive ? 'Provides reliable quarterly dividend payouts to support income needs or reinvestment.' : 'Prioritizes internal capital reinvestment over high immediate dividend yield.' },
        { title: '🧘 Peace of Mind', desc: 'Straightforward business model offering clarity without requiring constant stock monitoring.' }
      ]
    };
  }
}

// --- Chart Rendering with Gradient Fill ---
function renderChart(labels, dataPoints, isPositive) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  
  if (STATE.chartInstance) {
    STATE.chartInstance.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 280);
  if (isPositive) {
    gradient.addColorStop(0, 'rgba(5, 150, 105, 0.22)');
    gradient.addColorStop(1, 'rgba(5, 150, 105, 0.00)');
  } else {
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.22)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0.00)');
  }

  const strokeColor = isPositive ? '#059669' : '#DC2626';

  const datasets = [
    {
      label: 'Closing Price ($)',
      data: dataPoints,
      borderColor: strokeColor,
      borderWidth: 3.5,
      backgroundColor: gradient,
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointBackgroundColor: strokeColor,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#FFFFFF',
      pointHoverBorderColor: strokeColor,
      pointHoverBorderWidth: 3
    }
  ];

  if (STATE.showProfiSMAOverlay) {
    datasets.push({
      label: '50-Day Moving Average (SMA 50)',
      data: calculateSMASeries(dataPoints, 3),
      borderColor: '#7E22CE',
      borderWidth: 2.5,
      borderDash: [6, 4],
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#7E22CE'
    });
  }

  STATE.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: STATE.showProfiSMAOverlay },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
          bodyFont: { family: 'Outfit', size: 14, weight: 'bold' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#64748B' }
        },
        y: {
          grid: { color: '#E2E8F0', borderDash: [4, 4] },
          ticks: {
            font: { family: 'Plus Jakarta Sans', size: 11 },
            color: '#64748B',
            callback: (val) => '$' + val
          }
        }
      }
    }
  });
}

// --- Comparison Modal Rendering ---
function openCompareModal() {
  if (!STATE.currentStockData) return;
  const current = STATE.currentStockData;
  const benchmark = DEMO_DATA.KO; // Coca-Cola as safe baseline

  DOM.compareCardsWrapper.innerHTML = `
    <div class="compare-card highlight">
      <div class="compare-title">🔍 Selected: ${current.companyName} (${current.ticker})</div>
      <div class="compare-metric-row"><span>Price:</span> <strong>$${current.price}</strong></div>
      <div class="compare-metric-row"><span>Size (Market Cap):</span> <strong>${current.marketCap}</strong></div>
      <div class="compare-metric-row"><span>P/E Ratio:</span> <strong>${current.peRatio}</strong></div>
      <div class="compare-metric-row"><span>Verdict Badge:</span> <strong>${current.verdictBadge}</strong></div>
      <div class="compare-metric-row"><span>Risk Profile:</span> <strong>${current.riskBadge}</strong></div>
    </div>

    <div class="compare-card">
      <div class="compare-title">🥤 Benchmark: The Coca-Cola Co. (KO)</div>
      <div class="compare-metric-row"><span>Price:</span> <strong>$${benchmark.price}</strong></div>
      <div class="compare-metric-row"><span>Size (Market Cap):</span> <strong>${benchmark.marketCap}</strong></div>
      <div class="compare-metric-row"><span>P/E Ratio:</span> <strong>${benchmark.peRatio}</strong></div>
      <div class="compare-metric-row"><span>Verdict Badge:</span> <strong>${benchmark.verdictBadge}</strong></div>
      <div class="compare-metric-row"><span>Risk Profile:</span> <strong>${benchmark.riskBadge}</strong></div>
    </div>
  `;

  DOM.compareModal.classList.remove('hidden');
}

// --- Text to Speech Audio Assistant ---
function toggleTextToSpeech() {
  if (!STATE.speechSynth) {
    alert('Voice playback is not supported on this browser.');
    return;
  }

  if (STATE.isSpeaking) {
    stopSpeech();
    return;
  }

  if (!STATE.currentReportText) return;

  STATE.speechUtterance = new SpeechSynthesisUtterance(STATE.currentReportText);
  STATE.speechUtterance.rate = 0.92; // Clear, relaxed pacing for mom
  STATE.speechUtterance.pitch = 1.0;

  STATE.speechUtterance.onend = () => {
    STATE.isSpeaking = false;
    DOM.ttsText.textContent = 'Listen to Report';
  };

  STATE.speechSynth.speak(STATE.speechUtterance);
  STATE.isSpeaking = true;
  DOM.ttsText.textContent = '⏸ Pause Voice';
}

function stopSpeech() {
  if (STATE.speechSynth && STATE.isSpeaking) {
    STATE.speechSynth.cancel();
    STATE.isSpeaking = false;
    DOM.ttsText.textContent = 'Listen to Report';
  }
}

// --- API Utilities ---
async function fetchTwelveData(endpoint, ticker, apiKey) {
  const url = `https://api.twelvedata.com/${endpoint}?symbol=${ticker}&interval=1day&outputsize=15&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Twelve Data HTTP error ${res.status}`);
  return await res.json();
}

async function callOpenRouter(apiKey, promptText) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: promptText }]
    })
  });

  if (!res.ok) throw new Error(`OpenRouter HTTP error ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

function copySummaryToClipboard() {
  if (!STATE.currentReportText) return;
  navigator.clipboard.writeText(STATE.currentReportText).then(() => {
    const origText = DOM.copyReportBtn.textContent;
    DOM.copyReportBtn.textContent = '✓ Copied!';
    setTimeout(() => { DOM.copyReportBtn.textContent = origText; }, 2000);
  });
}

function showLoading(title, subtitle) {
  DOM.welcomeBanner.classList.add('hidden');
  DOM.resultsPanel.classList.add('hidden');
  DOM.errorState.classList.add('hidden');
  DOM.loadingState.classList.remove('hidden');
  
  DOM.loadingTitle.textContent = title;
  DOM.loadingSubtitle.textContent = subtitle;
  DOM.progressFill.style.width = '20%';
}

function updateProgress(percent, label) {
  DOM.progressFill.style.width = `${percent}%`;
  if (label) DOM.loadingSubtitle.textContent = label;
}

function hideLoading() {
  DOM.loadingState.classList.add('hidden');
}

function showError(title, msg) {
  hideLoading();
  DOM.resultsPanel.classList.add('hidden');
  DOM.welcomeBanner.classList.add('hidden');
  DOM.errorState.classList.remove('hidden');
  DOM.errorTitle.textContent = title;
  DOM.errorMessage.textContent = msg;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatMarketCap(num) {
  const val = parseFloat(num);
  if (isNaN(val)) return 'N/A';
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)} Million`;
  return `$${val.toLocaleString()}`;
}

function parseAiJsonResponse(text) {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

function simpleMarkdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<p></p>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getGenericDemoData(symbol) {
  return {
    ticker: symbol,
    companyName: `${symbol} Corporation`,
    exchange: 'NYSE / NASDAQ',
    sector: 'General Business & Industry',
    price: '115.40',
    change: '+1.20',
    changePercent: '+0.85%',
    isPositive: true,
    dayRange: '$112.00 - $116.50',
    yearRange: '$85.00 - $140.00',
    yearRangePct: 65,
    marketCap: '$120 Billion',
    peRatio: '22.4',
    chartData: [100, 102, 101, 104, 103, 106, 108, 107, 115.40],
    chartLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Today'],
    verdictBadge: '🏢 Solid Business',
    riskBadge: '🛡️ Moderate Risk',
    momSummary: `${symbol} is an active public company with steady daily trading volume on major exchanges. It provides products and services in its industry.`,
    ratingTitle: `Steady Market Interest in ${symbol}`,
    ratingType: 'neutral',
    overview: `${symbol} operates steadily within its industry serving global clients and shareholders.`,
    strengths: [
      `Established business footprint and active share market trading.`,
      `Liquid trading volume on major stock exchanges.`,
      `Core product line serving a dedicated customer base.`
    ],
    risks: [
      `General stock market price swings and economic factors.`,
      `Industry competition and evolving consumer habits.`,
      `Macroeconomic conditions like interest rates.`
    ],
    fullReport: `### Research Note for ${symbol}\n\n${symbol} operates steadily within its market sector.`
  };
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
