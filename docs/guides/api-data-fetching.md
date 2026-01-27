# API & Data Fetching Guide

> **React Query integration, API layer, and data management patterns**

---

## 🏗️ Architecture Overview

```
libs/api/
├── axios.ts           # Axios client configuration
├── utils.ts           # createServiceKeys utility
└── services/          # Service layer (API calls only here!)
    └── workspaces/    # Modular service folder
        ├── handlers.ts # Direct API call definitions
        ├── types.ts    # Service specific types
        └── index.ts    # Service export using createServiceKeys

Feature Module
├── hooks.ts           # Business logic hooks (uses API hooks)
└── api/
    ├── query.ts       # React Query queries (uses services)
    ├── mutation.ts    # React Query mutations (uses services)
    └── types.ts       # API request/response types
```

> [!IMPORTANT]
> **Axios/Strapi API calls should ONLY be imported inside service files** (`libs/api/services/`).
> Query and mutation hooks should use services, never direct axios calls.

---

## 📦 Services Layer

### Service Pattern (`libs/api/services/`)

Services encapsulate all direct API calls using a modular structure. This is the **only place** where `apiClient` (axios) should be imported.

The structure consists of:

1. `handlers.ts`: Defines the API call methods.
2. `types.ts`: Service-specific request/response types.
3. `index.ts`: Exports the service using `createServiceKeys`.

#### Example: Handlers (`libs/api/services/products/handlers.ts`)

```tsx
import { apiClient } from '../../axios';
import {
  ProductsResponse,
  SingleProductResponse,
  ProductCreateInput,
} from './types';

export const productHandler = {
  async list(filters?: { categoryId?: string }): Promise<ProductsResponse> {
    const { data } = await apiClient.get<ProductsResponse>('/api/products', {
      params: filters,
    });
    return data;
  },

  async get(id: string): Promise<SingleProductResponse> {
    const { data } = await apiClient.get<SingleProductResponse>(
      `/api/products/${id}`,
    );
    return data;
  },
  // ... other methods
};
```

#### Example: Index (`libs/api/services/products/index.ts`)

```tsx
import { createServiceKeys } from '../../utils';
import { productHandler } from './handlers';

export const productService =
  createServiceKeys<typeof productHandler>(productHandler);

export type * from './types';
```

---

## 📦 API Layer Structure

### API Types (`api/types.ts`)

Define all request parameters and response shapes:

```tsx
// features/products/api/types.ts

// Response types from Strapi
export interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Collection response wrapper
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Single item response wrapper
export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Request parameters
export interface CreateProductParams {
  name: string;
  slug: string;
  price: number;
  description?: string;
}

export interface UpdateProductParams {
  name?: string;
  slug?: string;
  price?: number;
  description?: string;
}

// Alias for common responses
export type ProductsResponse = StrapiCollectionResponse<StrapiProduct>;
export type ProductResponse = StrapiSingleResponse<StrapiProduct>;
```

---

### Query Keys Pattern

Instead of manual key factories, use the built-in `.keys()` method provided by `createServiceKeys`.

```tsx
// features/products/api/query.ts
import { productService } from '@/libs/api/services/products';

// Usage in hooks:
// productService.keys('list')                → ['list', 'list']
// productService.keys('list', { cat: '1' })   → ['list', 'list', { cat: '1' }]
// productService.keys('get', 'abc')           → ['list', 'get', 'abc']
```

> [!NOTE]
> The first element of the key defaults to the first method name in the handler if not explicitly provided as an alternative key.

---

### Queries (`api/query.ts`)

Query hooks use services, **not direct API calls**:

```tsx
// features/products/api/query.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/libs/api/services/products';

export const useProductsQuery = (categoryId?: string) => {
  const filters = categoryId ? { categoryId } : {};

  return useQuery({
    queryKey: productService.keys('list', filters),
    queryFn: () => productService.list(filters),
  });
};

// Detail query with conditional fetching
export const useProductQuery = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.get(slug),
    enabled: !!slug,
  });
};

// Query with multiple parameters
export const useUnitsQuery = (
  institution: string,
  courseId: string,
  city?: string,
  state?: string,
) => {
  return useQuery({
    queryKey: ['units', courseId, institution, state, city],
    queryFn: () =>
      workspaceService.get({
        institution,
        state,
        city,
        courseId,
      }),
    enabled: !!institution && !!courseId,
  });
};
```

