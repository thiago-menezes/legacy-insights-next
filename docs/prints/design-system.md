# Design System - Legacy Insight

## 1. Vision & Philosophy

**Legacy Insight** is a premium analytics platform built for high-performance digital entrepreneurs. The design philosophy centers on **clarity**, **professionalism**, and **data legibility**. The interface uses a clean "Dashboard-first" approach with subtle gradients, soft borders, and a monochromatic foundation with a vibrant purple signature.

---

## 2. Color Palette

### 🎨 Primary & Brand

These colors define the brand identity and primary interaction states.

- **Signature Purple:** `#8B5CF6` (Used for active states, dots, and brand accents).
- **Secondary Blue/Purple:** `#293056` (Used for badge text and secondary focus).
- **Highlight Lavender:** `#EAECF5` (Used for badge backgrounds and active hover states).

### 🌑 Neutrals & Text

Foundation colors for structure and content hierarchy.

- **Primary Text:** `#181828` (Headings, active menu labels).
- **Secondary Text:** `#717680` (Labels, captions, metadata).
- **Muted Text:** `#A0A5B1` (Placeholders, disabled states).
- **Card Border:** `#E9EAEB` (Subtle strokes for container separation).

### 🖼️ Backgrounds

- **Main App Background:** `#F5F5F5` (Light gray for the content area).
- **Surface/Card Background:** `#FFFFFF` (Pure white for sidebar, cards, and header).
- **Dark Mode Surface:** `#0F0F1A` (Tonal variation for dark theme).

### 🚦 Semantic Colors

- **Success:** `#22C55E` (Ativo, growth trends, positive ROI).
- **Error/Negative:** `#EF4444` (Desativado, negative trends).
- **Warning:** `#F59E0B` (Expired tokens, pending sync).

---

## 3. Typography

The system uses a modern sans-serif stack, optimized for data density and readability.

- **Primary Font:** `Inter` (or `Manrope`)
- **Weights:**
  - `Regular (400)` - Body copy, labels.
  - `Medium (500)` - Table headers, secondary navigation.
  - `SemiBold (600)` - Card titles, KPI values.
  - `Bold (700)` - Primary headings, Brand logo.

### Type Scale

- **H1 (Page Title):** 24px / 32px line-height.
- **H2 (Card Title):** 18px / 24px line-height.
- **Body Large (KPIs):** 32px / 40px line-height.
- **Body Base:** 14px / 20px line-height.
- **Body Small (Labels):** 12px / 16px line-height.

---

## 4. Layout & Spacing

### Structure

- **Sidebar:** Width: 280px. Fixed left. Pure white background with `#E9EAEB` right-border.
- **Header:** Height: 64px. Fixed top. Pure white background. Includes Breadcrumbs, Search, and Global Actions.
- **Page Container:** Background `#F5F5F5`. Internal padding: 32px.

### Spacing System

Based on an 8px grid (8, 16, 24, 32, 40, 48, 64).

---

## 5. Components

### 🗃️ Cards (Containers)

- **Border Radius:** `16px`.
- **Border:** `1px solid #E9EAEB`.
- **Shadow:** Minimal to none (prefers borders for depth).
- **Padding:** `24px` for internal content.

### 🔘 Buttons

- **Primary:** Purple background, white text.
- **Outline:** Transparent background, `#E9EAEB` border, dark text.
- **Icon Buttons:** Gray-scaled with subtle hover interaction.

### 🏷️ Status Badges

- **Shape:** Pill-shaped (`rx="999px"`).
- **Style:** Small icon dot + Text.
  - **Ativo:** Green dot and text on light green background.
  - **Desativado:** Gray dot and text on light gray background.

### 📊 Tables

- **Header:** Light gray text (`#717680`), medium weight, 12px.
- **Rows:** Border-bottom `1px solid #E9EAEB`. Height 56px.
- **Interactive:** Hover state changes background to `#FAFAFA`.

---

## 6. Iconography

- **Library:** `Lucide React` (Style: Outlined).
- **Stroke Width:** `1.5px` to `2.0px`.
- **Size:**
  - Sidebar: 20px.
  - Table Actions: 16px.
  - KPI Trends: 12px.

---

## 7. Interactive States

- **Hover:** Subtle transition (200ms) with background shifts or border color darker.
- **Active (Menu):** Lavender background (`#EAECF5`) and Purple text (`#8B5CF6`).
- **Focus:** `2px` rings using brand color with offset.
