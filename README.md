# CodeSync Backend Server

A comprehensive RESTful API for the CodeSync competitive programming learning platform.

## Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 2. Installation

```bash
cd codesync/server
npm install
```

### 3. Configuration

Create/update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/codesync
PORT=8000
NODE_ENV=development
```

### 4. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 5. Seed Database

```bash
npm run seed:db
```

---

##  Project Structure

```
server/
├── index.js                    # Main application entry
├── package.json                # Dependencies
├── .env                        # Environment variables
│
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── config.js           # App configuration
│   │
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling
│   │   └── logger.js           # Request logging
│   │
│   ├── users/
│   │   ├── model.js            # User schema (Mongoose)
│   │   ├── controllers.js      # Business logic (11 functions)
│   │   └── routes.js           # User endpoints
│   │
│   ├── routes.js               # Main router
│   └── [other modules...]
│
├── scripts/
│   └── seed.js                 # Database seeding
│
├── Documentation Files:
├── API_DOCUMENTATION.md        # Detailed API reference
├── ROUTES_SUMMARY.md           # Routes overview
├── MONGODB_SETUP.md            # MongoDB setup guide
├── SERVER_SETUP_GUIDE.md       # Complete setup guide
├── ARCHITECTURE.md             # System architecture
├── README.md                   # This file
└── quickstart.sh               # Quick start script
```

---

## Configuration

### Environment Variables

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/codesync
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codesync

# CORS
CORS_ORIGIN=*

# JWT (future use)
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d

# External APIs
GEMINI_API_KEY=your_api_key

# Email
MAIL_USER=your_email
MAIL_USER_PASSWORD=your_password
MAIL_USER_EMAIL=your_email

# Logging
LOG_LEVEL=debug
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Create new user |
| POST | `/api/users/login` | Login user |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile/:userId` | Get user profile |
| PATCH | `/api/users/profile/:userId` | Update profile |
| DELETE | `/api/users/profile/:userId` | Delete account |

### Password
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/change-password/:userId` | Change password |

### Account
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/deactivate/:userId` | Deactivate account |

### Discovery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/list` | All active users (paginated) |
| GET | `/api/users/list/public` | Public users (paginated) |
| GET | `/api/users/search?query=...` | Search users |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/leaderboard` | Competitive programming rankings |

---

## Security Features

**Password Security**
- Hashed with bcryptjs (10 rounds)
- Never returned in responses
- Compared securely on login

**Data Validation**
- Email format validation
- Password minimum length (6 chars)
- Bio max length (500 chars)
- Graduation year range (2020-2100)

**Database Security**
- Email unique constraint
- Schema validation
- Mongoose pre-save hooks
- Proper error handling

**API Security**
- CORS enabled
- Input sanitization
- No sensitive data in errors
- Proper HTTP status codes

---

## Usage Examples

### Register User

```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:8000/api/users/profile/USER_ID
```

### Update Profile

```bash
curl -X PATCH http://localhost:8000/api/users/profile/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Software engineer",
    "twitter_username": "johndoe",
    "leetcode_username": "john_doe"
  }'
```

### Search Users

```bash
curl -X GET "http://localhost:8000/api/users/search?query=john"
```

### List Users (Paginated)

```bash
curl -X GET "http://localhost:8000/api/users/list?page=1&limit=10"
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized (auth failed) |
| 403 | Forbidden (account deactivated) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field error 1", "Field error 2"],
  "error": "Detailed error (dev mode only)"
}
```

---

## Available Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start                # Start server

# Database
npm run seed:db          # Seed with sample users
npm run seed:clean       # Clear all users

# Monitoring
curl http://localhost:8000/health  # Health check
curl http://localhost:8000         # Home page
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `API_DOCUMENTATION.md` | Complete API reference |
| `ROUTES_SUMMARY.md` | Routes and controller overview |
| `MONGODB_SETUP.md` | MongoDB setup & troubleshooting |
| `SERVER_SETUP_GUIDE.md` | Full server setup guide |
| `ARCHITECTURE.md` | System architecture & data flows |
| `quickstart.sh` | Quick start script |

---

## 🧪 Testing

### Using Postman

1. Create new requests for each endpoint
2. Set base URL: `http://localhost:8000/api`
3. Test authentication flow
4. Save user ID after login for profile operations

### Using cURL

See "Usage Examples" section above.

### Using MongoDB Compass

1. Connect to `mongodb://localhost:27017`
2. Browse `codesync` database
3. View `users` collection
4. See all documents and run queries

---

## Middleware Stack

1. **Body Parser** - Parse JSON/URL-encoded bodies
2. **CORS** - Cross-origin resource sharing
3. **Logger** - Log all requests
4. **Router** - Route to appropriate handler
5. **Error Handler** - Catch and format errors

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "user": { /* user data */ },
  "pagination": { /* if applicable */ }
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["error1", "error2"]
}
```

---

## Troubleshooting

### MongoDB Connection Failed
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongodb            # Linux
```

### Port Already in Use
```bash
lsof -ti:8000 | xargs kill -9
PORT=3000 npm start
```

### Dependencies Not Found
```bash
npm install
```

### .env File Not Found
```bash
# Create in server root
cp .env.example .env
# or create manually
```

---

## Contributing

When adding new features:
1. Create controllers with proper error handling
2. Add middleware if needed
3. Update routes
4. Test with Postman/cURL
5. Update documentation

---

## Support

For issues or questions:
1. Check documentation files
2. Review error messages in console
3. Check MongoDB connection
4. Verify .env configuration
5. Test endpoints with Postman

---

## License

ISC

---


## Key Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **axios** - HTTP requests
- **nodemailer** - Email sending

