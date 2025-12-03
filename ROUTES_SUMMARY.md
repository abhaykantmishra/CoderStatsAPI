# User Routes Summary

## User Route Mapping

```
BASE URL: /api/users

### Authentication
POST    /register              - Create new user account
POST    /login                 - Login user

### User Profile
GET     /profile/:userId       - Get user profile
PATCH   /profile/:userId       - Update user profile
DELETE  /profile/:userId       - Delete user account

### Password Management
POST    /change-password/:userId - Update password

### Account Management
POST    /deactivate/:userId    - Deactivate user account

### User Discovery
GET     /list                  - Get all active users (paginated)
GET     /list/public           - Get all public users (paginated)
GET     /search                - Search users by query

### Leaderboard
GET     /leaderboard           - Get competitive programming leaderboard
```

---

## Quick Integration Guide

### Step 1: Import Router in Main App
File: `server/index.js`
```javascript
import userRouter from "./src/users/routes.js";

app.use('/api/users', userRouter);
```
✅ Already integrated in `/src/routes.js`

### Step 2: Ensure Database Connection
Make sure MongoDB is connected before starting the server.

### Step 3: Test Routes Using cURL or Postman

#### Register
```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

#### Get Profile
```bash
curl -X GET http://localhost:8000/api/users/profile/USER_ID
```

---

## Model Fields Reference

### User Schema Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| email | String | Yes | - | Unique, lowercase |
| password | String | Yes | - | Hashed, not returned by default |
| name | String | Yes | - | Trimmed |
| leetcode_username | String | No | null | Trim whitespace |
| codeforces_username | String | No | null | Trim whitespace |
| codechef_username | String | No | null | Trim whitespace |
| gfg_username | String | No | null | Trim whitespace |
| graduation_year | Number | No | null | 2020-2100 |
| bio | String | No | null | Max 500 chars |
| avatar | String | No | null | URL string |
| twitter_username | String | No | null | Trim whitespace |
| github_username | String | No | null | Trim whitespace |
| linkedin_username | String | No | null | Trim whitespace |
| isVerified | Boolean | No | false | - |
| isActive | Boolean | No | true | - |
| isPublic | Boolean | No | true | - |
| profileCompleteness | Number | No | 0 | 0-100, auto-calculated |
| lastLogin | Date | No | null | Auto-updated on login |
| createdAt | Date | Auto | - | MongoDB timestamp |
| updatedAt | Date | Auto | - | MongoDB timestamp |

---

## Controller Functions

### Implemented Controllers

1. **createUser** - Signup new user
   - Validates required fields
   - Checks email uniqueness
   - Hashes password
   - Returns user without password

2. **loginUser** - User authentication
   - Validates credentials
   - Checks account status
   - Updates last login timestamp
   - Returns user data

3. **getUserProfile** - Fetch user by ID
   - Validates MongoDB ObjectId format
   - Returns complete user profile

4. **updateUser** - Update profile
   - Blocks restricted field updates (password, email)
   - Calculates profile completeness
   - Validates field constraints

5. **deleteUser** - Delete account
   - Permanently removes user from database

6. **getAllUsers** - List all users
   - Paginated results
   - Returns active users only

7. **getAllPublicusers** - List public users
   - Paginated results
   - Returns only isPublic: true users

8. **searchUsers** - Search functionality
   - Searches name, email, platform usernames
   - Case-insensitive
   - Limits to 20 results

9. **updatePassword** - Change password
   - Verifies current password
   - Validates new password
   - Hashes and saves new password

10. **deactivateAccount** - Deactivate account
    - Sets isActive to false
    - Preserves user data
    - Prevents login

11. **getLeaderboard** - Competitive programming rankings
    - Lists users with platform profiles
    - Paginated results
    - Sorted by creation date

---

## Error Handling

### Validation Errors
All controllers validate input and return meaningful error messages:
- 400: Bad Request (validation error)
- 401: Unauthorized (auth failure)
- 403: Forbidden (account deactivated)
- 404: Not Found (user not found)
- 409: Conflict (duplicate email)
- 500: Internal Server Error

### Response Format
```json
{
  "success": boolean,
  "message": "Human readable message",
  "error": "Optional detailed error",
  "errors": ["Optional", "Error array for validations"],
  "user": { /* User object if applicable */ },
  "pagination": { /* Pagination info if applicable */ }
}
```

---

## Environment Variables Needed

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesync
PORT=8000
```

---

## Notes for Frontend Developers

1. **User ID Storage**: After login, store user._id for future requests
2. **Profile Completeness**: Use this value to show progress indicators
3. **Last Login**: Display when user last accessed the app
4. **Public Profiles**: Check isPublic before displaying user card
5. **Platform Usernames**: Validate before saving (optional fields)
6. **Error Handling**: Always check success field first
7. **Pagination**: Use page and limit parameters for performance
8. **Search**: Real-time search with 20-result limit for UI smoothness
