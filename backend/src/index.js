import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { initializeMinIO } from './config/minio.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import communityRoutes from './routes/community.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'CommunityHub API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      communities: '/api/communities',
      posts: '/api/posts',
      health: '/health'
    }
  });
});

app.get('/debug-db', async (req, res) => {
  try {
    const dbInfo = await sequelize.query("SELECT current_database() AS db, current_schema() AS schema;");
    const recentUsers = await sequelize.query("SELECT * FROM users ORDER BY created_at DESC LIMIT 3;");
    const recentCommunities = await sequelize.query("SELECT * FROM communities ORDER BY created_at DESC LIMIT 3;");
    res.json({
      dbInfo: dbInfo[0][0],
      recentUsers: recentUsers[0],
      recentCommunities: recentCommunities[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling
app.use(errorHandler);

// Database sync and server start
sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database synchronized');
  
  // Initialize MinIO
  try {
    await initializeMinIO();
  } catch (err) {
    console.warn('⚠️  MinIO initialization warning:', err.message);
    // Don't exit, just warn
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 API at http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
  process.exit(1);
});

