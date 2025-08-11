import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env vars first

import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Firebase must be imported after env vars are loaded
import bucket from './utils/firebaseAdmin.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

// Check essential env vars
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is missing. Please set it in .env.');
  process.exit(1);
}

const app = express();

// ───────────────────────────────────────────
// 0. Malformed URL Guard
// ───────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.includes('/:') || req.path.endsWith(':')) {
    console.error(`Blocking invalid path: ${req.path}`);
    return res.status(400).json({ error: 'Invalid characters in URL path.' });
  }
  next();
});

// ───────────────────────────────────────────
// 1. Trust proxy & rate limiting
// ───────────────────────────────────────────
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
}));

// ───────────────────────────────────────────
// 2. Security Middleware
// ───────────────────────────────────────────
app.use(helmet());

// ───────────────────────────────────────────
// 3. CORS Setup - Dynamic origin & full options
// ───────────────────────────────────────────
const allowedOrigins = [
  'https://my-react-app-taupe-six.vercel.app', 
  'http://localhost:5173',
  'https://my-react-ac5khiwo4-akils-projects-5424d5f4.vercel.app',
  'https://my-react-app-git-main-akils-projects-5424d5f4.vercel.app' // add your actual frontend deployed URL here
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

// ───────────────────────────────────────────
// 4. Logging middleware (moved up)
// ───────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

// ───────────────────────────────────────────
// 5. Body Parsing & File Upload
// ───────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// ───────────────────────────────────────────
// 6. Database Connection with Retry
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
// 7. Routes
// ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Backend is working',
    endpoints: { api: '/api/*', health: '/api/health' }
  });
});
   

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ───────────────────────────────────────────
// 8. 404 Handler (optional)
// ───────────────────────────────────────────
// app.all('*', (req, res) => {
//   res.status(404).json({ error: `Not Found - Cannot ${req.method} ${req.originalUrl}` });
// });

// ───────────────────────────────────────────
// 9. Error Handling
// ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS error: Access denied from this origin.' });
  }
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// ───────────────────────────────────────────
// 10. Start Server
// ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
