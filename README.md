# 🎓 EduFund Portal

> A production-ready full-stack bursary and educational funding management system for Kenya.

![EduFund Portal](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20PostgreSQL%20%7C%20Prisma%20%7C%20M--Pesa-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet)

---

## 🚀 Features

- **🔐 Authentication** — JWT-based auth with Student and Admin roles
- **📋 Multi-step Application Form** — 5-step guided bursary application
- **📱 Lipa Na M-Pesa** — STK Push payment via Lipana M-Pesa API
- **📊 Admin Dashboard** — Full application management, approvals, payments
- **🔔 Notifications** — In-app + email notifications for every status change
- **📄 PDF Export** — Download application summary as PDF
- **🏫 Institutions Directory** — Browse 200+ recognized Kenyan institutions
- **🎯 Bursary Listings** — Active funding opportunities
- **📝 Audit Logs** — Full admin action trail
- **🐳 Docker Ready** — Fully containerized for Railway deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT + bcrypt |
| Payments | Lipa Na M-Pesa (Lipana STK Push) |
| Validation | Zod + React Hook Form |
| State | Zustand |
| Email | Nodemailer |
| Deployment | Docker + Railway |

---

## 📁 Project Structure

```
edufund-portal/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   ├── login/page.tsx          # Login
│   │   └── register/page.tsx       # Registration
│   ├── dashboard/
│   │   ├── layout.tsx              # Student sidebar layout
│   │   └── page.tsx                # Student dashboard
│   ├── applications/
│   │   ├── new/page.tsx            # Multi-step application form
│   │   └── [id]/page.tsx           # Application detail + PDF
│   ├── bursaries/page.tsx          # Active bursaries
│   ├── institutions/page.tsx       # Institution directory
│   ├── notifications/page.tsx      # Notifications
│   └── admin/
│       ├── layout.tsx              # Admin sidebar layout
│       ├── page.tsx                # Admin dashboard/overview
│       ├── applications/page.tsx   # Manage applications
│       ├── institutions/page.tsx   # Manage institutions
│       ├── payments/page.tsx       # Payment logs
│       ├── users/page.tsx          # User management
│       └── logs/page.tsx           # Audit logs
├── app/api/
│   ├── auth/                       # Auth endpoints
│   ├── applications/               # Application CRUD
│   ├── payments/                   # M-Pesa STK Push + callback
│   ├── institutions/               # Institution management
│   ├── bursaries/                  # Bursary management
│   ├── notifications/              # Notifications
│   ├── documents/                  # File uploads
│   ├── admin/                      # Admin-only endpoints
│   └── health/                     # Health check
├── components/
│   └── forms/MPesaPayment.tsx      # M-Pesa payment component
├── hooks/
│   └── useAuth.ts                  # Auth store + API helpers
├── lib/
│   ├── auth.ts                     # JWT utilities
│   ├── db.ts                       # Prisma client singleton
│   ├── email.ts                    # Email notifications
│   ├── mpesa.ts                    # Lipana M-Pesa integration
│   ├── utils.ts                    # Helpers
│   └── validations.ts              # Zod schemas
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Sample data seed
├── middleware.ts                   # Route protection
├── Dockerfile                      # Docker build
├── docker-compose.yml              # Local dev compose
├── railway.toml                    # Railway config
└── .env.example                    # Environment template
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)
- npm or yarn

### 1. Clone & Install

```bash
git clone <your-repo>
cd edufund-portal
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/edufund_db"
JWT_SECRET="your-super-secret-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# M-Pesa (leave as-is for sandbox/mock mode)
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_PASSKEY="your-mpesa-passkey"
MPESA_SHORTCODE="174379"
MPESA_CALLBACK_URL="https://your-domain.railway.app/api/payments/callback"
MPESA_ENVIRONMENT="sandbox"

APPLICATION_FEE=500
```

> **Note:** If `MPESA_CONSUMER_KEY` is not set, the app runs in **mock mode** — payments are simulated locally.

### 3. Set Up Database

```bash
# Create database
createdb edufund_db

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 🐳 Docker Development

```bash
# Start PostgreSQL + App
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npm run db:seed

# View logs
docker-compose logs -f app
```

---

## 🚂 Deploying to Railway

### Step 1 — Create Railway Project

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository

### Step 2 — Add PostgreSQL Plugin

