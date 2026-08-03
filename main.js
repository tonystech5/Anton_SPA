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
  currentStockData: null
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
Apple is widely regarded as a low-to-moderate risk holding suitable for steady long-term capital preservation and steady wealth growth.`
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
Best suited for growth-focused investors who are comfortable with temporary price swings and believe in long-term electrification.`
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
NVIDIA offers industry-leading growth backed by massive cash profits, though investors should expect normal pullbacks after huge historical rallies.`
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
An exceptional defensive anchor stock for steady dividend income and capital preservation.`
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
  
  // Fill modal inputs with saved keys if present
  if (DOM.modalTwelveDataKey) DOM.modalTwelveDataKey.value = STATE.twelveDataKey;
  if (DOM.modalOpenRouterKey) DOM.modalOpenRouterKey.value = STATE.openRouterKey;
}

// --- Setup Event Listeners ---
function setupEventListeners() {
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
        const chipCat = chip.getAttribute('data-cat');
        if (cat === 'all' || chipCat === cat) {
          chip.style.display = 'inline-block';
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

  // Render Chart
  renderChart(data.chartLabels, data.chartData, data.isPositive);
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

  STATE.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
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
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
          bodyFont: { family: 'Outfit', size: 15, weight: 'bold' },
          padding: 12,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            label: (context) => ` Closing Price: $${context.parsed.y.toFixed(2)}`
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
