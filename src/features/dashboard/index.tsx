'use client';

import { View, Text, Button, Grid } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { AdList } from './ad-list';
import { DashboardChart } from './dashboard-chart';
import { FunnelChart } from './funnel-chart';
import { useDashboardData } from './hooks';
import { MetricCard } from './metric-card';
import styles from './styles.module.scss';

export const Dashboard = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <View align="center" justify="center" padding={8}>
        <Text variant="body-2" color="neutral-faded">
          Carregando...
        </Text>
      </View>
    );
  }

  const {
    summaryMetrics,
    investmentRevenueData,
    funnelStages,
    funnelStagesPrevious,
    metaAds,
    googleAds,
  } = data;

  return (
    <View gap={6} className={styles.dashboard}>
      <PageTitle
        title="Dashboard"
        description="Gestão de campanhas do Instagram, Facebook e Google Ads"
      />

      <View direction="row" gap={4} className={styles.filterBar}>
        <Button variant="outline" icon={<Icon name="calendar" />}>
          01 Dez, 2025 - 31 Dez, 2025
        </Button>
        <Button variant="outline" icon={<Icon name="adjustments-horizontal" />}>
          Filtros
        </Button>
        <View grow />
        <Button variant="outline" endIcon={<Icon name="chevron-down" />}>
          Lançamentos
        </Button>
      </View>

      <Grid columnGap={4} rowGap={4} columns={{ s: 1, m: 2, xl: 4 }}>
        {summaryMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            previousValue={metric.previousValue}
            percentageChange={metric.percentageChange}
            icon={metric.icon}
          />
        ))}
      </Grid>

      <Grid columnGap={4} rowGap={4} columns={{ s: 1, l: 2 }}>
        <DashboardChart
          title="Investimento vs Receita"
          data={investmentRevenueData}
          subtitle="Visualização geral de Investimento vs Receita"
          type="investment-revenue"
        />

        <FunnelChart
          title="Funil de Vendas"
          stages={funnelStages}
          previousStages={funnelStagesPrevious}
          periodLabel="01 Dez, 2025 - 31 Dez, 2025"
          previousPeriodLabel="01 Nov, 2025 - 30 Nov, 2025"
        />
      </Grid>

      <View gap={4}>
        <Text variant="featured-2" weight="medium">
          Visão por Plataforma
        </Text>

        <View direction="row" gap={4} className={styles.platformSection}>
          <View grow>
            <AdList title="Meta - Anúncios em alta performance" ads={metaAds} />
          </View>
          <View grow>
            <AdList
              title="Google - Anúncios em alta performance"
              ads={googleAds}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export type {
  MetricCardProps,
  ChartDataPoint,
  DashboardChartProps,
  FunnelStage,
  FunnelChartProps,
  AdItem,
  AdListProps,
  SummaryMetric,
  DashboardData,
} from './types';
