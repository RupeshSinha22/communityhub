# CommunityHub - Local Social Platform for Neighborhoods

A modern full-stack application for communities to connect, share, and collaborate locally.

## 🚀 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** (@tanstack/react-query) - Data fetching & caching
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Express.js** - REST API framework
- **Node.js** - JavaScript runtime
- **UUID** - Unique identifier generation
- **Joi** - Data validation
- **Morgan** - HTTP logging

## 📁 Project Structure

```
communityhub/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client & endpoints
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # Context API (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                  # Express backend application
    ├── src/
    │   ├── config/          # Configuration files
    │   ├── controllers/     # Business logic
    │   ├── middlewares/     # Express middlewares
    │   ├── models/          # Data models
    │   ├── routes/          # API routes
    │   ├── utils/           # Utility functions
    │   └── index.js         # Main server file
    ├── package.json
    ├── .env                 # Environment variables
    └── .gitignore
```

## 🎯 Core Features

### Authentication
- User registration with validation
- JWT-based login
- Protected routes
- User profiles with bio and avatar

### Communities
- Create new communities
- Browse all communities
- Join/leave communities
- View community members
- Community categories

### Posts & Content
- Create posts in communities
- Like/unlike posts
- View feed from joined communities
- Edit and delete own posts

### Social
- User profiles
- Community discovery
- Real-time interaction

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created with defaults):
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

4. Start development server:
```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/profile/:userId` - Get user profile
- `PATCH /api/users/profile` - Update profile

### Communities
- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create community
- `GET /api/communities/:id` - Get community details
- `PATCH /api/communities/:id` - Update community
- `DELETE /api/communities/:id` - Delete community
- `POST /api/communities/:id/join` - Join community
- `POST /api/communities/:id/leave` - Leave community

### Posts
- `GET /api/posts/feed` - Get user's feed
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post
- `GET /api/posts/community/:id` - Get community posts

## 🔐 Authentication Flow

1. User registers with email, password, and basic info
2. Backend validates and stores user
3. JWT token generated and returned
4. Token stored in localStorage
5. Token sent in Authorization header for protected requests
6. Backend verifies token on each protected route

## 🎨 Frontend Pages

- **Login** - User login page
- **Register** - User registration page
- **Home** - Feed with posts from joined communities
- **Communities** - Browse and join communities
- **Create Community** - Form to create new community
- **Profile** - View user profile information

## 🚀 Next Steps (Future Enhancements)

1. **Database Integration**
   - PostgreSQL connection
   - Prisma ORM setup
   - Database migrations

2. **Real-time Features**
   - WebSocket integration for notifications
   - Redis for caching and pub/sub
   - Real-time post updates

3. **Advanced Features**
   - Comments on posts
   - Event creation
   - Polls/voting
   - Image uploads to S3
   - Moderation system
   - Audit logs

4. **Infrastructure**
   - Docker containerization
   - Kubernetes deployment
   - CI/CD with GitHub Actions
   - ArgoCD for GitOps
   - Monitoring with Prometheus & Grafana
   - Logging with ELK/Loki

5. **Security**
   - OAuth2 integration
   - Rate limiting
   - CORS refinement
   - Secrets management
   - Input sanitization

6. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

## 📝 Development Notes

### Mock Data
Currently using in-memory storage with Maps for rapid development. This will be replaced with PostgreSQL when database setup is implemented.

### Error Handling
- Validation errors from Joi
- JWT authentication errors
- Custom application errors
- Centralized error handling middleware

### Logging
- Morgan for HTTP request logging
- Custom request logger middleware
- Structured error logging

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for local communities**
