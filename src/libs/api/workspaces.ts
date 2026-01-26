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
  logo: unknown | null; // Placeholder for media type
  owner: unknown | null;
  members: unknown[] | null;
  integrations: unknown[] | null;
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
  logo?: File | null;
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
   * Get a single workspace by ID (or documentId in Strapi v5)
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
    const formData = new FormData();
    const data = { ...payload };
    delete data.logo;

    formData.append('data', JSON.stringify(data));

    if (payload.logo) {
      formData.append('files.logo', payload.logo);
    }

    const { data: responseData } =
      await apiClient.post<SingleWorkspaceResponse>(
        '/api/workspaces',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    return responseData;
  },

  /**
   * Update an existing workspace
   */
  async update(
    id: string | number,
    payload: Partial<WorkspaceCreateInput>,
  ): Promise<SingleWorkspaceResponse> {
    const formData = new FormData();
    const data = { ...payload };
    delete data.logo;

    formData.append('data', JSON.stringify(data));

    if (payload.logo) {
      formData.append('files.logo', payload.logo);
    }

    const { data: responseData } = await apiClient.put<SingleWorkspaceResponse>(
      `/api/workspaces/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return responseData;
  },

  /**
   * Delete a workspace
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/workspaces/${id}`);
  },
};
