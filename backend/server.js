import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Middleware & Routers
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import problemRoutes from './routes/problems.js';
import aiRoutes from './routes/ai.js';
import roomRoutes from './routes/rooms.js';
import adminRoutes from './routes/admin.js';

// Configuration & Utils
import { configureSocket } from './config/socket.js';
import Achievement from './models/Achievement.js';
import { seedSampleProblems } from './controllers/problems.js';

// Load variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Configure Socket.IO
configureSocket(io);

// Security and Logging Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts / canvas styles in dev
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', apiLimiter);

// Database Seeding
const seedAchievements = async () => {
  try {
    const count = await Achievement.countDocuments();
    if (count > 0) return;
    const list = [
      {
        achievementId: 'first_solve',
        title: 'First Solve',
        description: 'Successfully complete a coding problem.',
        badgeIcon: 'Award',
        xpReward: 50,
        coinsReward: 10,
        criteriaType: 'problems',
        criteriaValue: 1
      },
      {
        achievementId: 'streak_3',
        title: 'Streak Explorer',
        description: 'Maintain a 3-day learning streak.',
        badgeIcon: 'Zap',
        xpReward: 100,
        coinsReward: 25,
        criteriaType: 'streak',
        criteriaValue: 3
      },
      {
        achievementId: 'streak_7',
        title: 'Streak Master',
        description: 'Maintain a 7-day learning streak.',
        badgeIcon: 'Flame',
        xpReward: 200,
        coinsReward: 50,
        criteriaType: 'streak',
        criteriaValue: 7
      },
      {
        achievementId: 'visualizer_5',
        title: 'Visualizer Explorer',
        description: 'Visualize 5 different algorithms.',
        badgeIcon: 'Eye',
        xpReward: 100,
        coinsReward: 20,
        criteriaType: 'visualizer',
        criteriaValue: 5
      }
    ];
    await Achievement.create(list);
    console.log('Default achievements seeded successfully!');
  } catch (err) {
    console.error('Error seeding achievements:', err);
  }
};

// Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: `${Math.round(process.uptime())}s`,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use(errorHandler);

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dsa-animator';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully');
    
    // Seed achievements & problems
    await seedAchievements();
    await seedSampleProblems();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Global crash prevention hooks
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err?.message || err}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err?.message || err}`);
});
