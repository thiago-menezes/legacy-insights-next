# Legacy Insight

> A premium centralized analytics and business intelligence platform designed to aggregate marketing, sales, and performance data from multiple sources into a single, intuitive interface.

---

## Overview

Legacy Insight eliminates "data fragmentation" for digital entrepreneurs by providing a unified hub for cross-platform monitoring and decision-making. The platform enables real-time visibility into advertising performance and sales conversions by integrating directly with major ad networks and digital product marketplaces.

## Target Audience

- **Digital marketers** managing high-volume campaigns
- **Media buyers** requiring centralized ROI monitoring
- **Info-product producers** tracking customer journeys across platforms

---

## Core Integrations

### Advertising Networks

| Platform   | Integration Type | Features                        |
| ---------- | ---------------- | ------------------------------- |
| Google Ads | OAuth API        | Campaign metrics, spend, clicks |
| Meta Ads   | OAuth API        | Facebook & Instagram metrics    |

### Sales Platforms (Webhooks)

| Platform | Data Type              |
| -------- | ---------------------- |
| Hotmart  | Real-time sales events |
| Kiwify   | Real-time sales events |
| Kirvano  | Real-time sales events |

---

## Key Features

### 1. Unified Performance Dashboard

The heart of the platform—a high-level analytics view monitoring critical business KPIs:

- **Financial Metrics** — Track "Value Invested" (Spend) and ROI across channels
- **Lead Performance** — Monitor lead volume and growth trends with period comparisons
- **Efficiency Ratios** — Real-time CPA (Cost per Acquisition) and conversion rates
- **Comparative Analysis** — Visual indicators for performance trends vs. past timeframes

### 2. Granular Campaign Management

Detailed views for Google and Meta campaigns with drill-down capabilities:

- **Campaign Status** — Instant visibility (Active, Deactivated, Finished)
- **Asset-Level Data** — Track performance by page/campaign set with budget, CPC, CTR
- **Customizable UI** — Edit Charts and Tables to match analytical needs

### 3. Centralized Integration Hub

Streamlined management for all external connections:

- **Multi-Account Support** — Connect multiple profiles per platform under one workspace
- **Connectivity Monitoring** — Visual alerts for connection health and expired tokens
- **Sync Control** — Manual data sync and token refresh capabilities

### 4. Advanced UX/UI Design

- **Premium Aesthetics** — Modern, clean interface focused on data legibility
- **Dark/Light Mode** — Full theme switching support
- **Workspace Management** — Organize data into different workspaces (ideal for agencies)
- **Comprehensive Sidebar** — Quick access to Dashboard, Campaigns, Integrations, Financials, Reports, Settings

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │  Dashboard  │  │  Campaigns  │  │ Integrations│        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────▼─────────────────────────────────┐
│                      Backend (Strapi)                        │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │    Auth     │  │   Content   │  │  Webhooks   │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   External Services                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │ Google Ads  │  │  Meta Ads   │  │Sales Platforms│       │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [Authentication API Guide](./auth.md)
- [Design System](./design-system.md)
- [Project Roadmap](./todo.md)
