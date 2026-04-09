# Authentication and Authorization Architecture

## Overview

This document explains how authentication and authorization
are implemented in TaskFlow.

## Authentication Flow

Authentication in TaskFlow uses a dual-token strategy — an access token
for short-lived API access and a refresh token for session continuity.

### Registration

1. User submits name, email, and password
2. Password is hashed using bcrypt with 10 salt rounds
3. Hashed password is stored in the database — plain text is never saved
4. Server generates an access token (JWT, expires 15 minutes)
5. Server generates a refresh token (JWT, expires 7 days)
6. Refresh token is saved to the database against the user record
7. Both tokens are returned to the client

### Login

1. User submits email and password
2. Server fetches user record by email
3. bcrypt compares submitted password against stored hash
4. On match — new access and refresh tokens are generated
5. New refresh token overwrites the old one in the database
6. Both tokens returned to client

### Token Refresh

1. Access token expires after 15 minutes
2. Axios interceptor in the frontend catches a 401 response
3. Interceptor calls POST /auth/refresh with the stored refresh token
4. Server verifies the refresh token signature and checks it matches
   the one stored in the database
5. New access and refresh tokens are issued (token rotation)
6. Original failed request is automatically retried with new token

### Logout

1. Client calls POST /auth/logout with the refresh token
2. Server sets refreshToken to null in the database
3. Even if someone has the old refresh token, it is now invalid

## Authorization

Every task endpoint is protected by the auth middleware in
backend/src/middleware/auth.ts.

The middleware:
1. Reads the Authorization header from the incoming request
2. Expects format: Bearer <token>
3. Verifies the JWT signature using the server secret
4. Extracts the userId from the token payload
5. Attaches userId to the request object
6. Passes control to the route handler

If the token is missing, malformed, or expired — the middleware
returns 401 Unauthorized immediately without reaching the controller.

Task ownership is enforced inside each controller. Every database
query filters by both the task ID and the requesting user's ID.
This means a logged-in user cannot read, edit, or delete
another user's tasks even if they know the task ID.

## File References

| File | Responsibility |
|------|---------------|
| backend/src/controllers/authController.ts | Register, login, refresh, logout logic |
| backend/src/middleware/auth.ts | JWT verification on every protected route |
| backend/src/utils/jwt.ts | Token generation and verification helpers |
| frontend/lib/api.ts | Axios interceptor for automatic token refresh |

## Security Decisions

| Decision | Reason |
|----------|--------|
| Short access token expiry (15 min) | Limits damage if token is stolen |
| Refresh token stored in database | Allows server-side invalidation on logout |
| Token rotation on refresh | Old refresh tokens cannot be reused |
| bcrypt with 10 salt rounds | Industry standard, computationally expensive to brute force |
| userId from token, not request body | Client cannot impersonate another user |