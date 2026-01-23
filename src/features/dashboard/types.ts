import { IconProps } from '@/components/icon';

export interface MetricCardProps {
  title: string;
  value: string;
  previousValue?: string;
  percentageChange?: number;
  icon?: IconProps['name'];
}

export interface ChartDataPoint {
  name: string;
  investment?: number;
  revenue?: number;
  capture?: number;
  sale?: number;
}

export interface DashboardChartProps {
  title: string;
  subtitle?: string;
  percentageChange?: number;
  data: ChartDataPoint[];
  type: 'investment-revenue' | 'capture-sale';
}

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  title: string;
  stages: FunnelStage[];
  previousStages?: FunnelStage[];
  periodLabel?: string;
  previousPeriodLabel?: string;
}

export interface AdItem {
  id: string;
  name: string;
  imageUrl?: string;
  clicks: number;
  percentage: number;
}

export interface AdListProps {
  title: string;
  ads: AdItem[];
}

export interface SummaryMetric {
  title: string;
  value: string;
  previousValue: string;
  percentageChange: number;
  icon: IconProps['name'];
}

export interface DashboardData {
  summaryMetrics: SummaryMetric[];
  investmentRevenueData: ChartDataPoint[];
  funnelStages: FunnelStage[];
  funnelStagesPrevious: FunnelStage[];
  metaAds: AdItem[];
  googleAds: AdItem[];
}
