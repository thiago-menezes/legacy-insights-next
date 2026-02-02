import { apiClient } from '../../axios';
import {
  CreateProductPayload,
  ProductEventsResponse,
  ProductListParams,
  StrapiProduct,
  StrapiProductListResponse,
  UpdateProductPayload,
} from './types';

export const list = async (
  params: ProductListParams = {},
): Promise<StrapiProductListResponse> => {
  const {
    search,
    platform,
    active,
    projectId,
    page = 1,
    pageSize = 10,
  } = params;

  const query = new URLSearchParams();
  query.append('populate', 'project');
  query.append('pagination[page]', page.toString());
  query.append('pagination[pageSize]', pageSize.toString());

  if (search) {
    query.append('search', search);
  }

  if (platform) {
    query.append('platform', platform);
  }

  if (active !== undefined) {
    query.append('active', active.toString());
  }

  if (projectId) {
    query.append('projectId', projectId);
  }

  const { data } = await apiClient.get<StrapiProductListResponse>(
    `/api/products?${query.toString()}`,
  );

  return data;
};

export const getById = async (id: string): Promise<StrapiProduct> => {
  const { data } = await apiClient.get<{ data: StrapiProduct }>(
    `/api/products/${id}?populate=project`,
  );

  return data.data;
};

export const create = async (
  payload: CreateProductPayload,
): Promise<StrapiProduct> => {
  const { data } = await apiClient.post<{ data: StrapiProduct }>(
    '/api/products',
    { data: payload },
  );

  return data.data;
};

export const update = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<StrapiProduct> => {
  const { data } = await apiClient.put<{ data: StrapiProduct }>(
    `/api/products/${id}`,
    { data: payload },
  );

  return data.data;
};

export const remove = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/products/${id}`);
};

export const getEvents = async (id: string): Promise<ProductEventsResponse> => {
  const { data } = await apiClient.get<ProductEventsResponse>(
    `/api/products/${id}/events?populate=integration&sort=processedAt:desc`,
  );

  return data;
};
