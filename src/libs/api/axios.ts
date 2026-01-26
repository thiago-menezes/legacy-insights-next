import axios from 'axios';
import { signOut } from 'next-auth/react';
import { getAccessToken } from './token';

export const createApiClient = (addAuthInterceptor: boolean = false) => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'http://localhost:1337';

  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 50000,
    withCredentials: true,
  });

  client.interceptors.request.use(async (config) => {
    try {
      if (addAuthInterceptor && typeof window !== 'undefined') {
        let token = await getAccessToken();

        // Fallback to localStorage if session token is not available
        if (!token) {
          token = localStorage.getItem('legacy_auth_token');
        }

        if (token) {
          config.headers = config.headers ?? {};
          (config.headers as Record<string, string>).Authorization =
            `Bearer ${token}`;
        }
      }

      const controller = new AbortController();
      config.signal = controller.signal;
      const timeoutMs = config.timeout ?? 50000;
      setTimeout(() => controller.abort(), timeoutMs);

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 403) {
        // eslint-disable-next-line no-console
        console.error(
          'Permission denied (403). Check Strapi permissions for this user role.',
        );
        if (error.response.data) {
          // eslint-disable-next-line no-console
          console.error('Strapi error details:', error.response.data);
        }
      }
      if (process.env.NODE_ENV === 'development') {
        // Log more info in dev
        // eslint-disable-next-line no-console
        console.error(`Request error: ${error.message}`, error.response?.data);
      }
      if (error?.response?.status === 401 && typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/auth/signin' });
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient(true);

export const publicApiClient = createApiClient(false);
export default apiClient;

export const query = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
) => {
  const { data } = await apiClient.get<T>(endpoint, { params });
  return data;
};

export const mutate = async <T, P>(
  endpoint: string,
  payload: P,
  method: 'post' | 'put' | 'delete' | 'patch' | 'get' = 'post',
) => {
  const { data } = await apiClient[method]<T>(endpoint, payload);
  return data;
};
