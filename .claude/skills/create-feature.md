---
name: create-feature
description: Use this skill when creating a new feature module following HFSA (Hybrid Feature Scope Architecture). Triggers on requests like "create a new feature", "add a feature for X", or "implement X feature".
---

# Create Feature Skill

You are creating a new feature module following the **Hybrid Feature Scope Architecture (HFSA)**.

## Feature Location

All features live in `/src/features/<feature-name>` using `kebab-case`.

## Required File Structure

```
/features/<feature-name>
├── index.tsx              # Main component (entry point) - REQUIRED
├── types.ts               # TypeScript interfaces - REQUIRED
├── hooks.ts               # Feature-specific hooks
├── utils.ts               # Utility functions
├── constants.ts           # Constants & configurations
├── schema.ts              # Zod validation schemas (for forms)
├── styles.module.scss     # Scoped styles
├── skeleton.tsx           # Loading skeleton
├── spec.tsx               # Component tests
└── api/                   # API layer (when fetching data)
    ├── query.ts           # React Query queries
    ├── mutation.ts        # React Query mutations
    └── types.ts           # API request/response types
```

## Step-by-Step Creation

### 1. Define Types (`types.ts`)

```tsx
// Component Props
export interface FeatureNameProps {
  // props
}

// Data Types
export interface EntityName {
  id: string;
  documentId: string;
  // other fields
  createdAt: string;
  updatedAt: string;
}

// Form Values (if using forms)
export interface EntityFormValues {
  // form fields
}

// Hook Return Types
export interface UseEntityResult {
  data: EntityName[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
```

### 2. Create API Layer (`api/`)

Use the service pattern from `libs/api/services/`:

```tsx
// api/query.ts
import { useQuery } from '@tanstack/react-query';
import { entityService } from '@/libs/api/services/entity';

export const useEntityQuery = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: entityService.keys('list', filters),
    queryFn: () => entityService.list(filters),
  });
};
```

```tsx
// api/mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityService } from '@/libs/api/services/entity';

export const useCreateEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => entityService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityService.keys('list') });
    },
  });
};
```

### 3. Create Hooks (`hooks.ts`)

Wrap API hooks with business logic:

```tsx
import { useEntityQuery } from './api/query';
import { transformEntity } from './utils';

export const useEntity = (): UseEntityResult => {
  const { data, isLoading, error, refetch } = useEntityQuery();

  const entities = data?.data?.map(transformEntity) ?? [];

  return {
    data: entities,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
```

### 4. Create Main Component (`index.tsx`)

```tsx
'use client';

import { useState } from 'react';
import { View, Text, Button, Loader } from 'reshaped';
import { useEntity } from './hooks';
import { FeatureNameProps } from './types';
import styles from './styles.module.scss';

export const FeatureName = ({}: FeatureNameProps) => {
  // 1. Router/Params hooks
  // 2. Context hooks
  // 3. Data fetching hooks
  const { data, isLoading, error } = useEntity();

  // 4. Local state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 5. Derived values
  // 6. Effects
  // 7. Handlers

  // 8. Early returns
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text color="critical">{error}</Text>;
  }

  // 9. Main render
  return <View className={styles.container}>{/* Content */}</View>;
};
```

### 5. Create Page (`app/.../page.tsx`)

```tsx
import { FeatureName } from '@/features/feature-name';

export default function FeatureNamePage() {
  return <FeatureName />;
}
```

## Subcomponents (Inception Pattern)

When a subcomponent grows beyond ~50 lines or needs its own styles:

```
/features/workspaces
├── index.tsx
├── card/                  # Subcomponent folder
│   ├── index.tsx
│   ├── types.ts
│   ├── styles.module.scss
│   └── skeleton.tsx
```

## Rules

1. Features own their UI, business logic, validation, and tests
2. No `/components` folder inside features - keep subcomponents flat or use Inception Pattern
3. Always export from `index.tsx`
4. Use Reshaped components for UI
5. Use SCSS modules with design tokens only
6. Transform API responses to domain models in hooks
