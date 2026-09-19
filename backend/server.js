import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';

import path from 'path';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import campusGuideRoutes from './routes/campusGuideRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import v3AcademicRoutes from './routes/v3AcademicRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CampusOne Shared REST API',
    version: '3.0.0',
    timestamp: new Date()
  });
});

// API Routes
import facultyRequestRoutes from './routes/facultyRequestRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/campus-guide', campusGuideRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/faculty-requests', facultyRequestRoutes);
app.use('/api/productivity', taskRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/notifications', notificationRoutes);

import { getStudentResults } from './controllers/academicCoreController.js';
import { protect } from './middleware/auth.js';

// CampusOne V3 Routes
app.use('/api/v3/academics', v3AcademicRoutes);
app.get('/api/student/results', protect, getStudentResults);




// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and Seed Database
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CampusOne Shared REST API running on port ${PORT}`);
    console.log(`👉 Base API: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

startServer();
