import { apiClient } from './axios';

export interface StrapiWorkspace {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  logo: {
    id: number;
    url: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    formats?: Record<string, unknown>;
  } | null;
  owner: {
    id: number;
    username: string;
    email: string;
  } | null;
  members:
    | {
        id: number;
        username: string;
        email: string;
      }[]
    | null;
  integrations:
    | {
        id: number;
        name: string;
        provider: string;
      }[]
    | null;
}

export interface WorkspaceResponse {
  data: StrapiWorkspace[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleWorkspaceResponse {
  data: StrapiWorkspace;
}

export interface WorkspaceCreateInput {
  name: string;
  slug: string;
  logo?: File | string | null;
  owner?: number | string | null;
  members?: (number | string)[] | null;
  integrations?: (number | string)[] | null;
}

export const workspaceService = {
  /**
   * List all workspaces
   */
  async list(): Promise<WorkspaceResponse> {
    const { data } = await apiClient.get<WorkspaceResponse>(
      '/api/workspaces?populate=*',
    );
    return data;
  },

  /**
   * Get a single workspace by documentId (Strapi v5)
   */
  async get(id: string | number): Promise<SingleWorkspaceResponse> {
    const { data } = await apiClient.get<SingleWorkspaceResponse>(
      `/api/workspaces/${id}?populate=*`,
    );
    return data;
  },

  /**
   * Create a new workspace
   */
  async create(
    payload: WorkspaceCreateInput,
  ): Promise<SingleWorkspaceResponse> {
    const data: Record<string, unknown> = { ...payload };

    // Handle logo upload separately in Strapi 5
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

    // Clean up optional fields if they are empty/null
    delete data.owner;
    if (Array.isArray(data.members) && data.members.length === 0)
      delete data.members;
    if (Array.isArray(data.integrations) && data.integrations.length === 0)
      delete data.integrations;

    const { data: responseData } =
      await apiClient.post<SingleWorkspaceResponse>('/api/workspaces', {
        data,
      });
    return responseData;
  },

  /**
   * Update an existing workspace by documentId
   */
  async update(
    id: string | number,
    payload: Partial<WorkspaceCreateInput>,
  ): Promise<SingleWorkspaceResponse> {
    const data: Record<string, unknown> = { ...payload };

    // Handle logo upload separately in Strapi 5
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

    // Only include fields that are actually provided
    if (data.owner === null) delete data.owner;
    if (Array.isArray(data.members) && data.members.length === 0)
      delete data.members;
    if (Array.isArray(data.integrations) && data.integrations.length === 0)
      delete data.integrations;

    // If logo is a string (URL), we don't want to send it to Strapi as it expects an ID
    if (typeof data.logo === 'string') {
      delete data.logo;
    }

    const { data: responseData } = await apiClient.put<SingleWorkspaceResponse>(
      `/api/workspaces/${id}`,
      { data },
    );
    return responseData;
  },

  /**
   * Delete a workspace by documentId
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/workspaces/${id}`);
  },
};
