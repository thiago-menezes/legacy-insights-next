# HSFA - Frontend Boilerplate

Welcome to the **HSFA Boilerplate** frontend project. This documentation provides a comprehensive guide to understanding our architecture, development workflow, and coding standards.

---

## 🏗️ Architecture

This project is built using a modern, scalable architecture designed for performance and maintainability.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI Library**: [Reshaped](https://reshaped.so/) (Premium Design System)
- **Styling**: SCSS + CSS Modules (PostCSS)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) + Axios
- **Forms**: `react-hook-form` + `zod` for validation
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library

### 📂 Directory Structure

| Folder           | Description                                                                |
| :--------------- | :------------------------------------------------------------------------- |
| `src/app`        | Next.js App Router pages, layouts, and providers.                          |
| `src/components` | Shared, reusable UI components.                                            |
| `src/features`   | Feature-based modules. Encapsulates business logic, components, and hooks. |
| `src/hooks`      | Global custom React hooks.                                                 |
| `src/libs`       | Third-party library initializations (API, Auth, Testing).                  |
| `src/styles`     | Global styles, theme overrides, and design tokens.                         |
| `src/utils`      | Pure utility functions (helpers).                                          |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (check `.nvmrc`)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 🧩 How to Create a New Component

We follow a modular approach. Components should be placed in `src/components` (if shared) or within a feature in `src/features`.

### Step-by-Step

1.  **Create Folder**: `src/components/MyComponent`
2.  **Logic**: Create `index.tsx`.
3.  **Styles**: Create `styles.module.scss`.
4.  **Testing**: Create `MyComponent.test.tsx`.

**Example:**

```tsx
// src/components/Button/index.tsx
import { Button as RSButton } from 'reshaped';
import s from './styles.module.scss';

export const MyButton = ({ label }: { label: string }) => {
  return <RSButton className={s.root}>{label}</RSButton>;
};
```

---

## 🎨 Theme & Styling

We use **Reshaped** as our foundation. Customizations are handled via CSS Variables.

### Creating/Modifying Themes

Themes are defined in `src/styles/theme.scss`. We override Reshaped tokens using specifically named CSS variables.

1.  **Tokens**: Define global values (colors, spacing) in `src/styles/tokens.scss`.
2.  **Theme Mapping**: Map tokens to Reshaped variables in `src/styles/theme.scss` under the `[data-rs-theme='HSFA']` selector.

**Example override:**

```scss
[data-rs-theme='HSFA'] {
  --rs-color-brand: #6714cd;
}

[data-rs-color-mode='dark'] {
  --rs-color-background-primary: #9053dbff;
}
```

To use the theme in your app, ensure the `Providers` component passes the theme name:

```tsx
<Reshaped theme="HSFA">
```

---

## 🧪 Testing

We use **Vitest** for unit and integration testing.

### Running Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:ui     # Visual test runner
```

### Writing a Test

Tests should be colocated with the file they are testing using `.test.ts` or `.spec.ts`.

**Example:**

```ts
// src/utils/myHelper.spec.ts
import { myHelper } from './myHelper';

describe('myHelper', () => {
  it('should do something correctly', () => {
    expect(myHelper('input')).toBe('output');
  });
});
```

---

## 🛠️ Configuration

### Linting & Formatting

- **ESLint**: `npm run lint` or `npm run lint:fix`.
- **Prettier**: Automatic formatting on save (recommended via VS Code).
- **Husky**: Git hooks are pre-configured to run linting/testing before commits.

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the required values.

---

## 📦 Core Functions & Utils

Commonly used helpers are located in `src/utils`. Always check if a utility exists before creating a new one.

- `formatProperName`: Formats strings to title case (e.g., "thiago menezes" -> "Thiago Menezes").
- `api`: Axios instance configured with base URL and interceptors in `src/libs/api`.

---

## 🚀 Deployment

The project follows a semantic release workflow. Merging to `main` triggers an automatic version bump and changelog generation via **Semantic Release**.

### 🌐 Published URL

The frontend is currently deployed at:
[http://34.135.235.80:4000](http://34.135.235.80:4000)
