# TaskFlow - Task Management System

A full-stack Task Management System built with Node.js, TypeScript, Prisma, and Next.js.

![TaskFlow Dashboard](https://img.shields.io/badge/Status-Live-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

## 🚀 Features

### Authentication
- ✅ User Registration and Login
- ✅ JWT Access Tokens (15 min expiry)
- ✅ JWT Refresh Tokens (7 days expiry)
- ✅ Auto token refresh on expiry
- ✅ Secure password hashing with bcrypt
- ✅ Logout with token invalidation

### Task Management
- ✅ Create, Read, Update, Delete tasks
- ✅ Toggle task status (pending/completed)
- ✅ Search tasks by title
- ✅ Filter tasks by status
- ✅ Pagination support
- ✅ Tasks belong to logged-in user only

### Frontend
- ✅ Responsive design (mobile + desktop)
- ✅ Login and Register pages
- ✅ Task Dashboard with full CRUD UI
- ✅ Toast notifications for all actions
- ✅ Auto redirect based on auth state

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript |
| Database | SQLite with Prisma ORM |
| Authentication | JWT (Access + Refresh Tokens) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| HTTP Client | Axios with interceptors |

## 📁 Project Structure

task-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Auth logic
│   │   │   └── taskController.ts   # Task logic
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.ts  # Auth endpoints
│   │   │   └── taskRoutes.ts  # Task endpoints
│   │   ├── utils/
│   │   │   ├── jwt.ts         # JWT helpers
│   │   │   └── prisma.ts      # Prisma client
│   │   └── index.ts           # Server entry point
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── register/
│   │   │   └── page.tsx       # Register page
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Task dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home redirect
│   ├── lib/
│   │   └── api.ts             # Axios API client
│   └── package.json
└── README.md

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/nidhi01bhagat/task-management-system.git
cd task-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="super_secret_access_key_2024"
JWT_REFRESH_SECRET="super_secret_refresh_key_2024"
PORT=5000
```

Run database migration:
```bash
npx prisma migrate dev --name init
```

Start backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Logout user |

### Task Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get all tasks (paginated) |
| POST | /tasks | Create new task |
| GET | /tasks/:id | Get single task |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| PATCH | /tasks/:id/toggle | Toggle task status |

### Query Parameters for GET /tasks
| Parameter | Description | Example |
|-----------|-------------|---------|
| page | Page number | ?page=1 |
| limit | Items per page | ?limit=10 |
| status | Filter by status | ?status=pending |
| search | Search by title | ?search=meeting |

## 🔐 Authentication Flow

1. User registers/logs in → receives `accessToken` + `refreshToken`
2. `accessToken` is sent in every API request header
3. When `accessToken` expires → axios interceptor auto-calls `/auth/refresh`
4. New tokens are saved and request is retried automatically
5. On logout → refresh token is invalidated in database

## 👩‍💻 Developer

**Nidhi Bhagat**
- GitHub: [@nidhi01bhagat](https://github.com/nidhi01bhagat)
- Email: nidhi01bhagat@gmail.com


