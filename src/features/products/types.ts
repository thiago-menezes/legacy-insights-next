export type ProductPlatform = 'hotmart' | 'kiwify' | 'kirvano' | 'other';

export interface ProductFilters {
  search?: string;
  platform?: ProductPlatform;
  active?: boolean;
  projectId?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductFormData {
  name: string;
  externalId?: string;
  platform: ProductPlatform;
  price?: number;
  currency?: string;
  active?: boolean;
  projectId: string;
}

export interface ProductListItemProps {
  id: string;
  name: string;
  platform: ProductPlatform;
  price?: number;
  currency: string;
  active: boolean;
  projectName?: string;
  salesCount?: number;
  totalRevenue?: number;
  lastSaleAt?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface ProductEventsListProps {
  productId: string;
}

export interface WebhookEventItemProps {
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
