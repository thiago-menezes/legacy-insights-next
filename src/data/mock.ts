// ============================================================================
// MOCK DATA - Simula resposta da API
// ============================================================================
import {
  CampaignMetric,
  CampaignRow,
  CampaignsData,
  CampaignsFilters,
} from '@/features/campaigns/types';
import {
  AdItem,
  ChartDataPoint,
  FunnelStage,
  SummaryMetric,
  DashboardData,
} from '@/features/dashboard/types';

export const summaryMetrics: SummaryMetric[] = [
  {
    title: 'Valor investido',
    value: 'R$ 45.231,89',
    previousValue: 'R$ 42.100,00',
    percentageChange: 7.4,
    icon: 'wallet',
  },
  {
    title: 'Receita',
    value: 'R$ 152.847,50',
    previousValue: 'R$ 138.500,00',
    percentageChange: 10.4,
    icon: 'chart-line',
  },
  {
    title: 'Custo por aquisição',
    value: 'R$ 12,40',
    previousValue: 'R$ 11,50',
    percentageChange: 13.3,
    icon: 'users',
  },
  {
    title: 'ROAS',
    value: '2,92',
    previousValue: '2,85',
    percentageChange: 2.5,
    icon: 'shopping-cart',
  },
];

export const investmentRevenueData: ChartDataPoint[] = [
  { name: 'Jan', investment: 12000, revenue: 35000 },
  { name: 'Fev', investment: 15000, revenue: 42000 },
  { name: 'Mar', investment: 18000, revenue: 48000 },
  { name: 'Abr', investment: 14000, revenue: 38000 },
  { name: 'Mai', investment: 22000, revenue: 58000 },
  { name: 'Jun', investment: 25000, revenue: 72000 },
  { name: 'Jul', investment: 28000, revenue: 85000 },
  { name: 'Ago', investment: 32000, revenue: 95000 },
  { name: 'Set', investment: 35000, revenue: 110000 },
  { name: 'Out', investment: 38000, revenue: 125000 },
  { name: 'Nov', investment: 42000, revenue: 140000 },
  { name: 'Dez', investment: 45000, revenue: 152000 },
];

export const captureSaleData: ChartDataPoint[] = [
  { name: 'Jan', capture: 180, sale: 45 },
  { name: 'Fev', capture: 220, sale: 58 },
  { name: 'Mar', capture: 280, sale: 72 },
  { name: 'Abr', capture: 240, sale: 62 },
  { name: 'Mai', capture: 320, sale: 85 },
  { name: 'Jun', capture: 380, sale: 98 },
  { name: 'Jul', capture: 420, sale: 112 },
  { name: 'Ago', capture: 480, sale: 128 },
  { name: 'Set', capture: 520, sale: 142 },
  { name: 'Out', capture: 580, sale: 158 },
  { name: 'Nov', capture: 640, sale: 175 },
  { name: 'Dez', capture: 700, sale: 192 },
];

export const funnelStages: FunnelStage[] = [
  {
    name: 'Impressões',
    value: 50002,
  },
  { name: 'Cliques', value: 45231 },
  { name: 'Leads', value: 2847 },
  { name: 'Oportunidades', value: 1284 },
  { name: 'Vendas', value: 584 },
];

export const metaAds: AdItem[] = [
  { id: '1', name: 'Campanha Black Friday', clicks: 12458, percentage: 24.5 },
  { id: '2', name: 'Remarketing Carrinho', clicks: 8932, percentage: 18.2 },
  { id: '3', name: 'Lookalike Compradores', clicks: 7654, percentage: 15.8 },
  { id: '4', name: 'Interesse Fitness', clicks: 5421, percentage: 12.3 },
];

export const googleAds: AdItem[] = [
  { id: '1', name: 'Busca - Marca', clicks: 9847, percentage: 22.1 },
  { id: '2', name: 'Display - Remarketing', clicks: 6543, percentage: 16.4 },
  { id: '3', name: 'Shopping - Produtos', clicks: 5432, percentage: 14.2 },
  { id: '4', name: 'YouTube - Awareness', clicks: 4321, percentage: 11.8 },
];

// ============================================================================
// AGREGADOR - Simula fetch completo da API
// ============================================================================

export const dashboardMockData: DashboardData = {
  summaryMetrics,
  investmentRevenueData,
  funnelStages,
  funnelStagesPrevious: [
    {
      name: 'Impressões',
      value: 115000,
    },
    { name: 'Cliques', value: 2300 },
    { name: 'Leads', value: 2500 },
    { name: 'Oportunidades', value: 1100 },
    { name: 'Vendas', value: 480 },
  ],
  metaAds,
  googleAds,
};

// ============================================================================
// HELPER - Simula delay de API (para testes de loading)
// ============================================================================

export const fetchDashboardData = (_filters?: {
  startDate?: Date;
  endDate?: Date;
  context?: string;
}): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dashboardMockData);
    }, 500);
  });
};

