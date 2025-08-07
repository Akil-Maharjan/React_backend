import express from 'express';
import router from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config({ override: false }); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });
  

app.use(express.json());
app.use(cors({origin: 'https://my-react-app-taupe-six.vercel.app'}));
app.get('/favicon.ico', (req, res) => res.status(204).end());
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
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});




if (process.env.VERCEL !== '1') {
  
    console.log(`Local server on port ${PORT}`);
}
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

  export default app;