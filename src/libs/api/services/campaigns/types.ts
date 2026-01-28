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
  page?: number;
  pageSize?: number;
}
