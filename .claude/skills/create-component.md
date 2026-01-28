---
name: create-component
description: Use this skill when creating a new shared UI component in /src/components. Triggers on requests like "create a component", "add a shared component", or "build a reusable X component".
---

# Create Component Skill

You are creating a **shared UI component** in `/src/components`. These are logic-free, reusable components used across multiple features.

## Component Location

All shared components live in `/src/components/<component-name>` using `kebab-case`.

## File Structure

```
/components/<component-name>
├── index.tsx              # Main component - REQUIRED
├── types.ts               # TypeScript types/interfaces
├── hooks.ts               # Component-specific hooks (rare)
├── utils.ts               # Utility functions
├── constants.ts           # Constants
├── styles.module.scss     # Scoped styles
├── skeleton.tsx           # Loading skeleton
└── spec.tsx               # Unit tests
```

## Component vs Feature

| Aspect          | `/components`          | `/features`            |
| --------------- | ---------------------- | ---------------------- |
| **Logic**       | None (pure UI)         | Business logic allowed |
| **State**       | Minimal, prop-driven   | Can have complex state |
| **API calls**   | Never                  | Yes, via React Query   |
| **Validation**  | Never                  | Yes, via Zod           |
| **Reusability** | High (across features) | Low (feature-specific) |

## Step-by-Step Creation

### 1. Define Types (`types.ts`)

```tsx
// Use interface for object shapes
export interface ComponentNameProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onAction?: () => void;
}

// Use type for unions
export type ComponentVariant = 'default' | 'outlined' | 'filled';
```

### 2. Create Main Component (`index.tsx`)

```tsx
import { View, Text } from 'reshaped';
import { ComponentNameProps } from './types';
import styles from './styles.module.scss';

export const ComponentName = ({
  title,
  description,
  children,
  onAction,
}: ComponentNameProps) => {
  return (
    <View className={styles.container}>
      <Text variant="title-3" weight="bold">
        {title}
      </Text>
      {description && <Text color="neutral-faded">{description}</Text>}
      {children}
    </View>
  );
};
```

### 3. Create Styles (`styles.module.scss`)

Always use design tokens:

```scss
.container {
  padding: var(--rs-unit-x4);
  border-radius: var(--rs-radius-medium);
  background: var(--rs-color-background-elevated);
}

.title {
  font-size: var(--rs-font-size-title-2);
  color: var(--rs-color-foreground);
}
```

### 4. Create Skeleton (`skeleton.tsx`)

```tsx
import { View, Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export const ComponentNameSkeleton = () => {
  return (
    <View className={styles.container}>
      <Skeleton width="60%" height="24px" />
      <Skeleton width="80%" height="16px" />
    </View>
  );
};
```

### 5. Create Tests (`spec.tsx`)

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentName } from './index';

describe('ComponentName', () => {
  it('renders title', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ComponentName title="Title" description="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
```

## Patterns

### Always Use Arrow Functions with const

```tsx
// Correct
export const ComponentName = ({ prop }: Props) => {
  return <div>{prop}</div>;
};

// Avoid
export function ComponentName({ prop }: Props) {
  return <div>{prop}</div>;
}
```

### Always Destructure Props

```tsx
// Correct
const ComponentName = ({ id, name, onEdit }: Props) => {};

// Avoid
const ComponentName = (props: Props) => {
  return <div>{props.name}</div>;
};
```

### Utils Naming Convention

| Prefix   | Use Case            | Example                      |
| -------- | ------------------- | ---------------------------- |
| `format` | String formatting   | `formatDate`, `formatPrice`  |
| `build`  | Object construction | `buildClassName`, `buildUrl` |
| `get`    | Data retrieval      | `getInitials`, `getValue`    |
| `is`     | Boolean checks      | `isValid`, `isEmpty`         |
| `to`     | Type conversion     | `toString`, `toArray`        |

## Rules

1. Components must be logic-free (no API calls, no business logic)
2. Use Reshaped components as building blocks
3. Always use SCSS modules with design tokens
4. Never hardcode colors, spacing, or typography values
5. Export component from `index.tsx`
6. Keep components prop-driven and pure
