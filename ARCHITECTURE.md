# CodeSync Architecture & Implementation Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│                    (client folder)                      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST Requests
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 API Server (Express)                    │
│                  (index.js entry)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Middleware Stack                     │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ 1. Body Parser (JSON/URL)                      │   │
│  │ 2. CORS Handler                                │   │
│  │ 3. Request Logger                              │   │
│  │ 4. Route Handlers                              │   │
│  │ 5. Error Handler                               │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Routes (API Endpoints)               │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ /api/users/register     (POST)                 │   │
│  │ /api/users/login        (POST)                 │   │
│  │ /api/users/profile/:id  (GET/PATCH/DELETE)    │   │
│  │ /api/users/search       (GET)                  │   │
│  │ /api/users/list         (GET)                  │   │
│  │ /api/users/leaderboard  (GET)                  │   │
│  │ ... (and other routes)                         │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Controllers (Business Logic)            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ - Input validation                             │   │
│  │ - Database operations                          │   │
│  │ - Error handling                               │   │
│  │ - Response formatting                          │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Mongoose Models                       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ - User Model                                   │   │
│  │ - Schema Validation                            │   │
│  │ - Instance Methods                             │   │
│  │ - Hooks (Pre/Post)                             │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose Driver
                       ↓
┌─────────────────────────────────────────────────────────┐
│              MongoDB Database                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Database: codesync                                    │
│  ├── Collections                                       │
│  │   └── users                                        │
│  │       ├── _id                                      │
│  │       ├── email                                    │
│  │       ├── password (hashed)                        │
│  │       ├── name                                     │
│  │       ├── competitiv_programming_profiles          │
│  │       ├── social_profiles                          │
│  │       ├── user_status                              │
│  │       └── timestamps                               │
│  │                                                    │
│  ├── Indexes                                          │
│  │   └── email (unique)                              │
│  └── Validation Rules                                 │
│      └── Schema validation on save                    │
│                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow Example: User Registration

```
Frontend                          Backend                          Database
   │                                │                                  │
   ├─ POST /register ──────────────>│                                  │
   │  {                             │                                  │
   │    name, email, password        │                                  │
   │  }                              │                                  │
   │                                ├─ Validate input                 │
   │                                │  (email, password length)        │
   │                                │                                  │
   │                                ├─ Check duplicate                │
   │                                │  (query: email exists?)          │
   │                                ├──────────────────────────────>│
   │                                │<──────────────────────────────│
   │                                │  (No duplicate)                │
   │                                │                                  │
   │                                ├─ Hash password                 │
   │                                │  (bcrypt + salt)                │
   │                                │                                  │
   │                                ├─ Create document               │
   │                                ├──────────────────────────────>│
   │                                │                           Create user
   │                                │<──────────────────────────────│
   │                                │  User created with _id          │
   │                                │                                  │
   │<─ 201 Created ────────────────┤                                  │
   │  {                             │                                  │
   │    success: true,              │                                  │
   │    user: {...}                 │                                  │
   │  }                             │                                  │
   │                                │                                  │
```

---

## Authentication Flow: Login

```
Frontend                          Backend                          Database
   │                                │                                  │
   ├─ POST /login ─────────────────>│                                  │
   │  {email, password}             │                                  │
   │                                ├─ Find user by email             │
   │                                ├──────────────────────────────>│
   │                                │<──────────────────────────────│
   │                                │  {user with hashed password}    │
   │                                │                                  │
   │                                ├─ Compare password               │
   │                                │  (bcrypt.compare)               │
   │                                │                                  │
   │                                ├─ Update lastLogin               │
   │                                ├──────────────────────────────>│
   │                                │                           Update user
   │                                │<──────────────────────────────│
   │                                │  User updated                   │
   │                                │                                  │
   │<─ 200 OK ──────────────────────┤                                  │
   │  {                             │                                  │
   │    success: true,              │                                  │
   │    user: {_id, name, email...}│                                  │
   │  }                             │                                  │
   │                                │                                  │
   │ (Store _id in localStorage)    │                                  │
   │                                │                                  │
```

