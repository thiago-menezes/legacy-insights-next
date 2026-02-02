# Architecture Overview

> **Understanding the Hybrid Feature Scope Architecture (HFSA) in Legacy Insights**

---

## 📖 What is HFSA?

**Hybrid Feature Scope Architecture (HFSA)** is a frontend architectural pattern designed to solve the common problems of large-scale frontend applications. It combines three established principles:

| Principle                      | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| **Scope-based Organization**   | Clear boundaries inspired by Domain-Driven Design (DDD) |
| **Feature-based Architecture** | Vertical slicing by domain/feature                      |
| **Adapted Atomic Design**      | Applied only to truly logic-free components             |

---

## 🎯 Problems HFSA Solves

| Problem                       | HFSA Solution                    |
| ----------------------------- | -------------------------------- |
| Ever-expanding shared folders | Features own their components    |
| Logic in "simple" components  | Atomic components are logic-free |
| Difficult onboarding          | Predictable file locations       |
| Cross-feature interference    | Isolated feature modules         |
| Scattered data/validation     | Co-located with UI               |

---

## 🏗️ Folder Structure

```
/src
├── /app                    # Next.js App Router
│   ├── page.tsx           # 'use server' - imports from /features
│   ├── layout.tsx         # 'use server' - scoped layouts
│   ├── loading.tsx        # Loading states
│   ├── error.tsx          # Error boundaries
│   ├── not-found.tsx      # 404 handling
│   ├── mock.ts            # Mock data for tests
│   │
│   ├── (auth)/            # Auth route group ('use server')
│   │   ├── layout.tsx
│   │   └── login/
│   │       └── page.tsx
│   │
│   └── (features)/        # Features route group ('use client')
│       ├── layout.tsx
│       ├── workspaces/
│       │   └── page.tsx
│       └── projects/
│           └── page.tsx
│
├── /components            # Shared UI components (Atomic)
│   ├── /button
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── /input
│   │   ├── index.tsx
│   │   └── types.ts
│   └── ...
│
├── /features              # Feature modules (HFSA core)
│   ├── /workspaces
│   │   ├── index.tsx      # Main component
│   │   ├── hooks.ts       # Custom hooks
│   │   ├── types.ts       # TypeScript types
│   │   ├── utils.ts       # Utility functions
│   │   ├── constants.ts   # Constants
│   │   ├── schema.ts      # Zod validation
│   │   ├── styles.module.scss
│   │   ├── skeleton.tsx   # Loading skeleton
│   │   ├── spec.tsx       # Tests
│   │   ├── card.tsx       # Subcomponent
│   │   ├── form.tsx       # Subcomponent
│   │   └── /api
│   │       ├── query.ts   # React Query queries
│   │       ├── mutation.ts # React Query mutations
│   │       └── types.ts   # API types
│   │
│   └── /projects
│       └── ...
│
├── /libs                  # External integrations
│   └── /api               # API clients
│       ├── client.ts      # Axios instance
│       └── workspaces.ts  # Workspace API
│
├── /utils                 # Shared utilities
├── /themes               # Theme tokens
└── /styles               # Global styles
```

---

## 📁 Feature Module Structure

Every feature follows this standard structure:

| File                 | Purpose                      | Required           |
| -------------------- | ---------------------------- | ------------------ |
| `index.tsx`          | Main component entry point   | ✅ Yes             |
| `hooks.ts`           | Feature-specific hooks       | When needed        |
| `types.ts`           | TypeScript interfaces        | When needed        |
| `utils.ts`           | Utility functions            | When needed        |
| `constants.ts`       | Constants and configurations | When needed        |
| `schema.ts`          | Zod validation schemas       | When using forms   |
| `styles.module.scss` | Scoped styles                | When needed        |
| `skeleton.tsx`       | Loading skeleton component   | When needed        |
| `spec.tsx`           | Component unit tests         | Recommended        |
| `api/query.ts`       | React Query queries          | When fetching data |
| `api/mutation.ts`    | React Query mutations        | When mutating data |
| `api/types.ts`       | API response/request types   | When using API     |

