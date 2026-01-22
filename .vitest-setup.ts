import { ReactNode } from 'react';
import { loadEnv } from 'vite';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Carrega variáveis do .env
loadEnv('test', process.cwd());

// Mock NextAuth for tests
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => children,
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}));