---

## User Model Schema

```javascript
User {
  // Identity
  ├─ email: string (unique, required)
  ├─ password: string (hashed, required, not returned)
  ├─ name: string (required)
  ├─ avatar: string (optional)
  │
  // Competitive Programming
  ├─ leetcode_username: string
  ├─ codeforces_username: string
  ├─ codechef_username: string
  ├─ gfg_username: string
  │
  // Profile Information
  ├─ bio: string (max 500 chars)
  ├─ graduation_year: number (2020-2100)
  │
  // Social Profiles
  ├─ twitter_username: string
  ├─ github_username: string
  ├─ linkedin_username: string
  │
  // Status
  ├─ isVerified: boolean (default: false)
  ├─ isActive: boolean (default: true)
  ├─ isPublic: boolean (default: true)
  │
  // Tracking
  ├─ profileCompleteness: number (0-100, auto-calculated)
  ├─ lastLogin: Date (auto-updated on login)
  ├─ createdAt: Date (auto)
  ├─ updatedAt: Date (auto)
}
```

---

## Controller Functions Breakdown

```
User Controllers (11 functions)
│
├─ Authentication (2)
│  ├─ createUser() - Register new user
│  └─ loginUser() - Authenticate user
│
├─ Profile Management (3)
│  ├─ getUserProfile() - Get user by ID
│  ├─ updateUser() - Update profile
│  └─ deleteUser() - Delete account
│
├─ Password Management (1)
│  └─ updatePassword() - Change password
│
├─ Account Management (1)
│  └─ deactivateAccount() - Deactivate (reversible)
│
├─ Discovery & Search (3)
│  ├─ getAllUsers() - List all (paginated)
│  ├─ getAllPublicusers() - Public profiles
│  └─ searchUsers() - Search by query
│
└─ Ranking (1)
   └─ getLeaderboard() - Competitive rankings
```

---

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│         Request comes in                │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│    Try to process request               │
│    ├─ Validate input                    │
│    ├─ Query database                    │
│    ├─ Process business logic            │
│    └─ Prepare response                  │
└────┬─────────────────┬──────────────────┘
     │                 │
   Success            Error
     │                 │
     ↓                 ↓
   ┌──────────────────────────┐
   │   Error Handler          │
   ├──────────────────────────┤
   │ ├─ Log error             │
   │ ├─ Map error to status   │
   │ │  ├─ Validation → 400   │
   │ │  ├─ Auth failed → 401  │
   │ │  ├─ Forbidden → 403    │
   │ │  ├─ Not found → 404    │
   │ │  ├─ Duplicate → 409    │
   │ │  └─ Server error → 500 │
   │ └─ Format response       │
   └──────┬──────────────────┘
         ↓
   ┌──────────────────────────┐
   │  Return Response         │
   │  ├─ success: false       │
   │  ├─ message: "..."       │
   │  └─ errors: [...]        │
   └──────────────────────────┘
```

---

## Middleware Stack

```
HTTP Request
    ↓
┌─────────────────────────────┐
│ 1. Body Parser Middleware   │
│    Parse JSON/URL-encoded   │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│ 2. CORS Middleware          │
│    Handle cross-origin      │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│ 3. Logger Middleware        │
│    Log request details      │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│ 4. Route Handler            │
│    Process request          │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│ 5. Error Handler            │
│    Catch all errors         │
└────────────┬────────────────┘
             ↓
     HTTP Response
```

---

## File Organization

### Configuration Layer
```
src/config/
├── database.js    - MongoDB connection logic
└── config.js      - Application configuration
```

### Middleware Layer
```
src/middleware/
├── errorHandler.js - Error handling & validation
└── logger.js       - Request/response logging
```

### Data Layer (Models)
```
src/users/
├── model.js        - MongoDB schema & methods
```

### Business Logic Layer (Controllers)
```
src/users/
├── controllers.js  - 11 controller functions
```

### API Layer (Routes)
```
src/users/
├── routes.js       - Endpoint definitions

