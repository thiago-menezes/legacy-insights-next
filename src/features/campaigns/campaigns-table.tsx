'use client';

import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDarkBlue,
  colorSchemeLight,
  themeQuartz,
} from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo, useState, useCallback } from 'react';
import { View, Text, Button, Badge, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import {
  STATUS_CONFIG,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from './constants';
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

export const CampaignsTable = ({
  data,
  currentPage = 1,
  totalPages = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}: CampaignsTableProps) => {
  const [selectedRows, setSelectedRows] = useState<number>(0);
  const { colorMode } = useTheme();

  const myTheme = themeQuartz.withPart(
    colorMode === 'dark' ? colorSchemeDarkBlue : colorSchemeLight,
  );

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

  const onSelectionChanged = useCallback(
    (event: { api: { getSelectedRows: () => CampaignRow[] } }) => {
      setSelectedRows(event.api.getSelectedRows().length);
    },
    [],
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange?.(Number(e.target.value));
  };

  return (
    <View className={styles.tableContainer}>
      <div className={clsx(styles.tableWrapper, 'ag-theme-quartz')}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection
          onSelectionChanged={onSelectionChanged}
          domLayout="normal"
          rowHeight={72}
          headerHeight={48}
          theme={myTheme}
        />
      </div>

      <div className={styles.pagination}>
        <Text variant="body-3" color="neutral-faded">
          {selectedRows} de {totalItems} linhas selecionadas
        </Text>

        <div className={styles.paginationControls}>
          <div className={styles.pageSize}>
            <span>Linhas por página</span>
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>

          <div className={styles.pageButtons}>
            <Button
              variant="ghost"
              size="small"
              icon={<Icon name="chevrons-left" size={16} />}
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(1)}
            />
            <Button
              variant="ghost"
              size="small"
              icon={<Icon name="chevron-left" size={16} />}
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            />
            <Button
              variant="ghost"
              size="small"
              icon={<Icon name="chevron-right" size={16} />}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            />
            <Button
              variant="ghost"
              size="small"
              icon={<Icon name="chevrons-right" size={16} />}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(totalPages)}
            />
          </div>
        </div>
      </div>
    </View>
  );
};