---

## 📏 Structure Exceptions

### Exception A: Subcomponents

When a feature has subcomponents, create them as separate files in the feature folder:

```
/features/workspaces
├── index.tsx          # Main component
├── card.tsx           # Subcomponent (NOT in /components folder)
├── form.tsx           # Subcomponent
├── form-skeleton.tsx  # Subcomponent skeleton
└── ...
```

> ⚠️ **Important**: Do NOT create a `/components` folder inside features. Keep subcomponents flat.

---

### Exception B: Multiple Files of Same Type

When you have multiple hooks, create a folder:

```
/features/workspaces
├── index.tsx
├── /hooks                    # Multiple hooks
│   ├── use-workspace.ts
│   ├── use-workspace-list.ts
│   └── use-workspace-form.ts
└── ...
```

This pattern applies to:

- `hooks/` - Multiple hooks
- `utils/` - Multiple utility files
- `schemas/` - Multiple schemas
- `types/` - If types become too large

---

## 🔄 App Router Conventions

### Page Files (`page.tsx`)

```tsx
// app/(features)/workspaces/page.tsx
// 'use server' is default
import { Workspaces } from '@/features/workspaces';

export default function WorkspacesPage() {
  return <Workspaces />;
}
```

> Pages only import and render features. No business logic.

---

### Layout Files (`layout.tsx`)

```tsx
// app/(features)/layout.tsx
// 'use server' is default

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="features-layout">{children}</div>;
}
```

> Layouts configure structure for child routes.

---

### Route Groups

| Group        | Purpose              | Render Mode    |
| ------------ | -------------------- | -------------- |
| `(auth)`     | Authentication pages | `'use server'` |
| `(features)` | Feature pages        | `'use client'` |

---

## 🎨 Component vs Feature

| Aspect          | `/components`          | `/features`              |
| --------------- | ---------------------- | ------------------------ |
| **Logic**       | None (pure UI)         | Business logic allowed   |
| **State**       | Minimal, prop-driven   | Can have complex state   |
| **API calls**   | Never                  | Yes, via React Query     |
| **Validation**  | Never                  | Yes, via Zod             |
| **Reusability** | High (across features) | Low (feature-specific)   |
| **Examples**    | Button, Input, Card    | ProductList, UserProfile |

---

## 🧪 Shared Code Guidelines

When code is used by **multiple features**, it belongs in `/src`:

```
/src
├── /utils            # Shared utility functions
│   ├── format.ts
│   └── validation.ts
├── /hooks            # Shared hooks
│   └── use-debounce.ts
├── /types            # Shared types
│   └── common.ts
└── /schemas          # Shared schemas
    └── common.ts
```

> **Rule**: If it's used in 2+ features, move it to shared.

---

## 📊 HFSA vs Microservices

| Aspect            | HFSA                  | Microservices      |
| ----------------- | --------------------- | ------------------ |
| **Scope**         | Frontend monolith     | Backend system     |
| **Deployment**    | Single app            | Multiple services  |
| **Communication** | Direct imports        | APIs/messaging     |
| **Isolation**     | Module boundaries     | Service boundaries |
| **Goal**          | Maintainable frontend | Scalable backend   |

> HFSA applies microservices thinking to frontend architecture, but within a single codebase.

---

## ✅ When to Use HFSA

HFSA is ideal for:

- ✅ Mid-to-large scale projects
- ✅ Teams that need clear onboarding paths
- ✅ Projects with complex "shared" folders
- ✅ Next.js with App Router
- ✅ Teams practicing vertical slicing

---

## 📚 Next Steps

- [Component Development Guide](../guides/components.md)
- [Feature Development Guide](../guides/features.md)
- [Code Patterns](../guides/code-patterns.md)