src/
└── routes.js       - Main router (combines all routes)
```

---

## Database Connection Lifecycle

```
Process Start
     ↓
Load environment variables (.env)
     ↓
Validate configuration
     ↓
Attempt MongoDB connection
     │
     ├─ Success ──→ Connection established
     │              Ready to process requests
     │
     └─ Failure ──→ Log error
                    Exit process (code 1)
```

---

## Response Format Standard

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "user": { /* data */ },
  "pagination": { /* if applicable */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field error 1", "Field error 2"],
  "error": "Detailed error (dev mode only)"
}
```

---

## Password Hashing Process

```
User enters password: "password123"
          ↓
Mongoose Pre-save Hook triggered
          ↓
Check if password is modified
          ↓
Generate salt (bcryptjs, rounds: 10)
          ↓
Hash password with salt
          ↓
Replace plain password with hash
          ↓
Save to database
          ↓
Database stores: "$2a$10$..." (hashed)
```

---

## Profile Completeness Calculation

```
10 Profile Fields:
├─ bio
├─ avatar
├─ graduation_year
├─ twitter_username
├─ github_username
├─ linkedin_username
├─ leetcode_username
├─ codeforces_username
├─ codechef_username
└─ gfg_username

Formula: (filledFields / totalFields) × 100

Examples:
- All empty → 0%
- 5 filled → 50%
- 8 filled → 80%
- All filled → 100%
```

---

## Pagination Implementation

```
GET /api/users/list?page=2&limit=10

Query Parameters:
├─ page: 2 (which page)
└─ limit: 10 (items per page)

Calculation:
skip = (page - 1) × limit
     = (2 - 1) × 10
     = 10

Database:
skip(10).limit(10) → items 11-20

Response includes:
├─ users: [...] (10 items)
└─ pagination: {
     total: 150,
     page: 2,
     pages: 15,
     limit: 10
   }
```

---

## Search Implementation

```
GET /api/users/search?query=john

Search across:
├─ name (case-insensitive)
├─ email (case-insensitive)
├─ leetcode_username
├─ codeforces_username
├─ codechef_username
└─ gfg_username

Uses MongoDB regex: new RegExp(query, 'i')

Max results: 20 (for UI performance)

Returns: Matching users with profile data
```

---

## Key Security Features

✅ **Password Security**
- Hashed with bcryptjs (salt rounds: 10)
- Never returned in responses
- Validated before database save

✅ **Email Validation**
- Regex pattern validation
- Unique constraint in database
- Case-normalized (lowercase)

✅ **Input Sanitization**
- Trimmed whitespace
- Type validation
- Max length constraints
- Enum validation

✅ **Error Handling**
- No sensitive data in error messages
- Stack traces only in development
- Proper HTTP status codes

✅ **Database**
- Mongoose schema validation
- Pre-save hooks for processing
- Proper indexes for performance

---

## Performance Optimizations

1. **Indexes**
   - Email field indexed (unique)
   - Automatic _id index

2. **Query Optimization**
   - Field selection (avoid fetching password)
   - Pagination for large datasets
   - Limits on search results (20)

3. **Caching**
   - Password not cached (hashed each time)
   - Database connection pooling (Mongoose default)

4. **Connection Management**
   - Single connection instance
   - Connection pooling
   - Proper error handling

---

## Development Workflow

```
1. Start MongoDB
   └─ brew services start mongodb-community

2. Set up environment
   └─ Check .env file

3. Install dependencies
   └─ npm install

4. Start development server
   └─ npm run dev (with auto-reload)

5. Seed database (optional)
   └─ npm run seed:db

6. Test endpoints
   └─ Use Postman or cURL

7. Check logs
   └─ Watch console output

8. Make changes
   └─ Auto-reload on file save

9. Monitor with Compass
   └─ Visual database client
```

---

## Next Phase: Frontend Integration

When frontend is ready:
1. Update `CORS_ORIGIN` in `.env`
2. Frontend will send requests to `/api/users/...`
3. Store user `_id` after login
4. Include `_id` in PATCH/DELETE requests
5. Handle all documented error responses

