# Styling Guide

> **Reshaped UI, design tokens, and SCSS modules patterns**

---

## 🎨 Styling Philosophy

This project uses a layered approach to styling:

| Layer             | Technology    | Purpose                                |
| ----------------- | ------------- | -------------------------------------- |
| **UI Components** | Reshaped      | Pre-built, accessible components       |
| **Design Tokens** | CSS Variables | Consistent colors, spacing, typography |
| **Custom Styles** | SCSS Modules  | Scoped, feature-specific styles        |

---

## 📦 Reshaped UI Library

Reshaped provides the foundation for all UI components:

```tsx
import { Badge, Button, Card, Text, View } from 'reshaped';

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card padding={4}>
      <View gap={2}>
        <Text variant="title-3" weight="bold">
          {product.name}
        </Text>
        <Text color="neutral-faded">{product.description}</Text>
        <Badge color="primary">{formatPrice(product.price)}</Badge>
      </View>
    </Card>
  );
};
```

---

### Common Reshaped Props

| Prop        | Values                                    | Example                   |
| ----------- | ----------------------------------------- | ------------------------- |
| `padding`   | `0-10`                                    | `padding={4}`             |
| `gap`       | `0-10`                                    | `gap={2}`                 |
| `direction` | `row`, `column`                           | `direction="row"`         |
| `align`     | `start`, `center`, `end`                  | `align="center"`          |
| `justify`   | `start`, `center`, `end`, `space-between` | `justify="space-between"` |
| `color`     | `primary`, `neutral`, `critical`, etc     | `color="primary"`         |
| `variant`   | Component-specific                        | `variant="title-3"`       |

---

## 🎯 Design Tokens

### Token Location

Design tokens are defined in `/src/themes/theme.css`:

```css
/* src/themes/theme.css */
:root {
  /* Colors */
  --rs-color-primary: #3366cc;
  --rs-color-critical: #dc3912;
  --rs-color-warning: #ff9900;
  --rs-color-positive: #109618;

  /* Spacing */
  --rs-unit-x1: 4px;
  --rs-unit-x2: 8px;
  --rs-unit-x3: 12px;
  --rs-unit-x4: 16px;
  --rs-unit-x5: 20px;
  --rs-unit-x6: 24px;
  --rs-unit-x8: 32px;
  --rs-unit-x10: 40px;

  /* Typography */
  --rs-font-size-body-1: 16px;
  --rs-font-size-body-2: 14px;
  --rs-font-size-title-1: 32px;
  --rs-font-size-title-2: 24px;
  --rs-font-size-title-3: 20px;

  /* Radius */
  --rs-radius-small: 4px;
  --rs-radius-medium: 8px;
  --rs-radius-large: 12px;

  /* Shadows */
  --rs-shadow-raised: 0 2px 4px rgba(0, 0, 0, 0.1);
  --rs-shadow-overlay: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

---

### Using Tokens in SCSS

**Always use tokens** - never hardcode values:

```scss
// ✅ Correct: Using design tokens
.container {
  padding: var(--rs-unit-x4);
  border-radius: var(--rs-radius-medium);
  background: var(--rs-color-background-elevated);
  box-shadow: var(--rs-shadow-raised);
}

.title {
  font-size: var(--rs-font-size-title-2);
  font-weight: var(--rs-font-weight-bold);
  color: var(--rs-color-foreground);
}

// ❌ Wrong: Hardcoded values
.container {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
}
```

---

## 📁 SCSS Modules

### File Naming

Always use the `.module.scss` extension:

```
/features/products
├── index.tsx
└── styles.module.scss    ← Scoped to this feature
```

---

### Basic Structure

```scss
// features/products/styles.module.scss

.container {
  display: flex;
  flex-direction: column;
  gap: var(--rs-unit-x4);
  padding: var(--rs-unit-x4);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--rs-unit-x4);
}

