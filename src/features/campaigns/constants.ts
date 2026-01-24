import { IconNames } from '@/components/icon';
import { CampaignStatus, CampaignTab } from './types';

export const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: 'positive' | 'neutral' | 'critical'; icon: IconNames }
> = {
  active: {
    label: 'Ativo',
    color: 'positive',
    icon: 'circle-check',
  },
  finished: {
    label: 'Finalizado',
    color: 'neutral',
    icon: 'circle-check',
  },
  disabled: {
    label: 'Desativado',
    color: 'neutral',
    icon: 'ban',
  },
};

export const TABS: { id: CampaignTab; label: string }[] = [
  { id: 'campaigns', label: 'Campanhas' },
  { id: 'adsets', label: 'Conjuntos' },
  { id: 'ads', label: 'Anúncios' },
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;
