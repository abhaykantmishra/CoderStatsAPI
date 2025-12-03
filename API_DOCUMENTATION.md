# CodeSync API Documentation

## Base URL
```
http://localhost:8000/api/users
```

---

## Authentication Endpoints

### 1. **Register User**
- **Method:** POST
- **Endpoint:** `/register`
- **Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "isVerified": false,
    "profileCompleteness": 0,
    "createdAt": "2025-12-03T10:30:00.000Z",
    "updatedAt": "2025-12-03T10:30:00.000Z"
  }
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. **Login User**
- **Method:** POST
- **Endpoint:** `/login`
- **Description:** Authenticate user and return profile

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "avatar": "https://...",
    "profileCompleteness": 50,
    "lastLogin": "2025-12-03T10:30:00.000Z",
    "leetcode_username": "john_doe",
    "createdAt": "2025-12-03T10:30:00.000Z",
    "updatedAt": "2025-12-03T10:30:00.000Z"
  }
}
```

---

## User Profile Endpoints

### 3. **Get User Profile**
- **Method:** GET
- **Endpoint:** `/profile/:userId`
- **Description:** Fetch user profile by ID

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "avatar": "https://...",
    "graduation_year": 2025,
    "twitter_username": "johndoe",
    "github_username": "johndoe",
    "linkedin_username": "johndoe",
    "leetcode_username": "john_doe",
    "codeforces_username": "johndoe",
    "codechef_username": "johndoe",
    "gfg_username": "johndoe",
    "profileCompleteness": 80,
    "lastLogin": "2025-12-03T10:30:00.000Z",
    "isActive": true,
    "isPublic": true,
    "createdAt": "2025-12-03T10:30:00.000Z"
  }
}
```

---

### 4. **Update User Profile**
- **Method:** PATCH
- **Endpoint:** `/profile/:userId`
- **Description:** Update user profile information

**Request Body (all fields optional):**
```json
{
  "name": "John Doe Updated",
  "bio": "Full stack developer",
  "avatar": "https://...",
  "graduation_year": 2025,
  "twitter_username": "johndoe",
  "github_username": "johndoe",
  "linkedin_username": "johndoe",
  "leetcode_username": "john_doe",
  "codeforces_username": "johndoe",
  "codechef_username": "johndoe",
  "gfg_username": "johndoe",
  "isPublic": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "bio": "Full stack developer",
    "profileCompleteness": 85,
    ...
  }
}
```

**Note:** Password and email cannot be updated through this endpoint.

---

### 5. **Delete User Account**
- **Method:** DELETE
- **Endpoint:** `/profile/:userId`
- **Description:** Permanently delete user account

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Password Management

### 6. **Update Password**
- **Method:** POST
- **Endpoint:** `/change-password/:userId`
- **Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Account Management

### 7. **Deactivate Account**
- **Method:** POST
- **Endpoint:** `/deactivate/:userId`
- **Description:** Deactivate user account (reversible)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

## User Listing & Discovery

### 8. **Get All Active Users**
- **Method:** GET
- **Endpoint:** `/list`
- **Description:** Get paginated list of all active users

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**URL Example:**
```
/list?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 15,
    "limit": 10
  },
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Software developer",
      "avatar": "https://...",
      "profileCompleteness": 80,
      ...
    }
  ]
}
```

---

### 9. **Get All Public Users**
- **Method:** GET
- **Endpoint:** `/list/public`
- **Description:** Get paginated list of users with public profiles

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:** Same format as endpoint #8

---

### 10. **Search Users**
- **Method:** GET
- **Endpoint:** `/search`
- **Description:** Search users by name, email, or platform usernames

**Query Parameters:**
- `query` (required): Search term

**URL Example:**
```
/search?query=john
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "leetcode_username": "john_doe",
      ...
    }
  ]
}
```

---

## Leaderboard

### 11. **Get Leaderboard**
- **Method:** GET
- **Endpoint:** `/leaderboard`
- **Description:** Get users ranked by competitive programming profiles

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**URL Example:**
```
/leaderboard?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "total": 75,
    "page": 1,
    "pages": 4,
    "limit": 20
  },
  "leaderboard": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "leetcode_username": "john_doe",
      "codeforces_username": "johndoe",
      "codechef_username": "johndoe",
      "gfg_username": "johndoe",
      "profileCompleteness": 100,
      ...
    }
  ]
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)",
  "errors": ["Field validation error 1", "Field validation error 2"] (optional)
}
```

### HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication failed |
| 403 | Forbidden - Account deactivated or access denied |
| 404 | Not Found - User not found |
| 409 | Conflict - Email already exists |
| 500 | Internal Server Error - Server error |

---

## Common Validation Rules

### Email
- Must be valid email format
- Must be unique
- Cannot be updated after creation

### Password
- Minimum 6 characters
- Gets automatically hashed before storage
- Cannot be retrieved, only compared

### Bio
- Maximum 500 characters

### Graduation Year
- Between 2020 and 2100

### Profile Completeness
- Auto-calculated based on filled fields:
  - bio
  - avatar
  - graduation_year
  - twitter_username
  - github_username
  - linkedin_username
  - leetcode_username
  - codeforces_username
  - codechef_username
  - gfg_username

---

## Frontend Integration Examples

### React Example - Register
```javascript
async function registerUser(name, email, password) {
  const response = await fetch('http://localhost:8000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password })
  });
  return await response.json();
}
```

### React Example - Login
```javascript
async function loginUser(email, password) {
  const response = await fetch('http://localhost:8000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('userId', data.user._id);
  }
  return data;
}
```

### React Example - Update Profile
```javascript
async function updateProfile(userId, updates) {
  const response = await fetch(`http://localhost:8000/api/users/profile/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  return await response.json();
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- User IDs are MongoDB ObjectIds (24 character hex strings)
- Passwords are never returned in any response
- Profile completeness is auto-calculated on profile updates
- Last login is updated on successful authentication
- Deactivated accounts cannot login but data is preserved
- All user endpoints require proper error handling on the frontend
