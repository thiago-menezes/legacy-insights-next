# Design System

> Legacy Insight uses [Reshaped](https://reshaped.so) as its design system foundation, providing a comprehensive set of accessible components and theming capabilities.

---

## Quick Start

### Official Documentation

- **Components** — [reshaped.so/docs](https://reshaped.so/docs)
- **Theming** — [reshaped.so/docs/theming](https://reshaped.so/docs/theming)

---

## Theme Configuration

The project uses a custom theme defined in `reshaped.config.js`:

```javascript
// reshaped.config.js
import { generateThemeColors } from 'reshaped/themes';

const config = {
  themes: {
    legacy: {
      color: generateThemeColors({ primary: '#6714CD' }),
      fontFamily: {
        body: { family: 'Montserrat, sans-serif' },
        heading: { family: 'Montserrat, sans-serif' },
        title: { family: 'newBlackTypeface, sans-serif' },
      },
      radius: {
        small: { px: 8 },
        medium: { px: 12 },
        large: { px: 16 },
      },
    },
  },
};

export default config;
```

### Theme Properties

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Primary    | `#6714CD` (Purple)                    |
| Body Font  | Montserrat, sans-serif                |
| Title Font | newBlackTypeface, sans-serif          |
| Radius     | Small: 8px, Medium: 12px, Large: 16px |

---

## Changing Colors

### 1. Modify Primary Color

Edit `reshaped.config.js` and change the hex value:

```javascript
color: generateThemeColors({ primary: '#YOUR_NEW_COLOR' }),
```

### 2. Generate New Theme

Run the Reshaped CLI to regenerate CSS:

```bash
npx reshaped generate-theme
```

---

## Using Tokens

### CSS Custom Properties

Reshaped exposes design tokens as CSS variables:

```css
/* Colors */
var(--rs-color-primary)
var(--rs-color-background-primary)
var(--rs-color-foreground-primary)

/* Spacing */
var(--rs-spacing-1)  /* 4px */
var(--rs-spacing-2)  /* 8px */
var(--rs-spacing-4)  /* 16px */

/* Typography */
var(--rs-font-family-body)
var(--rs-font-size-body-1)
```

### In Components

```tsx
import { Button, Text, View } from 'reshaped';

<View padding={4} backgroundColor="primary">
  <Text variant="body-1">Hello World</Text>
  <Button color="primary">Click me</Button>
</View>;
```

---

## Dark/Light Mode

The theme automatically supports both modes. Toggle using the `colorMode` prop:

```tsx
import { Reshaped } from 'reshaped';

<Reshaped theme="legacy" colorMode="light">
  {/* App content */}
</Reshaped>;
```

### Modes

| Mode     | Description           |
| -------- | --------------------- |
| `light`  | Light color scheme    |
| `dark`   | Dark color scheme     |
| `system` | Follows OS preference |

---

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

---

## File Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # Reshaped-based primitives
├── features/         # Feature-specific components
└── app/
    └── layout.tsx    # Reshaped provider setup
```
