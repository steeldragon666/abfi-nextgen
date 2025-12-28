/**
 * ABFI Stealth Discovery API Client
 * Connects to the stealth-discovery service for entity signals and scoring.
 *
 * This module provides both:
 * - Legacy REST API client (stealthApi)
 * - tRPC hooks via the main trpc client (recommended)
 *
 * Use tRPC hooks when possible:
 *   const { data } = trpc.stealth.getDashboardStats.useQuery();
 */

import { apiConfig } from "@/config/env";

// API base URL - will need to be configured for deployment
const STEALTH_API_URL = import.meta.env.DEV
  ? '/api/stealth'  // Proxy in development
  : apiConfig.stealthUrl;

// Types
export interface EntitySummary {
  id: string;
  entity_type: string;
  canonical_name: string;
  current_score: number;
  signal_count: number;
  last_signal_at: string | null;
}

export interface EntityDetail extends EntitySummary {
  all_names: string[] | null;
  identifiers: Record<string, string[]> | null;
  metadata: Record<string, unknown> | null;
  needs_review: boolean;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  entity_id: string;
  signal_type: string;
  signal_weight: number;
  confidence: number;
  source: string;
  title: string | null;
  description: string | null;
  detected_at: string;
}

export interface DashboardStats {
  total_entities: number;
  high_score_entities: number;
  new_signals_today: number;
  new_signals_week: number;
  top_signal_types: { type: string; count: number }[];
}

export interface SignalType {
  type: string;
  weight: number;
  category: 'high' | 'medium' | 'low';
}

// Signal type metadata for display
export const SIGNAL_TYPE_INFO: Record<string, { label: string; color: string; icon: string }> = {
  patent_biofuel_tech: { label: 'Biofuel Patent', color: 'emerald', icon: 'FileCheck' },
  permit_fuel_production: { label: 'Fuel Production Permit', color: 'blue', icon: 'Factory' },
  grant_awarded: { label: 'Grant Awarded', color: 'amber', icon: 'Award' },
  environmental_approval: { label: 'Environmental Approval', color: 'green', icon: 'Leaf' },
  new_company_biofuel: { label: 'New Biofuel Company', color: 'purple', icon: 'Building2' },
  permit_industrial: { label: 'Industrial Permit', color: 'cyan', icon: 'HardHat' },
  patent_related_tech: { label: 'Related Patent', color: 'teal', icon: 'FileText' },
  company_industry_code: { label: 'Industry Code Match', color: 'orange', icon: 'Tag' },
  company_name_match: { label: 'Name Match', color: 'gray', icon: 'Search' },
  location_cluster: { label: 'Location Cluster', color: 'pink', icon: 'MapPin' },
  keyword_match: { label: 'Keyword Match', color: 'slate', icon: 'Hash' },
};

// API fetch helper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${STEALTH_API_URL}${endpoint}`;
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

