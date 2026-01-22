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
  - Correct: `user-profile/`, `header.tsx`, `styles.module.scss`.
  - Incorrect: `UserProfile/`, `Header.tsx`, `style.module.scss`.
- **Component Structure**:
  - **Single File Pattern**: Small/Pure components use `component-name.tsx`.
  - **Folder Pattern**: Orchestrator or complex components use `component-name/` folder.
- **Folder Contents**:
  - `index.tsx`: Main component / Orchestrator.
  - `styles.module.scss`: Component-specific styles (plural `styles`).
  - `hooks.ts`: Component logic/state (plural `hooks`).
  - `types.ts`: interface definitions.
  - `utils.ts`: Pure helper functions / persistence.
  - `constants.ts`: Configuration and internal values.
  - `spec.tsx`: Component tests.

## The Peak Component Pattern (HFSA Peak)

The `src/components/shell` is the reference for complex architectural organization:

1.  **State Orchestration**: The `index.tsx` is a pure orchestrator. It consumes a single custom hook (`hooks.ts`) and distributes props to specialized sub-components.
2.  **Logic Separation**: 100% of state, effects, and event handlers live in `hooks.ts`. The component remains a visual-only template.
3.  **Persistence & Helpers**: Any logic related to browser APIs (localStorage) or data transformation lives in `utils.ts`, keeping the hooks focused on React state.
4.  **Sub-Componentization**: Large parts (Sidebar, Header) are extracted into their own sub-folders using the same pattern, ensuring a recursive and scalable structure.
5.  **Strict Typing**: All components use `interface` for props and shared types in `types.ts`.

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
