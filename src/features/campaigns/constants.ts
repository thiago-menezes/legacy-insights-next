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
  paused: {
    label: 'Pausado',
    color: 'neutral',
    icon: 'player-pause',
  },
  archived: {
    label: 'Arquivado',
    color: 'neutral',
    icon: 'archive',
  },
  removed: {
    label: 'Removido',
    color: 'critical',
    icon: 'trash',
  },
  deleted: {
    label: 'Excluído',
    color: 'critical',
    icon: 'trash',
  },
};

export const TABS: { id: CampaignTab; label: string }[] = [
  { id: 'campaigns', label: 'Campanhas' },
  { id: 'adsets', label: 'Conjuntos' },
  { id: 'ads', label: 'Anúncios' },
];
