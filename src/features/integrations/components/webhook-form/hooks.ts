import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IntegrationCreateInput } from '@/libs/api/services/integrations';
import { WebhookFormSchema, webhookFormSchema } from './schema';
import { WebhookFormProps } from './types';

export const useWebhookForm = ({
  initialValues,
  onSubmit,
  projectId,
}: Pick<WebhookFormProps, 'initialValues' | 'onSubmit' | 'projectId'>) => {
  // Extract config values from initial values
  const config =
    initialValues && 'config' in initialValues
      ? (initialValues.config as Record<string, unknown>)
      : {};

  const webhookType =
    initialValues?.type === 'hotmart' ||
    initialValues?.type === 'kiwify' ||
    initialValues?.type === 'kirvano' ||
    initialValues?.type === 'custom_webhook'
      ? initialValues.type
      : 'hotmart';

  const form = useForm<WebhookFormSchema>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      type: webhookType,

      eventTypes: (config.eventTypes as string[]) || [],
      signatureValidation: (config.signatureValidation as boolean) ?? true,
      allowedOrigins: (config.allowedOrigins as string[]) || [],
    },
  });

  const handleSubmit = form.handleSubmit((data: WebhookFormSchema) => {
    // Convert WebhookFormSchema to IntegrationCreateInput
    const payload: IntegrationCreateInput = {
      name: data.name,
      type: data.type,
      project: projectId as string,
      config: {
        eventTypes: data.eventTypes,
        signatureValidation: data.signatureValidation,
        allowedOrigins: data.allowedOrigins,
      },
      status: 'connected',
    };
    onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
  };
};

// Event types for each platform
export const PLATFORM_EVENT_TYPES: Record<
  'hotmart' | 'kiwify' | 'kirvano' | 'custom_webhook',
  string[]
> = {
  hotmart: [
    'PURCHASE_COMPLETE',
    'PURCHASE_REFUNDED',
    'PURCHASE_CANCELED',
    'PURCHASE_DELAYED',
    'PURCHASE_APPROVED',
  ],
  kiwify: ['sale', 'refund', 'chargeback', 'subscription_created'],
  kirvano: [
    'order.approved',
    'order.refunded',
    'order.canceled',
    'subscription.created',
  ],
  custom_webhook: [],
};
