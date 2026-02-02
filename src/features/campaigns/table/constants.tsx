import { ColDef, ICellRendererParams } from 'ag-grid-community';
import Link from 'next/link';
import { Badge, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { STATUS_CONFIG } from '../constants';
import styles from '../styles.module.scss';
import { CampaignRow, CampaignStatus } from '../types';
import { formatCurrency, formatNumber } from '../utils';
import { CellWithChange } from './cell-with-change';

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((size) => ({
  label: String(size),
  value: String(size),
}));

export const COLUMN_DEFS = (
  platform: 'meta' | 'google',
): ColDef<CampaignRow>[] => [
  {
    headerName: 'Nome da campanha',
    field: 'name',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    minWidth: 320,
    sortable: false,
    cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
      const row = params.data as CampaignRow;
      return (
        <Link
          href={`/campanhas/${platform}/${row.id}`}
          className={styles.campaignName}
        >
          {params.value}
        </Link>
      );
    },
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
    sortable: false,
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
    sortable: false,
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
    sortable: false,
    cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
      const row = params.data as CampaignRow;
      return (
        <CellWithChange
          value={row.cpc.toFixed(2).replace('.', ',')}
          previousValue={row.cpcPrevious.toFixed(2).replace('.', ',')}
          change={row.cpcChange}
          prefix="R$ "
        />
      );
    },
  },
  {
    headerName: 'CTR',
    field: 'ctr',
    sortable: false,
    cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
      const row = params.data as CampaignRow;
      return (
        <CellWithChange
          value={row.ctr.toFixed(2).replace('.', ',')}
          previousValue={row.ctrPrevious.toFixed(2).replace('.', ',')}
          change={row.ctrChange}
          suffix="%"
        />
      );
    },
  },
  {
    headerName: 'Tx. de conversão',
    field: 'conversionRate',
    sortable: false,
    cellRenderer: (params: ICellRendererParams<CampaignRow>) => {
      const row = params.data as CampaignRow;
      return (
        <CellWithChange
          value={row.conversionRate.toFixed(2).replace('.', ',')}
          previousValue={row.conversionRatePrevious
            .toFixed(2)
            .replace('.', ',')}
          change={row.conversionRateChange}
          suffix="%"
        />
      );
    },
  },
];
