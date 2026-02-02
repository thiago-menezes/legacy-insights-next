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
    documentId: string;
    name: string;
  };
  product?: {
    id: number;
    documentId: string;
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

export interface WebhookEventsProps {
  integrationId: string;
}

export interface EventDetailProps {
  event: WebhookEvent | null;
  isOpen: boolean;
  onClose: () => void;
}
