import { apiClient } from '../axios';

export type IntegrationType = 'meta_ads' | 'google_ads';

export type IntegrationStatus = 'connected' | 'disconnected' | 'token_expired';
export type SyncStatus = 'success' | 'failed' | 'pending';

export interface StrapiIntegration {
  id: number;
  documentId: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  lastSyncAt: string | null;
  lastSyncStatus: SyncStatus | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  config: Record<string, unknown> | null;
  project?: {
    id: number;
    documentId: string;
    name: string;
  };
}

export interface IntegrationResponse {
  data: StrapiIntegration[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleIntegrationResponse {
  data: StrapiIntegration;
}

export interface IntegrationCreateInput {
  name: string;
  type: IntegrationType;
  project: string | number; // documentId or ID
  config?: Record<string, unknown>;
  status?: IntegrationStatus;
}

export const integrationService = {
  /**
   * List all integrations, optionally filtered by project
   */
  async list(projectId?: string | number): Promise<IntegrationResponse> {
    let url = '/api/integrations?populate=*';
    if (projectId) {
      url += `&filters[project][documentId][$eq]=${projectId}`;
    }
    const { data } = await apiClient.get<IntegrationResponse>(url);
    return data;
  },

  /**
   * Get a single integration
   */
  async get(id: string | number): Promise<SingleIntegrationResponse> {
    const { data } = await apiClient.get<SingleIntegrationResponse>(
      `/api/integrations/${id}?populate=*`,
    );
    return data;
  },

  /**
   * Create a new integration
   */
  async create(
    payload: IntegrationCreateInput,
  ): Promise<SingleIntegrationResponse> {
    const { data } = await apiClient.post<SingleIntegrationResponse>(
      '/api/integrations',
      {
        data: payload,
      },
    );
    return data;
  },

  /**
   * Update an existing integration
   */
  async update(
    id: string | number,
    payload: Partial<IntegrationCreateInput>,
  ): Promise<SingleIntegrationResponse> {
    const { data } = await apiClient.put<SingleIntegrationResponse>(
      `/api/integrations/${id}`,
      { data: payload },
    );
    return data;
  },

  /**
   * Delete an integration
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/integrations/${id}`);
  },
};
