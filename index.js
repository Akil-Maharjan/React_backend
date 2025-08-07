import express from 'express';
import router from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Shop';

app.use(express.json());
app.use(cors());

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit example
}));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.use('/products', router);
app.use('/users', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });