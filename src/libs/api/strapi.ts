import axios from 'axios';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  'http://localhost:1337';

const strapiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  provider?: string;
  createdAt?: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
  };
}

/**
 * Login with email/password
 * POST /api/auth/local
 */
export async function strapiLogin(
  identifier: string,
  password: string,
): Promise<StrapiAuthResponse> {
  const { data } = await strapiClient.post<StrapiAuthResponse>(
    '/api/auth/local',
    { identifier, password },
  );
  return data;
}

/**
 * Register new user
 * POST /api/auth/local/register
 */
export async function strapiRegister(
  username: string,
  email: string,
  password: string,
): Promise<StrapiAuthResponse> {
  const { data } = await strapiClient.post<StrapiAuthResponse>(
    '/api/auth/local/register',
    { username, email, password },
  );
  return data;
}

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export async function strapiForgotPassword(
  email: string,
): Promise<{ ok: boolean }> {
  const { data } = await strapiClient.post<{ ok: boolean }>(
    '/api/auth/forgot-password',
    { email },
  );
  return data;
}

/**
 * Reset password with code from email
 * POST /api/auth/reset-password
 */
export async function strapiResetPassword(
  code: string,
  password: string,
  passwordConfirmation: string,
): Promise<StrapiAuthResponse> {
  const { data } = await strapiClient.post<StrapiAuthResponse>(
    '/api/auth/reset-password',
    { code, password, passwordConfirmation },
  );
  return data;
}

/**
 * Get Google OAuth URL
 */
export function getStrapiGoogleAuthUrl(): string {
  return `${STRAPI_URL}/api/connect/google`;
}

/**
 * Get Facebook OAuth URL
 */
export function getStrapiFacebookAuthUrl(): string {
  return `${STRAPI_URL}/api/connect/facebook`;
}

/**
 * Get full URL for a Strapi media object or path
 */
export function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Extract error message from Strapi error response
 */
export function getStrapiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const strapiError = error.response?.data as StrapiError | undefined;
    if (strapiError?.error?.message) {
      return strapiError.error.message;
    }
    if (error.response?.status === 400) {
      return 'Credenciais inválidas. Verifique seu email e senha.';
    }
    if (error.response?.status === 401) {
      return 'Não autorizado. Faça login novamente.';
    }
  }
  return 'Ocorreu um erro. Tente novamente.';
}
