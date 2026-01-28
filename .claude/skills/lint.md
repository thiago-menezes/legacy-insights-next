---
name: lint
description: Use this skill when fixing linting issues, configuring ESLint, or ensuring code quality through linting. Triggers on requests about lint, ESLint, code quality, or fixing lint errors.
---

# Lint Skill

Follow Legacy Insight's ESLint configuration and linting standards.

## Running Lint

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Lint specific file
npx eslint src/features/products/index.tsx

# Lint styles
npm run lint:styles
```

## Common ESLint Rules

### Import Order

Imports must follow this order:

```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Next.js imports
import { useRouter } from 'next/navigation';

// 3. External libraries
import { View, Text } from 'reshaped';
import { useQuery } from '@tanstack/react-query';

// 4. Internal absolute imports (@/)
import { apiClient } from '@/libs/api/client';
import { PageTitle } from '@/components/page-title';

// 5. Relative imports
import { useProducts } from './hooks';
import styles from './styles.module.scss';
```

### React Hooks Rules

```tsx
// WRONG: Hook inside condition
const Component = ({ enabled }) => {
  if (enabled) {
    const [state, setState] = useState(); // Error!
  }
};

// CORRECT: Hooks at top level
const Component = ({ enabled }) => {
  const [state, setState] = useState();
  // Use conditionally in render/effects
};
```

### Unused Variables

```tsx
// WRONG: Unused import
import { Button, Card } from 'reshaped'; // Card unused

// CORRECT: Only import what you use
import { Button } from 'reshaped';

// Prefix with _ for intentionally unused
const handleClick = (_event: MouseEvent) => {
  // event intentionally unused
};
```

### Exhaustive Dependencies

```tsx
// WRONG: Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId missing

// CORRECT: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Or disable if intentional
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### No Explicit Any

```tsx
// WRONG
const data: any = response.data;

// CORRECT
const data: ProductResponse = response.data;

// If truly unknown, use unknown
const data: unknown = response.data;
if (isProduct(data)) {
  // data is now typed
}
```

## TypeScript Strict Mode

The project uses strict TypeScript. Common patterns:

### Null Checks

```tsx
// WRONG: Possible null
const name = product.name; // product might be null

// CORRECT: Check first
const name = product?.name;

// Or assert non-null (only when certain)
const name = product!.name;
```

### Type Assertions

```tsx
// Prefer type guards
const isProduct = (data: unknown): data is Product => {
  return typeof data === 'object' && data !== null && 'id' in data;
};

// Use as only when necessary
const params = useParams() as { slug: string };
```

## Common Lint Errors and Fixes

### `react/no-unescaped-entities`

```tsx
// WRONG
<Text>It's a test</Text>

// CORRECT
<Text>It&apos;s a test</Text>
// Or
<Text>{`It's a test`}</Text>
```

### `@typescript-eslint/no-unused-vars`

```tsx
// WRONG
const [value, setValue] = useState(''); // setValue unused

// CORRECT: Prefix with _
const [value, _setValue] = useState('');
```

### `react-hooks/exhaustive-deps`

```tsx
// WRONG
const memoized = useCallback(() => {
  doSomething(value);
}, []); // value missing

// CORRECT
const memoized = useCallback(() => {
  doSomething(value);
}, [value]);
```

### `@next/next/no-img-element`

```tsx
// WRONG
<img src="/image.png" alt="Image" />;

// CORRECT: Use next/image
import Image from 'next/image';
<Image src="/image.png" alt="Image" width={100} height={100} />;
```

### `prefer-const`

```tsx
// WRONG
let value = 'constant';

// CORRECT
const value = 'constant';
```

## Disabling Rules

Only disable when absolutely necessary:

```tsx
// Disable for single line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = legacyApi.getData();

// Disable for block
/* eslint-disable @typescript-eslint/no-explicit-any */
const a: any = 1;
const b: any = 2;
/* eslint-enable @typescript-eslint/no-explicit-any */

// Disable for file (at top)
/* eslint-disable @typescript-eslint/no-explicit-any */
```

## Pre-commit Hooks

The project uses lint-staged for pre-commit checks:

```bash
# Runs automatically on commit
# Lints and fixes staged files
```

If commit fails:

1. Fix the reported issues
2. Stage the fixes
3. Commit again

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `stylelint.config.js` - Style linting
