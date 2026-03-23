# 📊 Product Analytics Dashboard

An interactive self-tracking analytics dashboard. Every time a user interacts with filters or charts, those interactions are recorded and visualized in real time.

## 🌐 Live Demo
- **Frontend:** [product-analytics-dashboard-alpha.vercel.app](https://product-analytics-dashboard-alpha.vercel.app)
 
- **Backend:**  [https://your-backend.railway.app ](https://analytics-backend-1kls.onrender.com) 

> Replace these URLs with your actual deployed URLs before submitting.

---

## 🧰 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React + Vite + Chart.js + React Router  |
| Backend   | Node.js + Express + TypeScript          |
| ORM       | Prisma                                  |
| Database  | PostgreSQL (Railway) / SQLite (local)   |
| Auth      | JWT + bcrypt                            |
| Styling   | CSS Modules                             |
| Cookies   | js-cookie                               |

---

## 🏗️ Architecture

```
Browser (React :5173)
        ↕  REST API (fetch + JWT)
Express Backend (:8000)
        ↕  Prisma ORM
PostgreSQL Database
```

**Key architectural decisions:**
- **Separation of concerns** — API calls isolated in `services/api.js`, state logic in custom hooks (`useAnalytics.js`), UI in components
- **Custom hook pattern** — `useAnalytics` encapsulates all data fetching and tracking logic, keeping pages clean
- **Cookie persistence** — filter state saved/restored via `js-cookie` so preferences survive page refreshes
- **Fire-and-forget tracking** — `POST /track` is called silently on every interaction without blocking the UI
- **CSS Modules** — scoped styles per component, zero class conflicts

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- npm

### Backend
```bash
cd Backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with dummy data
npm run seed

# Start development server (port 8000)
npm run dev
```

### Frontend
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start development server (port 5173)
npm run dev
```

### Open in browser
```
http://localhost:5173
```

---

## 🌱 Seed Instructions

The seed script creates **10 users** and **100 feature click events** spread across the last 90 days.

```bash
cd Backend
npm run seed
```

**Output:**
```
🌱 Starting seed...
🧹 Clearing existing data...
✅ Cleared.
👤 Creating 10 users...
  ✓ user1  age: 28  gender: Male
  ...
📊 Creating 100 feature clicks...
✅ Clicks created.
────────────────────────────────
🎉 Seed complete!
   Users:          10
   Feature Clicks: 100
────────────────────────────────
🔑 Login: username: user1  password: password123
```

**Test credentials:**
```
username: user1   (or user2, user3 ... user10)
password: password123
```

---

## 📡 API Endpoints

| Method | Endpoint         | Auth | Description                        |
|--------|------------------|------|------------------------------------|
| POST   | /auth/register   | ❌   | Register new user                  |
| POST   | /auth/login      | ❌   | Login, returns JWT token           |
| POST   | /track           | ✅   | Record a feature interaction       |
| GET    | /analytics       | ✅   | Get aggregated bar + line chart data |
| GET    | /health          | ❌   | Health check                       |

### Analytics Query Parameters
```
GET /analytics?startDate=2026-01-01&endDate=2026-03-22&feature=date_filter
```
- `startDate` — ISO date string (optional)
- `endDate`   — ISO date string (optional)  
- `feature`   — filter line chart by specific feature (optional)

---

## 🗃️ Database Models

```prisma
model User {
  id       Int            @id @default(autoincrement())
  username String         @unique
  password String         // bcrypt hashed
  age      Int
  gender   String         // Male | Female | Other
  clicks   FeatureClick[]
}

model FeatureClick {
  id           Int      @id @default(autoincrement())
  user_id      Int
  feature_name String
  timestamp    DateTime @default(now())
  user         User     @relation(fields: [user_id], references: [id])
}
```

---

## ⚡ Scale Essay

> *If this dashboard needed to handle 1 million write-events per minute, how would you change your backend architecture?*

The current synchronous `POST /track` → direct DB write would collapse under 1M writes/minute. I would decouple the write path using a **message queue**: the API endpoint would push events instantly onto a queue (Redis + BullMQ or AWS SQS) and return `202 Accepted` immediately, keeping p99 latency under 5ms. Separate **worker processes** would consume the queue and perform **bulk batch inserts** into the database (e.g. 1000 rows per INSERT) instead of one row at a time, reducing DB round-trips by 99.9%. For the database itself, I'd migrate from standard PostgreSQL to **TimescaleDB** (a PostgreSQL extension optimized for time-series append-only data) or **ClickHouse** for analytical queries. I'd add a **read replica** so the `GET /analytics` aggregation queries never compete with the write workers. Finally, I'd cache the analytics results in **Redis** with a 30-second TTL — since product managers don't need millisecond-fresh data, this eliminates the heavy aggregation query for most requests.

---

## 📁 Project Structure

```
Product-analytics-dashboard/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── analytics.controller.ts
│   │   │   └── track.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── track.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── FilterSidebar.jsx
    │   │   ├── BarChartCard.jsx
    │   │   ├── LineChartCard.jsx
    │   │   └── StatCard.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── hooks/
    │   │   └── useAnalytics.js
    │   ├── services/
    │   │   └── api.js
    │   └── utils/
    │       ├── auth.js
    │       └── filters.js
    ├── .env
    └── package.json
```
