import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

// Load environment variables first
dotenv.config();

// Check for essential environment variables
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in your environment. Please create a .env file in the backend directory.');
  process.exit(1);
}

const app = express();

// ───────────────────────────────────────────
// 0. Malformed URL Guard (prevents path-to-regexp crash)
// ───────────────────────────────────────────
// This must come before any routes are defined to be effective.
// It blocks requests with paths that are known to crash the Express router.
app.use((req, res, next) => {
  console.log(`[Guard] Checking request path: ${req.path}`);
  if (req.path.includes('/:') || req.path.endsWith(':')) {
    console.error(`[Guard] Blocking invalid path: ${req.path}`);
    return res.status(400).json({ error: 'Bad Request: Invalid characters in URL path.'});
  }
  next();
});
// ───────────────────────────────────────────
// 1. Trust proxy & rate limiting
// ───────────────────────────────────────────
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ───────────────────────────────────────────
// 2. Security Middleware
// ───────────────────────────────────────────
app.use(helmet());

// ───────────────────────────────────────────
// 3. CORS Setup
// ───────────────────────────────────────────
app.use(cors({
  origin: ['https://my-react-app-taupe-six.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// ───────────────────────────────────────────
// 4. Body Parsing & File Upload
// ───────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// ───────────────────────────────────────────
// 5. Database Connection with Retry
// ───────────────────────────────────────────
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      retryWrites: true,
      writeConcern: { w: 'majority' }
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();




// ───────────────────────────────────────────
// 6. Routes
// ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Backend is working',
    endpoints: {
      api: '/api/*',
      health: '/api/health'
    }
  });
});

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ───────────────────────────────────────────
// 7. 404 Handler for unknown routes
// ───────────────────────────────────────────
app.all('*', (req, res, next) => {
  res.status(404).json({ error: `Not Found - Cannot ${req.method} ${req.originalUrl}` });
});

// ───────────────────────────────────────────
// 8. Error Handling (last middleware)
// ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err); // Log full error object
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
// ───────────────────────────────────────────
// 9. Start Server
// ───────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

export default app;
