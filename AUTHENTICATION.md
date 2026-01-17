# 🔐 Authentication System Documentation

## Overview

This project implements a full-stack authentication system with JWT tokens, Prisma ORM, and bcrypt password hashing.

## Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables

Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the values:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION="7d"
NUXT_PUBLIC_API_BASE="http://localhost:3000"
```

### 3. Initialize database

```bash
# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

### 4. Run the development server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

## Project Structure

```
.
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts      # Login endpoint
│   │   │   ├── register.post.ts   # Registration endpoint
│   │   │   ├── logout.post.ts     # Logout endpoint
│   │   │   └── me.get.ts          # Get current user
│   │   └── ...
│   ├── middleware/
│   │   └── auth.ts                # JWT verification middleware
│   └── utils/
│       └── auth.ts                # JWT & password utilities
├── prisma/
│   └── schema.prisma              # Database schema
├── composables/
│   └── useAuth.ts                 # Vue composable for auth
├── pages/
│   └── auth.vue                   # Login/Register page
└── ...
```

## API Endpoints

### Public Endpoints (No Auth Required)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7 900 000-00-00",
  "password": "secure_password_123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "ivan@example.com",
    "name": "Иван Иванов",
    "phone": "+7 900 000-00-00"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "secure_password_123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "ivan@example.com",
    "name": "Иван Иванов",
    "phone": "+7 900 000-00-00",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Protected Endpoints (Auth Required)

#### Get Current User
```http
GET /api/auth/me
Cookie: auth-token=jwt_token
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "ivan@example.com",
    "name": "Иван Иванов",
    "phone": "+7 900 000-00-00",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-01-17T12:00:00.000Z"
  }
}
```

## Frontend Usage

### Using the useAuth Composable

```vue
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, isAuthenticated, login, register, logout, isLoading, error } = useAuth()

const handleLogin = async () => {
  const result = await login('user@example.com', 'password')
  if (result.success) {
    // Navigate to dashboard
  } else {
    // Show error
  }
}

const handleRegister = async () => {
  const result = await register('John', 'john@example.com', '+7 900 000-00-00', 'password')
  if (result.success) {
    // Navigate to dashboard
  }
}

const handleLogout = async () => {
  await logout()
  // Navigate to home
}
</script>

<template>
  <div v-if="!isAuthenticated">
    <button @click="handleLogin">Login</button>
    <button @click="handleRegister">Register</button>
  </div>
  <div v-else>
    <p>Welcome, {{ user?.name }}!</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>
```

## Database Schema

### Users Table
- `id` - Unique identifier (CUID)
- `email` - Unique email
- `password` - Hashed password (bcrypt)
- `name` - User's full name
- `phone` - Optional phone number
- `role` - User role (default: "user")
- `isActive` - Account status (default: true)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Sessions Table
- `id` - Unique identifier
- `token` - JWT token
- `userId` - Reference to User
- `expiresAt` - Token expiration
- `createdAt` - Session creation timestamp

### Orders Table
- `id` - Unique identifier
- `userId` - Reference to User
- `subject` - Order subject
- `theme` - Order theme
- `description` - Description
- `workType` - Type of work
- `volume` - Volume/pages
- `deadline` - Deadline date
- `status` - Order status
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Security Features

✅ **Password Hashing** - bcryptjs (10 rounds)
✅ **JWT Tokens** - 7-day expiration by default
✅ **HTTP-Only Cookies** - Prevents XSS attacks
✅ **Protected Routes** - Middleware validates tokens
✅ **Secure Mode** - HTTPS in production
✅ **SameSite Policy** - Prevents CSRF attacks

## Authentication Flow

```
1. User Registration
   └─> POST /api/auth/register
       ├─> Validate input
       ├─> Hash password with bcrypt
       ├─> Create user in database
       ├─> Generate JWT token
       ├─> Set HTTP-only cookie
       └─> Return user & token

2. User Login
   └─> POST /api/auth/login
       ├─> Find user by email
       ├─> Compare password with bcrypt
       ├─> Verify user is active
       ├─> Generate JWT token
       ├─> Set HTTP-only cookie
       └─> Return user & token

3. Protected Requests
   └─> GET /api/protected
       ├─> Middleware extracts token from cookie
       ├─> Verify JWT signature
       ├─> Validate expiration
       ├─> Extract userId
       └─> Attach to event context

4. Get Current User
   └─> GET /api/auth/me
       ├─> Verify JWT from cookie
       ├─> Fetch user from database
       └─> Return user data

5. Logout
   └─> POST /api/auth/logout
       ├─> Clear auth cookie
       └─> Frontend clears user state
```

## Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-production-secret-key"
JWT_EXPIRATION="7d"
NUXT_PUBLIC_API_BASE="https://yourdomain.com"
NODE_ENV="production"
```

### Notes
- Change JWT_SECRET to a strong random string
- Use PostgreSQL for production (not SQLite)
- Set NODE_ENV=production
- Enable HTTPS
- Use environment variables, not hardcoded values

## Troubleshooting

### Database Issues
```bash
# Reset database
npm run db:push -- --force-reset

# View database
npm run db:studio
```

### Token Errors
- Clear cookies in browser DevTools
- Verify JWT_SECRET is set correctly
- Check token expiration

### CORS Issues
- Ensure credentials are enabled in fetch requests
- Configure Nitro CORS in nuxt.config.ts if needed

## Next Steps

1. ✅ Add email verification
2. ✅ Implement password reset
3. ✅ Add 2FA (Two-Factor Authentication)
4. ✅ Implement social login (Google, GitHub)
5. ✅ Add role-based access control (RBAC)
6. ✅ Implement refresh token rotation

## Support

For issues or questions, please create an issue in the repository.
