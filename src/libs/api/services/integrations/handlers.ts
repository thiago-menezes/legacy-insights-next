import { apiClient } from '../../axios';
import { ServiceConfig } from '../types';
import {
  IntegrationResponse,
  IntegrationCreateInput,
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
