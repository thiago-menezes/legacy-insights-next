import { apiClient } from '../../axios';
import { ServiceConfig } from '../types';
import {
  IntegrationCreateInput,
  IntegrationResponse,
  SingleIntegrationResponse,
} from './types';

export const list = async (
  projectId?: string | number,
): ServiceConfig<IntegrationResponse> => {
  const filter = projectId
    ? `&filters[project][documentId][$eq]=${projectId}`
    : '';
  const { data } = await apiClient.get<IntegrationResponse>(
    `/api/integrations?populate=*${filter}`,
  );
  return { ...data, keys: ['integrations', projectId] };
};

export const get = async (
  id: string | number,
): Promise<SingleIntegrationResponse> => {
  // Try to find by documentId first using the list endpoint
  // This helps avoid issues if findOne permissions are distinct or if ID format varies
  try {
    const { data: listData } = await apiClient.get<IntegrationResponse>(
      `/api/integrations?filters[documentId][$eq]=${id}&populate=*`,
    );

    if (listData.data && listData.data.length > 0) {
      return { data: listData.data[0] };
    }
  } catch {
    // console.warn('Failed to fetch by documentId filter, trying direct ID...');
  }

  // Fallback to direct ID fetch
  const { data } = await apiClient.get<SingleIntegrationResponse>(
    `/api/integrations/${id}?populate=*`,
  );
  return data;
};

export const create = async (
  payload: IntegrationCreateInput,
): Promise<SingleIntegrationResponse> => {
  const { data } = await apiClient.post<SingleIntegrationResponse>(
    '/api/integrations',
    {
      data: payload,
    },
  );
  return data;
};

export const update = async (
  id: string | number,
  payload: Partial<IntegrationCreateInput>,
): Promise<SingleIntegrationResponse> => {
  const { data } = await apiClient.put<SingleIntegrationResponse>(
    `/api/integrations/${id}`,
    { data: payload },
  );
  return data;
};

export const deleteIntegration = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/api/integrations/${id}`);
};

export const validate = async (
  id: string | number,
): Promise<{ valid: boolean; message: string; status: string }> => {
  const { data } = await apiClient.post(`/api/integrations/${id}/validate`);
  return data;
};

export const process = async (
  id: string | number,
): Promise<{ message: string; status: string }> => {
  const { data } = await apiClient.post(`/api/integrations/${id}/process`);
  return data;
};
