'use client';

import Image from 'next/image';
import { View, Button, Tabs } from 'reshaped';
import { Icon } from '@/components/icon';
import { MetricCard } from '@/components/metric-card';
import { PageTitle } from '@/components/page-title';
import { CampaignsTable } from './campaigns-table';
import { TABS } from './constants';
import { useCampaignsData } from './hooks';
import { CampaignsSkeleton } from './skeleton';
import styles from './styles.module.scss';

export const Campaigns = () => {
  const { data, isLoading } = useCampaignsData();

  if (isLoading || !data) {
    return <CampaignsSkeleton />;
  }

  const { metrics, campaigns, totalPages, currentPage, totalItems } = data;

  return (
    <View gap={6} className={styles.campaigns}>
      <View gap={1}>
        <PageTitle
          icon={
            <Image
              src="/icon-meta.png"
              alt="Meta"
              width={24}
              height={16}
              priority
              quality={80}
            />
          }
          title="Campanhas da Meta"
          description=" Gestão de campanhas do Instagram, Facebook e outras ferramentas da Meta"
        />
      </View>

      <View
        direction="row"
        align="center"
        justify="space-between"
        className={styles.header}
      >
        <View gap={3}>
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

        <Button
          variant="outline"
          icon={<Icon name="chart-bar" size={18} />}
          endIcon={<Icon name="chevron-down" size={16} />}
        >
          Editar gráficos
        </Button>
      </View>

      <div className={styles.metricsGrid}>
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
      </div>

      {/* Filter Bar */}
      <View className={styles.filterBar}>
        <div className={styles.filterBarLeft}>
          <Button variant="outline" icon={<Icon name="calendar" size={18} />}>
            01 Dez, 2025 - 31 Dez, 2025
          </Button>
          <Button
            variant="outline"
            icon={<Icon name="adjustments-horizontal" size={18} />}
          >
            Filtros
          </Button>
        </div>

        <Button
          variant="outline"
          icon={<Icon name="table" size={18} />}
          endIcon={<Icon name="chevron-down" size={16} />}
        >
          Editar tabela
        </Button>
      </View>

      {/* Table */}
      <CampaignsTable
        data={campaigns}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={10}
      />
    </View>
  );
};
