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


app.use(express.json());
app.use(cors({origin: 'https://my-react-app-taupe-six.vercel.app/'}));

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

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


  export default app;