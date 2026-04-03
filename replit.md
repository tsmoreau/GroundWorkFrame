# Groundwork — Denhaus Small Business Admin

## Project Overview

**Denhaus** is a design studio for outdoor pet environments (catios, dog houses, kennels) based in Los Angeles. This is a single **Next.js 15 App Router** application with Tailwind v4 and mocked/localStorage-persisted data.

## Architecture

Single Next.js app at the repo root — no monorepo, no separate API server.

- **Stack**: Next.js 15 App Router, Tailwind v4 (`@tailwindcss/postcss`), lucide-react, date-fns, clsx, tailwind-merge
- **Port**: 3000 (dev), reads `$PORT` env var
- **API routes**: Next.js route handlers under `app/api/` (not yet implemented — mock data used for now)
- **Data**: In-memory React context (`app/admin/data-context.tsx`) seeded from `lib/mock-data.ts`, persisted to `localStorage` under key `groundwork-data-v1`
- **API spec**: `docs/openapi.yaml` — reference document only, no code generation

## Routes

### Public Site
- `/` — Landing page (Denhaus marketing)
- `/gallery` — Portfolio gallery
- `/contact` — Contact / quote request form (creates a lead in admin)
- `/invoice/[token]` — Client-facing invoice view with payment simulation

### Admin (`/admin/*`)
- `/admin/dashboard` — Stats cards, lead pipeline, upcoming jobs, outstanding invoices
- `/admin/leads` — Lead table; `/admin/leads/[id]` — detail with notes, status toggle, convert-to-client
- `/admin/clients` — Client table; `/admin/clients/[id]` — detail with jobs/invoices/pets/notes
- `/admin/jobs` — Kanban + list view; `/admin/jobs/[id]` — detail with line items, status progression, invoice creation
- `/admin/invoices` — Invoice table; `/admin/invoices/[id]` — detail with mark-paid / void
- `/admin/settings` — Business info + payment method toggles

## Key Files

| File | Purpose |
|------|---------|
| `lib/types.ts` | All TypeScript interfaces (Lead, Client, Job, Invoice, etc.) |
| `lib/mock-data.ts` | Initial seed data (8 leads, 3 clients, 4 jobs, 4 invoices) |
| `lib/utils.ts` | Formatters, constants, ID generators |
| `app/admin/data-context.tsx` | React context with CRUD + localStorage persistence |
| `app/admin/layout.tsx` | Sidebar nav + DataProvider wrapper |
| `docs/openapi.yaml` | Full REST API specification (reference only) |

## Design System

- **Background**: `#f8f6f2` (warm parchment)
- **Primary / Sidebar**: `#1c3829` (deep forest green)
- **Accent**: `#c8a55a` (warm gold)
- **Muted text**: `#5c5c54` (stone)
- **Border**: `#e0dbd0`
- **Paid/Success**: `#2d6a4f`
- **Danger**: `#b93232`
- **Font**: Inter

## Development Commands

```bash
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
```

## Planned Target Stack (not yet implemented)

Next.js (App Router) + Tailwind + MongoDB Atlas + Google OAuth via NextAuth + Stripe Checkout (ACH + card) + Google Cloud Storage + Resend + Vercel
