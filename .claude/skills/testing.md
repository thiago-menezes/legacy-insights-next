---
name: testing
description: Use this skill when writing tests, setting up test infrastructure, or ensuring code quality through testing. Triggers on requests about tests, unit tests, integration tests, testing patterns, or Vitest.
---

# Testing Skill

Write tests for Legacy Insight using **Vitest** and **Testing Library**.

## Test File Location

Tests live alongside source files:

```
/features/products
├── index.tsx          # Component
├── spec.tsx           # Component tests
├── hooks.ts           # Hooks
├── hooks.spec.tsx     # Hook tests
├── utils.ts           # Utilities
└── utils.spec.tsx     # Utility tests
```

## Component Test

```tsx
// features/products/spec.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from './index';

// Mock hooks
vi.mock('./hooks', () => ({
  useProducts: vi.fn(),
  useProductActions: vi.fn(),
}));

import { useProducts, useProductActions } from './hooks';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useProductActions as ReturnType<typeof vi.fn>).mockReturnValue({
      createProduct: vi.fn(),
      deleteProduct: vi.fn(),
      error: null,
    });
  });

  it('renders loading state', () => {
    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
    });

    render(<ProductList />, { wrapper: createWrapper() });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [],
      isLoading: false,
      error: 'Failed to load',
    });

    render(<ProductList />, { wrapper: createWrapper() });
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders product list', () => {
    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' },
      ],
      isLoading: false,
      error: null,
    });

    render(<ProductList />, { wrapper: createWrapper() });
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  it('opens modal on create button click', () => {
    render(<ProductList />, { wrapper: createWrapper() });
    fireEvent.click(screen.getByText('Novo Produto'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

## Hook Test

```tsx
// features/products/hooks.spec.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './hooks';

vi.mock('./api/query', () => ({
  useProductsQuery: vi.fn(),
}));

import { useProductsQuery } from './api/query';

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when no data', () => {
    (useProductsQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useProducts(), { wrapper });
    expect(result.current.products).toEqual([]);
  });

  it('transforms API response', () => {
    (useProductsQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        data: [{ id: 1, documentId: 'abc', name: 'Test' }],
      },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useProducts(), { wrapper });
    expect(result.current.products[0].id).toBe('1');
    expect(result.current.products[0].name).toBe('Test');
  });
});
```

## Utility Test

```tsx
// features/products/utils.spec.tsx
import { formatPrice, buildSlugFromName } from './utils';

describe('formatPrice', () => {
  it('formats in BRL currency', () => {
    expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('R$ 0,00');
  });
});

describe('buildSlugFromName', () => {
  it('converts to lowercase', () => {
    expect(buildSlugFromName('My Product')).toBe('my-product');
  });

  it('removes accents', () => {
    expect(buildSlugFromName('Café')).toBe('cafe');
  });

  it('removes special characters', () => {
    expect(buildSlugFromName('Test! @#$')).toBe('test');
  });
});
```

## Mocking Patterns

### Mock Modules

```tsx
vi.mock('./hooks', () => ({
  useProducts: vi.fn(),
}));
```

### Mock API Client

```tsx
vi.mock('@/libs/api/axios', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### Mock Next.js Router

```tsx
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useParams: () => ({ slug: 'test' }),
  useSearchParams: () => new URLSearchParams(),
}));
```

## Test Data Factories

```tsx
// features/products/test-utils.ts
import { Product } from './types';

export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: '1',
  documentId: 'abc123',
  name: 'Test Product',
  slug: 'test-product',
  price: 99.99,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Usage
const product = createMockProduct({ name: 'Custom Name' });
```

## Async Testing

```tsx
it('submits form', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  render(<ProductForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'New Product' },
  });

  fireEvent.click(screen.getByText('Criar'));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Product' }),
    );
  });
});
```

## CLI Commands

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm run test -- features/products/spec.tsx
```

## Testing Checklist

- [ ] Test loading state
- [ ] Test error state
- [ ] Test empty state
- [ ] Test success state with data
- [ ] Test user interactions
- [ ] Mock external dependencies
- [ ] Use descriptive test names
- [ ] Keep tests isolated
