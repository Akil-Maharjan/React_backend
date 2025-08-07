import express from 'express';
import router from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ override: false });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'https://my-react-app-taupe-six.vercel.app' }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use('/uploads', express.static('uploads')); // serve uploaded images

// Routes
app.use('/products', router);
app.use('/users', userRouter);

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server locally only
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// ✅ Vercel-compatible export
export default app;
