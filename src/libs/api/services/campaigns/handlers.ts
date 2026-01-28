import { apiClient } from '../../axios';
import { CampaignListParams, StrapiCampaignListResponse } from './types';

export const list = async (
  params: CampaignListParams = {},
): Promise<StrapiCampaignListResponse> => {
  const {
    platform = 'meta',
    integrationId,
    startDate,
    endDate,
    page = 1,
    pageSize = 10,
  } = params;

  const query = new URLSearchParams();
  query.append('filters[platform][$eq]', platform);
  query.append('populate', 'dailyMetrics');
  query.append('pagination[page]', page.toString());
  query.append('pagination[pageSize]', pageSize.toString());

  if (startDate) {
    query.append('filters[dailyMetrics][date][$gte]', startDate);
  }

  if (endDate) {
    query.append('filters[dailyMetrics][date][$lte]', endDate);
  }

  if (integrationId) {
    query.append(
      'filters[integration][documentId][$eq]',
      integrationId.toString(),
    );
  }

  const { data } = await apiClient.get<StrapiCampaignListResponse>(
    `/api/campaigns?${query.toString()}`,
  );

  return data;
};
