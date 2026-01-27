import { apiClient } from '../axios';
import { IntegrationType } from './integrations';

export interface StrapiProject {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
  integrations?: {
    id: number;
    documentId: string;
    name: string;
    type: IntegrationType;
    status: 'connected' | 'disconnected' | 'token_expired';
  }[];
}

export interface ProjectResponse {
  data: StrapiProject[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleProjectResponse {
  data: StrapiProject;
}

export interface ProjectCreateInput {
  name: string;
  slug: string;
  description?: string;
  workspace: number | string;
}

export const projectService = {
  /**
   * List all projects
   */
  async list(workspaceId?: string): Promise<ProjectResponse> {
    const filter = workspaceId
      ? `&filters[workspace][documentId][$eq]=${workspaceId}`
      : '';
    const { data } = await apiClient.get<ProjectResponse>(
      `/api/projects?populate=*${filter}`,
    );
    return data;
  },

  /**
   * Get a single project by documentId or slug
   */
  async get(idOrSlug: string): Promise<SingleProjectResponse> {
    const { data } = await apiClient.get<SingleProjectResponse>(
      `/api/projects/${idOrSlug}?populate=*`,
    );
    return data;
  },

  /**
   * Get a project by slug
   */
  async getBySlug(slug: string): Promise<SingleProjectResponse> {
    const { data: listData } = await apiClient.get<ProjectResponse>(
      `/api/projects?filters[slug][$eq]=${slug}&populate=*`,
    );
    if (!listData.data[0]) {
      throw new Error(`Project not found: ${slug}`);
    }
    return { data: listData.data[0] };
  },

  /**
   * Create a new project
   */
  async create(payload: ProjectCreateInput): Promise<SingleProjectResponse> {
    const { data } = await apiClient.post<SingleProjectResponse>(
      '/api/projects',
      { data: payload },
    );
    return data;
  },

  /**
   * Update an existing project by documentId
   */
  async update(
    id: string,
    payload: Partial<ProjectCreateInput>,
  ): Promise<SingleProjectResponse> {
    const { data } = await apiClient.put<SingleProjectResponse>(
      `/api/projects/${id}`,
      { data: payload },
    );
    return data;
  },

  /**
   * Delete a project by documentId
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/projects/${id}`);
  },
};