.card {
  background: var(--rs-color-background-elevated);
  border-radius: var(--rs-radius-medium);
  padding: var(--rs-unit-x4);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--rs-shadow-overlay);
  }
}

.cardImage {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--rs-radius-small);
}

.actions {
  display: flex;
  gap: var(--rs-unit-x2);
  justify-content: flex-end;
}
```

---

### Usage in Components

```tsx
// features/products/index.tsx
import styles from './styles.module.scss';

export const ProductList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.cardImage}
            />
            <div className={styles.actions}>
              <Button variant="outline">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎭 Conditional Classes

### Using `classnames` Library

```tsx
import cn from 'classnames';
import styles from './styles.module.scss';

export const Card = ({ isActive, isDisabled }: CardProps) => {
  return (
    <div
      className={cn(styles.card, {
        [styles.active]: isActive,
        [styles.disabled]: isDisabled,
      })}
    >
      {/* content */}
    </div>
  );
};
```

```scss
// styles.module.scss
.card {
  // base styles
}

.active {
  border-color: var(--rs-color-primary);
  background: var(--rs-color-primary-faded);
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

---

### Multiple Classes

```tsx
<div className={cn(styles.card, styles.large, styles.highlighted)}>
```

---

## 📱 Responsive Design

### Using Reshaped Responsive Props

```tsx
<View
  padding={{ s: 2, m: 4, l: 6 }}
  direction={{ s: 'column', l: 'row' }}
  gap={{ s: 2, m: 4 }}
>
  {/* Responsive content */}
</View>
```

---

### Using SCSS Media Queries

```scss
.grid {
  display: grid;
  gap: var(--rs-unit-x4);

  // Mobile first
  grid-template-columns: 1fr;

  // Tablet
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  // Large desktop
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 🌙 Dark Mode

Reshaped handles dark mode automatically. For custom styles:

```scss
.card {
  background: var(--rs-color-background-elevated);
  color: var(--rs-color-foreground);

  // These tokens automatically adapt to theme
}

// Or explicit dark mode overrides
.customElement {
  background: var(--rs-color-background-neutral);

  :global(.dark) & {
    background: var(--rs-color-background-neutral-faded);
  }
}
```

---

## 🔧 Common Patterns

### Layout Container

```scss
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--rs-unit-x4);
}
```

---

### Card Grid

```scss
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--rs-unit-x4);
}
```

---

### Form Layout

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
  padding-top: var(--rs-unit-x4);
  border-top: 1px solid var(--rs-color-border-neutral-faded);
}
```

---

### Transitions

```scss
.card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--rs-shadow-overlay);
  }
}

.button {
  transition: all 0.15s ease;
}
```

---

## 🛠️ CLI Commands

```bash
# Lint styles
npm run lint:styles

# Generate new theme
npm run generate:theme
```

---

## ✅ Styling Checklist

- [ ] Use Reshaped components when available
- [ ] Use CSS variables (tokens) for all values
- [ ] Use `.module.scss` extension for scoped styles
- [ ] Follow mobile-first responsive approach
- [ ] Use semantic token names (not raw colors)
- [ ] Test in both light and dark themes
- [ ] Keep selectors shallow (max 2-3 levels)

---

## ❌ Common Mistakes

```scss
// ❌ Hardcoded values
.container {
  padding: 16px;
  color: #333333;
  border-radius: 8px;
}

// ✅ Use tokens
.container {
  padding: var(--rs-unit-x4);
  color: var(--rs-color-foreground);
  border-radius: var(--rs-radius-medium);
}
```

```scss
// ❌ Deep nesting
.container {
  .wrapper {
    .content {
      .item {
        // Too deep!
      }
    }
  }
}

// ✅ Flat structure
.container {
}
.content {
}
.item {
}
```

---

## 📚 Next Steps

- [Component Development Guide](./components.md)
- [Feature Development Guide](./features.md)
- [Code Patterns Guide](./code-patterns.md)
