import { IconNames } from '@/components/icon';
import { IntegrationType } from '@/libs/api/services/integrations';
import { StrapiProject } from '@/libs/api/services/projects';
import { IntegrationTab } from './types';

export const TABS: { id: IntegrationTab; label: string; icon?: IconNames }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'ads', label: 'Anúncios', icon: 'speakerphone' },
  { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
];

export const PLATFORM_METADATA = [
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    description: 'Conecte seus perfis do Meta Ads',
    icon: '/icon-meta.png',
    category: 'ads',
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Conecte seus perfis do Google Ads',
    icon: '/icon-google.png',
    category: 'ads',
  },
] as const;

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: 'positive' | 'neutral' | 'critical' }
> = {
  connected: {
    label: 'Conectado',
    color: 'positive',
  },
  disconnected: {
    label: 'Desconectado',
    color: 'neutral',
  },
  token_expired: {
    label: 'Token Expirado',
    color: 'critical',
  },
  error: {
    label: 'Erro',
    color: 'critical',
  },
  processing: {
    label: 'Processando',
    color: 'neutral',
  },
};
export const PROCESS_STATUS_CONFIG: Record<
  string,
  { label: string; color: 'positive' | 'neutral' | 'critical' }
> = {
  'não processado': {
    label: 'Não Processado',
    color: 'neutral',
  },
  processando: {
    label: 'Processando',
    color: 'neutral',
  },
  erro: {
    label: 'Erro',
    color: 'critical',
  },
  'finalizado com sucesso': {
    label: 'Finalizado',
    color: 'positive',
  },
};

export const INTEGRATION_TYPES: { label: string; value: IntegrationType }[] = [
  { label: 'Meta Ads', value: 'meta_ads' },
  { label: 'Google Ads', value: 'google_ads' },
];

export const BREADCRUMBS: {
  label: (project?: StrapiProject) => string;
  href?: (project?: StrapiProject) => string;
}[] = [
  {
    label: (_?: StrapiProject) => 'Lista de Workspaces',
    href: (_?: StrapiProject) => '/workspaces',
  },
  {
    label: (project?: StrapiProject) =>
      `Workspace: ${project?.workspace?.slug}`,
    href: (project?: StrapiProject) =>
      `/workspaces/${project?.workspace?.slug}`,
  },
  {
    label: (project?: StrapiProject) => `Projeto: ${project?.name}`,
  },
];
