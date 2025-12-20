/**
 * ABFI Intelligence Suite API Client
 * Connects to the abfi-ai service for sentiment, prices, and policy data.
 */

// Use Vercel deployed URL or local fallback
const INTELLIGENCE_API_URL = import.meta.env.VITE_INTELLIGENCE_API_URL || 'https://abfi-ai.vercel.app';

interface FearComponents {
  regulatory_risk: number;
  technology_risk: number;
  feedstock_risk: number;
  counterparty_risk: number;
  market_risk: number;
  esg_concerns: number;
}

export interface SentimentIndex {
  date: string;
  overall_index: number;
  bullish_count: number;
  bearish_count: number;
  neutral_count: number;
  documents_analyzed: number;
  fear_components: FearComponents;
  daily_change?: number;
  weekly_change?: number;
  monthly_change?: number;
}

export interface SentimentTrend {
  date: string;
  bullish: number;
  bearish: number;
  net_sentiment: number;
}

export interface LenderScore {
  lender: string;
  sentiment: number;
  change_30d: number;
  documents: number;
  trend: number[];
}

export interface DocumentFeed {
  id: string;
  title: string;
  source: string;
  published_date: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentiment_score: number;
  url?: string;
}

export interface PriceKPI {
  commodity: string;
  price: number;
  currency: string;
  unit: string;
  change_pct: number;
  change_direction: 'up' | 'down' | 'flat';
}

export interface OHLCDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface PriceTimeSeries {
  commodity: string;
  region: string;
  data: OHLCDataPoint[];
  source: string;
}

export interface RegionalPrice {
  region: string;
  region_name: string;
  price: number;
  change_pct: number;
  currency: string;
}

export interface ForwardPoint {
  tenor: string;
  price: number;
  change_from_spot: number;
}

export interface ForwardCurve {
  commodity: string;
  region: string;
  curve_shape: 'contango' | 'backwardation' | 'flat';
  points: ForwardPoint[];
  as_of_date: string;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
}

export interface PolicyKPI {
  label: string;
  value: number;
  subtitle: string;
}

export interface PolicyTimelineEvent {
  jurisdiction: string;
  date: string;
  event_type: string;
  title: string;
  policy_id?: string;
}

export interface PolicyKanbanItem {
  id: string;
  title: string;
  jurisdiction: string;
  policy_type: string;
  status: string;
  summary?: string;
}

export interface MandateScenario {
  name: string;
  mandate_level: string;
  revenue_impact: number;
}

export interface CarbonCalculatorInput {
  project_type: string;
  annual_output_tonnes: number;
  emission_factor: number;
  baseline_year: number;
  carbon_price: number;
}

export interface CarbonCalculatorResult {
  accu_credits: number;
  accu_revenue: number;
  safeguard_benefit: number;
  total_annual_revenue: number;
  sensitivity_low: number;
  sensitivity_high: number;
}

export interface OfftakeAgreement {
  offtaker: string;
  mandate: string;
  volume: string;
  term: string;
  premium: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${INTELLIGENCE_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Sentiment API
export const sentimentApi = {
  getIndex: () => fetchApi<SentimentIndex>('/api/v1/sentiment/index'),
  getTrend: (period: string = '12m') =>
    fetchApi<SentimentTrend[]>(`/api/v1/sentiment/trend?period=${period}`),
  getLenders: (limit: number = 10) =>
    fetchApi<LenderScore[]>(`/api/v1/sentiment/lenders?limit=${limit}`),
  getDocumentFeed: (limit: number = 20, sentiment?: string) => {
    let url = `/api/v1/sentiment/documents/feed?limit=${limit}`;
    if (sentiment) url += `&sentiment=${sentiment}`;
    return fetchApi<DocumentFeed[]>(url);
  },
  getFearComponentHistory: (lookbackDays: number = 90) =>
    fetchApi<Record<string, { date: string; value: number }[]>>(
      `/api/v1/sentiment/fear-components/history?lookback_days=${lookbackDays}`
    ),
};

// Prices API
export const pricesApi = {
  getKPIs: () => fetchApi<PriceKPI[]>('/api/v1/prices/kpis'),
  getOHLC: (commodity: string, region: string = 'AUS', period: string = '1Y') =>
    fetchApi<PriceTimeSeries>(`/api/v1/prices/ohlc/${commodity}?region=${region}&period=${period}`),
  getHeatmap: (commodity: string) =>
    fetchApi<{ commodity: string; regions: RegionalPrice[] }>(`/api/v1/prices/heatmap/${commodity}`),
  getForwardCurve: (commodity: string, region: string = 'AUS') =>
    fetchApi<ForwardCurve>(`/api/v1/prices/forward/${commodity}?region=${region}`),
  getTechnicals: (commodity: string) =>
    fetchApi<TechnicalIndicator[]>(`/api/v1/prices/technicals/${commodity}`),
  getCommodities: () => fetchApi<{
    commodities: { id: string; name: string; unit: string }[];
    regions: { id: string; name: string }[];
  }>('/api/v1/prices/commodities'),
};

// Policy API
export const policyApi = {
  getKPIs: () => fetchApi<PolicyKPI[]>('/api/v1/policy/kpis'),
  getTimeline: (year: number = 2025) =>
    fetchApi<PolicyTimelineEvent[]>(`/api/v1/policy/timeline?year=${year}`),
  getKanban: () => fetchApi<{
    proposed: PolicyKanbanItem[];
    review: PolicyKanbanItem[];
    enacted: PolicyKanbanItem[];
  }>('/api/v1/policy/kanban'),
  getMandateScenarios: () => fetchApi<MandateScenario[]>('/api/v1/policy/mandate-scenarios'),
  getOfftakeMarket: () => fetchApi<OfftakeAgreement[]>('/api/v1/policy/offtake-market'),
  getACCUPrice: () => fetchApi<{
    price: number;
    currency: string;
    unit: string;
    change: number;
    change_pct: number;
    source: string;
    as_of_date: string;
  }>('/api/v1/policy/accu-price'),
  calculateCarbon: (input: CarbonCalculatorInput) =>
    fetchApi<CarbonCalculatorResult>('/api/v1/policy/carbon-calculator', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  getConsultations: () => fetchApi<{
    id: string;
    title: string;
    jurisdiction: string;
    opens: string;
    closes: string;
    days_remaining: number;
    relevance: string;
    submission_url?: string;
  }[]>('/api/v1/policy/consultations'),
};