---

### Mutations (`api/mutation.ts`)

Mutation hooks also use services, **not direct API calls**:

```tsx
// features/products/api/mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/libs/api/services/products';
import { CreateProductParams, UpdateProductParams } from './types';

// Create mutation
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateProductParams) => productService.create(params),
    onSuccess: () => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: productService.keys('list') });
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
};

// Update mutation
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateProductParams }) =>
      productService.update(id, params),
    onSuccess: (data) => {
      // Invalidate all product queries if needed, or specific ones
      queryClient.invalidateQueries({ queryKey: productService.keys('list') });

      // Or update cache directly
      // queryClient.setQueryData(productService.keys('get', data.data.slug), data.data);
    },
  });
};

// Delete mutation
export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productService.keys('list'),
      });
    },
  });
};
```

---

## 🎣 Business Logic Hooks

Wrap API hooks in business logic hooks for features:

```tsx
// features/products/hooks.ts
import { useState, useCallback } from 'react';
import { useProductsQuery, useProductQuery } from './api/query';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './api/mutation';
import { transformStrapiProduct } from './utils';
import { Product, UseProductsResult } from './types';

// Read hook
export const useProducts = (categoryId?: string): UseProductsResult => {
  const { data, isLoading, error, refetch } = useProductsQuery(categoryId);

  // Transform Strapi response to domain model
  const products: Product[] = data?.data?.map(transformStrapiProduct) ?? [];

  return {
    products,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
};

// Single item hook
export const useProductBySlug = (slug: string) => {
  const { data, isLoading, error } = useProductQuery(slug);

  return {
    product: data ? transformStrapiProduct(data) : null,
    isLoading,
    error: error?.message ?? null,
  };
};

// Actions hook
export const useProductActions = () => {
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(
    async (params: CreateProductParams) => {
      try {
        setError(null);
        return await createMutation.mutateAsync(params);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create';
        setError(message);
        throw err;
      }
    },
    [createMutation],
  );

  const updateProduct = useCallback(
    async (id: string, params: UpdateProductParams) => {
      try {
        setError(null);
        return await updateMutation.mutateAsync({ id, params });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update';
        setError(message);
        throw err;
      }
    },
    [updateMutation],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete';
        setError(message);
        throw err;
      }
    },
    [deleteMutation],
  );

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
```

---

## 🔧 API Client Configuration

```tsx
// libs/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

---

## 📤 File Upload Pattern

```tsx
// features/products/api/mutation.ts

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('files', file);

      const response = await apiClient.post<Array<{ id: number; url: string }>>(
        '/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data[0];
    },
  });
};

// Usage in form
export const useCreateProductWithImage = () => {
  const uploadMutation = useUploadImageMutation();
  const createMutation = useCreateProductMutation();

  return useMutation({
    mutationFn: async (params: CreateProductWithImageParams) => {
      let imageId: number | undefined;

      // Upload image first if provided
      if (params.image instanceof File) {
        const uploaded = await uploadMutation.mutateAsync(params.image);
        imageId = uploaded.id;
      }

      // Create product with image reference
      return await createMutation.mutateAsync({
        ...params,
        image: imageId,
      });
    },
  });
};
```

---

## 🔄 Pagination Pattern

```tsx
// features/products/api/query.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useProductsInfiniteQuery = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: productKeys.list({ pageSize }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ProductsResponse>('/api/products', {
        params: {
          pagination: {
            page: pageParam,
            pageSize,
          },
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Usage in component
const ProductList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsInfiniteQuery();

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
          Load More
        </Button>
      )}
    </>
  );
};
```

---

## ✅ Best Practices

| Practice               | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Query Keys Factory** | Use consistent key structure for cache management |
| **Separate API Layer** | Keep API logic in `api/` folder                   |
| **Transform Data**     | Convert Strapi format to domain models            |
| **Error Handling**     | Handle errors in both hooks and components        |
| **Type Safety**        | Define types for all requests/responses           |
| **Cache Invalidation** | Invalidate related queries after mutations        |
| **Optimistic Updates** | Use for better UX on simple mutations             |

---

## 📚 Next Steps

- [Feature Development Guide](./features.md)
- [Code Patterns Guide](./code-patterns.md)
- [Testing Guide](./testing.md)
