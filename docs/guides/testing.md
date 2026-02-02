# Testing Guide

> **Unit tests, integration tests, and testing patterns with Vitest**

---

## 🧪 Testing Philosophy

| Level           | Scope                | Location                           | Framework                |
| --------------- | -------------------- | ---------------------------------- | ------------------------ |
| **Unit**        | Single function/hook | `utils.spec.tsx`, `hooks.spec.tsx` | Vitest                   |
| **Component**   | Single component     | `spec.tsx`                         | Vitest + Testing Library |
| **Integration** | Feature module       | `spec.tsx`                         | Vitest + Testing Library |

---

## 📁 Test File Location

Tests live alongside their source files:

```
/features/products
├── index.tsx          # Main component
├── spec.tsx           # Component tests
├── hooks.ts           # Hooks
├── hooks.spec.tsx     # Hook tests
├── utils.ts           # Utilities
└── utils.spec.tsx     # Utility tests
```

---

## 🔧 Basic Test Structure

### Component Test

```tsx
// features/products/spec.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProductActions, useProducts } from './hooks';
import { ProductList } from './index';

// Mock hooks
vi.mock('./hooks', () => ({
  useProducts: vi.fn(),
  useProductActions: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useProductActions as ReturnType<typeof vi.fn>).mockReturnValue({
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
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
      error: 'Failed to load products',
    });

    render(<ProductList />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<ProductList />, { wrapper: createWrapper() });

    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
  });

  it('renders product list', () => {
    (useProducts as ReturnType<typeof vi.fn>).mockReturnValue({
      products: [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ],
      isLoading: false,
      error: null,
    });

    render(<ProductList />, { wrapper: createWrapper() });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('opens create modal on button click', () => {
    render(<ProductList />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText('Novo Produto'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

---

### Hook Test

```tsx
// features/products/hooks.spec.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProductsQuery } from './api/query';
import { useProducts } from './hooks';

// Mock API layer
vi.mock('./api/query', () => ({
  useProductsQuery: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
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
    expect(result.current.isLoading).toBe(false);
  });

  it('transforms Strapi response to domain model', () => {
    (useProductsQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            documentId: 'abc123',
            name: 'Test Product',
            slug: 'test-product',
            price: 99.99,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0]).toEqual({
      id: '1',
      documentId: 'abc123',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
    });
  });

  it('returns loading state', () => {
    (useProductsQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns error message', () => {
    (useProductsQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Network error'),
    });

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.error).toBe('Network error');
  });
});
```

---

### Utility Test

```tsx
// features/products/utils.spec.tsx
import { describe, expect, it } from 'vitest';
import {
  buildSlugFromName,
  formatPrice,
  transformStrapiProduct,
} from './utils';

describe('transformStrapiProduct', () => {
  it('transforms Strapi product to domain model', () => {
    const strapiProduct = {
      id: 1,
      documentId: 'abc123',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const result = transformStrapiProduct(strapiProduct);

    expect(result).toEqual({
      id: '1',
      documentId: 'abc123',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      image: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  });

  it('transforms product with image', () => {
    const strapiProduct = {
      id: 1,
      documentId: 'abc123',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      image: {
        id: 1,
        url: '/uploads/image.jpg',
        alternativeText: 'Product image',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const result = transformStrapiProduct(strapiProduct);

    expect(result.image).toEqual({
      url: '/uploads/image.jpg',
      alt: 'Product image',
    });
  });
});

describe('buildSlugFromName', () => {
  it('converts name to lowercase slug', () => {
    expect(buildSlugFromName('My Product')).toBe('my-product');
  });

  it('removes accents', () => {
    expect(buildSlugFromName('Café com Leite')).toBe('cafe-com-leite');
  });

  it('removes special characters', () => {
    expect(buildSlugFromName('Product! @#$% Name')).toBe('product-name');
  });

  it('trims leading/trailing hyphens', () => {
    expect(buildSlugFromName('  Product Name  ')).toBe('product-name');
  });
});

describe('formatPrice', () => {
  it('formats price in BRL currency', () => {
    expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('R$ 0,00');
  });

  it('formats large numbers', () => {
    expect(formatPrice(1000000)).toBe('R$ 1.000.000,00');
  });
});
```

---

## 🎭 Mocking Patterns

### Mocking Modules

```tsx
// Mock entire module
vi.mock('./hooks', () => ({
  useProducts: vi.fn(),
}));

// Mock specific exports
vi.mock('./api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
```

---

### Mocking API Responses

```tsx
import { apiClient } from '@/libs/api/client';

vi.mock('@/libs/api/client');

describe('useCreateProductMutation', () => {
  it('creates a product', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: { id: 1, name: 'New Product' },
      },
    });

    // Test mutation...
  });
});
```

---

### Mocking Next.js Router

```tsx
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({
    projectSlug: 'test-project',
  }),
  useSearchParams: () => new URLSearchParams(),
}));
```

---

## 🔄 Testing Async Operations

```tsx
import { waitFor } from '@testing-library/react';

it('submits form successfully', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  render(<ProductForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'New Product' },
  });

  fireEvent.click(screen.getByText('Criar'));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'New Product',
      slug: 'new-product',
    });
  });
});
```

---

## 📋 Test Data Factories

```tsx
// features/products/test-utils.ts
import { Product, StrapiProduct } from './types';

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

export const createMockStrapiProduct = (
  overrides?: Partial<StrapiProduct>,
): StrapiProduct => ({
  id: 1,
  documentId: 'abc123',
  name: 'Test Product',
  slug: 'test-product',
  price: 99.99,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Usage in tests
import { createMockProduct } from './test-utils';

const product = createMockProduct({ name: 'Custom Product' });
```

---

## 🛠️ CLI Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- features/products/spec.tsx
```

---

## ✅ Testing Checklist

- [ ] Test loading state
- [ ] Test error state
- [ ] Test empty state
- [ ] Test success state
- [ ] Test user interactions
- [ ] Mock external dependencies
- [ ] Use descriptive test names
- [ ] Keep tests focused and isolated

---

## 📚 Next Steps

- [Feature Development Guide](./features.md)
- [Code Patterns Guide](./code-patterns.md)
- [CLI Commands](./cli-commands.md)
- [API Utils Testing Guide](./api-utils-testing.md)
