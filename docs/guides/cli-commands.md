# CLI Commands Reference

> **Available npm scripts and development commands**

---

## 🚀 Development

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build production bundle  |
| `npm run start` | Start production server  |

---

## 🔍 Code Quality

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run typecheck`   | Run TypeScript type checking         |
| `npm run lint`        | Run ESLint on codebase               |
| `npm run lint:styles` | Run stylelint on SCSS files          |
| `npm run format`      | Format code with Prettier and ESLint |

---

## 🧪 Testing

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run test`          | Run all tests                  |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🎨 Theme Generation

| Command                  | Description                 |
| ------------------------ | --------------------------- |
| `npm run generate:theme` | Generate new Reshaped theme |

---

## 📋 Common Workflows

### Before Committing

```bash
# Check for type errors
npm run typecheck

# Check for linting errors
npm run lint

# Run tests
npm run test
```

---

### Full Code Quality Check

```bash
npm run typecheck && npm run lint && npm run lint:styles && npm run test
```

---

### Format All Code

```bash
npm run format
```

---

## 🔧 Environment Variables

| Variable                 | Description    | Default                 |
| ------------------------ | -------------- | ----------------------- |
| `NEXT_PUBLIC_STRAPI_URL` | Strapi API URL | `http://localhost:1337` |

---

## 📚 Next Steps

- [Testing Guide](./testing.md)
- [Component Development Guide](./components.md)
- [Feature Development Guide](./features.md)
