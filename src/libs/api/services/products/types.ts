export interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  externalId?: string;
  platform: 'hotmart' | 'kiwify' | 'kirvano' | 'other';
  price?: number;
  currency: string;
  active: boolean;
  project?: {
    id: number;
    documentId: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StrapiProductListResponse {
  data: StrapiProduct[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ProductListParams {
  search?: string;
  platform?: 'hotmart' | 'kiwify' | 'kirvano' | 'other';
  active?: boolean;
  projectId?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateProductPayload {
  name: string;
  externalId?: string;
  platform: 'hotmart' | 'kiwify' | 'kirvano' | 'other';
  price?: number;
  currency?: string;
  active?: boolean;
  projectId: string;
}

export interface UpdateProductPayload {
  name?: string;
  externalId?: string;
  platform?: 'hotmart' | 'kiwify' | 'kirvano' | 'other';
  price?: number;
  currency?: string;
  active?: boolean;
}

export interface WebhookEvent {
  id: number;
  documentId: string;
  source: 'hotmart' | 'kiwify' | 'kirvano' | 'custom';
  eventType: string;
  externalId?: string;
  payload: Record<string, unknown>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  amount?: number;
  processedAt: string;
  createdAt: string;
  integration?: {
    id: number;
    name: string;
  };
}

export interface ProductEventsResponse {
  data: WebhookEvent[];
}
