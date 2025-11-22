# CommunityHub - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Step 1: Start Backend Server

```bash
cd backend
npm run dev
```

✅ Backend will start on `http://localhost:5000`

The API will be available at `http://localhost:5000/api`

Health check: `http://localhost:5000/health`

### Step 2: Start Frontend Server (in new terminal)

```bash
cd frontend
npm run dev
```

✅ Frontend will start on `http://localhost:5173`

### Step 3: Open in Browser

Navigate to `http://localhost:5173`

## 📝 Test the Application

### 1. Register a New User
- Click "Register" or go to `/register`
- Fill in the form with:
  - First Name: John
  - Last Name: Doe
  - Username: johndoe
  - Email: john@example.com
  - Password: password123

### 2. Create a Community
- Click "Create Community" button
- Fill in:
  - Name: Downtown Neighbors
  - Description: A place for downtown residents to connect and share
  - Category: General

### 3. Browse Communities
- Go to "Communities" page
- Click "Join Community" on any community

### 4. View Feed
- Go to home page
- You should see posts from communities you've joined

### 5. Create a Post
- Currently posts can be created via API
- Future: Create post form will be added to UI

## 🔗 API Testing

### Using curl or Postman:

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Current User (requires token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create Community (requires token)
```bash
curl -X POST http://localhost:5000/api/communities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Community",
    "description": "Test community description",
    "category": "general"
  }'
```

## 📁 File Structure Quick Reference

```
backend/src/
├── index.js              # Main server entry point
├── config/               # Configuration
├── controllers/          # Business logic
│   ├── auth.js
│   ├── user.js
│   ├── community.js
│   └── post.js
├── middlewares/          # Express middlewares
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js
│   └── logger.js
├── models/              # Data models (currently in-memory)
│   └── index.js
├── routes/              # API routes
│   ├── auth.js
│   ├── user.js
│   ├── community.js
│   └── post.js
└── utils/               # Utilities
    ├── auth.js          # JWT & password utilities
    └── validation.js    # Joi schemas

frontend/src/
├── api/                 # API client
│   ├── client.js       # Axios instance
│   └── endpoints.js    # API functions
├── components/         # React components
│   ├── Navbar.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── PostCard.jsx
│   └── CommunityCard.jsx
├── context/           # React context
│   └── AuthContext.jsx
├── hooks/             # Custom hooks
│   └── useAuth.js
├── pages/             # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── CommunityPage.jsx
│   ├── CreateCommunityPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Tailwind CSS
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h
```

### Frontend
- Uses default API URL: `http://localhost:5000/api`
- Can be overridden with `VITE_API_URL` environment variable

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is in use
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

### Frontend won't start
- Check if port 5173 is in use
- Clear node_modules and reinstall
- Check that backend is running on 5000

### API calls failing
- Check browser console for errors
- Verify token is being sent in Authorization header
- Check backend logs for validation errors

### CORS issues
- Backend allows requests from `http://localhost:5173`
- Modify CORS settings in `backend/src/index.js` if needed

## 📚 Learn More

See [README.md](./README.md) for comprehensive documentation.

## ✨ Next Features Coming Soon

- Database integration (PostgreSQL)
- Comments on posts
- Real-time notifications
- Image uploads
- User search
- Direct messaging
- Events and polls
- Moderation tools

---

Happy coding! 🎉