1. Click **+ New** → **Database** → **Add PostgreSQL**
2. Railway auto-sets `DATABASE_URL` — no manual config needed

### Step 3 — Set Environment Variables

In Railway → your service → **Variables**, add:

```
JWT_SECRET=<min 32 char random string>
NEXTAUTH_SECRET=<min 32 char random string>
NEXT_PUBLIC_APP_URL=https://your-app.railway.app

MPESA_CONSUMER_KEY=<from Safaricom developer portal>
MPESA_CONSUMER_SECRET=<from Safaricom developer portal>
MPESA_PASSKEY=<from Safaricom developer portal>
MPESA_SHORTCODE=<your M-Pesa shortcode>
MPESA_CALLBACK_URL=https://your-app.railway.app/api/payments/callback
MPESA_ENVIRONMENT=production

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=<Gmail app password>
EMAIL_FROM=EduFund Portal <noreply@your-domain.com>

APPLICATION_FEE=500
```

### Step 4 — Deploy

Railway auto-deploys from your main branch. First deploy runs:
1. `docker build .`
2. `npx prisma migrate deploy`
3. `node server.js`

### Step 5 — Seed Production Database

```bash
# Using Railway CLI
railway run npm run db:seed
```

### Step 6 — Configure M-Pesa Callback

In Safaricom Developer Portal, set your callback URL to:
```
https://your-app.railway.app/api/payments/callback
```

---

## 🔐 Default Credentials (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edufund.co.ke | Admin@1234 |
| Student | student@test.co.ke | Student@1234 |

> **Change these immediately in production!**

---

## 💳 M-Pesa Integration Guide

### Getting Credentials (Lipana)

1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app and get **Consumer Key** and **Consumer Secret**
3. Go to **APIs** → **Lipa Na M-Pesa Online** → **Simulate** to test
4. Get your **Passkey** from the M-Pesa portal

### Sandbox Testing

Use these test credentials for sandbox:
- Shortcode: `174379`
- Test phone: `254708374149`
- PIN: any 6-digit number

### Mock Mode (Development)

If no M-Pesa credentials are set, the app runs in **mock mode**:
- STK Push is simulated
- A "Confirm Mock Payment" button appears
- No real M-Pesa transaction is triggered

---

## 📊 Database Schema

```
Users ──────── Applications ──── Documents
                    │
                    ├── Payments (M-Pesa)
                    │
                    └── StatusLogs

Institutions (directory)
Bursaries (funding opportunities)
Notifications (user inbox)
AuditLogs (admin actions)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Student |
| GET | `/api/applications` | List applications | Student/Admin |
| POST | `/api/applications` | Create application | Student |
| GET | `/api/applications/:id` | Get application | Student/Admin |
| POST | `/api/payments/initiate` | STK Push | Student |
| POST | `/api/payments/callback` | M-Pesa callback | Public |
| GET | `/api/payments/status` | Check payment | Student |
| GET | `/api/institutions` | List institutions | Public |
| GET | `/api/bursaries` | List bursaries | Public |
| GET | `/api/notifications` | Get notifications | Student |
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/applications` | All applications | Admin |
| PATCH | `/api/admin/applications` | Update status | Admin |
| GET | `/api/admin/payments` | All payments | Admin |
| GET | `/api/admin/logs` | Audit logs | Admin |
| GET | `/api/health` | Health check | Public |

---

## 🛡️ Security Features

- **Password hashing** — bcrypt with 12 salt rounds
- **JWT authentication** — Secure HTTP-only cookies
- **Role-based access** — Student and Admin guards on all routes
- **Input validation** — Zod schemas on all API endpoints
- **File sanitization** — Type + size validation on uploads
- **Audit trail** — All admin actions logged with IP
- **CSRF protection** — SameSite cookie policy

---

## 📧 Email Notifications

The system sends emails for:
- ✅ Account registration welcome
- 📋 Application submitted
- 🔄 Application status changes (Under Review, Approved, Rejected, Disbursed)
- 💰 Payment confirmation with M-Pesa receipt

Configure via `SMTP_*` environment variables. Supports Gmail, SendGrid, Resend, etc.

---

## 🧪 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:reset     # Reset + reseed database
npm run lint         # ESLint
```

---

## 📝 License

MIT © EduFund Portal

---

## 🤝 Support

- Email: support@edufund.co.ke
- Documentation: [docs.edufund.co.ke](https://docs.edufund.co.ke)
