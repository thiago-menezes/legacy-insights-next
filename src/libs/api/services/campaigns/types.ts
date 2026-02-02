export interface DailyMetric {
  id: number;
  date: string;
  impressions: string | number;
  reach: string | number;
  clicks: string | number;
  spend: number;
  conversions: number;
  leads: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  conversionRate: number;
  costPerConversion: number;
  costPerLead: number;
}

export interface StrapiCampaign {
  id: number;
  documentId: string;
  externalId: string;
  name: string;
  status: 'active' | 'paused' | 'archived' | 'removed' | 'deleted';
  objective?: string;
  platform: 'meta' | 'google';
  dailyBudget?: number;
  lifetimeBudget?: number;
  startDate?: string;
  endDate?: string;
  dailyMetrics?: DailyMetric[];
}

export interface StrapiCampaignListResponse {
  data: StrapiCampaign[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CampaignListParams {
  platform?: 'meta' | 'google';
  integrationId?: string | number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  showOnlyActive?: boolean;
  status?: ('active' | 'paused' | 'archived' | 'removed' | 'deleted')[];
  page?: number;
  pageSize?: number;
}

export interface MatchedWebhookEvent {
  id: number;
  documentId: string;
  source: 'hotmart' | 'kiwify' | 'kirvano' | 'custom';
  eventType: string;
  amount?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  processedAt: string;
  product?: {
    id: number;
    name: string;
  } | null;
}

export interface CampaignAttribution {
  campaignId: number;
  campaignName: string;
  campaignDocumentId: string;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  salesCount: number;
  matchedEvents: MatchedWebhookEvent[];
}

export interface CampaignAttributionResponse {
  data: CampaignAttribution;
}
