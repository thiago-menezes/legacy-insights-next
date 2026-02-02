import {
  IntegrationCreateInput,
  IntegrationType,
  StrapiIntegration,
} from '@/libs/api/services/integrations';

export interface WebhookFormValues {
  name: string;
  type: IntegrationType;

  eventTypes: string[];
  signatureValidation: boolean;
  allowedOrigins?: string[];
}

export interface WebhookFormProps {
  initialValues?: StrapiIntegration | Partial<IntegrationCreateInput>;
  onSubmit: (values: IntegrationCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectId: string | number | undefined;
}
