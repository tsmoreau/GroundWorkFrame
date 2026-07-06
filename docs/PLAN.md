# GroundWork — Product & Build Plan

**Status:** Authoritative founding document. Written 2026-07-06, distilled from the full planning
conversation between Terrence (owner) and Claude. Supersedes `replit.md` and `docs/openapi.yaml`
as the source of truth for what GroundWork is and how it gets built.

---

## 0. How to use this document

You are most likely an implementation session picking up a phase of this build. Before writing
any code:

1. Read §1–§6 completely (vision, deployment model, decisions, invariants, domain, config).
   They are short and everything downstream assumes them.
2. Find your phase in §9 and work its items in order. Every work item is tagged:
   - **BUILD** — new code, written to this spec.
   - **PORT** — working code exists in the reference implementation (this repo,
     `tsmoreau/GroundWorkFrame`, the Denhaus mock). Read the referenced file first, then
     re-implement it against GroundWork conventions (config layer, component library, single
     token set, zod types). Porting means carrying the *behavior and UX*, not the bytes.
   - **DROP** — exists in the reference; do not carry forward.
3. The reference implementation is a **quarry, not a foundation**. GroundWork is a fresh
   scaffold. Nothing from the reference lands unmodified; nothing in the reference is deleted.
4. When you finish a phase item, check it off here. When you deviate from this plan for good
   reason, append the decision and rationale to §4 (Decisions log) — do not silently diverge.
5. The acceptance criteria at the end of each phase are the definition of done. Run them.

**Repo layout note:** GroundWork is scaffolded as a fresh Next.js project. Preferred home is a
new repository (clean history matters — instances fork this repo, and the template's history is
part of the product). If it must live in this repo instead, scaffold on an orphan branch so
history starts clean. Either way this PLAN.md travels with it as `docs/PLAN.md`.

---

## 1. What GroundWork is

**GroundWork is a self-contained small-business package for trades/service businesses that
quote, do jobs, and invoice** — tile setters, GCs, fence builders, landscapers, handymen,
fabricators. One Next.js codebase containing:

- A **public brochure site** with a lead-intake contact form (landing, gallery/portfolio,
  contact, client-facing estimate/invoice pages).
- An **admin back office**: leads → clients → jobs → invoices pipeline, dashboard, settings.
- A **real backend** (auth, database, payments, email, file storage) — flag-gated so the
  template also runs in a zero-setup demo mode.
- An **AI module**: an in-app chat agent with tool access to the business's data, plus an MCP
  endpoint so external agents (Claude Desktop, Claude Code) can connect.

**Audience and distribution:** built by Terrence for himself, friends, and family — working
trade guys getting licensed and needing business tooling (canonical first user: a tile setter
with 15 years in the trade). Possibly offered as contract work later, but not a public SaaS.
Distribution = Terrence stamps out an instance per business.

**Non-goals (explicit):**
- No inventory/retail/appointment-booking business models — service businesses only.
- Not a QuickBooks replacement — integrate via export, never replicate accounting.
- Not a CMS or website builder — the public site is a deliberately simple brochure + intake;
  the lead API works with external websites for guys who have their own.
- No multi-tenancy, no billing/subscription machinery, no self-serve onboarding.
- No payroll, no HR. (Lightweight crew access and simple timecards are future modules — §9
  backlog.)

---

## 2. Deployment & maintenance model

**Single-tenant, stamped per business.** Each business = one fork/clone of the template repo,
one Vercel project, one MongoDB Atlas database, one set of env vars, their own Stripe/Resend
accounts, one Google-login allowlist. No shared infrastructure between businesses.

**The template-update contract.** Terrence maintains N instances. Instances stay mergeable with
the template if and only if per-business divergence is confined to the **divergence surface**:

| Divergence surface (instances may edit) | Everything else |
|---|---|
| `site.config.ts` | is template code. |
| `.env` / Vercel env vars | Instances **never** edit pages, |
| `lib/seed-data.ts` (or start empty) | components, lib, or API routes. |
| `app/tokens.css` (brand token block) | If an instance needs a code change, |
| `public/` assets (logo, favicon, OG image, gallery photos) | the change lands in the template |
| | (possibly behind a flag) and rolls out to everyone. |

Update flow: instance adds template as a git remote, `git merge template/main`, resolves the
(rare, surface-confined) conflicts, redeploys. Template keeps a `CHANGELOG.md`; schema-affecting
releases ship migration scripts (§7.2).

---

