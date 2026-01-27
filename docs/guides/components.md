# Component Development Guide

> **How to create and structure components following HFSA principles**

---

## 📁 Component File Structure

Every component follows this standard structure:

```
/components/component-name
├── index.tsx              # Main component
├── hooks.ts               # Component-specific hooks
├── types.ts               # TypeScript types/interfaces
├── utils.ts               # Utility functions
├── constants.ts           # Constants
├── styles.module.scss     # Scoped styles
├── skeleton.tsx           # Loading skeleton
├── schema.ts              # Zod validation schema
└── spec.tsx               # Unit tests
```

---

## 🏗️ Component Structure Pattern

### Basic Component Pattern

```tsx
// components/page-title/index.tsx
import { View, Text } from 'reshaped';
import { PageTitleProps } from './types';
import styles from './styles.module.scss';

export const PageTitle = ({ title, description, children }: PageTitleProps) => {
  return (
    <View className={styles.container}>
      <View>
        <Text variant="title-3" weight="bold">
          {title}
        </Text>
        {description && <Text color="neutral-faded">{description}</Text>}
      </View>
      {children && <View>{children}</View>}
    </View>
  );
};
```

---

### Complete Component Example

```tsx
// components/metric-card/index.tsx
import { View, Text } from 'reshaped';
import { useParams } from 'next/navigation';
import { useMetricData } from './hooks';
import { MetricCardProps } from './types';
import { formatValue } from './utils';
import { DEFAULT_PRECISION } from './constants';
import styles from './styles.module.scss';

export const MetricCard = ({ metricId, label }: MetricCardProps) => {
  // 1. Import hooks first
  const params = useParams();
  const slug = params.projectSlug as string;

  // 2. Then use custom hooks
  const { data, isLoading, error } = useMetricData(metricId);

  // 3. Early returns for loading/error states
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  if (error) {
    return (
      <View className={styles.error}>
        <Text color="critical">Error loading metric</Text>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  // 4. Main render
  return (
    <View className={styles.container}>
      <Text variant="body-2" color="neutral-faded">
        {label}
      </Text>
      <Text variant="title-2" weight="bold">
        {formatValue(data.value, DEFAULT_PRECISION)}
      </Text>
    </View>
  );
};
```

---

## 📝 Types File Pattern

### Always Use Interfaces (with exceptions)

```tsx
// components/metric-card/types.ts

// ✅ Use interface for object shapes
export interface MetricCardProps {
  metricId: string;
  label: string;
  precision?: number;
}

// ✅ Use interface for hook return types
export interface UseMetricDataResult {
  data: MetricData | null;
  isLoading: boolean;
  error: Error | null;
}

// ✅ Exception: Use 'type' for unions
export type MetricType = 'count' | 'percentage' | 'currency';

// ✅ Exception: Use 'type' for single values
export type MetricValue = number | string;
```

---

## 🎣 Hooks Pattern

### Single Hook File

```tsx
// components/metric-card/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMetric } from '@/libs/api/metrics';
import { UseMetricDataProps, UseMetricDataResult } from './types';

export const useMetricData = (metricId: string): UseMetricDataResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metric', metricId],
    queryFn: () => fetchMetric(metricId),
  });

  return {
    data: data ?? null,
    isLoading,
    error: error ?? null,
  };
};
```

---

### Multiple Hooks (Folder Structure)

When you have multiple hooks, create a folder:

```
/components/complex-component
├── index.tsx
├── hooks/
│   ├── use-data.ts
│   ├── use-actions.ts
│   └── use-validation.ts
└── ...
```

```tsx
// components/complex-component/hooks/use-data.ts
export const useData = () => {
  // ...
};
```

---

## 🔧 Utils Pattern

### Function Naming Convention

Always prefix functions with action verbs:

