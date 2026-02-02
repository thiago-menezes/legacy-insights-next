export interface ProductEventsProps {
  productId: string;
}

export interface WebhookEventRowProps {
  id: string;
  source: 'hotmart' | 'kiwify' | 'kirvano' | 'custom';
  eventType: string;
  amount?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  processedAt: string;
  integrationName?: string;
}
