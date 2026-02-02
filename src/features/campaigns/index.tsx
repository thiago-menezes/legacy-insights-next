'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button, Grid, Tabs, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { MetricCard } from '@/components/metric-card';
import { useDataAccessStatus } from '@/hooks';
import { AdvancedFilters } from './advanced-filters';
import { CampaignSearch } from './campaign-search';
import { TABS } from './constants';
import { DateRangeFilter } from './date-range-filter';
import { CampaignsEmptyState } from './empty-states';
import { FilterBadges } from './filter-badges';
import { CampaignsHeader } from './header';
import { useCampaignsData } from './hooks';
import { CampaignsSkeleton } from './skeleton';
import styles from './styles.module.scss';
import { CampaignsTable } from './table';
import { UseParamsCampaigns } from './types';

export const Campaigns = () => {
  const { client: platformParam } = useParams<UseParamsCampaigns>();
  const searchParams = useSearchParams();
  const integrationId = searchParams.get('integrationId');
  const [dateRange, setDateRange] = useState(90);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const {
    data,
    isLoading: isLoadingData,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleDateRangeChange,
    handleAdvancedFiltersChange,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useCampaignsData(platformParam, integrationId || undefined);

  const integrationType =
    platformParam === 'google' ? 'google_ads' : 'meta_ads';

  const {
    state: accessState,
    isLoading: isLoadingAccess,
    integrationsPageUrl,
    projectsPageUrl,
  } = useDataAccessStatus({
    integrationType,
    hasData: !!data && data.campaigns.length > 0,
  });

  const isLoading = isLoadingData || isLoadingAccess;

  if (!platformParam) return <></>;

  if (isLoading) {
    return <CampaignsSkeleton />;
  }

  if (accessState === 'no-project') {
    return (
      <CampaignsEmptyState
        state="no-project"
        platform={platformParam}
        projectsPageUrl={projectsPageUrl}
        integrationsPageUrl={integrationsPageUrl}
      />
    );
  }

  if (accessState === 'no-integration') {
    return (
      <CampaignsEmptyState
        state="no-integration"
        platform={platformParam}
        projectsPageUrl={projectsPageUrl}
        integrationsPageUrl={integrationsPageUrl}
      />
    );
  }

  const hasData = data && data.campaigns.length > 0;
  const { metrics, campaigns, totalPages, currentPage, totalItems } = data || {
    metrics: [],
    campaigns: [],
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
  };

  return (
    <View gap={4} className={styles.campaigns}>
      <CampaignsHeader />

      <View
        direction="row"
        align="center"
        justify="space-between"
        className={styles.header}
      >
        <View direction="row" gap={4} align="center">
          <Tabs variant="pills-elevated" defaultValue="campaigns">
            <Tabs.List>
              {TABS.map((tab) => (
                <Tabs.Item key={tab.id} value={tab.id}>
                  {tab.label}
                </Tabs.Item>
              ))}
            </Tabs.List>
          </Tabs>
        </View>
      </View>

      {hasData && (
        <Grid gap={4} columns={{ s: 1, m: 2, xl: 4 }}>
          {metrics.map((metric) => (
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
      )}

      <View className={styles.filterBar}>
        <div className={styles.filterBarLeft}>
          <CampaignSearch
            value={filters.search || ''}
            onChange={handleSearchChange}
          />

          <DateRangeFilter
            value={dateRange}
            onChange={(days) => {
              setDateRange(days);
              handleDateRangeChange(days);
            }}
          />

          <Button
            variant="outline"
            icon={<Icon name="adjustments-horizontal" size={18} />}
            onClick={() => setIsFiltersModalOpen(true)}
          >
            Filtros
          </Button>
        </div>
      </View>

      <FilterBadges
        filters={filters}
        onClearAll={handleClearAllFilters}
        onRemoveFilter={handleRemoveFilter}
      />

      {!hasData ? (
        <CampaignsEmptyState
          state="no-data"
          platform={platformParam}
          projectsPageUrl={projectsPageUrl}
          integrationsPageUrl={integrationsPageUrl}
        />
      ) : (
        <CampaignsTable
          data={campaigns}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={filters.pageSize || 10}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          platform={platformParam}
        />
      )}

      <AdvancedFilters
        key={isFiltersModalOpen ? 'open' : 'closed'}
        active={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={handleAdvancedFiltersChange}
        currentFilters={{
          status: filters.status,
          showOnlyActive: filters.showOnlyActive,
        }}
      />
    </View>
  );
};
