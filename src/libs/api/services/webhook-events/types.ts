export interface WebhookEvent {
  documentId: string;
  id: number;
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
  product?: {
    documentId: string;
    id: number;
    name: string;
  };
}

export interface WebhookEventsResponse {
  data: WebhookEvent[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface WebhookEventsParams {
  page?: number;
  pageSize?: number;
  eventType?: string;
}
