# Feature Development Guide

> **Step-by-step guide for creating new features following HFSA**

---

## 🎯 What is a Feature?

A **feature** is a self-contained module that:

- Owns its UI, business logic, validation, and tests
- Is isolated from other features
- Lives in `/src/features/<feature-name>`
- Is rendered by App Router pages

---

## 📁 Feature File Structure

```
/features/workspaces
├── index.tsx              # Main component (entry point)
├── card.tsx               # Subcomponent
├── form.tsx               # Subcomponent
├── form-skeleton.tsx      # Form loading skeleton
├── hooks.ts               # Feature-specific hooks
├── context.tsx            # React Context (if needed)
├── types.ts               # TypeScript interfaces
├── utils.ts               # Utility functions
├── constants.ts           # Constants & configurations
├── schema.ts              # Zod validation schemas
├── styles.module.scss     # Scoped styles
├── skeleton.tsx           # Main skeleton
├── spec.tsx               # Component tests
└── api/                   # API layer
    ├── query.ts           # React Query queries
    ├── mutation.ts        # React Query mutations
    └── types.ts           # API types
```

---

## 🚀 Creating a Feature: Complete Walkthrough

### Step 1: Create the Feature Folder

```bash
mkdir -p src/features/products
```

---

### Step 2: Define Types (`types.ts`)

```tsx
// features/products/types.ts

// Component Props
export interface ProductListProps {
  categoryId?: string;
}

export interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

// Data Types
export interface Product {
  id: string;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Form Values
export interface ProductFormValues {
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: File | string | null;
}

// Hook Types
export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
```

---

### Step 3: Create API Layer (`api/`)

#### API Types (`api/types.ts`)

```tsx
// features/products/api/types.ts

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

export interface ProductsResponse {
  data: StrapiProduct[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
  };
}

export interface CreateProductParams {
  name: string;
  slug: string;
  price: number;
  description?: string;
}
```

---

#### Queries (`api/query.ts`)

```tsx
// features/products/api/query.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/client';
import { ProductsResponse, StrapiProduct } from './types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProductsQuery = (categoryId?: string) => {
  return useQuery({
    queryKey: productKeys.list({ categoryId }),
    queryFn: async () => {
      const params = categoryId
        ? { filters: { category: { id: categoryId } } }
        : {};

      const response = await apiClient.get<ProductsResponse>('/api/products', {
        params,
      });
      return response.data;
    },
  });
};

export const useProductQuery = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<{ data: StrapiProduct }>(
        `/api/products/${slug}`,
      );
      return response.data.data;
    },
    enabled: !!slug,
  });
};
```

---

#### Mutations (`api/mutation.ts`)

```tsx
// features/products/api/mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/client';
import { productKeys } from './query';
import { CreateProductParams, StrapiProduct } from './types';

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateProductParams) => {
      const response = await apiClient.post<{ data: StrapiProduct }>(
        '/api/products',
        { data: params },
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      params,
    }: {
      id: string;
      params: Partial<CreateProductParams>;
    }) => {
      const response = await apiClient.put<{ data: StrapiProduct }>(
        `/api/products/${id}`,
        { data: params },
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
```

---

### Step 4: Create Hooks (`hooks.ts`)

