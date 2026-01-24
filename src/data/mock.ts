// ============================================================================
// MOCK DATA - Simula resposta da API
// ============================================================================

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
    value: 125847,
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
    { name: 'Cliques', value: 41000 },
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
