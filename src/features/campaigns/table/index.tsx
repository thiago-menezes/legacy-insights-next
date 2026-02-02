'use client';

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
} from 'ag-grid-community';
import { Pagination, Select, Text, View } from 'reshaped';
import { Table } from '@/components/table';
import styles from '../styles.module.scss';
import { CampaignRow, CampaignsTableProps } from '../types';
import { COLUMN_DEFS, PAGE_SIZE_OPTIONS } from './constants';

ModuleRegistry.registerModules([
  PaginationModule,
  ClientSideRowModelModule,
  ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

export const CampaignsTable = ({
  data,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 10,
  onPageChange,
  onPageSizeChange,
  platform = 'meta',
}: CampaignsTableProps) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <View className={styles.tableContainer}>
      <Table<CampaignRow>
        rowData={data}
        columnDefs={COLUMN_DEFS(platform)}
        defaultColDef={{
          resizable: true,
          suppressMovable: true,
        }}
        rowSelection="multiple"
        onSelectionChanged={() => {}}
        domLayout="autoHeight"
        rowHeight={72}
        headerHeight={48}
        pagination={false}
      />

      <View
        direction="row"
        align="center"
        justify="space-between"
        className={styles.pagination}
      >
        <Text variant="body-3" color="neutral-faded">
          {totalItems > 0 ? (
            <>
              {startItem}-{endItem} de {totalItems} itens
            </>
          ) : (
            'Nenhum item encontrado'
          )}
        </Text>

        <View direction="row" align="center" gap={3}>
          <View direction="row" align="center" gap={2}>
            <Text variant="body-3" color="neutral-faded">
              Visualizar
            </Text>
            <View width="80px">
              <Select
                name="pageSize"
                value={String(pageSize)}
                onChange={(e) => onPageSizeChange?.(Number(e.value))}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </View>
          </View>

          <Pagination
            total={totalPages}
            previousAriaLabel="Previous page"
            nextAriaLabel="Next page"
            onChange={({ page }) => onPageChange?.(page)}
            page={currentPage}
          />
        </View>
      </View>
    </View>
  );
};
