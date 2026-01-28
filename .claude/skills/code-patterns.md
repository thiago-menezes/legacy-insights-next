---
name: code-patterns
description: Use this skill when writing code to follow project conventions, naming patterns, TypeScript rules, and import order. Triggers on requests about code style, naming conventions, or best practices.
---

# Code Patterns Skill

Follow these conventions for all code in Legacy Insight.

## Naming Conventions

### Files and Folders

| Element           | Convention                 | Example                      |
| ----------------- | -------------------------- | ---------------------------- |
| Feature folders   | `kebab-case`               | `product-list/`              |
| Component folders | `kebab-case`               | `metric-card/`               |
| Component files   | `index.tsx`                | `index.tsx`                  |
| Hook files        | `hooks.ts` or `use-*.ts`   | `hooks.ts`, `use-product.ts` |
| Type files        | `types.ts`                 | `types.ts`                   |
| Service handlers  | `handlers.ts`              | `handlers.ts`                |
| Util files        | `utils.ts`                 | `utils.ts`                   |
| Test files        | `spec.tsx` or `*.spec.tsx` | `spec.tsx`, `utils.spec.tsx` |
| Style files       | `styles.module.scss`       | `styles.module.scss`         |

### Variables and Functions

| Element          | Convention                | Example                            |
| ---------------- | ------------------------- | ---------------------------------- |
| Variables        | `camelCase`               | `productList`, `isLoading`         |
| Functions        | `camelCase` + action verb | `handleClick`, `formatDate`        |
| Constants        | `UPPER_SNAKE_CASE`        | `MAX_ITEMS`, `API_URL`             |
| Components       | `PascalCase`              | `ProductCard`, `MetricChart`       |
| Hooks            | `useCamelCase`            | `useProducts`, `useFormValidation` |
| Types/Interfaces | `PascalCase`              | `ProductProps`, `UseProductResult` |

### Function Prefixes

| Prefix      | Use Case                   | Examples                              |
| ----------- | -------------------------- | ------------------------------------- |
| `handle`    | Event handlers             | `handleClick`, `handleSubmit`         |
| `build`     | Object/data construction   | `buildQueryParams`, `buildUrl`        |
| `format`    | String/data formatting     | `formatDate`, `formatCurrency`        |
| `parse`     | Data parsing               | `parseResponse`, `parseJson`          |
| `get`       | Data retrieval/calculation | `getInitials`, `getValue`             |
| `is`        | Boolean checks             | `isValid`, `isEmpty`                  |
| `has`       | Boolean checks             | `hasPermission`, `hasItems`           |
| `to`        | Conversions                | `toString`, `toArray`                 |
| `transform` | Data transformation        | `transformResponse`, `transformToDto` |
| `validate`  | Validation                 | `validateEmail`, `validateForm`       |

## TypeScript Patterns

### Interface vs Type

```tsx
// Use INTERFACE for object shapes
export interface ProductProps {
  id: string;
  name: string;
}

export interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
}

// Use TYPE for unions
export type Status = 'pending' | 'active' | 'completed';

// Use TYPE for single primitives
export type ProductId = string;

// Use TYPE for function types
export type OnClickHandler = (event: MouseEvent) => void;
```

### Props Naming

```tsx
// Component props: ComponentNameProps
export interface ProductCardProps {}

// Hook props: UseHookNameProps
export interface UseProductProps {}

// Hook return: UseHookNameResult
export interface UseProductResult {}
```

### Always Destructure Props

```tsx
// CORRECT
const ProductCard = ({ id, name, price }: ProductCardProps) => {};

// AVOID
const ProductCard = (props: ProductCardProps) => {
  return <div>{props.name}</div>;
};
```

### Always Use const for Components

```tsx
// CORRECT
export const ProductCard = ({ name }: Props) => {
  return <div>{name}</div>;
};

// AVOID
export function ProductCard({ name }: Props) {
  return <div>{name}</div>;
}
```

## Import Order

```tsx
// 1. React imports
import { useState, useEffect, useCallback } from 'react';

// 2. Next.js imports
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// 3. External library imports
import { View, Text, Button } from 'reshaped';
import { useQuery } from '@tanstack/react-query';

// 4. Internal absolute imports (@/)
import { apiClient } from '@/libs/api/client';
import { PageTitle } from '@/components/page-title';

// 5. Relative imports (same feature/component)
import { useProducts } from './hooks';
import { ProductCard } from './card';
import { ProductProps } from './types';
import styles from './styles.module.scss';
```

## Component Internal Order

```tsx
export const ProductList = ({ categoryId }: Props) => {
  // 1. Router/Params hooks (Next.js)
  const router = useRouter();

  // 2. Context hooks
  const { user } = useAuth();

  // 3. Data fetching hooks
  const { products, isLoading, error } = useProducts();

  // 4. Form hooks
  const form = useForm<FormSchema>();

  // 5. Local state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 6. Derived values
  const hasProducts = products.length > 0;

  // 7. Effects
  useEffect(() => {}, []);

  // 8. Callbacks/handlers
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // 9. Early returns (loading, error, empty)
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  if (!hasProducts) return <EmptyState />;

  // 10. Main render
  return <View>{/* JSX */}</View>;
};
```

## No Comments Policy

Code should be self-documenting. Use:

- Descriptive function/variable names instead of comments
- Unit tests to document behavior
- README.md files only when truly needed (complex configs, external deps)

```tsx
// AVOID
// Check if user is authenticated
if (!user) return;

// CORRECT
if (!isAuthenticated) return;
```

## Constants Pattern

```tsx
// GOOD: Configuration objects
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
} as const;

// BAD: Simple text (inline is better)
// export const TITLE = 'Products';
```
