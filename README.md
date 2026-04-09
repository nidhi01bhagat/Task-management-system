# TaskFlow — Task Management System

TaskFlow is a full-stack web application where users can register, log in, and manage
their personal tasks. It is built with a Node.js backend and a Next.js frontend,
connected through a REST API secured with JWT authentication.

This project was built as part of the Associate Software Developer assessment
at Earnest Data Analytics.

---

## What This Application Does

A user visits the app, creates an account, and lands on their personal dashboard.
From there they can create tasks, mark them complete, edit details, delete them,
search by title, and filter by status. Every user sees only their own tasks.
Sessions are handled automatically — the app refreshes login tokens in the
background so users are never interrupted mid-session.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Node.js, Express, TypeScript | REST API server |
| Database | SQLite | File-based relational database |
| ORM | Prisma | Database queries and migrations |
| Authentication | JWT (Access + Refresh Tokens) | Stateless session management |
| Password Security | bcrypt | One-way password hashing |
| Frontend | Next.js 16, TypeScript | React-based web application |
| Styling | Tailwind CSS | Utility-based CSS framework |
| HTTP Client | Axios | API communication with interceptors |
| Dev Runner | Concurrently | Runs both servers with one command |

---

## Project Structure
task-management-system/
│
├── package.json                     # Root config — starts both servers together
│
├── backend/                         # Node.js API server
│   ├── prisma/
│   │   ├── schema.prisma            # Defines User and Task database tables
│   │   └── migrations/              # Tracks database changes over time
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Handles register, login, refresh, logout
│   │   │   └── taskController.ts    # Handles create, read, update, delete, toggle
│   │   ├── middleware/
│   │   │   └── auth.ts              # Verifies JWT token on protected routes
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Maps /auth/* endpoints to controllers
│   │   │   └── taskRoutes.ts        # Maps /tasks/* endpoints to controllers
│   │   ├── utils/
│   │   │   ├── jwt.ts               # Generates and verifies JWT tokens
│   │   │   └── prisma.ts            # Shared Prisma database client
│   │   └── index.ts                 # Entry point — starts the Express server
│   ├── .env                         # Environment variables (not committed to Git)
│   └── package.json
│
├── frontend/                        # Next.js web application
│   ├── app/
│   │   ├── login/page.tsx           # Login screen
│   │   ├── register/page.tsx        # Registration screen
│   │   ├── dashboard/page.tsx       # Main task management screen
│   │   ├── layout.tsx               # Shared HTML wrapper
│   │   └── page.tsx                 # Root redirect based on auth state
│   ├── lib/
│   │   └── api.ts                   # Axios instance with token refresh logic
│   └── package.json
│
└── README.md

---

## Authentication Flow

When a user logs in, the server returns two tokens — an access token and a
refresh token. The access token is short-lived (15 minutes) and is sent with
every API request. The refresh token is long-lived (7 days) and is used only
to obtain a new access token when the current one expires.

This happens automatically in the background. The Axios interceptor in
frontend/lib/api.ts catches any 401 response, calls the refresh endpoint,
updates the stored tokens, and retries the original request — all without
the user noticing.

On logout, the refresh token is deleted from the database, which permanently
invalidates that session.
Login
-> Server returns accessToken (15 min) + refreshToken (7 days)
-> accessToken stored in localStorage, sent in Authorization header
-> On 401 response: interceptor calls /auth/refresh
-> New tokens saved, original request retried
-> On logout: refreshToken deleted from database

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create a new user account |
| POST | /auth/login | Log in and receive tokens |
| POST | /auth/refresh | Exchange refresh token for new access token |
| POST | /auth/logout | Invalidate session |

### Tasks (require Authorization header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | List tasks with pagination, search, filter |
| POST | /tasks | Create a new task |
| GET | /tasks/:id | Get a single task |
| PATCH | /tasks/:id | Update task fields |
| DELETE | /tasks/:id | Delete a task |
| PATCH | /tasks/:id/toggle | Toggle status between pending and completed |

### Query Parameters for GET /tasks

| Parameter | Description | Example |
|-----------|-------------|---------|
| page | Page number | ?page=1 |
| limit | Results per page | ?limit=10 |
| status | Filter by status | ?status=pending |
| search | Search by title | ?search=meeting |

---

## Database Schema
User
id            Int       Primary key
name          String
email         String    Unique
password      String    Hashed with bcrypt
refreshToken  String    Nullable, cleared on logout
createdAt     DateTime
tasks         Task[]    One user has many tasks
Task
id            Int       Primary key
title         String
description   String    Optional
status        String    Default: pending
createdAt     DateTime
updatedAt     DateTime  Auto-updated
userId        Int       Foreign key to User

---

## How to Run Locally

### Requirements

- Node.js v18 or above
- npm v9 or above
- Git

### Setup

Clone the repository:

```bash
git clone https://github.com/nidhi01bhagat/task-management-system.git
cd task-management-system
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create a .env file inside the backend folder:

```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="super_secret_access_key_2024"
JWT_REFRESH_SECRET="super_secret_refresh_key_2024"
PORT=5000
```

Run the database migration:

```bash
npx prisma migrate dev --name init
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Install root dependencies:

```bash
cd ..
npm install
```

Start both servers with a single command:

```bash
npm run dev
```

The backend starts on http://localhost:5000 and the frontend on
http://localhost:3000. Open http://localhost:3000 in your browser.

---

## How the Single Command Works

The root package.json uses concurrently to run both servers in parallel
from one terminal:

```json
"dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
```

The --prefix flag tells npm which subdirectory to run the command in.
Without this, you would need two separate terminals.

---

## About package-lock.json

Each folder — backend, frontend, and root — has its own package-lock.json.
This file records the exact version of every installed dependency so that
anyone who clones this repository and runs npm install gets identical
packages, regardless of when they do it.

The node_modules folder is excluded from Git. The lock file is what allows
it to be reliably recreated.

---

## Developer

Nidhi Bhagat
GitHub: github.com/nidhi01bhagat
LinkedIn: linkedin.com/in/nidhi-bhagat01
Email: nidhi01bhagat@gmail.com

---

## License