## 3. Stack (settled)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15+ App Router, TypeScript, React 19 | Server components + route handlers |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) | Single design-token set (§8.1) |
| UI deps | lucide-react, date-fns, clsx, tailwind-merge | Same as reference; no UI framework |
| Fonts | `next/font` (Inter + Newsreader) | Replaces reference's `<link>` tags |
| Validation/types | **zod** — single source of truth (§7.1) | Derives TS types, API validation, AI tool schemas |
| Auth | Auth.js (NextAuth v5), Google provider, JWT sessions | Works with no DB → ships in Phase 1 |
| Database | MongoDB Atlas | Behind the data-adapter seam; demo mode = localStorage |
| Payments | Stripe Checkout (card + ACH) | Manual methods (Zelle/check) remain first-class |
| Email | Resend | Lead notifications + invoice/estimate sends |
| File storage | **Vercel Blob** | Decided over GCS: one less account per instance |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) | Default model `claude-sonnet-5` (config-swappable); tool runner for chat loop |
| MCP | `mcp-handler` (Vercel's Next.js MCP adapter), Streamable HTTP | Same tool registry as chat |
| Tests/CI | Vitest (money math first), GitHub Actions (typecheck+lint+build+test), Playwright later | |
| Lint/format | ESLint + Prettier (flat config) | From commit one |
| Hosting | Vercel | Vercel Cron for backup job |

---

## 4. Decisions log

Every settled decision with its rationale. Implementation sessions: append here when you make a
new architectural decision or deviate from an existing one.

| # | Decision | Rationale |
|---|---|---|
| D1 | Single-tenant template stamped per business; no multi-tenancy | Audience is friends/family at N≈handful; kills org/tenant/billing complexity; each guy's data fully isolated under his own accounts |
| D2 | Fresh scaffold; Denhaus mock (`tsmoreau/GroundWorkFrame`) kept as reference quarry | ~90% of files needed heavy rework anyway; template repo wants clean history/conventions; greenfield-to-spec is the better task shape for agent implementation; proven UI gets ported deliberately |
| D3 | Backend fully built in v2 but flag-gated; demo mode is a **permanent feature**, not scaffolding | Demo = sales demo, zero-setup local dev, and proof the adapter seam stays honest |
| D4 | Coarse module-level feature flags in `site.config.ts` (`features: {payments, ai, gallery, crew, accountingExport, backups}`) | Gates nav/routes/settings/API per module; no fine-grained flag spaghetti |
| D5 | Zod schemas are the single source of truth; `docs/openapi.yaml` retired | One definition → TS types + runtime validation + AI tool schemas + MCP; a hand-maintained 1,458-line YAML will drift within a month |
| D6 | Auth: Auth.js Google provider, JWT sessions, email allowlist; `role` (`owner`/`crew`) on the session from day one | JWT = no DB needed, so full auth ships in Phase 1 demo mode; role now = cheap, retrofit = painful |
| D7 | One shared "GroundWork" Google OAuth client owned by Terrence; per-instance redirect URIs | Per-instance provisioning drops from ~30 min (GCP project + consent screen) to ~2 min (add one URI). Consent screen says "GroundWork" — acceptable, only owner/crew see it |
| D8 | Crew concept: role-gated access to assigned jobs (view, flip status, add photos/notes). No payroll/timesheets/HR | That's Gusto/QuickBooks territory. `Job.assignedTo` optional field designed in now; crew *features* built later (backlog) |
| D9 | Timecards (if ever): simple hours-per-person-per-job records + CSV export | QuickBooks Time owns real time-tracking; we'd feed it, not compete |
| D10 | QuickBooks: **CSV export** of invoices/payments/customers; no live Intuit API integration | 90% of value at 5% of cost for this audience; live sync = OAuth + app review + sync conflicts for a handful of users |
| D11 | File storage on Vercel Blob, not GCS | One fewer cloud account + IAM setup per instance; friends-and-family means setup friction is Terrence's friction |
| D12 | AI: one **tool registry** defined against the data layer, exposed through two transports — in-app chat (Anthropic API tool use) and an MCP endpoint for external agents | Chat doesn't need MCP internally; define tools once, serve both |
| D13 | AI keys: BYOK is the only code path (`ANTHROPIC_API_KEY` env; later encrypted settings field). "Terrence provides inference" = an Anthropic Console **workspace per instance with a monthly spend cap**, that workspace's key in the env | Cost reality: ~3–5¢/question on Sonnet-class → few $/month/user. Workspace caps + revocation = zero proxy infrastructure. Server-side only; key never in the browser |
| D14 | AI default model `claude-sonnet-5` in config; Haiku as budget option | Near-Opus tool-use quality at $3/$15 (intro $2/$10); model swappable per instance |
| D15 | AI writes are draft-only or confirm-gated; reads are free | "Agent drafted an invoice" = delightful; "agent sent your client an invoice" = a phone call you don't want |
| D16 | Email notification on new lead is **core v2 scope**, not optional | A lead that sits two days is a lost job; highest-value single feature in the package |
| D17 | Estimate → client approval flow is core v2 scope | Types already half-model it (`InvoiceType: "quote"`, statuses `approved`/`declined`); the token page's Approve button is the contract moment for trades |
| D18 | Calendar (week/month view of scheduled jobs) in v2 scope; Google Calendar sync = future flag | Trade guys think in "what's my week"; sync rides existing Google OAuth later |
| D19 | Photos are the anchor Blob use case: contact-form uploads, job before/after, `portfolioApproved` → public gallery feed | For trades, photos are the product; the gallery loop turns finished jobs into marketing with one checkbox |
| D20 | Public lead-intake API accepts external POSTs (config CORS allowlist + spam protection) | CRM stays useful for guys with existing Wix/Squarespace/Facebook sites; decouples the two halves |
| D21 | Contact/lead endpoints ship with honeypot + rate limiting from day one | Bots love contact forms; a spam-filled leads table makes the product feel broken |
| D22 | Invoice numbers: per-year sequence from a DB counter (never `count+1`) | Voids/deletes make count-based numbers collide/reuse; accountants notice |
| D23 | Scheduling dates stored date-only (`YYYY-MM-DD`); datetimes only for actual timestamps | Prevents jobs shifting a day across timezones — classic bug |
| D24 | Every mutation/note carries an **actor** (`owner` / crew email / `ai`) | Required the moment crew or AI exists; trivial now, painful retrofit |
| D25 | Invoice designed to carry `payments[]` (not a binary paid flag) in the real schema; partial payments *built* later | Trades reality (client pays 2k of 3k). Design-now, build-later. Same for change orders (approval-gated line-item additions) |
| D26 | Backups: nightly JSON export to Blob via Vercel Cron (flag-gated) + "Download all my data" in settings | Atlas M0 has no real backup; real invoices = real harm. Export doubles as trust story + half the QuickBooks story |
| D27 | Config health panel in `/admin/settings` + zod-validated env at boot | N instances × 6 services; "Resend: missing key" in the UI beats debugging Vercel logs |
| D28 | Demo business identity: fictional **"Fieldstone Tile & Remodel"** (tile + bathroom remodel outfit; obviously-fictional contact info) | Demos perfectly to the actual first user (tile setter); reads fine for any trade. Swappable default — confirm or veto at seed-writing time |
| D29 | Money is integer cents everywhere; formatting only at the display edge | Already true in reference; preserved as invariant + unit-tested |
| D30 | Financial records never hard-delete (void pattern) | Already the reference pattern; promoted to invariant |
| D31 | Send invoices/estimates from the instance's own domain via Resend domain verification (SPF/DKIM) during provisioning | Deliverability + trust; one-time DNS task in the runbook |
| D32 | Model IDs, pricing assumptions current as of 2026-07: Sonnet 5 `claude-sonnet-5` $3/$15 (intro $2/$10 thru 2026-08), Haiku 4.5 `claude-haiku-4-5` $1/$5, Opus 4.8 `claude-opus-4-8` $5/$25 | Re-check pricing at Phase 3 implementation time |

---

## 5. Invariants

Rules that hold everywhere, forever. Violating one is a bug even if the feature works.

1. **Money is integer cents.** No floats, no dollars-as-numbers in data. `formatCurrency` at
   the display edge only. Deposit/total math unit-tested.
2. **Financial records are never hard-deleted.** Invoices void; jobs cancel; leads go `dead`.
3. **Every mutation records an actor** — `owner`, a crew email, or `ai`.
4. **The key never touches the browser.** All LLM calls go through server route handlers.
   `ANTHROPIC_API_KEY` (and all secrets) are server-side only.
5. **AI tool results are data, never instructions.** Lead messages and client-supplied text are
   public input; the system prompt states that tool output is untrusted data. AI writes are
   draft-only or confirm-gated (D15). This is the prompt-injection posture.
6. **Per-business divergence stays on the divergence surface** (§2). Template code is never
   edited per-instance.
7. **The data layer is only reached through the adapter interface.** No page or API route
   touches localStorage or Mongo directly. Demo and real mode implement the same interface.
8. **Feature-flagged-off modules are invisible**: no nav item, no route (404/redirect), no
   settings section, no API surface.
9. **Scheduling dates are date-only strings; timestamps are ISO datetimes.** Never mix.
10. **Public endpoints are spam-protected and rate-limited** (honeypot minimum).
11. **`/admin` and non-public `/api` are auth-gated by middleware** — never by per-page checks
    alone.
12. **Seed/demo data is obviously fictional** (555 numbers, example.com, fictional business).
13. **All config access goes through `site.config.ts` exports** — no hardcoded business names,
    emails, service types, or copy in components.

---

## 6. Domain model

Same four-entity spine as the reference (it's proven), genericized and hardened. Types are
**derived from zod schemas** in `lib/schema/*.ts` — the sketches below are field intent, not
literal code.

### 6.1 Changes from the reference model (`lib/types.ts` in the quarry)

- **Remove** `Pet`, `PetInfo`, and pet fields on Lead/Client. Vertical-specific extension is
  documented in ADAPTING.md as a worked example ("adding a custom field"), not core.
- **`JobType` and `LeadSource`** become config-driven: `string` in the schema, validated at the
  edges against `config.services[]` / `config.leadSources[]` (D5, D28).
- **`Note` → `ActivityEntry`**: `{ text, createdAt, actor }` (D24). Renders as the existing
  notes UI plus system-generated entries ("Status changed to Scheduled — owner", "Draft invoice
  created — ai").
- **`Job.assignedTo?: string[]`** (crew emails) — designed in, unused until crew module (D8).
- **`Job.scheduledStart/End`** become date-only strings (D23).
- **`Invoice`** gains: `payments: Payment[]` where `Payment = { id, amountCents, method,
  reference?, receivedAt, actor }` (D25; in demo/v1 an invoice simply has 0 or 1 payment);
  `approvedAt?` / `declinedAt?` for the estimate flow (D17). `paidAt` derived: set when
  `sum(payments) >= total`.
- **Invoice numbering**: `{prefix}-{year}-{seq}` where `seq` comes from a per-year counter
  (Mongo: atomic counter doc; demo: max existing + 1 for the year) (D22).
- **`BusinessSettings`** keeps payment-method toggles (Stripe/Zelle/check/bank) — this shape is
  good — plus AI section (model choice, monthly soft cap) and MCP token management in v3.

### 6.2 Entities (summary)

| Entity | Key fields | Status flow |
|---|---|---|
| **Lead** | name, email, phone?, address?, source (config), message, photos[], status, activity[], convertedTo? | `new → contacted → qualified → converted` / `dead` |
| **Client** | name, email, phone?, address, activity[], leadId?, jobIds[] | — |
| **Job** | clientId, title, type (config), status, lineItems[], depositAmount?, estimatedDays, scheduledStart/End (date-only), materialsCost, photos[], portfolioApproved, invoiceIds[], assignedTo[]?, activity[] | `quoted → deposit_paid → materials_ordered → scheduled → in_progress → complete` / `cancelled` |
| **Invoice** | invoiceNumber, jobId, clientId, type (`quote/deposit/final/full`), lineItems[], payments[], token, status, sentAt/viewedAt/approvedAt/declinedAt/paidAt | `draft → sent → viewed → approved/declined → paid` / `void` |
| **BusinessSettings** | identity fields, invoicePrefix, depositPercent, taxRate, payment toggles, AI config | — |

Domain operations (service layer, shared by both adapters): `convertLead`, `createJobForClient`,
`createInvoiceFromJob(type)` (deposit math: `round(total × depositPercent/100)`),
`recordPayment`, `approveEstimate`/`declineEstimate`, `nextInvoiceNumber`.

---

## 7. Architecture

### 7.1 Data layer — zod SSOT + adapter seam

```
lib/schema/           zod schemas per entity  →  z.infer types exported from lib/types.ts
lib/data/adapter.ts   DataAdapter interface: CRUD primitives per entity
lib/data/demo.ts      localStorage adapter (client-side; versioned key groundwork-demo-v2; seeded)
lib/data/mongo.ts     Mongo adapter (server-side; Phase 2)
lib/data/service.ts   Domain operations (§6.2) as pure-as-possible functions over the adapter
```

- `DATA_MODE=demo | mongo` (env) selects the adapter.
- **Demo mode** runs the adapter + service client-side behind a React context (port of the
  reference `data-context.tsx` mechanics), so the template works with zero backend.
- **Real mode** runs adapter + service server-side; pages/components call route handlers
  (`app/api/*`) validated with the same zod schemas. UI components consume a thin hooks layer
  (`useLeads()` etc.) that hides which mode is active.
- The zod schemas also feed the AI tool definitions (7.5) — one source of truth (D5).

### 7.2 Migrations & versioning

- Template releases are tagged; `CHANGELOG.md` per release.
- Schema-affecting releases ship `scripts/migrations/NNN-*.ts` (idempotent, run via
  `npm run migrate` against `MONGODB_URI`). Demo mode migrates by localStorage version-key bump
  + reseed.

### 7.3 Auth (Phase 1)

- Auth.js v5, Google provider, JWT sessions, no adapter/DB.
- Allowlist + roles from env: `OWNER_EMAILS`, `CREW_EMAILS` (comma-separated). Session carries
  `role`. Non-allowlisted Google accounts are rejected with a friendly page.
- `middleware.ts` gates `/admin/**` and non-public `/api/**` (Invariant 11). Crew-role route
  restrictions activate with the crew module (backlog); until then crew==owner minus settings.
- Per-instance env: `AUTH_SECRET`, `OWNER_EMAILS`, `CREW_EMAILS`; shared: `GOOGLE_CLIENT_ID/SECRET` (D7).

### 7.4 Feature flags

`config.features: { payments, gallery, ai, crew, accountingExport, backups }` — each gates nav
items, routes (layout-level redirect/404), settings sections, and API routes (Invariant 8).
Boot-time env validation (zod) cross-checks: a flag that's ON with missing env fails loudly at
build/boot and shows in the config health panel (D27).

### 7.5 AI module (Phase 3)

```
lib/ai/registry.ts    Tool registry: name, description, zod input schema, handler over lib/data/service
lib/ai/tools/*.ts     search_leads, get_client, list_jobs, outstanding_invoices, summarize_job,
                      draft_invoice (draft-only), add_note (actor: 'ai'), business_snapshot, ...
app/api/ai/chat       Streaming route handler; Anthropic SDK tool runner over the registry;
                      bounded history + max_tokens; persists light chat history (real mode)
app/api/mcp           mcp-handler endpoint (Streamable HTTP); same registry; bearer-token auth
                      (token generated/revoked in settings)
components/ai/*       Chat panel in admin (slide-over), usage meter widget
```

- Writes: draft-only or UI-confirm-gated (D15). Every AI mutation logs `actor: 'ai'` (D24).
- Usage: tally `response.usage` tokens server-side; settings shows "AI this month: ~$X" with an
  optional soft cap that pauses chat (D13).
- Env: `ANTHROPIC_API_KEY`; config: model id (default `claude-sonnet-5`), soft cap.
- Prompt-injection posture per Invariant 5.

### 7.6 Notifications & email (Phase 2)

- Resend; instance domain verified (SPF/DKIM) at provisioning (D31).
- Sends: new-lead notification to owner (D16); estimate/invoice send to client with tokenized
  link; payment-received notification. React Email or simple HTML templates, branded from config.

### 7.7 Payments (Phase 2)

- Stripe Checkout for card + ACH on the invoice token page; webhook (`/api/payments/webhook`)
  records payment + flips status.
- Manual methods stay first-class: Zelle/check/bank instructions render from settings; owner
  records manual payments (`recordPayment`) in admin. Reference UI already models this well.

### 7.8 Files/photos (Phase 2)

- Vercel Blob. Upload paths: contact form (client's site photos), job detail (before/after,
  mobile camera capture), settings (logo).
- `portfolioApproved` jobs feed the public gallery from real data (D19); gallery falls back to
  config-driven placeholder content when empty.

### 7.9 Exports & backups (Phase 2)

- `/admin/settings` → "Download all data" (full JSON) + QuickBooks-compatible CSVs (invoices,
  payments, customers) (D10, D26).
- Flag-gated Vercel Cron nightly JSON snapshot to Blob, retention ~30 days (D26).

### 7.10 Public lead intake (Phase 1 form; Phase 2 hardened API)

- `POST /api/leads` public: zod-validated, honeypot, IP rate-limit, CORS allowlist from config
  (D20, D21). The template's own contact form and any external site both use it.

---

## 8. UI system

### 8.1 Design tokens

Distill the reference's newest token generation ("Architectural Naturalist" set in
`app/globals.css:56-126` of the quarry) into **one** small set in `app/tokens.css` (the
divergence surface file): `--color-primary`, `--color-on-primary`, surface scale
(`surface`, `surface-container[-low/-high]`), `on-surface[-variant]`, `outline[-variant]`,
`error` pair, status hues (blue/amber/purple/green/red bg+fg pairs — port the concept from
`lib/status-colors.ts`), radius scale, font vars. **Delete** the legacy `parchment/espresso/
gold/charcoal` generation entirely. Re-theming an instance = editing ~10 variables.

### 8.2 Component library (`components/`)

Extracted once, used everywhere — the reference inlines all of these per-page (its biggest
structural flaw):

| Component | Port from (quarry) |
|---|---|
| `ui/`: Button, Input, Select, Textarea, Modal, StatusBadge, EmptyState, Card | patterns scattered across all admin pages |
| `DataTable` (sort/filter/search/click-row) | `app/admin/leads/page.tsx` (cleanest instance) |
| `KanbanBoard` | `app/admin/jobs/page.tsx` (highest-value single port) |
| `ActivityFeed` (+ add-entry) | notes UI in `app/admin/leads/[id]/page.tsx` |
| `LineItemEditor` | `app/admin/jobs/[id]/page.tsx` |
| `StatCard` | `app/admin/dashboard/page.tsx` |
| `admin/Shell` (sidebar, badges, mobile drawer) | `app/admin/layout.tsx` |
| `site/Header`, `site/Footer` | duplicated navs in `app/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx` |
| `PhotoGrid`/`PhotoUpload` (Phase 2) | new |
| `ai/ChatPanel` (Phase 3) | new |

Mobile matters disproportionately (trade guys, trucks, phones): preserve the reference's mobile
drawer/topbar work; add PWA manifest + icons in Phase 2 polish so "add to home screen" is decent.

---

## 9. Phased build

### Phase 0 — Scaffold & foundations

| # | Item | Tag |
|---|---|---|
| 0.1 | Fresh Next.js 15 App Router scaffold (TS, Tailwind v4, ESLint+Prettier flat config, `next/font`) | BUILD |
| 0.2 | `site.config.ts` skeleton (see sketch below) + `app/tokens.css` + zod env validation (`lib/env.ts`) | BUILD |
| 0.3 | `lib/schema/*` zod schemas per §6; types via `z.infer` | BUILD (informed by quarry `lib/types.ts`) |
| 0.4 | CI: GitHub Actions — typecheck, lint, build, vitest | BUILD |
| 0.5 | Repo docs: `README.md`, `docs/PLAN.md` (this file), `CLAUDE.md` (build commands, conventions, pointer here), `CHANGELOG.md` | BUILD |
| 0.6 | Vitest + first tests: deposit math, totals, invoice-number sequencing, config validation | BUILD |

```ts
// site.config.ts — shape sketch (implementation session finalizes)
export const config = {
  business: { name, legalName, tagline, email, phone, address, serviceAreas: [] },
  site: { url, metaDescription, ogImage, nav: [...], corsAllowlist: [] },
  services: [ { key: 'tile_install', label: 'Tile Installation' }, ... ], // job types
  leadSources: [ { key: 'contact_form', label: 'Contact Form' }, ... ],
  invoicing: { prefix: 'INV', depositPercent: 50, taxRate: 0 },
  features: { payments: false, gallery: true, ai: false, crew: false,
              accountingExport: false, backups: false },
  ai: { model: 'claude-sonnet-5', monthlySoftCapCents: null },
} as const;
```

**Done when:** fresh clone → `npm i && npm run dev` renders a config-driven placeholder landing
page; CI green; env validation fails loudly on garbage.

### Phase 1 — Template core (ships as deployable demo-mode product)

| # | Item | Tag / reference |
|---|---|---|
| 1.1 | Design tokens finalized (§8.1) | PORT `app/globals.css` (newest set only) |
| 1.2 | Component library (§8.2, Phase-1 rows) | PORT (per-component references above) |
| 1.3 | Demo data adapter + service layer + hooks (§7.1) | PORT logic from `app/admin/data-context.tsx`; restructure behind adapter seam |
| 1.4 | Seed data: Fieldstone Tile & Remodel (D28) — keep the reference's richness (8 leads, 3 clients, 4 jobs, 4 invoices, realistic notes) | REWRITE from `lib/mock-data.ts` |
| 1.5 | Admin: dashboard, leads (list+detail), clients (list+detail), jobs (kanban+list+detail), invoices (list+detail), settings | PORT all `app/admin/**` pages onto the component library |
| 1.6 | Public: landing, gallery, contact (posting to `POST /api/leads` w/ honeypot even in demo), estimate/invoice token page | PORT `app/page.tsx`, `gallery`, `contact`, `invoice/[token]`; copy/content config-driven |
| 1.7 | Auth (§7.3): Google + allowlist + roles + middleware; sign-in/denied pages | BUILD |
| 1.8 | Feature-flag gating wired (nav/routes/settings) (§7.4) | BUILD |
| 1.9 | Settings: business info + payment toggles + "Reset demo data" + config health panel v1 (env presence per flag) | PORT `app/admin/settings/page.tsx` + BUILD |
| 1.10 | `ADAPTING.md`: the "make it yours in 30 minutes" checklist (config, tokens, assets, seed, envs, deploy) incl. worked example "add a custom field to Lead" | BUILD |
| 1.11 | Basic SEO: config-driven metadata, sitemap, robots, OG image; placeholder privacy page | BUILD |

**Done when:** deploy to Vercel with only auth env vars → Google-gated admin over demo data with
the new identity; every reference flow works (convert lead, job kanban, create deposit invoice
with correct math, token page view/simulated-pay, settings persist); zero occurrences of
"Denhaus"/pets/LA anywhere; ADAPTING.md walkthrough completes in ~30 min; CI green.

### Phase 2 — Real backend (flag-gated)

| # | Item | Tag |
|---|---|---|
| 2.1 | Mongo adapter + route handlers for all entities (zod-validated), `DATA_MODE` switch, per-year invoice counter (D22) | BUILD |
| 2.2 | Migration runner + first migration scripts (§7.2) | BUILD |
| 2.3 | Resend: new-lead notification (D16), estimate/invoice send, payment-received; branded templates | BUILD |
| 2.4 | Estimate approval flow on token page (Approve/Decline → statuses, timestamps, owner notification) (D17) | BUILD (extend quarry `invoice/[token]` port) |
| 2.5 | Stripe Checkout (card+ACH) + webhook + `recordPayment`; manual-payment recording in admin | BUILD |
| 2.6 | Blob photos end-to-end (§7.8): contact-form upload, job photos w/ mobile capture, portfolio→gallery loop | BUILD |
| 2.7 | Calendar: week/month view of scheduled jobs (D18) | BUILD |
| 2.8 | Public lead API hardened: rate limit, CORS allowlist, external-site docs snippet (D20/21) | BUILD |
| 2.9 | Exports: full JSON + QuickBooks CSVs; flag-gated nightly Blob backup cron (§7.9) | BUILD |
| 2.10 | Config health panel v2: live connectivity checks per service | BUILD |
| 2.11 | PWA polish: manifest, icons, installability | BUILD |
| 2.12 | Playwright smoke: lead→convert→job→invoice→pay happy path (both modes) | BUILD |

**Done when:** a real instance (Mongo/Stripe-test/Resend/Blob) runs the full pipeline: contact
form → owner email → convert → job → estimate → client approves → deposit paid via Stripe test →
photos on job → complete → final invoice → CSV export contains it all. Demo mode still fully
works with backend flags off.

### Phase 3 — AI module (flag-gated)

| # | Item | Tag |
|---|---|---|
| 3.1 | Tool registry over service layer (§7.5): read tools + `draft_invoice`/`add_note` writes | BUILD |
| 3.2 | Chat route (streaming, SDK tool runner, bounded history) + admin ChatPanel | BUILD |
| 3.3 | MCP endpoint (`mcp-handler`, bearer token from settings) exposing the same registry | BUILD |
| 3.4 | Usage meter + soft cap (D13); prompt-injection posture verified against a hostile lead message (Invariant 5) | BUILD |
| 3.5 | Chat history persistence (real mode), prunable | BUILD |

**Done when:** owner asks "which leads haven't I touched in a week?" and gets a correct answer;
"draft a deposit invoice for the Hendricks job" yields a draft (never sent) with `actor: ai` in
the activity feed; Claude Desktop connects via MCP token and reads the same data; a lead message
containing prompt-injection is quoted, not obeyed; usage meter reflects real token spend.

### Backlog (designed-for, not scheduled)

Crew module (role-gated job views, assignment, field photo/notes) · simple timecards + CSV (D9)
· partial payments UI + change orders (D25) · Google Calendar sync · SMS (Twilio) · live QBO
sync (only if truly demanded) · encrypted settings-page AI key entry · per-instance
theming presets.

---

## 10. Porting map (quarry → GroundWork)

| Reference file (`tsmoreau/GroundWorkFrame`) | Disposition |
|---|---|
| `lib/types.ts` | SUPERSEDE → zod schemas (§6 changes) |
| `lib/mock-data.ts` | REWRITE → Fieldstone seed (keep richness/pattern) |
| `lib/utils.ts` | PORT (cn/format/computeTotal); label maps → config; `generateId` → nanoid/ObjectId per adapter |
| `lib/status-colors.ts` | PORT concept into token set |
| `app/admin/data-context.tsx` | SUPERSEDE → adapter + service + hooks (port the CRUD/convert/invoice logic) |
| `app/admin/layout.tsx` | PORT → `admin/Shell` (keep mobile drawer, badges) |
| `app/admin/dashboard/page.tsx` | PORT (StatCard extraction) |
| `app/admin/leads/page.tsx` + `[id]` | PORT (DataTable + ActivityFeed extraction) |
| `app/admin/clients/page.tsx` + `[id]` | PORT |
| `app/admin/jobs/page.tsx` | PORT — kanban is the highest-value UI in the quarry |
| `app/admin/jobs/[id]/page.tsx` | PORT (LineItemEditor extraction) |
| `app/admin/invoices/page.tsx` + `[id]` | PORT |
| `app/admin/settings/page.tsx` | PORT + extend (health panel, reset demo) |
| `app/page.tsx` | PORT structure; copy from config (note: has a typo "Desgined" — don't carry it) |
| `app/gallery/page.tsx` | PORT; content config/data-driven; `next/image`; fix odd `direction-rtl` class |
| `app/contact/page.tsx` | PORT UX; submit via `POST /api/leads`; honeypot |
| `app/invoice/[token]/page.tsx` | PORT flow; + estimate approval (2.4); server-rendered in real mode |
| `app/globals.css` | DISTILL newest token generation only (§8.1) |
| `app/layout.tsx` | REBUILD (config metadata, `next/font`) |
| `next.config.ts` | REBUILD (drop `allowedDevOrigins: ["*"]`, unsplash remote pattern only if placeholder gallery keeps it) |
| `docs/openapi.yaml` | RETIRE (D5) — historical reference only |
| `replit.md`, `.replit*`, `attached_assets/`, `artifacts/`, `.canvas/` | DROP (never copied) |
| `public/*` | REPLACE with placeholder brand assets |

---

## 11. Per-instance provisioning runbook (target state)

The ADAPTING.md deliverable expands this; the plan-level checklist:

1. Fork/clone template → new private repo `groundwork-<business>`; add template remote.
2. Edit divergence surface: `site.config.ts`, `app/tokens.css`, `public/` assets, seed (or start
   empty).
3. Vercel project; set env per matrix below.
4. Google OAuth: add `https://<domain>/api/auth/callback/google` to the shared client (D7).
5. Mongo Atlas: create DB + user; set `MONGODB_URI`; run `npm run migrate`.
6. Resend: verify business domain (SPF/DKIM DNS records) (D31).
7. Stripe: their account; keys + webhook endpoint.
8. Blob: create store, token.
9. AI (optional): their key, or a spend-capped workspace key under Terrence's org (D13).
10. Domain: point DNS at Vercel.
11. Verify via config health panel → flip flags on → hand over.

**Env matrix**

| Var | Phase | Scope |
|---|---|---|
| `AUTH_SECRET`, `OWNER_EMAILS`, `CREW_EMAILS` | 1 | per-instance |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | 1 | shared (D7) |
| `NEXT_PUBLIC_SITE_URL` | 1 | per-instance |
| `DATA_MODE`, `MONGODB_URI` | 2 | per-instance |
| `RESEND_API_KEY`, `EMAIL_FROM` | 2 | per-instance |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | 2 | per-instance |
| `BLOB_READ_WRITE_TOKEN` | 2 | per-instance |
| `ANTHROPIC_API_KEY` | 3 | per-instance (BYOK or capped workspace key) |
| `MCP_ACCESS_TOKEN` (or settings-generated) | 3 | per-instance |

---

## 12. Open items

| Item | Default in this plan | Owner |
|---|---|---|
| New repo vs. this repo (orphan branch) for the scaffold | New repo (see §0 note) | Terrence |
| Demo business identity | "Fieldstone Tile & Remodel" (D28) | Terrence — veto at seed time |
| License | Private/UNLICENSED until distribution plans change | Terrence |
| AI key via encrypted settings field (vs env-only) | Env-only through Phase 3; settings field = backlog | — |
| Exact Fieldstone seed content/locale | Implementation session's creative call within Invariant 12 | Phase 1 session |
