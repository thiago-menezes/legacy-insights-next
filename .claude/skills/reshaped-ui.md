---
name: reshaped-ui
description: Use this skill when working with the Reshaped design system, styling, or UI components. Triggers on requests about UI, styling, design tokens, theming, dark mode, or component styling.
---

# Reshaped UI Skill

Legacy Insight uses **Reshaped** (https://reshaped.so) as its design system foundation.

## Theme Configuration

The project uses a custom theme in `reshaped.config.js`:

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Primary    | `#6714CD` (Purple)                    |
| Body Font  | Montserrat, sans-serif                |
| Title Font | newBlackTypeface, sans-serif          |
| Radius     | Small: 8px, Medium: 12px, Large: 16px |

## Using Reshaped Components

```tsx
import {
  View,
  Text,
  Button,
  Card,
  Badge,
  TextField,
  Modal,
  Loader,
  Skeleton,
} from 'reshaped';

<View padding={4} gap={2} direction="row" align="center">
  <Text variant="title-3" weight="bold">
    Title
  </Text>
  <Text color="neutral-faded">Description</Text>
  <Button color="primary">Action</Button>
</View>;
```

### Common Props

| Prop        | Values                                    | Example                   |
| ----------- | ----------------------------------------- | ------------------------- |
| `padding`   | `0-10`                                    | `padding={4}`             |
| `gap`       | `0-10`                                    | `gap={2}`                 |
| `direction` | `row`, `column`                           | `direction="row"`         |
| `align`     | `start`, `center`, `end`                  | `align="center"`          |
| `justify`   | `start`, `center`, `end`, `space-between` | `justify="space-between"` |
| `color`     | `primary`, `neutral`, `critical`, etc     | `color="primary"`         |
| `variant`   | Component-specific                        | `variant="title-3"`       |

### Responsive Props

```tsx
<View
  padding={{ s: 2, m: 4, l: 6 }}
  direction={{ s: 'column', l: 'row' }}
  gap={{ s: 2, m: 4 }}
>
  {/* Responsive content */}
</View>
```

## Design Tokens

Always use CSS variables - never hardcode values:

```scss
// Colors
var(--rs-color-primary)
var(--rs-color-background-elevated)
var(--rs-color-foreground)
var(--rs-color-critical)

// Spacing
var(--rs-unit-x1)  // 4px
var(--rs-unit-x2)  // 8px
var(--rs-unit-x4)  // 16px
var(--rs-unit-x6)  // 24px

// Typography
var(--rs-font-size-title-1)  // 32px
var(--rs-font-size-title-2)  // 24px
var(--rs-font-size-body-1)   // 16px

// Radius
var(--rs-radius-small)   // 4px
var(--rs-radius-medium)  // 8px
var(--rs-radius-large)   // 12px

// Shadows
var(--rs-shadow-raised)
var(--rs-shadow-overlay)
```

## SCSS Modules Pattern

```scss
// styles.module.scss

// CORRECT - Using tokens
.container {
  padding: var(--rs-unit-x4);
  border-radius: var(--rs-radius-medium);
  background: var(--rs-color-background-elevated);
  box-shadow: var(--rs-shadow-raised);
}

// WRONG - Hardcoded values
.container {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
}
```

### Common Patterns

#### Card with Hover

```scss
.card {
  background: var(--rs-color-background-elevated);
  border-radius: var(--rs-radius-medium);
  padding: var(--rs-unit-x4);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--rs-shadow-overlay);
  }
}
```

#### Grid Layout

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--rs-unit-x4);
}
```

#### Form Layout

```scss
.form {
  display: flex;
  flex-direction: column;
  gap: var(--rs-unit-x4);
  max-width: 480px;
}

.formActions {
  display: flex;
  justify-content: flex-end;
  gap: var(--rs-unit-x2);
}
```

## Conditional Classes

```tsx
import cn from 'classnames';
import styles from './styles.module.scss';

<div
  className={cn(styles.card, {
    [styles.active]: isActive,
    [styles.disabled]: isDisabled,
  })}
/>;
```

## Dark Mode

Reshaped handles dark mode automatically via tokens. For custom styles:

```scss
.customElement {
  background: var(--rs-color-background-neutral);

  :global(.dark) & {
    background: var(--rs-color-background-neutral-faded);
  }
}
```

## Common Components

| Component     | Usage                               |
| ------------- | ----------------------------------- |
| `Button`      | Primary actions, forms              |
| `View`        | Layout container with spacing/color |
| `Text`        | Typography with variants            |
| `Card`        | Content containers                  |
| `Table`       | Data display                        |
| `FormControl` | Form field wrapper                  |
| `TextField`   | Text inputs                         |
| `Select`      | Dropdown selections                 |
| `Modal`       | Dialogs and overlays                |
| `Loader`      | Loading spinners                    |
| `Skeleton`    | Loading placeholders                |

## Rules

1. Always use Reshaped components when available
2. Always use CSS variables (tokens) for all values
3. Use `.module.scss` extension for scoped styles
4. Follow mobile-first responsive approach
5. Test in both light and dark themes
6. Keep selectors shallow (max 2-3 levels)
