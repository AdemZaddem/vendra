# Vendra

A Tunisian SaaS platform for Instagram/Facebook social-commerce sellers. Merchants get a storefront, product/inventory management, COD and online-payment checkout, and order fulfillment — all from one dashboard.

## Tech Stack

- **Frontend:** Next.js (TypeScript, Tailwind) — `storefront` (public) and `backoffice` (merchant dashboard + admin)
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL via Prisma 7
- **Auth:** Supabase Auth (email/password, Google, Facebook)
- **Monorepo:** Turborepo + pnpm workspaces

## Project Structure

vendra/
├── apps/
│ ├── storefront/ # Public customer-facing store (port 3000)
│ ├── backoffice/ # Merchant dashboard + platform admin (port 3001)
│ └── api/ # NestJS backend (port 4000)
├── packages/ # Shared UI, types, validation, config (WIP)
├── prisma/ # Database schema and migrations
├── docker/ # Local PostgreSQL setup
└── docs/ # Architecture and planning notes


## Prerequisites

- Node.js
- pnpm
- Docker

## Local Setup

1. **Install dependencies** (run once, from repo root):
```bash
   pnpm install
```

2. **Start local PostgreSQL** via Docker:
```bash
   docker run --name vendra-db \
     -e POSTGRES_USER=vendrauser \
     -e POSTGRES_PASSWORD=vendrapass \
     -e POSTGRES_DB=vendradb \
     -p 5433:5432 \
     -d postgres:16
```
   (Skip this if the container already exists — just `docker start vendra-db`.)

3. **Set up environment variables.** Each app needs its own `.env` / `.env.local` (not committed — see `.gitignore`):

   **`apps/storefront/.env.local`** and **`apps/backoffice/.env.local`**:

NEXT_PUBLIC_SUPABASE_URL=<Supabase project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable/anon key>


   **`apps/api/.env`**:

DATABASE_URL="postgresql://vendrauser:vendrapass@localhost:5433/vendradb"
SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key — backend only, never expose>


4. **Run Prisma migrations:**
```bash
   cd apps/api
   pnpm prisma migrate dev
```

5. **Start all apps** (from repo root):
```bash
   pnpm dev
```

   This runs `storefront` (localhost:3000), `backoffice` (localhost:3001), and `api` (localhost:4000) together via Turborepo.

## Auth Notes

- Customers checking out on `storefront` are **guest checkout only** — no login required.
- Merchants and platform admins log into `backoffice` via Supabase Auth (email/password, Google, or Facebook).
- Google and Facebook OAuth apps are configured in their respective developer consoles, with redirect URIs pointing to the Supabase project's callback URL.

## Billing Note

Vendra does not use automated subscription billing. Merchants select a plan and are contacted manually; plan activation/status is managed by the platform admin in the `backoffice` admin panel.

## Status

Early development — foundational setup (monorepo, database, auth wiring) complete. Core business logic (organizations, catalog, orders, payments) not yet implemented.