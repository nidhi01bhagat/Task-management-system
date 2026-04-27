#  TaskFlow - Task Management System
> A full-stack task management system designed with production-level architecture, secure authentication, and scalable API design using Node.js, Next.js, and TypeScript.

## Overview
TaskFlow is a full-stack web application that enables users to securely manage personal tasks with a clean and responsive interface. The system is built with a strong focus on backend architecture, authentication flows, and maintainable code structure—mirroring real-world production applications.

Users can register, log in, and manage tasks through a protected dashboard, with seamless session handling powered by JWT-based authentication.

## Key Capabilities

* Secure user authentication (JWT access + refresh token flow)
* Full CRUD operations for task management
* Search, filter, and pagination support
* Automatic session refresh using Axios interceptors
* User-specific data isolation (multi-user safe architecture)

---

##  System Architecture

```text
Client (Next.js)
        ↓
REST API (Node.js + Express)
        ↓
Database (SQLite via Prisma ORM)
```

* Frontend handles UI and API communication
* Backend enforces business logic and authentication
* Database layer ensures data consistency and integrity

---

##  Authentication Design

The system uses a **dual-token strategy**:

* **Access Token (short-lived)** → sent with every request
* **Refresh Token (long-lived)** → used to renew sessions

An Axios interceptor automatically:

1. Detects expired tokens
2. Requests a new access token
3. Retries the failed request

This ensures **zero interruption for the user experience**, similar to production systems.

---

##  Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Backend    | Node.js, Express, TypeScript  |
| Database   | SQLite                        |
| ORM        | Prisma                        |
| Auth       | JWT (Access + Refresh Tokens) |
| Security   | bcrypt                        |
| Frontend   | Next.js, TypeScript           |
| Styling    | Tailwind CSS                  |
| API Client | Axios (with interceptors)     |

---

##  Project Structure

```bash
task-management-system/
├── backend/        # API server (auth, tasks, middleware)
├── frontend/       # Next.js application
├── package.json    # Runs both services together
```

---

##  Engineering Approach

This project was implemented from scratch with a focus on:

* Separation of concerns (controllers, routes, middleware)
* Clean and maintainable code structure
* Scalable authentication design
* Real-world API behavior (pagination, filtering, error handling)

The goal was not just to build features, but to understand how production systems are designed and maintained.

---

##  API Highlights

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`

### Tasks

* `GET /tasks` (with pagination, search, filters)
* `POST /tasks`
* `PATCH /tasks/:id`
* `DELETE /tasks/:id`
* `PATCH /tasks/:id/toggle`

---

##  Data Model

* **User → Task (1:N relationship)**
* Secure password storage using hashing
* Token-based session tracking

---

##  Challenges Solved

* Designing a reliable token refresh mechanism
* Maintaining clean separation between layers
* Handling authenticated requests without breaking UX
* Structuring backend for scalability

---

##  Outcome

Built a complete, end-to-end system demonstrating:

* Backend architecture understanding
* Secure authentication implementation
* Full-stack integration
* Production-level thinking

---

##  Running Locally

```bash
git clone https://github.com/nidhi01bhagat/task-management-system.git
cd task-management-system
npm install
npm run dev
```

---

##  Developer

Nidhi Bhagat
GitHub: github.com/nidhi01bhagat
LinkedIn: linkedin.com/in/nidhi-bhagat01

---

