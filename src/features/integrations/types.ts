import { IntegrationCreateInput } from '@/libs/api/services/integrations';

export type IntegrationTab = 'all' | 'ads' | 'webhooks';

export type ConnectionStatus = 'connected' | 'disconnected';

export interface IntegrationProfile {
  id: string;
  name: string;
  status: ConnectionStatus;
}

export interface IntegrationPlatform {
  id: string;
  name: string;
  description: string;
  icon: string;
  profiles: IntegrationProfile[];
  category: 'ads' | 'webhooks';
}

export interface StatusConfig {
  label: string;
  color: 'positive' | 'neutral';
}

export interface IntegrationsProps {
  projectId: string;
}

export interface ProfileItemProps {
  profile: IntegrationProfile;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

export interface PlatformCardProps {
  platform: IntegrationPlatform;
  onDelete: (id: string) => void;
  onAdd: (type: string) => void;
  onUpdate: (id: string) => void;
}

export interface IntegrationFormProps {
  initialValues?: Partial<IntegrationCreateInput>;
  onSubmit: (values: IntegrationCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectId: string | number;
}
