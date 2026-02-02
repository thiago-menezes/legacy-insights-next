'use client';

import { Button, Grid, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { MetricCard } from '@/components/metric-card';
import { PageTitle } from '@/components/page-title';
import { useDataAccessStatus } from '@/hooks';
import { DashboardChart } from './dashboard-chart';
import { DashboardEmptyState } from './empty-states';
import { FunnelChart } from './funnel-chart';
import { useDashboardData } from './hooks';
import { DashboardSkeleton } from './skeleton';
import styles from './styles.module.scss';

export const Dashboard = () => {
  const { data, isLoading: isLoadingData } = useDashboardData();

  const {
    state: accessState,
    isLoading: isLoadingAccess,
    integrationsPageUrl,
    projectsPageUrl,
  } = useDataAccessStatus({
    integrationType: 'meta_ads',
    hasData: !!data,
  });

  const isLoading = isLoadingData || isLoadingAccess;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (accessState === 'no-project') {
    return (
      <DashboardEmptyState
        state="no-project"
        projectsPageUrl={projectsPageUrl}
        integrationsPageUrl={integrationsPageUrl}
      />
    );
  }

  if (accessState === 'no-integration') {
    return (
      <DashboardEmptyState
        state="no-integration"
        projectsPageUrl={projectsPageUrl}
        integrationsPageUrl={integrationsPageUrl}
      />
    );
  }

  if (!data) {
    return (
      <DashboardEmptyState
        state="no-data"
        projectsPageUrl={projectsPageUrl}
        integrationsPageUrl={integrationsPageUrl}
      />
    );
  }

  const {
    summaryMetrics,
    investmentRevenueData,
    funnelStages,
    funnelStagesPrevious,
  } = data;

  return (
    <View gap={6} className={styles.dashboard}>
      <PageTitle
        title="Dashboard"
        description="Gestão de campanhas do Instagram, Facebook e Google Ads"
      />

      <View direction="row" gap={4} justify="space-between">
        <View direction="row" gap={4}>
          <Button variant="outline" icon={<Icon name="calendar" />}>
            01 Dez, 2025 - 31 Dez, 2025
          </Button>
          <Button
            variant="outline"
            icon={<Icon name="adjustments-horizontal" />}
          >
            Filtros
          </Button>
        </View>

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

      {/* TODO: add platform section after creating details page */}
      {/* <View gap={4}>
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
      </View> */}
    </View>
  );
};