// Stealth Discovery API
export const stealthApi = {
  // Dashboard
  getDashboardStats: () => fetchApi<DashboardStats>('/api/v1/dashboard/stats'),

  // Entities
  listEntities: (params?: {
    entity_type?: string;
    min_score?: number;
    max_score?: number;
    needs_review?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.entity_type) searchParams.set('entity_type', params.entity_type);
    if (params?.min_score !== undefined) searchParams.set('min_score', String(params.min_score));
    if (params?.max_score !== undefined) searchParams.set('max_score', String(params.max_score));
    if (params?.needs_review !== undefined) searchParams.set('needs_review', String(params.needs_review));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    return fetchApi<EntitySummary[]>(`/api/v1/entities?${searchParams}`);
  },

  getEntity: (id: string) => fetchApi<EntityDetail>(`/api/v1/entities/${id}`),

  searchEntities: (query: string, limit: number = 20) =>
    fetchApi<EntitySummary[]>(`/api/v1/entities/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  getEntitySignals: (entityId: string, limit: number = 50) =>
    fetchApi<Signal[]>(`/api/v1/entities/${entityId}/signals?limit=${limit}`),

  // Signals
  getRecentSignals: (params?: { signal_type?: string; days?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.signal_type) searchParams.set('signal_type', params.signal_type);
    if (params?.days) searchParams.set('days', String(params.days));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    return fetchApi<Signal[]>(`/api/v1/signals/recent?${searchParams}`);
  },

  getSignalTypes: () => fetchApi<SignalType[]>('/api/v1/signals/types'),

  // Admin
  triggerIngestion: (source?: string) =>
    fetchApi<{ success: boolean; message: string; stats?: Record<string, unknown> }>(
      '/api/v1/admin/ingest',
      {
        method: 'POST',
        body: JSON.stringify({ source }),
      }
    ),

  getIngestionStatus: () =>
    fetchApi<{
      is_running: boolean;
      jobs: { id: string; name: string; next_run: string | null }[];
      last_ingestion: Record<string, unknown> | null;
    }>('/api/v1/admin/ingestion/status'),
};

// Mock data for development/demo
export const mockStealthData = {
  dashboardStats: {
    total_entities: 247,
    high_score_entities: 42,
    new_signals_today: 12,
    new_signals_week: 67,
    top_signal_types: [
      { type: 'patent_biofuel_tech', count: 89 },
      { type: 'permit_fuel_production', count: 45 },
      { type: 'grant_awarded', count: 38 },
      { type: 'environmental_approval', count: 32 },
      { type: 'new_company_biofuel', count: 28 },
    ],
  } as DashboardStats,

  entities: [
    {
      id: '1',
      entity_type: 'company',
      canonical_name: 'Southern Oil Refining Pty Ltd',
      current_score: 87.5,
      signal_count: 12,
      last_signal_at: '2024-12-20T14:30:00Z',
    },
    {
      id: '2',
      entity_type: 'company',
      canonical_name: 'Jet Zero Australia Pty Ltd',
      current_score: 82.3,
      signal_count: 9,
      last_signal_at: '2024-12-19T10:15:00Z',
    },
    {
      id: '3',
      entity_type: 'company',
      canonical_name: 'BioEnergy Australia Holdings',
      current_score: 78.9,
      signal_count: 8,
      last_signal_at: '2024-12-18T16:45:00Z',
    },
    {
      id: '4',
      entity_type: 'company',
      canonical_name: 'Queensland Biofuels Corporation',
      current_score: 75.2,
      signal_count: 7,
      last_signal_at: '2024-12-17T09:20:00Z',
    },
    {
      id: '5',
      entity_type: 'company',
      canonical_name: 'Green Hydrogen Partners',
      current_score: 72.8,
      signal_count: 6,
      last_signal_at: '2024-12-16T11:30:00Z',
    },
    {
      id: '6',
      entity_type: 'company',
      canonical_name: 'Sustainable Aviation Fuels Ltd',
      current_score: 68.4,
      signal_count: 5,
      last_signal_at: '2024-12-15T08:00:00Z',
    },
    {
      id: '7',
      entity_type: 'company',
      canonical_name: 'Waste-to-Energy Solutions',
      current_score: 65.1,
      signal_count: 5,
      last_signal_at: '2024-12-14T13:45:00Z',
    },
    {
      id: '8',
      entity_type: 'company',
      canonical_name: 'Biogas Energy Systems',
      current_score: 61.7,
      signal_count: 4,
      last_signal_at: '2024-12-13T15:20:00Z',
    },
  ] as EntitySummary[],

  recentSignals: [
    {
      id: 's1',
      entity_id: '1',
      signal_type: 'patent_biofuel_tech',
      signal_weight: 9,
      confidence: 0.95,
      source: 'ip_australia',
      title: 'Advanced Hydrotreated Vegetable Oil Process',
      description: 'Patent filed for novel HVO production method with improved yield',
      detected_at: '2024-12-20T14:30:00Z',
    },
    {
      id: 's2',
      entity_id: '2',
      signal_type: 'permit_fuel_production',
      signal_weight: 9,
      confidence: 0.92,
      source: 'nsw_planning',
      title: 'SSD-2024-1234 - SAF Refinery Development',
      description: 'State Significant Development approval for sustainable aviation fuel facility',
      detected_at: '2024-12-19T10:15:00Z',
    },
    {
      id: 's3',
      entity_id: '3',
      signal_type: 'grant_awarded',
      signal_weight: 8,
      confidence: 0.98,
      source: 'arena',
      title: 'ARENA Bioenergy Innovation Grant',
      description: '$15M funding for advanced biofuel demonstration plant',
      detected_at: '2024-12-18T16:45:00Z',
    },
    {
      id: 's4',
      entity_id: '4',
      signal_type: 'environmental_approval',
      signal_weight: 8,
      confidence: 0.88,
      source: 'qld_epa',
      title: 'EA-2024-5678 - Biodiesel Production Facility',
      description: 'Environmental authority granted for biodiesel manufacturing',
      detected_at: '2024-12-17T09:20:00Z',
    },
    {
      id: 's5',
      entity_id: '5',
      signal_type: 'new_company_biofuel',
      signal_weight: 7,
      confidence: 0.85,
      source: 'abn_lookup',
      title: 'New Company Registration - Green Hydrogen',
      description: 'Recently registered company in hydrogen production sector',
      detected_at: '2024-12-16T11:30:00Z',
    },
  ] as Signal[],
};
