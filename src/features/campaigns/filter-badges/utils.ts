import { CampaignStatus, CampaignsFilters } from '../types';
import { ActiveFilter } from './types';

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  archived: 'Arquivada',
  removed: 'Removida',
  deleted: 'Deletada',
};

export const getActiveFilters = (filters: CampaignsFilters): ActiveFilter[] => {
  const activeFilters: ActiveFilter[] = [];

  // Search filter
  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `Busca: "${filters.search}"`,
    });
  }

  // Date range filter
  if (filters.startDate && filters.endDate) {
    const start = filters.startDate.toLocaleDateString('pt-BR');
    const end = filters.endDate.toLocaleDateString('pt-BR');
    activeFilters.push({
      key: 'startDate',
      label: `Período: ${start} - ${end}`,
    });
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filters.status.forEach((status: CampaignStatus) => {
      activeFilters.push({
        key: 'status',
        label: `Status: ${STATUS_LABELS[status] || status}`,
        value: status,
      });
    });
  }

  // Show only active filter
  if (filters.showOnlyActive) {
    activeFilters.push({
      key: 'showOnlyActive',
      label: 'Apenas ativas',
    });
  }

  return activeFilters;
};
