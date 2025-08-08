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

const app = express();

// ───────────────────────────────────────────
// 1. Early request path validation
// ───────────────────────────────────────────
app.use((req, res, next) => {
  try {
    if (req.originalUrl.includes('git.new')) {
      console.error('❌ Invalid route detected:', req.originalUrl);
      return res.status(400).json({ error: 'Invalid request path' });
    }
    next();
  } catch (err) {
    console.error('❌ Path validation error:', err);
    return res.status(400).json({ error: 'Bad request' });
  }
});

// ───────────────────────────────────────────
// 2. Trust proxy & rate limiting
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
// 3. Security Middleware
// ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.options('*', cors()); // Handle preflight

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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
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
// 7. Error Handling
// ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ───────────────────────────────────────────
// 8. Serverless-friendly export
// ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
