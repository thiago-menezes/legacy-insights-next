# Legacy Insights - Developer Documentation

> **Comprehensive guide for building and maintaining the Legacy Insights codebase**

This documentation provides detailed instructions on how to develop, structure, and maintain code following the **Hybrid Feature Scope Architecture (HFSA)** adopted in this project.

---

## 🤖 For AI Agents

> **Start here**: Read [AGENTS.md](../AGENTS.md) before any coding task.

The `AGENTS.md` file contains:

- **Knowledge Flow** — Which docs to consult for each task type
- **Post-Coding Checklist** — Required verification steps after changes
- **Common Mistakes** — Patterns to avoid

---

## 📚 Documentation Index

### Architecture & Patterns

| Document                                          | Description                                              |
| ------------------------------------------------- | -------------------------------------------------------- |
| [Architecture Overview](./architecture/README.md) | HFSA principles, folder structure, and design philosophy |
| [Code Patterns](./guides/code-patterns.md)        | Naming conventions, TypeScript patterns, best practices  |

### Development Guides

| Document                                             | Description                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| [Feature Development](./guides/features.md)          | Step-by-step guide for creating new features        |
| [Component Development](./guides/components.md)      | How to create components, hooks, and utilities      |
| [API & Data Fetching](./guides/api-data-fetching.md) | React Query integration, API layer, data management |
| [Styling Guide](./guides/styling.md)                 | Reshaped UI, tokens, and SCSS modules               |
| [Testing Guide](./guides/testing.md)                 | Unit tests, integration tests, and test patterns    |
| [CLI Commands](./guides/cli-commands.md)             | Available npm scripts and development commands      |

### Project Information

| Document                                        | Description                    |
| ----------------------------------------------- | ------------------------------ |
| [Project Description](./project/description.md) | Platform overview and features |
| [Design System](./project/design-system.md)     | Reshaped theming and tokens    |
| [Authentication API](./project/auth.md)         | Strapi auth endpoints          |

---

## 🛠️ Tech Stack

| Category          | Technology                   |
| ----------------- | ---------------------------- |
| **Framework**     | Next.js (App Router)         |
| **UI Library**    | Reshaped                     |
| **Language**      | TypeScript                   |
| **Backend**       | Strapi (separate project)    |
| **Forms**         | React Hook Form + Zod        |
| **HTTP Client**   | Axios                        |
| **Data Fetching** | React Query (TanStack Query) |
| **Linting**       | ESLint                       |
| **Formatting**    | Prettier                     |
| **Testing**       | Vitest                       |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

---

## 🏗️ Project Structure

```
/src
├── /app                    # Next.js App Router (pages & layouts)
│   ├── page.tsx           # Root page
│   ├── layout.tsx         # Root layout
│   └── (auth)/            # Auth route group
│
├── /components            # Shared UI components
│   ├── /shell            # App shell (sidebar, header) ⭐ Reference
│   ├── /ui               # Base UI primitives
│   └── ...
│
├── /features              # Feature modules (HFSA)
│   ├── /workspaces
│   ├── /projects
│   ├── /integrations
│   └── ...
│
├── /libs                  # External library integrations
│   └── /api              # API client, services, hooks
│
├── /utils                 # Shared utility functions
├── /themes               # Theme tokens and configurations
└── /styles               # Global styles
```

---

## 📖 Key Concepts

### Hybrid Feature Scope Architecture (HFSA)

HFSA combines:

1. **Scope-based organization** — Clear boundaries for each module
2. **Feature-based architecture** — Vertical slicing by domain
3. **Adapted Atomic Design** — Only for truly logic-free components

### The Peak Component Pattern

Reference implementation: `src/components/shell/`

```
component/
├── index.tsx          # Orchestrator (consumes hooks, distributes props)
├── hooks.ts           # All state and effects
├── types.ts           # Interface definitions
├── utils.ts           # Pure helpers, persistence
├── styles.module.scss # Component styles
└── spec.tsx           # Tests
```

### Benefits

- ✅ **Predictability** — Developers always know where to find code
- ✅ **Isolation** — Features own their UI, API, validation, and tests
- ✅ **Scalability** — Adding features = creating a folder
- ✅ **Testability** — Tests live close to features
- ✅ **Consistency** — Standardized naming conventions

---

## 📝 Contributing Guidelines

1. Follow patterns in `/docs/guides/`
2. Keep documentation up-to-date with code changes
3. Include code examples for complex patterns
4. Reference existing implementations in the codebase

---

## 🔗 Related Resources

- [AGENTS.md](../AGENTS.md) — AI agent instructions and workflow
- [ESLint Configuration](../eslint/README.md) — Linting rules
- [Code Rules (Original)](./code-rules/hfsa-english.md) — HFSA specification
- [Code Samples](./code-rules/code-samples.md) — Reference implementations
