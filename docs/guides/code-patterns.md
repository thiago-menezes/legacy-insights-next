# Code Patterns Guide

> **Naming conventions, TypeScript patterns, and best practices for Legacy Insights**

---

## 📝 Naming Conventions

### Files and Folders

| Element           | Convention                 | Example                      |
| ----------------- | -------------------------- | ---------------------------- |
| Feature folders   | `kebab-case`               | `product-list/`              |
| Component folders | `kebab-case`               | `metric-card/`               |
| Component files   | `index.tsx`                | `index.tsx`                  |
| Hook files        | `hooks.ts` or `use-*.ts`   | `hooks.ts`, `use-product.ts` |
| Type files        | `types.ts`                 | `types.ts`                   |
| Service handlers  | `handlers.ts`              | `handlers.ts`                |
| Service index     | `index.ts`                 | `index.ts`                   |
| Util files        | `utils.ts`                 | `utils.ts`                   |
| Test files        | `spec.tsx` or `*.spec.tsx` | `spec.tsx`, `utils.spec.tsx` |
| Style files       | `styles.module.scss`       | `styles.module.scss`         |

---

### Variables and Functions

| Element          | Convention                | Example                            |
| ---------------- | ------------------------- | ---------------------------------- |
| Variables        | `camelCase`               | `productList`, `isLoading`         |
| Functions        | `camelCase` + action verb | `handleClick`, `formatDate`        |
| Constants        | `UPPER_SNAKE_CASE`        | `MAX_ITEMS`, `API_URL`             |
| Components       | `PascalCase`              | `ProductCard`, `MetricChart`       |
| Hooks            | `useCamelCase`            | `useProducts`, `useFormValidation` |
| Types/Interfaces | `PascalCase`              | `ProductProps`, `UseProductResult` |

---

### Function Prefixes

| Prefix      | Use Case                   | Examples                                         |
| ----------- | -------------------------- | ------------------------------------------------ |
| `handle`    | Event handlers             | `handleClick`, `handleSubmit`, `handleChange`    |
| `build`     | Object/data construction   | `buildQueryParams`, `buildUrl`, `buildFormData`  |
| `format`    | String/data formatting     | `formatDate`, `formatCurrency`, `formatPhone`    |
| `parse`     | Data parsing               | `parseResponse`, `parseJson`, `parseQueryString` |
| `get`       | Data retrieval/calculation | `getInitials`, `getValue`, `getTotalPrice`       |
| `set`       | State setters              | `setError`, `setLoading`                         |
| `is`        | Boolean checks             | `isValid`, `isEmpty`, `isAuthenticated`          |
| `has`       | Boolean checks             | `hasPermission`, `hasItems`                      |
| `can`       | Capability checks          | `canEdit`, `canDelete`                           |
| `should`    | Conditional logic          | `shouldRender`, `shouldRefetch`                  |
| `to`        | Conversions                | `toString`, `toArray`, `toFormData`              |
| `create`    | Factory functions          | `createUser`, `createConfig`                     |
| `transform` | Data transformation        | `transformResponse`, `transformToDto`            |
| `validate`  | Validation                 | `validateEmail`, `validateForm`                  |

---

## 🔤 TypeScript Patterns

### Interface vs Type

```tsx
// ✅ Use INTERFACE for object shapes
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

// ✅ Use TYPE for unions
export type Status = 'pending' | 'active' | 'completed';
export type Theme = 'light' | 'dark';

// ✅ Use TYPE for single primitives
export type ProductId = string;
export type Price = number;

// ✅ Use TYPE for function types
export type OnClickHandler = (event: MouseEvent) => void;

// ✅ Use TYPE for complex unions/intersections
export type FormInput = TextInput | NumberInput | SelectInput;
```

---

### Props Types Naming

```tsx
// Component props: ComponentNameProps
export interface ProductCardProps {}
export interface MetricChartProps {}

// Hook props: UseHookNameProps
export interface UseProductProps {}
export interface UseFormValidationProps {}

// Hook return: UseHookNameResult
export interface UseProductResult {}
export interface UseFormValidationResult {}
```

---

### Always Destructure Props

```tsx
// ✅ Correct: Destructure props inline
const ProductCard = ({ id, name, price, onEdit }: ProductCardProps) => {
  // ...
};

// ❌ Avoid: Using props object
const ProductCard = (props: ProductCardProps) => {
  return <div>{props.name}</div>;
};
```

---

### Always Use `const` for Components

```tsx
// ✅ Correct: Arrow function with const
export const ProductCard = ({ name }: ProductCardProps) => {
  return <div>{name}</div>;
};

// ❌ Avoid: Function declaration
export function ProductCard({ name }: ProductCardProps) {
  return <div>{name}</div>;
}
```

---

## 📦 Component Patterns

### Import Order

Follow this order in all files:

```tsx
// 1. React imports
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
// 2. Next.js imports
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
// 3. External library imports
import { Button, Text, View } from 'reshaped';
import { PageTitle } from '@/components/page-title';
// 4. Internal absolute imports (@/)
import { apiClient } from '@/libs/api/client';
import { formatDate } from '@/utils/format';
import { ProductCard } from './card';
// 5. Relative imports (same feature/component)
import { useProducts } from './hooks';
import styles from './styles.module.scss';
import { ProductProps } from './types';
```

---

### Component Internal Order

