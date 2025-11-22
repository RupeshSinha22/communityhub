# 🏘️ CommunityHub - Complete Developer Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
6. [Project Structure](#project-structure)
7. [Development Workflow](#development-workflow)
8. [Roadmap](#roadmap)

---

## 🎯 Project Overview

**CommunityHub** is a modern full-stack social platform enabling local neighborhoods to connect, share content, and build community. Built with React frontend and Express.js backend, it provides features for user authentication, community management, and social interactions.

### Vision
Create a platform where neighbors can:
- Connect with local communities
- Share posts and updates
- Discover and join communities
- Build meaningful local relationships

---

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI library |
| Vite | 5+ | Build tool & dev server |
| Tailwind CSS | 3+ | Utility-first CSS |
| React Query | 5+ | Data fetching & caching |
| React Router | 6+ | Client-side routing |
| Axios | 1+ | HTTP client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4.18+ | Web framework |
| Node.js | 16+ | Runtime |
| Joi | 17+ | Data validation |
| UUID | 9+ | Unique IDs |
| Morgan | 1.10+ | HTTP logging |
| Dotenv | 16+ | Environment variables |

### Current Data Storage
- **In-memory Maps** (for rapid development)
- Ready for PostgreSQL migration

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- npm 7+ (comes with Node.js)
- Git (optional but recommended)

### Step 1: Clone/Navigate to Project
```bash
cd communityhub
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Environment Configuration

Backend already has `.env` file. For frontend, default settings work for development.

**Backend .env** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h
```

---

## 🚀 Running the Application

### Option 1: Manual (Two Terminal Windows)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs at `http://localhost:5000`

**Terminal 2 - Frontend (new terminal):**
```bash
cd frontend
npm run dev
```
✅ Frontend runs at `http://localhost:5173`

### Option 2: Using Startup Scripts

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 3: Production Build

**Backend:**
```bash
npm start  # runs src/index.js directly
```

**Frontend:**
```bash
npm run build   # creates optimized build
npm run preview # preview production build
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "avatar": null,
    "bio": ""
  }
}
```

### User Endpoints

#### Get All Users
```http
GET /users
```

#### Get User Profile
```http
GET /users/profile/:userId
```

#### Update User Profile
```http
PATCH /users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "bio": "I love my community!",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Community Endpoints

#### Get All Communities
```http
GET /communities
```

**Response:**
```json
{
  "communities": [
    {
      "id": "uuid",
      "name": "Downtown Neighbors",
      "description": "A place for downtown residents",
      "category": "general",
      "createdBy": "uuid",
      "members": ["uuid1", "uuid2"],
      "moderators": ["uuid"],
      "isPrivate": false,
      "createdAt": "2025-11-22T...",
      "updatedAt": "2025-11-22T..."
    }
  ]
}
```

#### Create Community
```http
POST /communities
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Downtown Neighbors",
  "description": "A place for downtown residents to connect",
  "category": "general",
  "isPrivate": false
}
```

#### Get Community
```http
GET /communities/:communityId
```

#### Update Community
```http
PATCH /communities/:communityId
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Delete Community
```http
DELETE /communities/:communityId
Authorization: Bearer YOUR_TOKEN
```

#### Join Community
```http
POST /communities/:communityId/join
Authorization: Bearer YOUR_TOKEN
```

#### Leave Community
```http
POST /communities/:communityId/leave
Authorization: Bearer YOUR_TOKEN
```

### Post Endpoints

#### Create Post
```http
POST /posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "content": "Hello neighbors! Great to be part of this community.",
  "communityId": "uuid",
  "attachments": []
}
```

#### Get User Feed
```http
GET /posts/feed
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "content": "Post content...",
      "authorId": "uuid",
      "communityId": "uuid",
      "likes": ["uuid1", "uuid2"],
      "comments": [],
      "createdAt": "2025-11-22T...",
      "updatedAt": "2025-11-22T...",
      "author": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "avatar": null
      }
    }
  ]
}
```

#### Get Community Posts
```http
GET /posts/community/:communityId
```

#### Like Post
```http
POST /posts/:postId/like
Authorization: Bearer YOUR_TOKEN
```

#### Unlike Post
```http
DELETE /posts/:postId/like
Authorization: Bearer YOUR_TOKEN
```

---

## 📁 Project Structure

```
communityhub/
│
├── backend/                          # Express.js server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuration settings
│   │   ├── controllers/             # Business logic
│   │   │   ├── auth.js              # Auth handlers
│   │   │   ├── user.js              # User handlers
│   │   │   ├── community.js         # Community handlers
│   │   │   └── post.js              # Post handlers
│   │   ├── middlewares/             # Express middleware
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── logger.js            # Request logging
│   │   ├── models/
│   │   │   └── index.js             # Data models
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── community.js
│   │   │   └── post.js
│   │   ├── utils/
│   │   │   ├── auth.js              # JWT & crypto utilities
│   │   │   └── validation.js        # Joi validation schemas
│   │   └── index.js                 # Server entry point
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js            # Axios configuration
│   │   │   └── endpoints.js         # API function wrappers
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── CommunityCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Auth hook
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CommunityPage.jsx
│   │   │   ├── CreateCommunityPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── PROJECT_SUMMARY.md                # Project summary
├── DEVELOPER_GUIDE.md                # This file
├── start.bat                         # Windows startup script
├── start.sh                          # Linux/Mac startup script
└── .gitignore

```

---

## 💡 Development Workflow

### Adding a New Feature

1. **Create Backend Endpoint**
   - Add controller in `backend/src/controllers/`
   - Add route in `backend/src/routes/`
   - Add validation schema in `backend/src/utils/validation.js` if needed

2. **Create Frontend Components**
   - Add page/component in `frontend/src/pages/` or `frontend/src/components/`
   - Add API function in `frontend/src/api/endpoints.js`
   - Import and use in your component

3. **Test**
   - Test endpoint with curl/Postman
   - Test UI in browser
   - Check console for errors

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Common Tasks

**Add a new API endpoint:**
1. Create controller function
2. Add route
3. Test with curl
4. Create frontend wrapper
5. Use in component

**Add a new page:**
1. Create page component in `pages/`
2. Add route in `App.jsx`
3. Create any needed API functions
4. Create supporting components

**Update validation:**
1. Edit `backend/src/utils/validation.js`
2. Add new Joi schema
3. Use in controller with `schema.validate(data)`

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- User registration & authentication
- Community management
- Posts & feed
- User profiles

### Phase 2: Real-time Features (Next)
- WebSocket notifications
- Redis caching
- Real-time updates

### Phase 3: Advanced Features
- Comments on posts
- Events and polls
- Image uploads (S3)
- Moderation tools
- Audit logs

### Phase 4: Infrastructure
- PostgreSQL database
- Prisma ORM
- Docker containers
- Kubernetes deployment
- GitHub Actions CI/CD
- ArgoCD GitOps

### Phase 5: Monitoring & Security
- Prometheus metrics
- Grafana dashboards
- Jaeger tracing
- Loki logging
- Rate limiting
- OAuth2 integration

---

## 🐛 Troubleshooting

### Backend won't start
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Port 5000 is in use. Either:
- Kill process on port 5000
- Change PORT in `.env`

### Frontend can't connect to backend
**Solution:** Verify:
- Backend is running on 5000
- Frontend API URL is correct in `api/client.js`
- CORS is configured in `backend/src/index.js`

### JWT token expired
**Solution:** Login again to get a new token. Tokens expire after 24h by default.

### Database connection error
**Solution:** Current setup uses in-memory storage. No database setup required yet.

---

## 📚 Useful Commands

```bash
# Backend
npm run dev        # Start development server
npm start          # Start production server
npm test           # Run tests (when configured)
npm run lint       # Lint code

# Frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint React code
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "feat: add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

---

## 📄 License

MIT License - Free to use for personal or commercial projects

---

## 📞 Support

For issues or questions:
1. Check existing issues
2. Create new issue with details
3. Include error messages and steps to reproduce

---

**Happy Coding! 🎉**

Built with ❤️ for local communities

Last Updated: November 22, 2025
