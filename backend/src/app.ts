import dotenv from 'dotenv';
// Load environment variables early
dotenv.config();

import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import securityRoutes from './routes/security';
import reportRoutes from './routes/reports';
import aiRoutes from './routes/ai';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Base Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'OnboardIQ AI API Service',
    databaseMode: require('./db').db.isMocked() ? 'In-Memory (Mock Fallback)' : 'PostgreSQL (Prisma)'
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('OnboardIQ AI Backend Running Successfully 🚀');
});

export default app;
