# Contractor Job Tracker

A full-stack web app for contractors to manage jobs, clients, and invoices.

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Auth:** Clerk
- **Deploy:** Vercel (client) + Railway (server + DB)

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Set up environment variables

**server/.env** (copy from server/.env.example):
```
DATABASE_URL="postgresql://..."  # from Railway
CLERK_SECRET_KEY="sk_test_..."   # from Clerk dashboard
CLIENT_URL="http://localhost:5173"
PORT=3001
```

**client/.env** (copy from client/.env.example):
```
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."  # from Clerk dashboard
VITE_API_URL="http://localhost:3001"
```

### 3. Set up the database

```bash
cd server
npm run db:push    # Push schema to Railway PostgreSQL
npm run db:generate  # Generate Prisma client
```

### 4. Run locally

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit http://localhost:5173

## Features
- Sign up / sign in via Clerk
- Dashboard with revenue and invoice stats
- Manage clients (add, edit, delete)
- Manage jobs (add, edit, delete, status tracking)
- Invoices auto-created from jobs, mark paid/unpaid/overdue

## Deploy

**Railway (server + DB):**
1. Create a Railway project, add PostgreSQL
2. Deploy the `server` folder, set env vars

**Vercel (client):**
1. Connect your GitHub repo
2. Set root directory to `client`
3. Add env vars in Vercel dashboard
