# Flare

### *Your Glow. Your Way.*

AI-powered skin & hair analysis, a DIY beauty marketplace, and a community
forum — built as a full-stack Next.js app for **everyone**, not just one
gender. This README is a living document and is updated at the end of every
build phase.

> **Status:** actively being built out phase by phase. Sections below marked
> ✅ are implemented and working end-to-end against a real database; 🚧 are
> designed but not yet built.

## What this is

- 🔬 **AI Skin & Hair Analysis** — a short quiz, answered by anyone, turned
  into a structured routine (skin/hair type, concerns, ingredients to
  seek/avoid, budget-aware product ideas) by an LLM. Free tier gets the
  basics; Premium gets a deeper, more specific report.
- 🛍️ **Marketplace** — handmade beauty products from women (and anyone)
  running a small business, plus, while the seller community is still small,
  a curated catalog of real third-party products that link out to where you
  can actually buy them.
- 💬 **Community** — a lightweight social feed for skincare/haircare tips,
  open to every registered user, moderated by admins.
- 🧑‍💼 **Three account types** — shopper, entrepreneur (seller), admin — each
  with their own panel and permissions.
- 🌱 **Sustainability-aware** — products can carry a sustainability score and
  a "sponsored eco-brand" flag.

Landing page, marketplace browsing, and community reading are open to
everyone without an account — like any normal e-commerce site. Creating an
account is only required to run the AI analysis, buy something, post, or
sell.

## Feature status

| Area | Status |
|---|---|
| Homepage, marketplace shell, design system | ✅ |
| Database schema (Prisma + Neon Postgres) | ✅ |
| Auth: email/password (bcrypt, rate-limited, timing-safe) | ✅ |
| Auth: Google OAuth | ✅ |
| Role-based route protection (user / entrepreneur / admin) | ✅ |
| AI skin & hair analysis (Groq) | 🚧 |
| User dashboard (history, saved products) | 🚧 (placeholder page live) |
| Entrepreneur panel (list/manage products) | 🚧 (placeholder page live) |
| Cloudinary image uploads | 🚧 |
| External-catalog products (bootstrap marketplace) | 🚧 (schema ready) |
| Razorpay checkout (products + premium) | 🚧 |
| Community forum | 🚧 |
| Admin panel (approvals, moderation, bulk upload) | 🚧 (placeholder page live) |
| Blog | 🚧 |
| Deployment guide | 🚧 |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, TypeScript) |
| Styling | Tailwind CSS v4, Ant Design (forms), Radix/shadcn primitives |
| Database | PostgreSQL on [Neon](https://neon.tech) (serverless) |
| ORM | Prisma 7 (`prisma-client` generator + `@prisma/adapter-neon`) |
| Auth | Auth.js / NextAuth v5 — Credentials + Google, JWT sessions |
| AI | [Groq](https://groq.com) (Llama models) for structured analysis |
| Images | Cloudinary |
| Payments | Razorpay (test mode) |
| State | Zustand (client), React Server Components (server) |
| Validation | Zod |

## Security posture

Built with the explicit goal of having no obvious holes. What's actually in
place today:

- Passwords hashed with **bcrypt** (cost factor 12), never stored or logged
  in plaintext.
- Login is **rate-limited** per email+IP (5 attempts / 15 min) and short-
  circuits before touching the database once limited.
- **Timing-safe** credential checks — a login attempt for a non-existent
  email takes the same time as a wrong password, so response timing can't be
  used to enumerate registered emails.
- Sessions are **JWT-based, `httpOnly`, `SameSite=Lax`** cookies (no tokens
  readable from client JS).
- **Google OAuth** does not auto-link to an existing email/password account
  (`allowDangerousEmailAccountLinking: false`) — prevents account takeover
  via a same-address OAuth sign-in.
- Registration is rate-limited per IP and never reveals timing differences
  between "email taken" and "validation failed" paths in a way that's
  exploitable at scale.
- Route access is enforced **server-side** in `proxy.ts` (Next's middleware
  successor) by role, not just hidden in the UI.
- Security headers on every response: `X-Frame-Options`, `X-Content-Type-
  Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-
  Security`.
- All request bodies validated with **Zod** before touching the database.

Honest caveat: the current rate limiter is in-memory (per server instance),
which is fine for a single-region small-scale deployment but won't hold up
across many serverless instances at real scale — see `DEPLOYMENT.md` (once
written) for the Upstash Redis upgrade path. No system is "unhackable"; this
is a solid, standard baseline, not a guarantee.

## Getting started

```bash
git clone <this-repo>
cd flare-her
npm install
cp .env.example .env   # then fill in the real values, see below
npx prisma migrate dev # creates all tables in your database
npm run db:seed        # creates demo accounts (see below)
npm run dev
```

### Environment variables

See `.env.example` for the full list with setup links. You'll need:

- A free [Neon](https://neon.tech) Postgres database (`DATABASE_URL` — use
  the **direct**, non-pooled host; see the comment in `.env.example` for why)
- A `NEXTAUTH_SECRET` (`openssl rand -base64 32`)
- A free [Groq](https://console.groq.com/keys) API key
- [Cloudinary](https://console.cloudinary.com) credentials
- [Razorpay](https://dashboard.razorpay.com/app/keys) **test** keys
- (Optional, for Google sign-in) OAuth credentials from the
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Demo accounts

After `npm run db:seed`, these accounts exist (password for all: `password123`):

| Email | Role |
|---|---|
| `admin@flare.app` | ADMIN |
| `seller@flare.app` | ENTREPRENEUR |
| `user@flare.app` | USER |

## Project structure

```
app/                 # Next.js App Router pages & API routes
  (auth)/login, register
  admin/, entrepreneur/, dashboard/   # role-gated panels
  api/                                # route handlers (auth, register, ...)
  analysis/, marketplace/
components/
  forms/             # login/register (Ant Design + real signIn/register calls)
  shared/             # navbar, footer, homepage sections
  providers/          # session + antd providers
lib/
  auth.ts, auth.config.ts   # NextAuth (split so the edge proxy stays DB-free)
  prisma.ts                  # Prisma client (Neon adapter, singleton)
  rate-limit.ts               # in-memory limiter
  validations/                # Zod schemas
prisma/
  schema.prisma, migrations/, seed.ts
proxy.ts             # role-based route protection (Next 16's middleware successor)
```

## Roadmap

Built in phases — AI analysis engine, Cloudinary + marketplace, Razorpay
checkout, community forum, admin panel, blog, then a security/perf hardening
pass and full deployment guide. This README's feature table above tracks
current status.

---

*Not just for women — for everyone's skin and hair.*
