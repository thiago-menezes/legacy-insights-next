## 🗺️ Project Implementation Roadmap (TODO)

### Phase 0: Authentication

- [ ] **Login Page:** Modern UI with email/password login, social auth buttons (Google, Facebook), and reset password flow.
- [ ] **Create Account Page:** Registration form with email/password.
- [ ] **Social Authentication:** One-click Google and Facebook login integration.
- [ ] **Reset Password Flow:** Forgot password and password reset pages.
- [ ] **Strapi API Integration:** Connect authentication UI to Strapi backend.

### Phase 1: Core Foundation & Layout

- [x] **Global Theme Sync:** Connect the `reshaped` theme to the dark/light mode toggle.
- [x] **Shell Implementation:**
  - [x] Responsive Sidebar with navigation items (Dashboard, Campaigns, Integrations, etc.).
  - [x] Global Header with Breadcrumbs and User Profile.
  - [x] Main content area with standard padding and background.

### Phase 2: Unified Dashboard (The Hub)

- [ ] **KPI Summary Row:** Implementation of cards for "Value Invested", "ROI", "Leads", and "CPA".
- [ ] **Performance Trend Chart:** Interactive Line/Area chart showing spend vs. conversions.
- [ ] **Lead Growth Comparison:** Circular progress or simple bar indicators for period-over-period growth.
- [ ] **Channel Breakdown:** A minimalist horizontal bar or donut chart comparing Google vs. Meta.

### Phase 3: Campaign Management

- [ ] **Campaign List View:**
  - [ ] Searchable and filterable table (Active, Deactivated, Finished).
  - [ ] Status badges (Pill style from design system).
- [ ] **Campaign Detail View:**
  - [ ] Drill-down metrics for specific ad sets and ads.
  - [ ] Breakdown per page/asset.

### Phase 4: Integration Hub

- [ ] **Platform Matrix:** Grid of available integrations (Google Ads, Meta Ads, Hotmart, Kiwify, etc.).
- [ ] **Connection Flow:**
  - [ ] OAuth integration UI for Google/Meta.
  - [ ] Webhook configuration guides for sales platforms.
- [ ] **Health Monitor:** Visual indicators for expired tokens and last sync timestamps.

### Phase 5: Financials & Advanced Reports

- [ ] **Financial Ledger:** Detailed view of spend and revenue data.
- [ ] **Custom Report Builder:** Basic functionality to "Edit Charts" and "Edit Tables" as mentioned in `project.md`.

### Phase 6: Polish & Performance

- [ ] **Skeleton Loaders:** For all data-heavy charts and tables.
- [ ] **Micro-animations:** Transitions between pages and hover states for interactive data points.
- [ ] **Error Boundaries:** Graceful handling of API failures or expired tokens.
