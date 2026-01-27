# Authentication API Guide

> Complete reference for authentication endpoints provided by the Strapi backend.

---

## Table of Contents

- [Base URL](#base-url)
- [Standard Authentication](#standard-authentication-emailpassword)
  - [Register](#1-register-new-user)
  - [Login](#2-login)
  - [Get Current User](#3-get-current-user)
  - [Update Profile](#4-update-user-profile)
  - [Change Password](#5-change-password)
  - [Forgot Password](#6-forgot-password)
  - [Reset Password](#7-reset-password)
- [Social Authentication](#social-authentication-oauth)
  - [Google Login](#google-login)
  - [Facebook Login](#facebook-login)
- [Strapi Configuration](#strapi-admin-configuration)
- [Error Codes](#error-codes)

---

## Base URL

```
http://localhost:1337 (development)
https://your-strapi-domain.com (production)
```

---

## Standard Authentication (Email/Password)

### 1. Register New User

**POST** `/api/auth/local/register`

```json
// Request Body
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

// Response (201 Created)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2026-01-25T19:00:00.000Z"
  }
}
```

**Notes:**

- Store the `jwt` in localStorage or secure cookie
- Use this token for all authenticated requests

---

### 2. Login

**POST** `/api/auth/local`

```json
// Request Body
{
  "identifier": "john@example.com",  // Can be email OR username
  "password": "SecurePassword123"
}

// Response (200 OK)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}

// Error Response (400 Bad Request)
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid identifier or password"
  }
}
```

---

### 3. Get Current User

**GET** `/api/users/me`

```bash
# Headers
Authorization: Bearer <jwt_token>
```

```json
// Response (200 OK)
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "confirmed": true,
  "blocked": false
}
```

---

### 4. Update User Profile

**PUT** `/api/users/:id`

```bash
# Headers
Authorization: Bearer <jwt_token>
```

```json
// Request Body (only include fields to update)
{
  "username": "new_username",
  "email": "newemail@example.com"
}

// Response (200 OK)
{
  "id": 1,
  "username": "new_username",
  "email": "newemail@example.com"
}
```

**Note:** Users can only update their own profile.

---

### 5. Change Password

**POST** `/api/auth/change-password`

```bash
# Headers
Authorization: Bearer <jwt_token>
```

```json
// Request Body
{
  "currentPassword": "OldPassword123",
  "password": "NewSecurePassword456",
  "passwordConfirmation": "NewSecurePassword456"
}

// Response (200 OK)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### 6. Forgot Password

**POST** `/api/auth/forgot-password`

```json
// Request Body
{
  "email": "john@example.com"
}

// Response (200 OK)
{
  "ok": true
}
```

**Notes:**

- Sends a password reset email (requires email plugin configuration)
- Email contains a link with reset code

---

### 7. Reset Password

**POST** `/api/auth/reset-password`

```json
// Request Body
{
  "code": "privateCode",  // From reset email URL
  "password": "NewPassword123",
  "passwordConfirmation": "NewPassword123"
}

// Response (200 OK)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## Social Authentication (OAuth)

### Google Login

> **Requires:** Google OAuth configured in Strapi Admin → Settings → Users & Permissions → Providers

#### Step 1: Redirect to Google

**GET** `/api/connect/google`

- Redirects user to Google OAuth consent screen
- After consent, Google redirects back to your callback URL

#### Step 2: Handle Callback

**GET** `/api/auth/google/callback?access_token=...`

```json
// Response (200 OK)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "google_user",
    "email": "user@gmail.com",
    "provider": "google"
  }
}
```

#### Frontend Implementation

```javascript
// 1. Open Google login in popup/redirect
window.location.href = `${STRAPI_URL}/api/connect/google`;

// 2. On callback page, extract query params
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');

// 3. Use access_token as JWT for authenticated requests
```

---

### Facebook Login

> **Requires:** Facebook OAuth configured in Strapi Admin → Settings → Users & Permissions → Providers

#### Step 1: Redirect to Facebook

**GET** `/api/connect/facebook`

#### Step 2: Handle Callback

**GET** `/api/auth/facebook/callback?access_token=...`

```json
// Response (200 OK)
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "facebook_user",
    "email": "user@facebook.com",
    "provider": "facebook"
  }
}
```

---

## Strapi Admin Configuration

### Enable Providers

1. Go to **Strapi Admin Panel** → **Settings**
2. Navigate to **Users & Permissions Plugin** → **Providers**
3. Click on **Google** or **Facebook**
4. Configure:

| Setting           | Description                                     |
| ----------------- | ----------------------------------------------- |
| **Enable**        | Toggle ON                                       |
| **Client ID**     | From Google Cloud Console / Facebook Developers |
| **Client Secret** | From Google Cloud Console / Facebook Developers |
| **Redirect URL**  | `https://your-frontend.com/auth/callback`       |

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable **Google+ API**
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `http://localhost:1337/api/connect/google/callback` (dev)
   - `https://your-strapi.com/api/connect/google/callback` (prod)

### Facebook Developers Setup

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create app → Add Facebook Login product
3. Configure Valid OAuth Redirect URIs:
   - `http://localhost:1337/api/connect/facebook/callback`

---

## Authentication Headers

For all authenticated requests, include:

```javascript
headers: {
  'Authorization': `Bearer ${jwt}`,
  'Content-Type': 'application/json'
}
```

---

## Error Codes

| Status | Error             | Description                  |
| ------ | ----------------- | ---------------------------- |
| 400    | ValidationError   | Invalid request body         |
| 400    | ApplicationError  | Invalid credentials          |
| 401    | UnauthorizedError | Missing or invalid JWT       |
| 403    | ForbiddenError    | User doesn't have permission |

---

## Frontend Reference Implementation

See the example implementation in the `frontend/` folder (to be deleted):

- `src/lib/api.ts` - API client with typed endpoints
- `src/hooks/use-auth.tsx` - Auth context with login/logout

You can copy these as reference for your separate frontend repo.
