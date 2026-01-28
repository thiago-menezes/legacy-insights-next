---
name: types
description: Use this skill when defining TypeScript types, interfaces, or working with type patterns. Triggers on requests about TypeScript, types, interfaces, generics, or type definitions.
---

# Types Skill

Follow these TypeScript patterns for Legacy Insight.

## Interface vs Type

```tsx
// USE INTERFACE for object shapes
export interface ProductProps {
  id: string;
  name: string;
  price: number;
}

export interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

// USE TYPE for unions
export type Status = 'pending' | 'active' | 'completed';
export type Theme = 'light' | 'dark';

// USE TYPE for single primitives
export type ProductId = string;
export type Price = number;

// USE TYPE for function types
export type OnClickHandler = (event: MouseEvent) => void;
export type AsyncAction<T> = () => Promise<T>;

// USE TYPE for complex unions/intersections
export type FormInput = TextInput | NumberInput | SelectInput;
export type WithId<T> = T & { id: string };
```

## Naming Conventions

| Type              | Convention           | Example               |
| ----------------- | -------------------- | --------------------- |
| Component Props   | `ComponentNameProps` | `ProductCardProps`    |
| Hook Props        | `UseHookNameProps`   | `UseProductProps`     |
| Hook Return       | `UseHookNameResult`  | `UseProductResult`    |
| API Response      | `EntityResponse`     | `ProductResponse`     |
| API List Response | `EntityListResponse` | `ProductListResponse` |
| Form Values       | `EntityFormValues`   | `ProductFormValues`   |
| Strapi Types      | `StrapiEntity`       | `StrapiProduct`       |

## Type File Structure

### Feature Types (`features/products/types.ts`)

```tsx
// 1. Component Props
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

// 2. Domain/Entity Types
export interface Product {
  id: string;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: ProductImage;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

// 3. Form Types
export interface ProductFormValues {
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: File | string | null;
}

// 4. Hook Return Types
export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseProductActionsResult {
  createProduct: (params: CreateProductParams) => Promise<Product>;
  updateProduct: (id: string, params: UpdateProductParams) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}
```

### API Types (`features/products/api/types.ts`)

```tsx
// Strapi response types
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

// Generic Strapi wrappers
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

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Request types
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

// Response aliases
export type ProductsResponse = StrapiCollectionResponse<StrapiProduct>;
export type ProductResponse = StrapiSingleResponse<StrapiProduct>;
```

## Common Patterns

### Optional Props with Defaults

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const Button = ({ variant = 'primary', size = 'medium' }: ButtonProps) => {};
```

### Children Pattern

```tsx
interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}
```

### Event Handlers

```tsx
interface FormProps {
  onSubmit: (values: FormValues) => void;
  onChange?: (field: string, value: unknown) => void;
}
```

### Generics

```tsx
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Discriminated Unions

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Usage
const state: AsyncState<Product[]> = { status: 'loading' };
```

### Utility Types

```tsx
// Pick specific properties
type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>;

// Omit properties
type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Make all optional
type PartialProduct = Partial<Product>;

// Make all required
type RequiredProduct = Required<Product>;

// Record for objects
type ProductMap = Record<string, Product>;
```

## Rules

1. Always use `interface` for object shapes
2. Use `type` for unions, primitives, and function types
3. Export all types from `types.ts`
4. Keep Strapi/API types separate from domain types
5. Use descriptive names following conventions
6. Prefer explicit types over `any` or `unknown`
