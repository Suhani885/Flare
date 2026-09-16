# Flare

### *Your Glow. Your Way.*

AI-powered skin & hair analysis, a DIY beauty marketplace, and a community
forum — built as a full-stack Next.js app for **everyone**, not just one
gender. 

## What this is

- 🔬 **AI Skin & Hair Analysis** — a short quiz, answered by anyone, turned
  into a structured routine (skin/hair type, concerns, ingredients to
  seek/avoid, budget-aware product ideas) by an LLM. Free tier gets a
  concise report; Premium gets a longer, more specific one from a larger
  model.
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
- 🎨 **Adaptive theming** — the entire color palette (buttons, accents, forms)
  follows an audience preference: a warm rose theme for "Women", a deep
  steel-blue theme for "Men", and a copper-neutral default for everyone else.
  The palette icon in the navbar works for **everyone, logged in or not**.

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
| Auth: forgot/reset password, remember me | ✅ |
| Role-based route protection (user / entrepreneur / admin) | ✅ |
| Adaptive gender-based theming (works logged out too) | ✅ |
| Scroll-reveal motion, full responsive layout (375–1440px+) | ✅ |
| AI skin & hair analysis (Groq, free vs premium depth) | ✅ |
| User dashboard (analysis history) | ✅ (saved products still pending) |
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
| AI | [Groq](https://groq.com) — `openai/gpt-oss-20b` (free tier) / `openai/gpt-oss-120b` (premium) |
| Images | Cloudinary (planned) |
| Payments | Razorpay test mode (planned) |
| State | Zustand (client), React Server Components (server) |
| Validation | Zod |


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

### Demo accounts

After `npm run db:seed`, these accounts exist (password for all: `password123`):

| Email | Role |
|---|---|
| `admin@flare.app` | ADMIN (Premium) |
| `seller@flare.app` | ENTREPRENEUR |
| `user@flare.app` | USER (Free) |

