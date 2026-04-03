# Small Business Backend Boilerplate

## Spec Document — v0.2

**Working name:** Groundwork (or whatever — this is the boilerplate, not the brand)
**Use case zero:** Denhaus — design studio for outdoor pet environments
**Stack:** Next.js (App Router) + Tailwind + MongoDB + Stripe + QuickBooks Online API
**Deploy target:** Vercel + MongoDB Atlas (free tier to start)

---

## Changelog

- **v0.2:** GCS replaces Cloudflare R2 for file storage. Google OAuth via NextAuth replaces email/password auth. Payment architecture revised: app owns invoices and presentation, Stripe is one payment rail (ACH + card fallback) alongside manual methods (Zelle, check, bank transfer). Invoice is a pure data object — PDF, web view, email body, Stripe line items, and CSV are all renderers that read the same record on demand. `totalAmount` removed from Job and Invoice schemas (computed on read from lineItems). Photos store GCS object keys, not URLs or thumbnails. Notes are `{ text, createdAt }` objects, not strings. Invoice model updated with payment method tracking.

---

## 1. Problem Shape

A small service business — one operator, maybe a helper — needs:

1. A public face that collects leads (not a WordPress blog, not a Squarespace site with a contact widget that emails you)
2. A pipeline that turns leads into jobs and jobs into invoices without switching between 4 SaaS tools
3. Payment collection that isn't "Venmo me" or "I'll send you a Square invoice from my phone"
4. Books that don't require re-typing everything into QuickBooks at tax time

The existing market solution is: Squarespace + HoneyBook/Jobber + Square/Stripe Dashboard + QuickBooks = $150–300/month in SaaS fees, four logins, no data continuity between them, and a bunch of manual re-entry.

The boilerplate replaces that with one codebase that owns the full lifecycle: **lead → client → job → invoice → payment → books.**

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                     NEXT.JS APP                       │
│                                                       │
│  ┌──────────────┐    ┌─────────────────────────────┐  │
│  │  PUBLIC SITE  │    │       ADMIN BACKEND         │  │
│  │              │    │                             │  │
│  │  /           │    │  /admin/dashboard           │  │
│  │  /gallery    │    │  /admin/leads               │  │
│  │  /contact    │    │  /admin/clients             │  │
│  │  /products   │    │  /admin/jobs                │  │
│  │              │    │  /admin/invoices            │  │
│  │  /invoice/   │    │  /admin/settings            │  │
│  │    [token]   │    │                             │  │
│  └──────┬───────┘    └────────────┬────────────────┘  │
│         │                         │                    │
│  ┌──────┴─────────────────────────┴─────────────────┐ │
│  │                  API ROUTES                       │ │
│  │  /api/leads     /api/clients    /api/jobs         │ │
│  │  /api/invoices  /api/payments   /api/webhooks     │ │
│  │  /api/export    /api/auth       /api/upload       │ │
│  └──────────────────────┬───────────────────────────┘ │
└─────────────────────────┼─────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     ┌────▼────┐    ┌─────▼─────┐   ┌────▼─────────┐
     │ MongoDB │    │  Stripe   │   │  QuickBooks   │
     │  Atlas  │    │ (payment  │   │  Online API   │
     │         │    │  rail)    │   │               │
     └─────────┘    └───────────┘   └──────────────-┘
          │
     ┌────▼────┐
     │  GCS    │
     │ (files) │
     └─────────┘
