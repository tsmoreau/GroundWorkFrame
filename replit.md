# Groundwork — Denhaus Small Business Admin

## Project Overview

**Denhaus** is a design studio for outdoor pet environments (catios, dog houses, kennels) based in Los Angeles. This monorepo contains a full small business admin boilerplate + public marketing site built as a **Next.js 15 App Router** application with Tailwind v4 and mocked data.

## Architecture

This is a **pnpm monorepo** with multiple artifacts:

### `artifacts/groundwork` — Main App (Next.js 15)
- Port: **22198**
- Preview path: `/`
- Stack: Next.js 15 App Router, Tailwind v4 (`@tailwindcss/postcss`), lucide-react, date-fns

**No real auth, no real backend, no real payments** — everything is mocked and persisted to `localStorage` for demo navigation.

### `artifacts/api-server` — API Server
- Port: **8080**
- Separate Express API (not used by the groundwork app)

### `artifacts/mockup-sandbox` — Canvas Design Sandbox
- Port: **8081**

## Groundwork App Routes

### Public Site
- `/` — Landing page (Denhaus marketing)
- `/gallery` — Portfolio gallery (4 past projects)
- `/contact` — Contact/quote request form (creates a lead in admin)
- `/invoice/[token]` — Client-facing invoice view with payment simulation

### Admin (`/admin/*`)
- `/admin/dashboard` — Stats cards, lead pipeline, upcoming jobs, outstanding invoices
- `/admin/leads` — Lead table with search/filter; `/admin/leads/[id]` — detail with notes, status toggle, convert-to-client
- `/admin/clients` — Client table; `/admin/clients/[id]` — detail with linked jobs/invoices/pets/notes
- `/admin/jobs` — Kanban + list view; `/admin/jobs/[id]` — detail with line items, status progression, invoice creation, photos
- `/admin/invoices` — Invoice table; `/admin/invoices/[id]` — detail with mark-paid / void actions
- `/admin/settings` — Business info + payment method toggles (Stripe, Zelle, Check, Bank Transfer)

## Key Files

| File | Purpose |
|------|---------|
| `artifacts/groundwork/lib/types.ts` | All TypeScript interfaces (Lead, Client, Job, Invoice, etc.) |
| `artifacts/groundwork/lib/mock-data.ts` | Initial seed data (8 leads, 3 clients, 4 jobs, 4 invoices) |
| `artifacts/groundwork/lib/utils.ts` | Formatters, constants, ID generators |
| `artifacts/groundwork/app/admin/data-context.tsx` | React context with CRUD + localStorage persistence |
| `artifacts/groundwork/app/admin/layout.tsx` | Sidebar nav + DataProvider wrapper |

## Design System

- **Background**: `#f8f6f2` (warm parchment)
- **Primary / Sidebar**: `#1c3829` (deep forest green)
- **Accent**: `#c8a55a` (warm gold)
- **Muted text**: `#5c5c54` (stone)
- **Border**: `#e0dbd0`
- **Paid/Success**: `#2d6a4f`
- **Danger**: `#b93232`
- **Font**: Inter

## Data Flow

All data lives in `app/admin/data-context.tsx` as React state, initialized from `lib/mock-data.ts`. On mount, it hydrates from `localStorage` (key: `groundwork-data-v1`). All mutations (add note, convert lead, mark invoice paid, advance job status, etc.) update state and auto-persist to localStorage.

## Development Commands

```bash
pnpm --filter @workspace/groundwork run dev     # Start Next.js dev server
pnpm --filter @workspace/groundwork run build   # Build for production
pnpm --filter @workspace/groundwork run typecheck
```