```tsx
export const ProductList = ({ categoryId }: ProductListProps) => {
  // 1. Router/Params hooks (Next.js)
  const router = useRouter();
  const params = useParams();

  // 2. Context hooks
  const { user } = useAuth();

  // 3. Data fetching hooks
  const { products, isLoading, error } = useProducts(categoryId);

  // 4. Form hooks
  const form = useForm<ProductFormSchema>();

  // 5. Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 6. Derived values
  const hasProducts = products.length > 0;
  const selectedProduct = products.find((p) => p.id === selectedId);

  // 7. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 8. Callbacks/handlers
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
  }, []);

  // 9. Early returns (loading, error, empty states)
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!hasProducts) {
    return <EmptyState />;
  }

  // 10. Main render
  return <View>{/* Component JSX */}</View>;
};
```

---

### Loading and Error States Pattern

```tsx
export const ProductList = () => {
  const { products, isLoading, error } = useProducts();

  // Loading state
  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View padding={4} backgroundColor="critical-faded" borderRadius="medium">
        <Text color="critical">{error}</Text>
      </View>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <View align="center" padding={8} textAlign="center">
        <Icon name="inbox" size={48} />
        <Text variant="featured-3">Nenhum produto encontrado</Text>
      </View>
    );
  }

  // Main render
  return (
    <View gap={4}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </View>
  );
};
```

---

## 🎣 Hook Patterns

### Custom Hook Structure

```tsx
// hooks.ts
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UseProductProps, UseProductsResult } from './types';

export const useProducts = (categoryId?: string): UseProductsResult => {
  // Data fetching with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => fetchProducts(categoryId),
  });

  // Transform data if needed
  const products = data?.map(transformProduct) ?? [];

  // Return consistent shape
  return {
    products,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
```

---

### Hook with Actions

```tsx
export const useProductActions = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = useCallback(async (data: CreateProductData) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const result = await apiClient.post('/products', data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    createProduct,
    error,
    isSubmitting,
  };
};
```

---

## 📋 Constants Patterns

### When to Use Constants

```tsx
// ✅ Good: Configuration objects
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// ✅ Good: Enum-like objects
export const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

// ✅ Good: Arrays of options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Preço' },
  { value: 'date', label: 'Data' },
];

// ✅ Good: Theme/UI configurations
export const CHART_COLORS = ['#3366CC', '#DC3912', '#FF9900'];

// ❌ Bad: Simple text (inline is better)
// export const TITLE = 'Products';
// export const BUTTON_TEXT = 'Save';
```

---

## 🚫 No Comments in Code

### Philosophy

Code should be **self-documenting**. Well-named functions, clear variable names, and proper structure eliminate the need for inline comments. When documentation is needed, use dedicated README files instead.

### Why No Comments?

1. **Comments become stale** — Code changes but comments often don't get updated
2. **Tests document behavior** — Unit and integration tests show how code works
3. **UI testing validates intent** — Browser tests demonstrate expected user flows
4. **README files are maintainable** — Dedicated docs are easier to find and update

### What Replaces Comments?

| Instead of...          | Use...                                           |
| ---------------------- | ------------------------------------------------ |
| Inline code comments   | Descriptive function/variable names              |
| "How it works" notes   | Unit tests showing inputs and outputs            |
| "Why we did this" docs | README.md in the feature folder (like `eslint/`) |
| TODO comments          | GitHub Issues or project task tracker            |
| Complex logic comments | Extract to well-named helper function            |

### When README Files Are Appropriate

Create a `README.md` in a folder only when:

- The folder has **non-obvious configuration** (like `eslint/README.md`)
- There are **external dependencies** or **environment setup** requirements
- The code implements a **complex algorithm** that needs conceptual explanation
- There are **gotchas or edge cases** that future developers must know

```
src/
├── features/
│   └── complex-feature/
│       ├── README.md          # Only if truly needed
│       ├── index.tsx
│       ├── hooks.ts
│       └── spec.tsx           # Tests document behavior
```

### Examples

```tsx
// ❌ Avoid: Comments explaining what code does
const handleSubmit = async (data: FormData) => {
  // Check if user is authenticated before submitting
  if (!user) return;

  // Format the data for the API
  const formatted = formatForApi(data);

  // Send to server
  await api.post('/items', formatted);
};

// ✅ Correct: Self-documenting code
const handleSubmit = async (data: FormData) => {
  if (!isAuthenticated) return;

  const apiPayload = buildApiPayload(data);
  await createItem(apiPayload);
};
```

```tsx
// ❌ Avoid: TODO comments in code
// TODO: Add validation here

// ✅ Correct: Create a GitHub Issue or task instead
```

### Document with Tests

```tsx
// spec.tsx - This IS your documentation
describe('calculateDiscount', () => {
  it('applies 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(15);
  });

  it('returns 0 for orders under $100', () => {
    expect(calculateDiscount(50)).toBe(0);
  });

  it('handles edge case at exactly $100', () => {
    expect(calculateDiscount(100)).toBe(10);
  });
});
```

---

## ✅ Best Practices Checklist

### TypeScript

- [ ] Always use `const` for component declarations
- [ ] Always destructure props
- [ ] Use `interface` for objects, `type` for unions
- [ ] Follow naming conventions for props types
- [ ] Enable strict mode in tsconfig

### Components

- [ ] Follow import order convention
- [ ] Follow internal component order
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Handle empty states

### Hooks

- [ ] Name hooks with `use` prefix
- [ ] Return consistent shape
- [ ] Handle errors within hook
- [ ] Use `useCallback` for returned functions

### Files

- [ ] Use `kebab-case` for file/folder names
- [ ] Export from `index.tsx`
- [ ] Keep related code together
- [ ] Split into folders when files grow
- [ ] Modular services: use `handlers.ts`, `types.ts`, and `index.ts`

---

## 📚 Next Steps

- [Feature Development Guide](./features.md)
- [API & Data Fetching](./api-data-fetching.md)
- [Styling Guide](./styling.md)
