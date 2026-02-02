import { apiClient } from '../../axios';
import {
  CampaignAttributionResponse,
  CampaignListParams,
  StrapiCampaignListResponse,
} from './types';

export const list = async (
  params: CampaignListParams = {},
): Promise<StrapiCampaignListResponse> => {
  const {
    platform = 'meta',
    integrationId,
    startDate,
    endDate,
    search,
    sortBy,
    sortOrder,
    showOnlyActive,
    status,
    page = 1,
    pageSize = 10,
  } = params;

  const query = new URLSearchParams();
  query.append('filters[platform][$eq]', platform);
  query.append('populate', 'dailyMetrics');
  query.append('pagination[page]', page.toString());
  query.append('pagination[pageSize]', pageSize.toString());

  if (startDate) {
    query.append('startDate', startDate);
  }

  if (endDate) {
    query.append('endDate', endDate);
  }

  if (integrationId) {
    query.append(
      'filters[integration][documentId][$eq]',
      integrationId.toString(),
    );
  }

  if (search) {
    query.append('search', search);
  }

  if (sortBy) {
    query.append('sortBy', sortBy);
  }

  if (sortOrder) {
    query.append('sortOrder', sortOrder);
  }

  if (showOnlyActive) {
    query.append('showOnlyActive', 'true');
  }

  if (status && status.length > 0) {
    status.forEach((s) => {
      query.append('status[]', s);
    });
  }

  const { data } = await apiClient.get<StrapiCampaignListResponse>(
    `/api/campaigns?${query.toString()}`,
  );

  return data;
};

export const getAttribution = async (
  campaignId: string,
): Promise<CampaignAttributionResponse> => {
  const { data } = await apiClient.get<CampaignAttributionResponse>(
    `/api/campaigns/${campaignId}/attribution`,
  );

  return data;
};