// ============================================================================
// CAMPAIGNS MOCK DATA - Simula resposta da API de Campanhas
// ============================================================================

export const campaignMetrics: CampaignMetric[] = [
  {
    title: 'Valor investido',
    value: 'R$2.533.932,95',
    previousValue: 'R$2.498.823,92',
    percentageChange: 1.6,
    icon: 'wallet',
  },
  {
    title: 'Leads',
    value: '65.857',
    previousValue: '59.893',
    percentageChange: 12.42,
    icon: 'users',
  },
  {
    title: 'Custo por aquisição',
    value: 'R$2,62',
    previousValue: 'R$2,02',
    percentageChange: -9.7,
    icon: 'receipt',
  },
  {
    title: 'Conversão em venda',
    value: '15,42%',
    previousValue: '13,21%',
    percentageChange: 2.21,
    icon: 'percentage',
  },
];

export const campaignRows: CampaignRow[] = [
  {
    id: '1',
    name: 'Unama_Prematricula_2026',
    status: 'active',
    budget: 21250.0,
    clicks: 9282,
    clicksPrevious: 14534,
    clicksChange: -49.96,
    cpc: 1.54,
    cpcPrevious: 0.55,
    cpcChange: -49.96,
    ctr: 1.54,
    ctrPrevious: 0.55,
    ctrChange: -49.96,
    conversionRate: 1.54,
    conversionRatePrevious: 0.55,
    conversionRateChange: -49.96,
  },
  {
    id: '2',
    name: 'Unama_Camapanha_S1_2026',
    status: 'active',
    budget: 12976.54,
    clicks: 7654,
    clicksPrevious: 7023,
    clicksChange: 2.96,
    cpc: 1.34,
    cpcPrevious: 1.48,
    cpcChange: 2.96,
    ctr: 1.54,
    ctrPrevious: 0.55,
    ctrChange: -49.96,
    conversionRate: 1.54,
    conversionRatePrevious: 0.55,
    conversionRateChange: -49.96,
  },
  {
    id: '3',
    name: 'Unama_Campanha S2_2025',
    status: 'finished',
    budget: 10345.34,
    clicks: 2032,
    clicksPrevious: 1042,
    clicksChange: 83.96,
    cpc: 0.98,
    cpcPrevious: 1.45,
    cpcChange: 22.96,
    ctr: 1.54,
    ctrPrevious: 0.55,
    ctrChange: -49.96,
    conversionRate: 1.54,
    conversionRatePrevious: 0.55,
    conversionRateChange: -49.96,
  },
  {
    id: '4',
    name: 'Unama_Campanha S1_2025',
    status: 'finished',
    budget: 12323.65,
    clicks: 11432,
    clicksPrevious: 10232,
    clicksChange: 2.96,
    cpc: 0.85,
    cpcPrevious: 0.78,
    cpcChange: -4.32,
    ctr: 1.54,
    ctrPrevious: 0.55,
    ctrChange: -49.96,
    conversionRate: 1.54,
    conversionRatePrevious: 0.55,
    conversionRateChange: -49.96,
  },
  {
    id: '5',
    name: 'Campanha_Vestibular_2025',
    status: 'disabled',
    budget: 22349.5,
    clicks: 21242,
    clicksPrevious: 20534,
    clicksChange: 5.56,
    cpc: 1.04,
    cpcPrevious: 0.98,
    cpcChange: 1.5,
    ctr: 1.54,
    ctrPrevious: 0.55,
    ctrChange: -49.96,
    conversionRate: 1.54,
    conversionRatePrevious: 0.55,
    conversionRateChange: -49.96,
  },
  {
    id: '6',
    name: 'Unama_Retargeting_2026',
    status: 'active',
    budget: 8500.0,
    clicks: 5432,
    clicksPrevious: 1000,
    clicksChange: 11.08,
    cpc: 1.12,
    cpcPrevious: 1.05,
    cpcChange: 6.67,
    ctr: 2.1,
    ctrPrevious: 1.85,
    ctrChange: 13.51,
    conversionRate: 3.2,
    conversionRatePrevious: 2.9,
    conversionRateChange: 10.34,
  },
  {
    id: '7',
    name: 'Unama_Lookalike_2026',
    status: 'active',
    budget: 15750.0,
    clicks: 8921,
    clicksPrevious: 7650,
    clicksChange: 16.61,
    cpc: 0.95,
    cpcPrevious: 1.02,
    cpcChange: -6.86,
    ctr: 1.8,
    ctrPrevious: 1.65,
    ctrChange: 9.09,
    conversionRate: 2.5,
    conversionRatePrevious: 2.1,
    conversionRateChange: 19.05,
  },
];

export const campaignsMockData: CampaignsData = {
  metrics: campaignMetrics,
  campaigns: campaignRows,
  totalPages: 7,
  currentPage: 1,
  totalItems: 65,
};

export const fetchCampaignsData = (
  _filters?: CampaignsFilters,
): Promise<CampaignsData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(campaignsMockData);
    }, 500);
  });
};
