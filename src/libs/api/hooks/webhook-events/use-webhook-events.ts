import { useQuery } from '@tanstack/react-query';
import { getWebhookEvents } from '../../services/webhook-events';
import type { WebhookEventsParams } from '../../services/webhook-events/types';

export const useWebhookEventsQuery = (
  integrationId: string,
  params?: WebhookEventsParams,
) => {
  return useQuery({
    queryKey: ['webhook-events', integrationId, params],
    queryFn: () => getWebhookEvents(integrationId, params),
    enabled: !!integrationId,
  });
};
