# CyberDesk

**CyberDesk** is a multi-tenant cyber cafe management platform built as a MERN monorepo. It gives cafe owners a real-time admin dashboard to manage PCs, customers, and billing, while customers get a self-service portal to start sessions, top up their wallet, and log in via QR code.

> Originally built as a Web Development practical project, the codebase is structured like a real production SaaS scaffold: workspaces, role-based auth, Socket.io live state, and a normalized MongoDB schema.

---

## Features

### Admin / Owner Dashboard
- Email + password sign-in with JWT access/refresh tokens
- Live stats: total PCs, active sessions, free PCs, locked PCs
- **PC management** — add workstations, track status (free, active, locked, maintenance, offline)
- **Customer management** — view profiles, wallet balance, spend, membership tier, block/unblock
- **Session monitoring** — see every active session's PC, customer, start time, running cost
- **Cafe settings** — name, address, currency, timezone, logo, tax percent, sound alerts
- Role-based access control: owner / admin / staff

### Customer Portal
- Sign up / log in with email or phone
- **QR code login** for fast in-cafe access
- Dashboard with wallet balance, profile, and recent session history
- Self-service session start (admin-assisted stop also supported)

### Real-time Engine
- Socket.io broadcasts live cafe snapshots (active/paused/stopped sessions, PC status) to every connected admin client every few seconds
- Per-cafe Socket.io rooms keep tenants isolated
- JWT-authenticated socket handshake

### Security
- bcrypt password hashing
- JWT access + httpOnly refresh token cookies
- Helmet, CORS, rate limiting, and MongoDB query sanitization on the API
- Joi request validation on auth and session endpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Admin) | React 18, React Router, Zustand, Tailwind CSS, Recharts, Framer Motion, Axios |
| Frontend (Client) | React 18, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation / Security | Joi, Helmet, express-rate-limit, express-mongo-sanitize |
| Tooling | pnpm workspaces, Vite, ESLint, Jest (scaffolded), Docker Compose |

---

## Project Structure 
cyberdesk/

├── apps/

│   ├── backend/            # Express + Socket.io API

│   │   └── src/

│   │       ├── config/      # DB connection

│   │       ├── controllers/ # Route handlers (auth, pc, session, customer, cafe...)

│   │       ├── middleware/  # JWT auth, role guard, error handler

│   │       ├── models/      # Mongoose schemas

│   │       ├── routes/      # Express routers

│   │       ├── sockets/     # Socket.io connection + broadcast logic

│   │       └── server.js

│   ├── admin-web/          # React admin dashboard (Vite)

│   └── client-web/         # React customer portal (Vite)

├── docker-compose.yml       # Mongo + Redis + all three apps

├── pnpm-workspace.yaml

└── package.json


---

## Data Models

| Model | Purpose |
|---|---|
| Cafe | Tenant record — name, address, currency, timezone, plan, settings |
| User | Staff accounts (owner / admin / staff), scoped to one cafe |
| Customer | End users — wallet, membership tier, loyalty points, QR token, block status |
| PC | Workstation — status, specs, current session reference |
| Session | A billed PC session — start/end time, rate, pauses, status, payment method |
| Invoice | Generated bill — line items, subtotal, tax, total |
| PricingRule (scaffolded) | Time/day-based rate rules (gaming, night, happy hour) |
| License (scaffolded) | Per-cafe plan/seat licensing |
| AuditLog | Tracks admin actions for accountability |

> PricingRule and License have schemas in place for future use but aren't yet wired into the controllers — current session billing uses a fixed in-memory rate table per pricingType.

---

## API Overview

All routes are mounted under /api. Protected routes require Authorization: Bearer <accessToken>.

| Method & Path | Description | Roles |
|---|---|---|
| POST /auth/admin/register | Register a new cafe + owner account | public |
| POST /auth/admin/login | Admin/staff login | public |
| POST /auth/refresh | Refresh access token | public |
| POST /auth/logout | Clear refresh cookie | public |
| GET /auth/me | Current admin profile | authenticated |
| POST /auth/client/signup | Customer registration | public |
| POST /auth/client/login | Customer login (email/phone + cafeId) | public |
| POST /auth/client/qr-login | Customer QR token login | public |
| GET /auth/client/me | Customer profile | customer |
| GET /auth/client/me/sessions | Customer session history | customer |
| GET /admin/dashboard | Dashboard stats (PCs, sessions, customers) | owner/admin/staff |
| GET /pcs, POST /pcs | List / add PCs | owner/admin (write), +staff (read) |
| PUT /pcs/:id, POST /pcs/:id/status | Update PC / change status | owner/admin/staff |
| GET /sessions, GET /sessions/active | List sessions / active sessions | owner/admin/staff |
| POST /sessions/start | Start a session on a free PC | owner/admin/staff |
| POST /sessions/:id/pause, /resume, /stop | Control a running session | owner/admin/staff |
| GET /customers, GET /customers/:id | List / view customers | owner/admin/staff |
| POST /customers/:id/block, /unblock | Block or unblock a customer | owner/admin |
| GET /cafe, PUT /cafe | View / update cafe settings | owner/admin/staff (read), owner/admin (write) |
| GET /health | Service health check | public |

### Socket.io Events
| Event | Direction | Purpose |
|---|---|---|
| socket:connected | server → client | Acks auth, returns assigned room |
| cafe:status | server → client | Periodic snapshot of session/PC counts for the cafe |
| session:refresh | client → server | Request an immediate status broadcast |
| session:log | client → server | Write a custom audit log entry |

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (npm i -g pnpm)
- MongoDB instance (local or Atlas)

### 1. Install dependencies
pnpm install

### 2. Configure environment variables
Create apps/backend/.env (use .env.example as a starting point):

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_this_with_a_strong_secret
JWT_REFRESH_SECRET=replace_this_with_a_strong_refresh_secret
NODE_ENV=development

> ⚠️ Don't commit real credentials. Keep MONGODB_URI and both JWT secrets out of version control — use placeholder values in any .env.example you push, and put the real file only in .gitignore'd .env.

### 3. Run in development
pnpm --recursive dev

This starts:
- Backend API → http://localhost:5000
- Admin dashboard → http://localhost:5173
- Client portal → http://localhost:5174

### 4. Or run with Docker Compose
docker compose up --build

Spins up MongoDB, Redis, and all three apps together.

---

## Roadmap
- [ ] Wire PricingRule into session billing for time/day-based rates
- [ ] Activate License model for plan/seat enforcement
- [ ] Invoice PDF generation
- [ ] Test suites (Jest is configured; no tests written yet)
- [ ] Analytics/reporting views on the admin dashboard

---

## Author
**Nafis Mansoori**
SY BVoC, Thakur College of Engineering & Technology

## License
This project is licensed under the [MIT License](LICENSE).