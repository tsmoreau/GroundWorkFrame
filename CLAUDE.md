# GroundWorkFrame — reference implementation (quarry)

**Read `docs/PLAN.md` first.** It is the authoritative product and build plan for **GroundWork**,
the small-business template this repo informs. This repo is the **Denhaus mock** — the working
prototype that proved out the domain model and UI. It is kept as a **reference quarry**: GroundWork
is built as a fresh scaffold (preferably in its own repo), porting behavior and UX from here per
the porting map in `docs/PLAN.md` §10.

## What that means for sessions in this repo

- **Do not build GroundWork features here** unless the owner has explicitly decided to scaffold
  in-place (see PLAN.md §0 repo-layout note and §12 open items).
- Treat the code as read-mostly reference material. It runs fine (`npm run dev`) and is useful
  for verifying ported behavior side-by-side.
- `replit.md` and `docs/openapi.yaml` are historical; PLAN.md supersedes both.

## Current state of this codebase

Single Next.js 15 App Router app, Tailwind v4, no backend — data is a React context seeded from
`lib/mock-data.ts`, persisted to localStorage (`groundwork-data-v1`). Public site (landing,
gallery, contact, tokenized invoice view) + admin (`/admin/*`: dashboard, leads, clients, jobs
kanban, invoices, settings). No auth. Branded as "Denhaus" (fictional LA outdoor-pet-environment
studio) with pet-specific fields in the domain model — all of which GroundWork genericizes.

## Commands

```bash
npm run dev        # dev server (reads $PORT, defaults 3000)
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Key reference files (see PLAN.md §10 for full porting map)

| File | Why it matters |
|---|---|
| `lib/types.ts` | Domain model the GroundWork zod schemas derive from |
| `app/admin/data-context.tsx` | CRUD/convert-lead/invoice-from-job logic to port into the service layer |
| `app/admin/jobs/page.tsx` | Kanban — highest-value UI port |
| `app/admin/leads/page.tsx` | Cleanest DataTable (sort/filter/search) pattern |
| `app/admin/layout.tsx` | Admin shell incl. mobile drawer |
| `app/invoice/[token]/page.tsx` | Client-facing invoice/payment flow |
| `app/globals.css` | Newest token generation ("Architectural Naturalist") is the keeper; legacy sets are not |