```tsx
// features/products/hooks.ts
import { useState, useCallback } from 'react';
import { useProductsQuery, useProductQuery } from './api/query';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './api/mutation';
import { Product, UseProductsResult } from './types';
import { transformStrapiProduct } from './utils';

export const useProducts = (categoryId?: string): UseProductsResult => {
  const { data, isLoading, error, refetch } = useProductsQuery(categoryId);

  const products: Product[] = data?.data?.map(transformStrapiProduct) ?? [];

  return {
    products,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
};

export const useProductBySlug = (slug: string) => {
  const { data, isLoading, error } = useProductQuery(slug);

  return {
    product: data ? transformStrapiProduct(data) : null,
    isLoading,
    error: error?.message ?? null,
  };
};

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
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      }
    },
    [createMutation],
  );

  const updateProduct = useCallback(
    async (id: string, params: Partial<CreateProductParams>) => {
      try {
        setError(null);
        return await updateMutation.mutateAsync({ id, params });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
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
        const message = err instanceof Error ? err.message : 'Unknown error';
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

### Step 5: Create Validation Schema (`schema.ts`)

```tsx
// features/products/schema.ts
import { z } from 'zod';

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug deve conter apenas letras minúsculas, números e hífens',
    ),

  price: z
    .number()
    .min(0, 'Preço não pode ser negativo')
    .max(999999.99, 'Preço muito alto'),

  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),

  image: z.union([z.instanceof(File), z.string().url(), z.null()]).optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
```

---

### Step 6: Create Utils (`utils.ts`)

```tsx
// features/products/utils.ts
import { StrapiProduct } from './api/types';
import { Product } from './types';

export const transformStrapiProduct = (strapi: StrapiProduct): Product => ({
  id: strapi.id.toString(),
  documentId: strapi.documentId,
  name: strapi.name,
  slug: strapi.slug,
  price: strapi.price,
  description: strapi.description,
  image: strapi.image
    ? {
        url: strapi.image.url,
        alt: strapi.image.alternativeText,
      }
    : undefined,
  createdAt: strapi.createdAt,
  updatedAt: strapi.updatedAt,
});

export const buildSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};
```

---

### Step 7: Create Subcomponents

#### Product Card (`card.tsx`)

```tsx
// features/products/card.tsx
import { View, Text, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { ProductCardProps } from './types';
import { formatPrice } from './utils';
import styles from './styles.module.scss';

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  return (
    <View className={styles.card}>
      {product.image && (
        <img
          src={product.image.url}
          alt={product.image.alt || product.name}
          className={styles.cardImage}
        />
      )}

      <View padding={4} gap={2}>
        <Text variant="body-1" weight="semibold">
          {product.name}
        </Text>

        <Text variant="body-2" color="primary">
          {formatPrice(product.price)}
        </Text>

        {product.description && (
          <Text variant="body-2" color="neutral-faded">
            {product.description}
          </Text>
        )}

        <View direction="row" gap={2}>
          <Button
            variant="outline"
            size="small"
            icon={<Icon name="edit" />}
            onClick={() => onEdit(product)}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="small"
            color="critical"
            icon={<Icon name="trash" />}
            onClick={() => onDelete(product.documentId)}
          >
            Excluir
          </Button>
        </View>
      </View>
    </View>
  );
};
```

---

#### Product Form (`form.tsx`)

```tsx
// features/products/form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Button, TextField } from 'reshaped';
import { productFormSchema, ProductFormSchema } from './schema';
import { ProductFormProps } from './types';
import { buildSlugFromName } from './utils';

export const ProductForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues || {
      name: '',
      slug: '',
      price: 0,
      description: '',
    },
  });

  const name = watch('name');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue('name', newName);

    // Auto-generate slug
    if (!initialValues) {
      setValue('slug', buildSlugFromName(newName));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4}>
        <TextField
          name="name"
          label="Nome"
          placeholder="Nome do produto"
          inputAttributes={{ ...register('name'), onChange: handleNameChange }}
          hasError={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          name="slug"
          label="Slug"
          placeholder="nome-do-produto"
          inputAttributes={register('slug')}
          hasError={!!errors.slug}
          helperText={errors.slug?.message}
        />

        <TextField
          name="price"
          label="Preço"
          type="number"
          placeholder="0.00"
          inputAttributes={register('price', { valueAsNumber: true })}
          hasError={!!errors.price}
          helperText={errors.price?.message}
        />

        <TextField
          name="description"
          label="Descrição"
          placeholder="Descrição do produto (opcional)"
          inputAttributes={register('description')}
          hasError={!!errors.description}
          helperText={errors.description?.message}
        />

        <View direction="row" gap={2} justify="end">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" color="primary" loading={isSubmitting}>
            {initialValues ? 'Atualizar' : 'Criar'}
          </Button>
        </View>
      </View>
    </form>
  );
};
```

---

### Step 8: Create Main Component (`index.tsx`)

```tsx
// features/products/index.tsx
'use client';

