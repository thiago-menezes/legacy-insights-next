import {
  IntegrationCreateInput,
  IntegrationType,
  StrapiIntegration,
} from '@/libs/api/services/integrations';

export type IntegrationTab = 'all' | 'ads' | 'webhooks' | 'utms';

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'token_expired'
  | 'error'
  | 'processing';

export interface IntegrationProfile {
  id: string;
  name: string;
  status: ConnectionStatus;
  processStatus?: string;
  integration: StrapiIntegration;
}

export interface IntegrationPlatform {
  id: IntegrationType | string;
  name: string;
  description: string;
  icon: string;
  profiles: IntegrationProfile[];
  category: 'ads' | 'webhooks';
}

export interface StatusConfig {
  label: string;
  color: 'positive' | 'neutral' | 'critical';
}

export interface IntegrationsProps {
  projectId: string;
}

export interface ProfileItemProps {
  profile: IntegrationProfile;
  onDelete: (id: string) => void;
  onEdit: (integration: StrapiIntegration) => void;
  onProcess: (id: string) => void;
  onDetails: (id: string) => void;
}

export interface PlatformCardProps {
  platform: IntegrationPlatform;
  onDelete: (id: string) => void;
  onAdd: (type: IntegrationType) => void;
  onEdit: (integration: StrapiIntegration) => void;
  onProcess: (id: string) => void;
  onDetails: (id: string) => void;
}

export interface IntegrationFormProps {
  initialValues?: StrapiIntegration | Partial<IntegrationCreateInput>;
  onSubmit: (values: IntegrationCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectId: string | number | undefined;
}
