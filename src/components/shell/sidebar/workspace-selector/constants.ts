import type { IconNames } from '@/components/icon';
import type { Organization } from './types';

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Grupo Ser',
    logoIcon: 'stars',
    workspaces: [
      { id: 'ws-1', name: 'Unama' },
      { id: 'ws-2', name: 'Uninassau' },
      { id: 'ws-3', name: 'UNG' },
      { id: 'ws-4', name: 'Uninorte' },
      { id: 'ws-5', name: 'Unifael' },
      { id: 'ws-6', name: 'Uni7' },
    ],
  },
  {
    id: 'org-2',
    name: 'GOkursos',
    logoIcon: 'message-circle',
    workspaces: [
      { id: 'ws-7', name: 'Vendas' },
      { id: 'ws-8', name: 'Marketing' },
    ],
  },
];

export const DEFAULT_ORG_ID = 'org-1';
export const DEFAULT_WORKSPACE_ID = 'ws-1';
export const DEFAULT_ORG_ICON: IconNames = 'building';
