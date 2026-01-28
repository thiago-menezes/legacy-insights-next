---
name: create-api
description: Use this skill when creating API integrations with React Query, including services, queries, and mutations. Triggers on requests like "create API for X", "add data fetching", "integrate with backend", or "create service for X".
---

# Create API Skill

You are creating an API integration layer using **React Query** and the **service pattern**.

## Architecture Overview

```
libs/api/
├── axios.ts           # Axios client configuration
└── services/          # Service layer (API calls only here!)
    └── <entity>/      # Modular service folder
        ├── handlers.ts # Direct API call definitions
        ├── types.ts    # Service specific types
        └── index.ts    # Service export

Feature Module
├── hooks.ts           # Business logic hooks (uses API hooks)
└── api/
    ├── query.ts       # React Query queries (uses services)
    ├── mutation.ts    # React Query mutations (uses services)
    └── types.ts       # API request/response types
```

## Step-by-Step Creation

### 1. Create Service (`libs/api/services/<entity>/`)

#### handlers.ts

```tsx
import { apiClient } from '../../axios';
import {
  EntityResponse,
  EntityListResponse,
  CreateEntityParams,
} from './types';

export const entityHandler = {
  async list(filters?: Record<string, unknown>): Promise<EntityListResponse> {
    const { data } = await apiClient.get<EntityListResponse>('/api/entities', {
      params: filters,
    });
    return data;
  },

  async get(id: string): Promise<EntityResponse> {
    const { data } = await apiClient.get<EntityResponse>(`/api/entities/${id}`);
    return data;
  },

  async create(params: CreateEntityParams): Promise<EntityResponse> {
    const { data } = await apiClient.post<EntityResponse>('/api/entities', {
      data: params,
    });
    return data;
  },

  async update(
    id: string,
    params: Partial<CreateEntityParams>,
  ): Promise<EntityResponse> {
    const { data } = await apiClient.put<EntityResponse>(
      `/api/entities/${id}`,
      {
        data: params,
      },
    );
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/entities/${id}`);
  },
};
```

#### types.ts

```tsx
export interface StrapiEntity {
  id: number;
  documentId: string;
  name: string;
  // other fields from Strapi
  createdAt: string;
  updatedAt: string;
}

export interface EntityListResponse {
  data: StrapiEntity[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface EntityResponse {
  data: StrapiEntity;
  meta: Record<string, unknown>;
}

export interface CreateEntityParams {
  name: string;
  // other create fields
}
```

#### index.ts

```tsx
export * from './handlers';
export type * from './types';
```

### 2. Create Feature API Layer (`features/<feature>/api/`)

#### query.ts

```tsx
import { useQuery } from '@tanstack/react-query';
import { entityService } from '@/libs/api/services/entity';

export const useEntityListQuery = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: entityService.keys(filters),
    queryFn: () => entityService.list(filters),
  });
};

export const useEntityQuery = (id: string) => {
  return useQuery({
    queryKey: entityService.keys(id),
    queryFn: () => entityService.get(id),
    enabled: !!id,
  });
};
```

#### mutation.ts

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityService } from '@/libs/api/services/entity';
import { CreateEntityParams } from '@/libs/api/services/entity';

export const useCreateEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateEntityParams) => entityService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityService.keys() });
    },
  });
};

export const useUpdateEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string;
      params: Partial<CreateEntityParams>;
    }) => entityService.update(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityService.keys() });
    },
  });
};

export const useDeleteEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityService.keys() });
    },
  });
};
```

### 3. Create Business Logic Hook (`features/<feature>/hooks.ts`)

```tsx
import { useState, useCallback } from 'react';
import { useEntityListQuery, useEntityQuery } from './api/query';
import {
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} from './api/mutation';
import { transformEntity } from './utils';
import { Entity, UseEntitiesResult } from './types';

export const useEntities = (
  filters?: Record<string, unknown>,
): UseEntitiesResult => {
  const { data, isLoading, error, refetch } = useEntityListQuery(filters);

  const entities: Entity[] = data?.data?.map(transformEntity) ?? [];

  return {
    entities,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
};

export const useEntityActions = () => {
  const createMutation = useCreateEntityMutation();
  const updateMutation = useUpdateEntityMutation();
  const deleteMutation = useDeleteEntityMutation();

  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (params: CreateEntityParams) => {
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

  return {
    create,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
```

## Pagination Pattern

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

export const useEntitiesInfiniteQuery = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: entityService.keys('list', { pageSize }),
    queryFn: async ({ pageParam = 1 }) => {
      return entityService.list({
        pagination: { page: pageParam, pageSize },
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
```

## Rules

1. **Axios/Strapi API calls should ONLY be in service files** (`libs/api/services/`)
2. Query and mutation hooks use services, never direct axios calls
3. Transform Strapi responses to domain models in feature hooks
4. Always invalidate related queries after mutations
5. Use `enabled` option for conditional queries
6. Handle errors in both hooks and components