| Prefix     | Use Case            | Example                         |
| ---------- | ------------------- | ------------------------------- |
| `handle`   | Event handlers      | `handleClick`, `handleSubmit`   |
| `build`    | Object construction | `buildQueryParams`, `buildUrl`  |
| `format`   | String formatting   | `formatDate`, `formatCurrency`  |
| `parse`    | Data parsing        | `parseResponse`, `parseJson`    |
| `validate` | Validation          | `validateEmail`, `validateForm` |
| `get`      | Data retrieval      | `getInitials`, `getValue`       |
| `is`       | Boolean checks      | `isValid`, `isEmpty`            |
| `to`       | Type conversion     | `toString`, `toArray`           |

```tsx
// components/metric-card/utils.ts

export const formatValue = (value: number, precision: number): string => {
  return value.toFixed(precision);
};

export const buildMetricUrl = (id: string): string => {
  return `/api/metrics/${id}`;
};

export const isValidMetric = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value);
};
```

---

## 📦 Constants Pattern

### Naming Convention

- Use `UPPERCASE_SNAKE_CASE`
- Only for configurations, arrays, objects
- **Never** for simple HTML text content

```tsx
// components/metric-card/constants.ts

// ✅ Good: Configuration objects
export const DEFAULT_PRECISION = 2;

export const METRIC_TYPES = {
  COUNT: 'count',
  PERCENTAGE: 'percentage',
  CURRENCY: 'currency',
} as const;

export const CHART_COLORS = ['#3366CC', '#DC3912', '#FF9900', '#109618'];

// ❌ Bad: Simple text content
// export const TITLE = 'Metric Card';
// export const ERROR_MESSAGE = 'Something went wrong';
```

---

## 🎨 Styles Pattern

### Always Use SCSS Modules

```scss
// components/metric-card/styles.module.scss
@use '@/themes/theme.css';

.container {
  padding: var(--rs-unit-x4);
  border-radius: var(--rs-radius-medium);
  background: var(--rs-color-background-elevated);
}

.error {
  color: var(--rs-color-critical);
  padding: var(--rs-unit-x2);
}

.value {
  font-size: var(--rs-font-size-title-2);
  font-weight: var(--rs-font-weight-bold);
}
```

> **Rule**: Always use Reshaped tokens. Never hardcode values.

---

## 💀 Skeleton Pattern

```tsx
// components/metric-card/skeleton.tsx
import { View, Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export const MetricCardSkeleton = () => {
  return (
    <View className={styles.container}>
      <Skeleton width="60%" height="16px" />
      <Skeleton width="40%" height="32px" />
    </View>
  );
};
```

---

## 🧪 Testing Pattern

### Component Test

```tsx
// components/metric-card/spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetricCard } from './index';

describe('MetricCard', () => {
  it('renders metric value', () => {
    render(<MetricCard metricId="1" label="Users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('shows skeleton while loading', () => {
    vi.mock('./hooks', () => ({
      useMetricData: () => ({ isLoading: true }),
    }));

    render(<MetricCard metricId="1" label="Users" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
```

---

### Utils Test

```tsx
// components/metric-card/utils.spec.tsx
import { describe, it, expect } from 'vitest';
import { formatValue, isValidMetric } from './utils';

describe('formatValue', () => {
  it('formats number with precision', () => {
    expect(formatValue(123.456, 2)).toBe('123.46');
  });
});

describe('isValidMetric', () => {
  it('returns true for valid numbers', () => {
    expect(isValidMetric(42)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isValidMetric(NaN)).toBe(false);
  });
});
```

---

## ✅ Checklist: Creating a Component

- [ ] Create folder with kebab-case name
- [ ] Create `index.tsx` with main component
- [ ] Create `types.ts` with interfaces (if needed)
- [ ] Create `hooks.ts` for custom hooks (if needed)
- [ ] Create `utils.ts` for utility functions (if needed)
- [ ] Create `constants.ts` for configurations (if needed)
- [ ] Create `styles.module.scss` with Reshaped tokens
- [ ] Create `skeleton.tsx` for loading states (if needed)
- [ ] Create `spec.tsx` for unit tests
- [ ] Export component from `index.tsx`

---

## 📚 Next Steps

- [Feature Development Guide](./features.md)
- [Code Patterns Guide](./code-patterns.md)
- [API & Data Fetching](./api-data-fetching.md)
