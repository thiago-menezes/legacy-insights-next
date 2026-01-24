import { IconProps } from '@/components/icon';

export type CampaignStatus = 'active' | 'finished' | 'disabled';

export type CampaignTab = 'campaigns' | 'adsets' | 'ads';

export interface CampaignMetric {
  title: string;
  value: string;
  previousValue: string;
  percentageChange: number;
  icon?: IconProps['name'];
}

export interface CampaignRow {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  clicks: number;
  clicksPrevious: number;
  clicksChange: number;
  cpc: number;
  cpcPrevious: number;
  cpcChange: number;
  ctr: number;
  ctrPrevious: number;
  ctrChange: number;
  conversionRate: number;
  conversionRatePrevious: number;
  conversionRateChange: number;
}

export interface CampaignsData {
  metrics: CampaignMetric[];
  campaigns: CampaignRow[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface CampaignsFilters {
  startDate?: Date;
  endDate?: Date;
  status?: CampaignStatus[];
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CampaignMetricCardProps {
  title: string;
  value: string;
  previousValue?: string;
  percentageChange?: number;
  icon?: IconProps['name'];
}

export interface CampaignsTableProps {
  data: CampaignRow[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
}

export interface StatusBadgeProps {
  status: CampaignStatus;
}
