import { DashboardData } from './types';

export const MOCK_DASHBOARD_DATA: DashboardData = {
  summaryMetrics: [
    {
      title: 'Investimento Total',
      value: 'R$ 12.450,00',
      previousValue: 'R$ 10.200,00',
      percentageChange: 22,
      icon: 'cash',
    },
    {
      title: 'Receita Total',
      value: 'R$ 48.920,00',
      previousValue: 'R$ 42.150,00',
      percentageChange: 16,
      icon: 'currency-dollar',
    },
    {
      title: 'ROAS Médio',
      value: '3.92x',
      previousValue: '4.13x',
      percentageChange: -5.1,
      icon: 'chart-arrows-vertical',
    },
    {
      title: 'Custo por Lead',
      value: 'R$ 8,45',
      previousValue: 'R$ 9,12',
      percentageChange: 7.3,
      icon: 'users',
    },
  ],
  investmentRevenueData: [
    { name: 'Jan', investment: 4000, revenue: 12000 },
    { name: 'Fev', investment: 3000, revenue: 9000 },
    { name: 'Mar', investment: 2000, revenue: 11000 },
    { name: 'Abr', investment: 2780, revenue: 8000 },
    { name: 'Mai', investment: 1890, revenue: 7500 },
    { name: 'Jun', investment: 2390, revenue: 10500 },
    { name: 'Jul', investment: 3490, revenue: 13000 },
    { name: 'Ago', investment: 4000, revenue: 15000 },
    { name: 'Set', investment: 3800, revenue: 14200 },
    { name: 'Out', investment: 4200, revenue: 16500 },
    { name: 'Nov', investment: 5000, revenue: 18000 },
    { name: 'Dez', investment: 6000, revenue: 22000 },
  ],
  funnelStages: [
    { name: 'Impressões', value: 7000 },
    { name: 'Cliques', value: 2600 },
    { name: 'Leads', value: 4200 },
    { name: 'Vendas', value: 1459 },
  ],
  funnelStagesPrevious: [
    { name: 'Impressões', value: 11000 },
    { name: 'Cliques', value: 7800 },
    { name: 'Leads', value: 1050 },
    { name: 'Vendas', value: 1201 },
  ],
  metaAds: [
    {
      id: '1',
      name: 'Black Friday 2025 - Carrossel',
      clicks: 4500,
      percentage: 45,
    },
    {
      id: '2',
      name: 'Remarketing - Estático',
      clicks: 2800,
      percentage: 28,
    },
    {
      id: '3',
      name: 'Prospecção - Vídeo',
      clicks: 2700,
      percentage: 27,
    },
  ],
  googleAds: [
    {
      id: '1',
      name: 'Rede de Pesquisa - Institucional',
      clicks: 3200,
      percentage: 40,
    },
    {
      id: '2',
      name: 'Performance Max - Vendas',
      clicks: 2800,
      percentage: 35,
    },
    {
      id: '3',
      name: 'Youtube - Awareness',
      clicks: 2000,
      percentage: 25,
    },
  ],
};
