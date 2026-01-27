# ESLint Configuration

This folder contains modular ESLint configurations for the project. Each file exports a specific configuration that can be composed together.

## Configuration Files

### `index.js`

Entry point that exports all configurations:

- `base` - Base configuration for JavaScript/TypeScript
- `react` - React-specific configuration
- `next` - Next.js-specific configuration

---

## Base Configuration (`base.js`)

Foundation configuration that includes:

### Extended Configs

- `@eslint/js` - ESLint recommended rules
- `typescript-eslint` - TypeScript-specific linting
- `eslint-config-prettier` - Disables rules that conflict with Prettier

### Plugins

- `eslint-plugin-import-x` - Import/export linting

### Rules

| Rule                     | Severity | Description                                                                                                                               |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `import-x/order`         | error    | Enforces import ordering: builtin → external → internal → parent → sibling → index, with newlines between groups and alphabetical sorting |
| `import-x/no-duplicates` | error    | Disallows duplicate imports from the same module                                                                                          |
| `quotes`                 | error    | Enforces single quotes (with `avoidEscape: true`)                                                                                         |
| `jsx-quotes`             | error    | Enforces double quotes in JSX attributes                                                                                                  |
| `no-console`             | warn     | Warns on console statements                                                                                                               |
| `no-debugger`            | error    | Disallows debugger statements                                                                                                             |
| `prefer-const`           | error    | Requires `const` for variables never reassigned                                                                                           |
| `no-var`                 | error    | Disallows `var` declarations                                                                                                              |

### Ignores

- `dist/**` - Ignores built files

---

## React Configuration (`react.js`)

Extends `base.js` and adds React-specific rules.

### Plugins

- `eslint-plugin-react` - React-specific linting
- `eslint-plugin-react-hooks` - React Hooks rules

### Rules

| Rule                          | Severity | Description                                   |
| ----------------------------- | -------- | --------------------------------------------- |
| `react/react-in-jsx-scope`    | off      | Not needed with new JSX transform             |
| `react/prop-types`            | off      | Disabled (using TypeScript for type checking) |
| `react-hooks/rules-of-hooks`  | error    | Enforces Rules of Hooks                       |
| `react-hooks/exhaustive-deps` | warn     | Warns on missing dependencies in hooks        |

### Settings

- Automatically detects React version

---

## React Internal Configuration (`react-internal.js`)

Alternative React configuration for internal libraries.

### Extended Configs

- Everything from `base.js`
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react` flat recommended config
- `eslint-config-prettier`

### Additional Features

- Includes browser and service worker globals
- Uses flat config API from eslint-plugin-react

---

## Next.js Configuration (`next.js`)

Full configuration for Next.js applications.

### Extended Configs

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-config-prettier`

### Plugins

- `@next/eslint-plugin-next` - Next.js specific rules
- `eslint-plugin-react` - React linting
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-import-x` - Import organization
- `eslint-plugin-prettier` - Prettier integration

### Rules

| Rule                                              | Severity | Description                                                         |
| ------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| **React**                                         |          |                                                                     |
| `react/react-in-jsx-scope`                        | off      | Not needed with new JSX transform                                   |
| All `pluginReact.configs.recommended` rules       | -        | Standard React rules                                                |
| All `pluginReactHooks.configs.recommended` rules  | -        | Standard Hooks rules                                                |
| **Next.js**                                       |          |                                                                     |
| All `pluginNext.configs.recommended` rules        | -        | Next.js best practices                                              |
| All `pluginNext.configs['core-web-vitals']` rules | -        | Core Web Vitals optimization                                        |
| **Imports**                                       |          |                                                                     |
| `import-x/order`                                  | error    | Enforces import ordering with React first, `@/**` paths as internal |
| `import-x/no-duplicates`                          | error    | Disallows duplicate imports                                         |
| `import-x/first`                                  | error    | Ensures imports are at the top                                      |
| `import-x/newline-after-import`                   | error    | Requires newline after import block                                 |
| **TypeScript**                                    |          |                                                                     |
| `no-undef`                                        | off      | Handled by TypeScript                                               |
| `@typescript-eslint/no-unused-vars`               | error    | Errors on unused vars (ignores `_` prefixed args)                   |
| `no-unused-vars`                                  | off      | Disabled for TS files (handled by `@typescript-eslint`)             |
| **Code Style**                                    |          |                                                                     |
| `quotes`                                          | error    | Enforces single quotes                                              |
| `jsx-quotes`                                      | error    | Enforces double quotes in JSX                                       |
| `no-console`                                      | warn     | Warns on console statements                                         |
| `no-debugger`                                     | error    | Disallows debugger                                                  |
| `prefer-const`                                    | error    | Requires const when possible                                        |
| `no-var`                                          | error    | Disallows var                                                       |
| **Prettier**                                      |          |                                                                     |
| `prettier/prettier`                               | error    | Enforces Prettier formatting                                        |

### Import Order Groups

1. `builtin` - Node.js built-in modules
2. `external` - npm packages (React prioritized first)
3. `internal` - Project internal imports (including `@/**` paths)
4. `parent` - Parent directory imports (`../`)
5. `sibling` - Same directory imports (`./`)
6. `index` - Index file imports

---

## Usage

### In `eslint.config.js` (root)

```javascript
import { next } from './eslint/index.js';

export default [
  ...next,
  // Additional project-specific overrides
];
```

### Using individual configs

```javascript
import { base, react, next } from './eslint/index.js';

// Choose the appropriate config for your package
export default [...base]; // For plain JS/TS
export default [...react]; // For React libraries
export default [...next]; // For Next.js apps
```