```

### Why This Stack

- **Next.js App Router:** Public site and admin are the same app. SSR for public pages (SEO), client components for admin UI. API routes handle everything — no separate backend.
- **MongoDB Atlas:** Schema flexibility matters here. A catio job and a dog house job have different fields. Leads have freeform notes. You don't want to be running migrations every time you add a field to a job type. Free tier is 512MB — that's tens of thousands of records before you pay a cent.
- **Stripe:** The payment rail, not the billing platform. Your app owns invoices, presentation, and client communication. Stripe moves money when the client clicks "Pay Online" — ACH by default ($5 flat cap), card as fallback (2.9% + 30¢). Other payment methods (Zelle, check, bank transfer) are tracked locally with no processor involvement.
- **QuickBooks Online:** 70%+ market share for small business accounting in the US. The API is annoying but well-documented. The alternative is CSV export, which is a fine v1.
- **Google Cloud Storage:** Familiar GCP ecosystem, generous free tier (5GB), signed URL flow for direct uploads. Same GCP project as Google OAuth — one project, two services.
- **Tailwind:** You already know it. No discussion needed.

---

## 3. Data Model

### 3.1 Leads

A lead is an inbound contact that hasn't become a client yet.

```
Lead {
  _id: ObjectId
  name: string
  email: string
  phone?: string
  address?: string                // street address — used for Street View lookup
  source: enum [contact_form, nextdoor, craigslist, referral, vet_card, other]
  message: string                 // freeform from contact form
  photos: string[]                // GCS object keys (originals only — thumbnails derived by convention)
  petInfo: {
    type: enum [cat, dog, both]
    breed?: string
    count?: number
  }
  status: enum [new, contacted, qualified, converted, dead]
  notes: [{                       // append-only timeline
    text: string
    createdAt: Date
  }]
  convertedTo?: ObjectId          // ref → Client
  createdAt: Date
  updatedAt: Date
}
```

**Key decisions:**
- Photos upload to GCS at intake. The `photos` array stores GCS object keys (e.g. `leads/{leadId}/img_001.jpg`), not full URLs. Thumbnails are derived by convention (`{key}_thumb.jpg`) or generated on the fly by the renderer (Next.js Image, GCS transform). The data model doesn't know about rendering sizes.
- `notes` are proper objects with timestamps, not strings with timestamps faked into the text. The admin UI renders them as a timeline; the data supports that without the renderer having to parse anything.
- `source` tracking matters for knowing which channel is working (vet cards vs. Nextdoor vs. Craigslist).
- `address` is a first-class field, not buried in notes. For a service business, the job site IS the address.

### 3.2 Clients

A client is a lead that converted. Persists across multiple jobs.

```
Client {
  _id: ObjectId
  name: string
  email: string
  phone?: string
  address: string
  coordinates?: { lat: number, lng: number }  // geocoded from address
  stripeCustomerId?: string       // Stripe Customer object
  qboCustomerId?: string          // QuickBooks customer ref
  pets: [{
    name?: string
    type: enum [cat, dog]
    breed?: string
  }]
  notes: [{ text: string, createdAt: Date }]
  leadId: ObjectId                // ref → Lead (origin)
  jobs: ObjectId[]                // ref → Job[]
  createdAt: Date
  updatedAt: Date
}
```

**Key decisions:**
- `stripeCustomerId` is set on first Stripe payment. Persists payment methods for repeat clients.
- `qboCustomerId` is set on first QuickBooks sync. Links the local record to the QBO record.
- Pets are embedded, not a separate collection. You'll never query "all golden retrievers across all clients."

### 3.3 Jobs

A job is a unit of work for a client. This is the core operational record.

```
Job {
  _id: ObjectId
  clientId: ObjectId              // ref → Client
  title: string                   // "Martinez Catio" or "Patel Dog House — Ranch Large"
  type: enum [catio, dog_house, kennel, cat_box, tunnel, other]
  status: enum [quoted, deposit_paid, materials_ordered, scheduled, in_progress, complete, cancelled]
  
  // Pricing
  lineItems: [{
    description: string           // "Base catio structure", "Tech package — camera + LED"
    amount: number                // in cents
    category?: string             // for QBO mapping: materials, labor, tech, etc.
  }]
  // totalAmount: computed on read — sum of lineItems[].amount
  depositAmount?: number          // if deposit model
  
  // Scheduling
  estimatedDays: number
  scheduledStart?: Date
  scheduledEnd?: Date
  actualStart?: Date
  actualEnd?: Date
  
  // Materials
  materialsCost: number           // internal cost tracking, in cents — never shown to client
  materialsNotes?: string
  
  // Deliverables
  photos: string[]                // GCS object keys (originals only — thumbnails derived by convention)
  portfolioApproved: boolean      // flag to include in public gallery
  
  // Payments
  invoices: ObjectId[]            // ref → Invoice[]
  
  notes: [{ text: string, createdAt: Date }]
  createdAt: Date
  updatedAt: Date
}
```

**Key decisions:**
- `lineItems` is the source of truth for pricing. Each line item has a description and amount. This maps directly to Stripe Checkout line items, your own invoice renderer, and QuickBooks invoice line items. One schema, N outputs.
- **`totalAmount` is not stored.** It's computed on read: `lineItems.reduce((sum, li) => sum + li.amount, 0)`. This eliminates the sync problem — edit a line item and every renderer sees the correct total immediately. At 2-4 jobs/month you'll never notice the compute cost. Implement as a Mongoose virtual or a utility function.
- **`photos` stores GCS object keys, not URLs or thumbnails.** The full URL is constructed by the renderer from the key + bucket config. Thumbnails are derived by convention (`{key}_thumb.jpg`) or generated on the fly. The data model has no opinion about rendering sizes.
- `materialsCost` is internal. This is your margin tracking. Never exposed to the client, never on an invoice. Margin = `computed totalAmount - materialsCost`.
- `portfolioApproved` gates whether job photos show up on the public gallery. You photograph everything; you only publish what you choose.
- Status enum tracks the actual workflow: quoted → deposit paid → materials ordered → scheduled → in progress → complete. This is the kanban.

### 3.4 Invoices

An invoice is a payment request tied to a job. **It's a data object in MongoDB — nothing more.** It is not a PDF, not a Stripe Invoice, not an email. It's a record with line items, a total, a status, and a payment method. Every output — web view, PDF, email body, Stripe Checkout line items, QBO CSV row — is a render of this data at request time. Nothing is pre-generated or stored in a specific format.

```
Invoice {
  _id: ObjectId
  invoiceNumber: string            // sequential, human-readable: "DNH-2025-001"
  jobId: ObjectId                  // ref → Job
  clientId: ObjectId               // ref → Client
  type: enum [deposit, final, full]
  
  lineItems: [{                    // copied from job lineItems at creation time
    description: string
    amount: number                 // in cents
    category?: string
  }]
  // totalAmount: computed on read — sum of lineItems[].amount
  
  // Payment
  paymentMethod?: enum [stripe_ach, stripe_card, zelle, check, bank_transfer, other]
  paymentReference?: string        // check number, Zelle confirmation, transfer ref, etc.
  
  // Stripe (only populated if client pays via Stripe)
  stripeSessionId?: string         // Checkout Session ID
  stripePaymentIntentId?: string
  
  // QuickBooks
  qboInvoiceId?: string
  
  // Client-facing
  token: string                    // unique URL token for /invoice/[token] public page
  sentAt?: Date                    // when invoice email was sent
  viewedAt?: Date                  // when client first opened the invoice page
  
  status: enum [draft, sent, viewed, paid, void]
  paidAt?: Date
  
  createdAt: Date
  updatedAt: Date
}
```

**Key decisions:**
- **The invoice is a data object, not a document.** There is no "invoice file" anywhere. When someone needs a PDF, you render one from the data. When the client opens `/invoice/[token]`, you render HTML from the data. When you send an email, you render the email body from the data. When you create a Stripe Checkout Session, you map line items from the data. When you export to QBO, you serialize a CSV row from the data. One source of truth, N output formats, all generated on demand.
- A job can have multiple invoices (deposit + final). Or one invoice (full payment upfront for a dog house).
- Line items are copied from the job at invoice creation time, not referenced. If you change the job quote after sending a deposit invoice, the deposit invoice doesn't change.
- `token` is a unique, unguessable URL slug. The client-facing invoice page lives at `/invoice/[token]` — no auth required, no client login. Anyone with the link can view and pay.
- `paymentMethod` and `paymentReference` capture how the payment actually arrived, regardless of whether it came through Stripe or was marked manually.
- `viewedAt` is set the first time the client opens the invoice page. Useful for knowing whether to follow up ("they haven't even looked at it" vs. "they looked 3 days ago and haven't paid").

### 3.5 Payment Settings (embedded in business config or settings collection)

```
PaymentSettings {
  // Stripe
  stripeEnabled: boolean
  stripeDefaultMethod: enum [ach, card]  // ACH first, card as fallback
  
  // Zelle
  zelleEnabled: boolean
  zelleRecipient: string           // email or phone registered with Zelle
  zelleQrImage?: string            // GCS URL of static QR screenshot from banking app
  
  // Check
  checkEnabled: boolean
  checkPayableTo: string           // "Denhaus LLC"
  checkMailingAddress?: string
  
  // Bank Transfer
  bankTransferEnabled: boolean
  bankName?: string
  bankRoutingNumber?: string
  bankAccountLast4?: string        // display only — never store full account number
  
  // Invoice
  invoicePrefix: string            // "DNH"
  depositPercent: number           // 50
  taxRate: number                  // 0 for labor in CA
  
  // Business info (for invoice header)
  businessName: string
  businessAddress?: string
  businessPhone?: string
  businessEmail: string
  businessLogo?: string            // GCS URL
}
```

### 3.6 Data Model Principles

Three rules applied throughout:

1. **No computed fields stored.** `totalAmount` on Jobs and Invoices is derived from `lineItems` at read time (Mongoose virtual or utility function). One source of truth per value. Edit a line item, every renderer sees the correct total immediately.

2. **No rendering concerns in the data.** Photos store GCS object keys, not URLs or thumbnail variants. Notes store `{ text, createdAt }`, not timestamp-embedded strings. The data model has no opinion about how it's displayed — that's the renderer's job.

3. **Data is copied at transition boundaries, not referenced.** When an Invoice is created from a Job, line items are copied, not linked. The invoice is a snapshot of the quote at the moment it was issued. Subsequent changes to the Job don't silently mutate outstanding invoices.

---

## 4. Feature Modules

### 4.1 Public Site

**Pages:**
- `/` — Landing. Hero image, one-line pitch, product categories, pricing minimums, CTA to contact.
- `/gallery` — Grid of portfolio photos pulled from jobs where `portfolioApproved: true`. Filterable by type.
- `/contact` — Form that creates a Lead. Fields: name, email, phone, address, pet type, message, photo upload (multi).
- `/products` (optional) — Static or CMS-driven product pages for Design Objects and Design Systems.
- `/invoice/[token]` — Client-facing invoice page (see §4.7).

**Technical notes:**
- Public pages are server-rendered. No auth required.
- Contact form photo upload goes direct to GCS via signed URL. The form submission sends the URLs, not the files. No 10MB POST bodies hitting your API route.
- Rate limiting on `/api/leads` — honeypot field + simple rate limit middleware. No CAPTCHA unless spam becomes a problem.
- Email notification to admin on new lead (Resend or SendGrid — one transactional email, not a marketing platform).

### 4.2 Admin Auth

**Approach:** NextAuth.js (Auth.js) with Google OAuth provider, restricted to a whitelist of allowed emails.

This is a one-person business. You don't need roles, permissions, team management, or a password to manage. You sign in with Google — the same Google account you already use for everything.

**Implementation:**
- `next-auth` with Google OAuth provider
- Allowlist of admin email(s) in env var: `ADMIN_EMAILS=you@gmail.com`
- Auth callback checks: if the Google email isn't in the allowlist, deny access
- Session strategy: JWT (stateless, no session collection needed)
- Middleware: `middleware.ts` checks for valid session on `/admin/*` paths

```typescript
// lib/auth.ts — simplified
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowed = process.env.ADMIN_EMAILS?.split(',') ?? []
      return allowed.includes(user.email ?? '')
    },
  },
  session: { strategy: 'jwt' },
}
```

**Why Google OAuth over email/password:**
- No password to manage, store, hash, or reset
- No magic link email infrastructure needed just for auth
- Google handles 2FA, session security, account recovery
- One fewer thing to build. The Google Cloud Console project you need for GCS already gives you OAuth credentials.

### 4.3 Admin Dashboard

`/admin/dashboard` — The home screen after login.

**Displays:**
- Pipeline summary: count of leads by status, count of jobs by status
- Upcoming scheduled jobs (next 2 weeks)
- Outstanding invoices (unpaid) with age indicators
- Monthly revenue (paid invoices this month)
- Quick actions: "New Lead," "New Job," view latest lead

**Not a full analytics suite.** This is a glanceable status board. You're checking it on your phone between cuts on a table saw.

### 4.4 Leads Management

`/admin/leads` — Table view of all leads, filterable by status and source.

**Per-lead view:**
- All submitted info + photos
- Google Maps embed or link (from address)
- Street View embed (the house exterior — this is how you match roofline for dog house design)
- Status toggle
- Notes (append-only timeline)
- "Convert to Client" action → creates Client record, copies fields, sets `convertedTo`

### 4.5 Client Management

`/admin/clients` — Table view of all clients.

**Per-client view:**
- Contact info, address, pets
- List of associated jobs (with status badges)
- List of associated invoices (with payment status)
- Notes timeline

### 4.6 Job Management

`/admin/jobs` — Kanban board view (columns = status) AND table view (toggle).

**Per-job view:**
- Title, type, client (linked)
- Line items editor (add/remove/edit)
- Computed total (sum of line items) and margin display (total - materialsCost)
- Status progression buttons (advance to next status)
- Schedule picker (date range)
- Photo upload (multi, drag-and-drop to GCS)
- Portfolio toggle
- Notes timeline
- Invoice actions: "Create Deposit Invoice," "Create Final Invoice"

**Kanban view:**
- Drag cards between status columns
- Cards show: title, client name, total, scheduled date
- This is the primary operational view. You want to see at a glance: what's quoted, what's paid up and waiting to schedule, what's this week, what's done.

### 4.7 Invoicing & Payments

This is the core of the payment architecture. **Your app owns invoices end-to-end.** Stripe is one payment method, not the invoicing system.

#### Invoice Creation Flow (Admin)

1. From a Job, click "Create Invoice"
2. Choose type: deposit (auto-calculates from `depositPercent`), final (remaining balance), or full
3. Line items pre-populated from job. Editable before sending.
4. Preview the invoice as the client will see it
5. "Send Invoice" → generates the invoice, emails client a link to `/invoice/[token]`

#### Client-Facing Invoice Page: `/invoice/[token]`

This is a public page (no auth) that displays the invoice with your branding:

- Business logo, name, contact info (from PaymentSettings)
- Client name and address
- Invoice number, date, due date
- Line items with descriptions and amounts
- Total

Below the invoice, the payment options section — rendered based on what's enabled in PaymentSettings:

**Pay Online (Stripe):**
- "Pay Now" button → creates a Stripe Checkout Session on click (ACH default, card fallback)
- Client completes payment on Stripe's hosted page
- Stripe redirects back to `/invoice/[token]?status=success`
- Webhook `checkout.session.completed` → updates invoice status to `paid`, sets `paymentMethod` to `stripe_ach` or `stripe_card`

**Pay via Zelle:**
- Displays Zelle QR code image (static, uploaded from banking app, stored in GCS)
- Text: "Scan to pay via Zelle, or send to [zelleRecipient]. Reference: [invoiceNumber]"
- After sending, payment is confirmed when admin marks it manually

**Pay by Check:**
- Text: "Make check payable to [checkPayableTo]. Mail to: [checkMailingAddress]. Reference: [invoiceNumber]"

**Pay by Bank Transfer:**
- Text: "Bank: [bankName]. Routing: [bankRoutingNumber]. Account ending in: [accountLast4]. Reference: [invoiceNumber]"

The invoice number as reference on all manual methods is what lets you match the incoming payment to the invoice when you see it in your bank app.

#### Payment Confirmation

**Stripe payments:** Automatic. Webhook fires, invoice status updates, admin gets email notification. No manual step.

**Everything else:** Admin opens the invoice in `/admin/invoices`, clicks "Mark as Paid," selects payment method from dropdown, optionally enters a reference (check number, Zelle confirmation, etc.), confirms. Invoice status updates to `paid`.

#### Invoice Renderers

The invoice data object is the single source of truth. Every output format is a renderer — a function that takes the invoice data (plus business settings for branding) and produces output. Nothing is pre-generated. Nothing is cached as a file.

**Renderers:**

| Output | When | Implementation |
|---|---|---|
| Web view | Client opens `/invoice/[token]` | Server component reads Invoice from DB, renders HTML |
| PDF | Client clicks "Download PDF" or email needs attachment | `@react-pdf/renderer` or equivalent, generates on demand from Invoice data |
| Email body | Admin clicks "Send Invoice" | Resend template populated from Invoice data, includes link to web view |
| Stripe line items | Client clicks "Pay Now" | Map `invoice.lineItems` → Stripe Checkout Session `line_items` |
| QBO CSV row | Admin exports for bookkeeping | Serialize Invoice fields to CSV format |
| Admin detail view | Admin views invoice in backend | Client component reads Invoice from API |

**Why no pre-generated PDF:**
- The data is the truth. If you fix a typo in a line item description before the client pays, the web view and the next PDF download both reflect it immediately. No stale file to regenerate.
- Storage is zero. You're not keeping PDFs in GCS.
- The PDF renderer is a function call, not a pipeline. It takes invoice data in, returns bytes out. Fast enough to generate on every request at this volume.
- If you ever need to cache PDFs (you won't at 2-4 invoices/month), add a `pdfUrl` field and generate-on-first-request. But don't build that until you need it.

#### Stripe Integration Details

Stripe's role is narrow and specific: it's the online payment processor, not the invoicing system.

- **Stripe Checkout Session** (not Stripe Invoices) — created on-demand when client clicks "Pay Now"
- Payment methods enabled: ACH bank transfer (default) + card (fallback)
- ACH fee: 0.8% capped at $5. On a $6,500 catio that's $5. On a $14,500 catio that's $5.
- Card fee: 2.9% + 30¢. Available as fallback for clients who want it.
- On first Stripe payment for a client, create a Stripe Customer and store `stripeCustomerId`
- Webhook `checkout.session.completed` → update Invoice status, set payment method, notify admin
- Webhook `checkout.session.expired` → optional: flag in admin that client started but didn't complete

**What you're NOT building:**
- Your own payment form or card input (Stripe Checkout handles PCI compliance)
- Your own ACH collection flow (Stripe handles bank verification)

**What you ARE building (that v0.1 deferred to Stripe):**
- Invoice as a data object with multiple renderers (web, PDF, email, Stripe line items, CSV)
- Invoice email delivery (your email, via Resend)
- Client-facing invoice web view (`/invoice/[token]`)
- Payment status tracking across multiple methods

### 4.8 QuickBooks Integration

**Two approaches, in order of complexity:**

#### v1: CSV Export (build this first)

`/admin/settings/export` or `/api/export/quickbooks`

- Generate a CSV of paid invoices for a date range
- Format matches QuickBooks Online import format
- Includes payment method for each invoice (useful for reconciliation)
- Download and import manually into QBO
- Takes 5 minutes per month. Good enough for year one.

**QBO CSV import fields:**
```
InvoiceNo, Customer, InvoiceDate, DueDate, ItemDescription, ItemAmount, ItemCategory, PaymentMethod, PaymentDate
```

#### v2: QuickBooks Online API (build when CSV becomes annoying)

- OAuth2 flow to connect QBO account (one-time setup in admin settings)
- On invoice paid → create corresponding QBO Invoice (marked as paid) or Sales Receipt
- Map line item categories to QBO Chart of Accounts items
- Sync customer records (create QBO Customer from local Client if not exists)
- Include payment method metadata for reconciliation

**QBO API notes:**
- Uses OAuth2 with refresh tokens. Tokens expire; you need a refresh flow.
- Intuit's sandbox is free for development.
- The API is REST/JSON. Well-documented but verbose.
- Rate limits are generous for this volume (one-person business).
- **Main gotcha:** QBO requires items/services to be pre-configured in the Chart of Accounts. You'll need a mapping step in settings: "Catio Structure" → QBO Service Item "Construction Income," "Tech Package" → "Tech Installation Income," etc.

### 4.9 File/Photo Storage

**Approach:** Google Cloud Storage (GCS)

- Signed upload URLs generated by API routes
- Photos organized by path prefix: `leads/{leadId}/`, `jobs/{jobId}/`, `clients/{clientId}/`
- Public gallery images served via GCS public bucket or signed URLs with long expiry
- Invoice assets (logo, Zelle QR) stored in a `config/` prefix
- **No thumbnails stored.** Thumbnails are derived by convention or generated on the fly by the renderer (see Image Optimization below).

**GCS specifics:**
- `@google-cloud/storage` SDK for signed URLs and bucket operations
- Service account key for server-side operations (stored as env var, not checked into repo)
- Same GCP project as the Google OAuth credentials — one project, two services
- Free tier: 5GB storage, 5K Class A ops, 50K Class B ops, 1GB egress/month. Sufficient for early operation.
- If gallery traffic grows past free tier egress, put Cloudflare in front of the public bucket.

**Upload flow:**
1. Client selects photos in contact form (or admin uploads job photos)
2. Frontend requests signed upload URL from `/api/upload/presign`
3. API route generates GCS signed URL with content-type restriction (images only) and size limit
4. Frontend uploads direct to GCS — binary never hits your API route
5. Frontend sends the resulting GCS URL(s) back with the form submission

**Image optimization:**
Source photos from a phone are 5–12MB HEICs. Two approaches, neither of which stores rendering concerns in the data model:
- **Option A (v1): Next.js Image component.** Point `<Image>` at the GCS URL. Next.js handles resize, format conversion, and caching at the edge. Zero infrastructure, works on Vercel out of the box. The data model stores the original key; the renderer decides the display size.
- **Option B (scale): GCS Cloud Function on object creation** — resize to a standard web-optimized size (e.g. 2048px long edge) and store alongside original with a convention suffix (`_web.jpg`). Keeps egress/bandwidth lean if gallery traffic grows. Still derived from the original, still convention-based — the data model stores one key, the renderer knows the convention.

### 4.10 Email Notifications

**Approach:** Resend (or SendGrid)

Transactional emails only. Not marketing. Not newsletters.

**Triggers:**
- New lead submitted → email to admin
- Invoice sent → email to client with invoice link and PDF attachment
- Invoice paid via Stripe (webhook) → email to admin
- Invoice paid manually (marked by admin) → no email needed, you just did it
- (Optional) Payment reminder → email to client for unpaid invoices older than N days

**Volume:** Maybe 10–20 emails/month. Well within any free tier.

**Invoice email template:**
- From: Denhaus <invoices@denhaus.la> (or whatever the business email is)
- Subject: "Invoice DNH-2025-001 from Denhaus"
- Body: brief message, total amount, "View & Pay" button linking to `/invoice/[token]`
- Attachment: PDF generated on-the-fly from invoice data at send time (not a stored file)

---

## 5. Tech Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR public + SPA admin in one app |
| Styling | Tailwind CSS | Already in the toolbox |
| UI components | shadcn/ui | Copy-paste, no dependency. Tailwind-native. |
| Database | MongoDB Atlas | Schema flexibility, free tier, familiar |
| ODM | Mongoose | Schema validation, middleware hooks, typed models |
| Auth | NextAuth.js + Google OAuth | No password management, one GCP project for auth + storage |
| Payments (online) | Stripe Checkout (ACH + card) | Best API, ACH capped at $5/txn, handles PCI |
| Payments (offline) | Zelle / check / bank transfer | Tracked locally, marked paid manually in admin |
| Invoice rendering | @react-pdf/renderer (PDF), React server components (web), Resend templates (email) | Data object → N output formats on demand |
| Accounting | QBO CSV export → QBO API | Start manual, automate later |
| File storage | Google Cloud Storage | Same GCP project as auth, signed URL uploads |
| Email | Resend | Simple transactional API, generous free tier |
| Deploy | Vercel | Zero-config Next.js deploy, free tier works |
| DNS | Cloudflare | Already using it |

### Dependencies (npm)

```
next
react
tailwindcss
@shadcn/ui (via cli)
mongoose
next-auth
stripe
@google-cloud/storage
@react-pdf/renderer
resend
sharp                        # image resize (if needed for PDF rendering or GCS Cloud Function)
date-fns                     # date formatting
zod                          # input validation (forms + API)
```

No Redux. No state management library. React state + server actions + SWR or TanStack Query for admin data fetching.

---

## 6. API Route Structure

```
/api
├── auth/[...nextauth]           # NextAuth Google OAuth handlers
├── leads
│   ├── route.ts                 # GET (list), POST (create from contact form)
│   └── [id]/
│       ├── route.ts             # GET, PATCH (update status/notes)
│       └── convert/route.ts     # POST → creates Client from Lead
├── clients
│   ├── route.ts                 # GET (list), POST (create)
│   └── [id]/route.ts            # GET, PATCH
├── jobs
│   ├── route.ts                 # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts             # GET, PATCH
│       └── invoice/route.ts     # POST → creates Invoice record
├── invoices
│   ├── route.ts                 # GET (list)
│   └── [id]/
│       ├── route.ts             # GET, PATCH (mark paid, void, etc.)
│       ├── send/route.ts        # POST → sends invoice email to client
│       ├── pdf/route.ts         # GET → renders Invoice data to PDF on demand
│       └── checkout/route.ts    # POST → creates Stripe Checkout Session
├── payments
│   └── webhook/route.ts         # POST — Stripe webhook handler
├── upload
│   └── presign/route.ts         # POST → returns GCS signed upload URL
└── export
    └── quickbooks/route.ts      # GET → CSV download of paid invoices
```

### Public Routes (no auth)

```
/invoice/[token]                 # Client-facing invoice view + payment options
```

---

## 7. What's NOT in v1

Scope control. These are real features but they don't block launch:

- **Scheduling/calendar view** — Use Google Calendar. A job has `scheduledStart`/`scheduledEnd` in the DB; you put it on your calendar manually. Calendar integration is a v2 feature.
- **Contracts/e-signatures** — Use HelloSign or send a PDF. Not worth building.
- **SMS notifications** — Twilio is easy to add later. Email is fine for v1.
- **Inventory/materials tracking** — A spreadsheet or just the `materialsCost` field on each job. Don't build a materials management system for 2 jobs/month.
- **Client portal** — Clients don't need a login. They get an invoice link. That IS the portal.
- **Multi-user/team** — One operator. The Google OAuth allowlist supports multiple emails if needed later — just add to the env var.
- **Reporting/analytics** — The dashboard shows monthly revenue and pipeline counts. For deeper analysis, export to a spreadsheet. Don't build charts.
- **Automated follow-ups** — CRM automation is for businesses with 100+ leads/month, not 4.
- **Recurring invoices** — This is project-based work, not subscription billing. Every invoice is manually created from a job.

---

## 8. Boilerplate Generalization

Everything above is described through the Denhaus lens, but the actual schema is generic. To reuse this for a different service business:

**What changes per business:**
- `Job.type` enum values (catio/dog_house → bathroom_remodel/deck/fence)
- `Lead.petInfo` becomes whatever intake-specific fields the business needs (embedded object, schema-flexible)
- Line item category mappings for QBO
- Public site content and styling
- Photo gallery categories
- Payment settings (which methods are enabled, Zelle recipient, check payee, etc.)
- Invoice branding (logo, business info, prefix)

**What stays the same:**
- Lead → Client → Job → Invoice → Payment pipeline
- Stripe Checkout integration
- Manual payment tracking
- Invoice generation + PDF rendering
- QBO export
- Auth (Google OAuth + allowlist)
- File upload (GCS signed URLs)
- Admin CRUD UI patterns
- Dashboard shape

The boilerplate ships with the pipeline, the integrations, and the admin UI. You configure the domain-specific parts via a config file or settings page.

```typescript
// config/business.ts
export const businessConfig = {
  name: "Denhaus",
  domain: "denhaus.la",
  tagline: "Design studio for outdoor pet environments",
  
  jobTypes: [
    { value: "catio", label: "Catio", defaultLineItems: [...] },
    { value: "dog_house", label: "Dog House", defaultLineItems: [...] },
    { value: "kennel", label: "Kennel", defaultLineItems: [...] },
  ],
  
  leadIntakeFields: [
    { name: "petInfo.type", type: "select", options: ["cat", "dog", "both"] },
    { name: "petInfo.breed", type: "text" },
  ],
  
  payments: {
    stripe: { enabled: true, defaultMethod: "ach" },
    zelle: { enabled: true, recipient: "you@email.com" },
    check: { enabled: true, payableTo: "Denhaus LLC" },
    bankTransfer: { enabled: false },
  },
  
  invoice: {
    prefix: "DNH",
    depositPercent: 50,
    taxRate: 0,
  },
  
  qboCategories: [
    { local: "structure", qbo: "Construction Income" },
    { local: "tech", qbo: "Tech Installation Income" },
    { local: "materials", qbo: "Materials" },
  ],
}
```

---

## 9. Build Order

Phase 1 — **Foundation** (get leads flowing):
1. Next.js project scaffold + Tailwind + shadcn/ui
2. MongoDB connection + Mongoose models (Lead, Client, Job, Invoice)
3. Google OAuth via NextAuth (admin allowlist)
4. Public contact form → creates Lead → email notification via Resend
5. Admin leads table + lead detail view (with Street View embed)

Phase 2 — **Pipeline** (manage work):
6. Client management (CRUD + convert from lead)
7. Job management (CRUD + line items + status kanban)
8. Photo upload (GCS signed URLs + Sharp resize)
9. Public gallery (pulls from portfolio-approved jobs)

Phase 3 — **Money** (get paid):
10. Invoice model + admin CRUD (create from job, edit line items, set type)
11. Client-facing invoice web view (`/invoice/[token]`) — first renderer
12. Invoice email delivery via Resend (link + on-demand PDF attachment) — second renderer
13. Stripe Checkout integration (ACH + card, from invoice page) — third renderer (line items → Stripe)
14. Stripe webhook handler (auto-confirm payment)
15. "Mark as Paid" flow for manual payments (Zelle, check, bank transfer)
16. PDF download endpoint (`/api/invoices/[id]/pdf`) — fourth renderer, same data
17. Dashboard with revenue + pipeline summary + outstanding invoices

Phase 4 — **Books** (stay legal):
18. QBO CSV export (paid invoices with payment method + category)
19. (Later) QBO API integration

---

## 10. Open Questions

- **Domain-specific intake forms:** Should the contact form be fully configurable from the config file, or is a per-business custom form component the right call? Config is cleaner but limits layout control.
- **Estimate/quote as a first-class object vs. just a Job in "quoted" status?** Keeping it as a Job status is simpler. A separate Quote entity adds a conversion step but lets you track quote-to-close rate.
- **Stripe Connect vs. direct Stripe account?** For a single-operator boilerplate, direct Stripe is correct. If this ever becomes a platform (multiple businesses on one instance), Stripe Connect is the path. Don't build for that now.
- **Offline/mobile-first admin?** You're on a job site. Phone is the primary admin device. The admin UI needs to be fully responsive and usable on mobile. Consider PWA manifest for add-to-homescreen. This is a design constraint, not a feature — it shapes every admin UI decision.
- **Invoice payment reminder automation?** The `sentAt` and `viewedAt` fields on invoices support a future "remind client" flow. Manual for v1 (you click a button in admin to re-send), automated later if needed.
- **GCS bucket topology:** One bucket with path prefixes (`leads/`, `jobs/`, `config/`) or multiple buckets? Single bucket is simpler to manage. Separate public bucket for gallery images if you want direct public access without signed URLs.
