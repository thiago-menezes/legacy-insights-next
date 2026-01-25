'use client';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import Link from 'next/link';
import { useMemo } from 'react';
import { View, Badge } from 'reshaped';
import { Icon } from '@/components/icon';
import { Table } from '@/components/table';
import { STATUS_CONFIG } from './constants';
import styles from './styles.module.scss';
import { CampaignRow, CampaignStatus, CampaignsTableProps } from './types';
import { formatCurrency, formatNumber } from './utils';

ModuleRegistry.registerModules([AllCommunityModule]);

const CellWithChange = ({
  value,
  previousValue,
  change,
  prefix = '',
  suffix = '',
}: {
  value: string | number;
  previousValue: string | number;
  change: number;
  prefix?: string;
  suffix?: string;
}) => {
  const isPositive = change >= 0;

  return (
    <div className={styles.cellWithChange}>
      <View gap={2} direction="row" align="center">
        <span className={styles.cellValue}>
          {prefix}
          {value}
          {suffix}
        </span>

        <Badge
          variant="faded"
          color={isPositive ? 'positive' : 'critical'}
          icon={
            <Icon
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={12}
            />
          }
          rounded
        >
          {isPositive ? '+' : ''} {change.toFixed(2).replace('.', ',')}%
        </Badge>
      </View>

      <span className={styles.cellPrevious}>
        {prefix}
        {previousValue}
        {suffix} período anterior
      </span>
    </div>
  );
};

export const CampaignsTable = ({ data }: CampaignsTableProps) => {
  const columnDefs = useMemo<ColDef<CampaignRow>[]>(
    () => [
      {
        headerName: 'Página',
        field: 'name',
        flex: 1,
        minWidth: 240,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => (
          <Link href="#" className={styles.campaignName}>
            {params.value}
          </Link>
        ),
      },
      {
        headerName: 'Veiculação',
        field: 'status',
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
          const config = STATUS_CONFIG[params.value as CampaignStatus];

          return (
            <View align="center" justify="center" height="100%">
              <Badge
                icon={<Icon name={config.icon} size={14} />}
                color={config.color}
                variant="faded"
                rounded
              >
                {config.label}
              </Badge>
            </View>
          );
        },
        sortable: false,
      },
      {
        headerName: 'Orçamento',
        field: 'budget',
        sortable: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => (
          <div className={styles.budgetCell}>
            <span>{formatCurrency(params.value as number)}</span>
            <Icon name="pencil" size={14} className={styles.editIcon} />
          </div>
        ),
      },
      {
        headerName: 'Cliques no link',
        field: 'clicks',
        sortable: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
          const row = params.data as CampaignRow;
          return (
            <CellWithChange
              value={formatNumber(row.clicks)}
              previousValue={formatNumber(row.clicksPrevious)}
              change={row.clicksChange}
            />
          );
        },
      },
      {
        headerName: 'CPC',
        field: 'cpc',
        sortable: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
          const row = params.data as CampaignRow;
          return (
            <CellWithChange
              value={row.cpc.toFixed(2).replace('.', ',')}
              previousValue={row.cpcPrevious.toFixed(2).replace('.', ',')}
              change={row.cpcChange}
              prefix="R$"
            />
          );
        },
      },
      {
        headerName: 'CTR',
        field: 'ctr',
        sortable: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
          const row = params.data as CampaignRow;
          return (
            <CellWithChange
              value={row.ctr.toFixed(2).replace('.', ',')}
              previousValue={row.ctrPrevious.toFixed(2).replace('.', ',')}
              change={row.ctrChange}
              prefix="R$"
            />
          );
        },
      },
      {
        headerName: 'CTR',
        field: 'conversionRate',
        sortable: true,
        cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
          const row = params.data as CampaignRow;
          return (
            <CellWithChange
              value={row.conversionRate.toFixed(2).replace('.', ',')}
              previousValue={row.conversionRatePrevious
                .toFixed(2)
                .replace('.', ',')}
              change={row.conversionRateChange}
              prefix="R$"
            />
          );
        },
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: true,
    }),
    [],
  );

  return (
    <Table
      rowData={data}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowSelection="multiple"
      onSelectionChanged={(params) => console.log('selected', params)}
      domLayout="autoHeight"
      rowHeight={72}
      headerHeight={48}
    />
  );
};
