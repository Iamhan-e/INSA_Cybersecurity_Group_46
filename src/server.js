// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARE ======
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== ROUTES ======
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/admin', adminRoutes);  // ✅ NEW ADMIN ROUTES

// ====== HEALTH CHECK ======
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ESP32 NAC Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ====== 404 HANDLER ======
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ====== START SERVER ======
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();