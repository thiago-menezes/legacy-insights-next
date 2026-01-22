# Agent Instructions - Legacy Insight

You are an AI assistant working on the **Legacy Insight** project. This project follows the **Hybrid Feature Scope Architecture (HFSA)**.

## Project Core

- **Framework**: Next.js (App Router)
- **UI Library**: Reshaped
- **Language**: TypeScript
- **TypeScript**:
  - ALWAYS use `interface` for object definitions (Props, API responses, etc.).
  - Use `type` ONLY for unique cases: Unions (`type Status = 'on' | 'off'`), Intersections, or Primitives.
  - Never use inline types in component signatures.

## Naming & Structure Conventions

- **Folders & Files**: ALWAYS use lowercase with hyphens (kebab-case). No camelCase.
  - Correct: `user-profile/`, `header.tsx`, `style.module.scss`.
  - Incorrect: `UserProfile/`, `Header.tsx`, `styles.module.scss`.
- **Component Structure**:
  - **Single File Pattern**: If the component is small and only needs one file, use `component-name.tsx`.
  - **Folder Pattern**: If the component needs more files (styles, hooks, etc.), create a folder `component-name/` with an `index.tsx`.
- **Folder Contents**:
  - `index.tsx`: Main component file.
  - `style.module.scss`: Component-specific styles (always singular `style`).
  - `hook.ts`: Component logic/hooks.
  - `type.ts`: interface definitions (using `interface`).
  - `utils.ts`: Helper functions.
  - `constants.ts`: For configuration, numbers, etc. **NOT for UI text content**.
  - `spec.tsx`: Component tests.

- **Shared Components**: Located in `src/components`.
- **Feature Components**: Located in `src/features/[feature-name]`.

## Theme & Styling

- Use **Reshaped** design tokens.
- Theme overrides are in `src/styles/theme.scss`.
- Global tokens are in `src/styles/tokens.scss`.
- Always prefer CSS variables from the theme over hardcoded values.

## Phase 1 Objectives

1. **Global Theme Sync**: Ensure `Reshaped` uses the correct color mode and syncs with any toggle.
2. **Shell Implementation**:
   - Build a responsive Sidebar with Dashboards, Campaigns, Integrations.
   - Build a Global Header with Breadcrumbs and User Profile.
   - Set up the Main content area.

## Implementation Flow

1. Define shared components in `src/components` if they are pure UI.
2. Define Shell-related components in `src/components/shell`.
3. Update `src/app/layout.tsx` to include the Shell.