import { useState } from 'react';
import { View, Text, Button, Loader, Modal } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { ProductCard } from './card';
import { ProductForm } from './form';
import { useProducts, useProductActions } from './hooks';
import { Product, ProductFormValues, ProductListProps } from './types';
import styles from './styles.module.scss';

export const ProductList = ({ categoryId }: ProductListProps) => {
  // 1. Hooks first
  const { products, isLoading, error, refetch } = useProducts(categoryId);
  const { createProduct, updateProduct, deleteProduct } = useProductActions();

  // 2. Local state
  const [isModalActive, setIsModalActive] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 3. Handler functions
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalActive(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalActive(true);
  };

  const handleCloseModal = () => {
    setIsModalActive(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.documentId, values);
      } else {
        await createProduct(values);
      }
      handleCloseModal();
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id);
      refetch();
    }
  };

  // 4. Early returns for loading/error
  if (isLoading) {
    return (
      <View align="center" padding={10}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View padding={4} backgroundColor="critical-faded" borderRadius="medium">
        <Text color="critical">{error}</Text>
      </View>
    );
  }

  // 5. Main render
  return (
    <>
      <PageTitle title="Produtos" description="Gerencie seus produtos">
        <Button
          color="primary"
          icon={<Icon name="plus" size={18} />}
          onClick={handleOpenCreate}
        >
          Novo Produto
        </Button>
      </PageTitle>

      {products.length === 0 ? (
        <View gap={4} align="center" padding={8} textAlign="center">
          <Icon name="package" size={48} />
          <Text variant="featured-3" weight="medium">
            Nenhum produto encontrado
          </Text>
          <Button
            icon={<Icon name="plus" size={18} />}
            color="primary"
            onClick={handleOpenCreate}
          >
            Criar Primeiro Produto
          </Button>
        </View>
      ) : (
        <View className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}

      <Modal active={isModalActive} onClose={handleCloseModal}>
        <Modal.Title>
          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
        </Modal.Title>
        <ProductForm
          key={editingProduct?.documentId || 'new'}
          initialValues={
            editingProduct
              ? {
                  name: editingProduct.name,
                  slug: editingProduct.slug,
                  price: editingProduct.price,
                  description: editingProduct.description,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};
```

---

### Step 9: Create Styles (`styles.module.scss`)

```scss
// features/products/styles.module.scss

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--rs-unit-x4);
}

.card {
  background: var(--rs-color-background-elevated);
  border-radius: var(--rs-radius-medium);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--rs-shadow-overlay);
  }
}

.cardImage {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
```

---

### Step 10: Create Page (`app/(features)/products/page.tsx`)

```tsx
// app/(features)/products/page.tsx
import { ProductList } from '@/features/products';

export default function ProductsPage() {
  return <ProductList />;
}
```

---

## ✅ Feature Creation Checklist

- [ ] Create feature folder in `/src/features/<name>`
- [ ] Define types in `types.ts`
- [ ] Create API layer (`api/query.ts`, `api/mutation.ts`, `api/types.ts`)
- [ ] Create hooks in `hooks.ts`
- [ ] Create validation schema in `schema.ts`
- [ ] Create utility functions in `utils.ts`
- [ ] Create subcomponents (card, form, etc.)
- [ ] Create main component in `index.tsx`
- [ ] Create styles in `styles.module.scss`
- [ ] Create page in `app/(features)/<name>/page.tsx`
- [ ] Write tests in `spec.tsx`

---

## 📚 Next Steps

- [Component Development Guide](./components.md)
- [Code Patterns Guide](./code-patterns.md)
- [API & Data Fetching](./api-data-fetching.md)
