import { apiClient } from '../../axios';
import {
  CreateWorkspacePayload,
  StrapiWorkspaceListResponse,
  StrapiWorkspaceResponse,
} from './types';

export const list = async (): Promise<StrapiWorkspaceListResponse> => {
  const { data } =
    await apiClient.get<StrapiWorkspaceListResponse>('/api/workspaces');
  return data;
};

export const get = async (
  id: string | number,
): Promise<StrapiWorkspaceResponse> => {
  const { data } = await apiClient.get<StrapiWorkspaceResponse>(
    `/api/workspaces/${id}?populate=*`,
  );
  return data;
};

export const create = async (
  payload: CreateWorkspacePayload,
): Promise<StrapiWorkspaceResponse> => {
  const data: Record<string, unknown> = { ...payload };

  if (payload.logo) {
    delete data.logo;
    const formData = new FormData();
    formData.append('files', payload.logo);

    const { data: uploadResponse } = await apiClient.post<{ id: number }[]>(
      '/api/upload',
      formData,
    );

    if (uploadResponse && uploadResponse[0]) {
      data.logo = uploadResponse[0].id;
    }
  }

  delete data.owner;
  if (Array.isArray(data.members) && data.members.length === 0)
    delete data.members;
  if (Array.isArray(data.integrations) && data.integrations.length === 0)
    delete data.integrations;

  const { data: responseData } = await apiClient.post<StrapiWorkspaceResponse>(
    '/api/workspaces',
    {
      data,
    },
  );
  return responseData;
};

export const update = async (
  id: string | number,
  payload: Partial<CreateWorkspacePayload>,
): Promise<StrapiWorkspaceResponse> => {
  const data: Record<string, unknown> = { ...payload };

  if (payload.logo && typeof payload.logo !== 'string') {
    delete data.logo;
    const formData = new FormData();
    formData.append('files', payload.logo);

    const { data: uploadResponse } = await apiClient.post<{ id: number }[]>(
      '/api/upload',
      formData,
    );

    if (uploadResponse && uploadResponse[0]) {
      data.logo = uploadResponse[0].id;
    }
  }

  if (data.owner === null) delete data.owner;
  if (Array.isArray(data.members) && data.members.length === 0)
    delete data.members;
  if (Array.isArray(data.integrations) && data.integrations.length === 0)
    delete data.integrations;

  if (typeof data.logo === 'string') {
    delete data.logo;
  }

  const { data: responseData } = await apiClient.put<StrapiWorkspaceResponse>(
    `/api/workspaces/${id}`,
    { data },
  );
  return responseData;
};

export const deleteWorkspace = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/api/workspaces/${id}`);
};
