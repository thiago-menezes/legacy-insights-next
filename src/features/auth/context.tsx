'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  StrapiUser,
  getStrapiErrorMessage,
  strapiRegister,
} from '@/libs/api/strapi';

const AUTH_TOKEN_KEY = 'legacy_auth_token';
const AUTH_USER_KEY = 'legacy_auth_user';

interface AuthContextType {
  user: StrapiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to safely read localStorage (handles SSR)
function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getInitialUser(): StrapiUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  // Derive user and token from session or localStorage
  const user = useMemo(() => {
    if (status === 'authenticated' && session?.user) {
      return {
        id: Number(session.user.id),
        username: session.user.name || '',
        email: session.user.email || '',
      } as StrapiUser;
    }
    if (status === 'loading') {
      return getInitialUser();
    }
    return null;
  }, [session, status]);

  const token = useMemo(() => {
    if (status === 'authenticated' && session && 'accessToken' in session) {
      return (session as { accessToken?: string }).accessToken || null;
    }
    if (status === 'loading') {
      return getInitialToken();
    }
    return null;
  }, [session, status]);

  // Sync session data to localStorage
  useEffect(() => {
    if (status === 'authenticated' && user && token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else if (status === 'unauthenticated') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [status, user, token]);

  const login = useCallback(
    async (
      identifier: string,
      password: string,
    ): Promise<{ error?: string }> => {
      try {
        const result = await signIn('strapi', {
          identifier,
          password,
          redirect: false,
        });

        if (result?.error || !result?.ok) {
          if (result?.error === 'CredentialsSignin') {
            return {
              error: 'Credenciais inválidas. Verifique seu email e senha.',
            };
          }
          return {
            error: result?.error || 'Falha ao autenticar. Tente novamente.',
          };
        }

        // We don't need to manually redirect if we use router.push,
        // but let's do a full refresh to be safe with session detection
        window.location.href = '/';
        return {};
      } catch {
        return { error: 'Ocorreu um erro ao fazer login.' };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ error?: string }> => {
      try {
        // We use email as the username to ensure uniqueness and avoid "username taken" errors
        // for display names. The actual name is sent as a separate field.
        await strapiRegister(email, email, password, name);

        // After registration, log in automatically with NextAuth
        const result = await signIn('strapi', {
          identifier: email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return { error: 'Conta criada, mas erro ao fazer login automático.' };
        }

        window.location.href = '/';
        return {};
      } catch (error) {
        return { error: getStrapiErrorMessage(error) };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    await signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to get token for API calls
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
