import { apiClient } from '../../axios';
import type { WebhookEventsParams, WebhookEventsResponse } from './types';

export const getWebhookEvents = async (
  integrationId: string,
  params?: WebhookEventsParams,
): Promise<WebhookEventsResponse> => {
  const response = await apiClient.get(
    `/integrations/${integrationId}/webhook-events`,
    { params },
  );
  return response.data;
};
