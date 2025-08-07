import express from 'express';
import router from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';



const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://rubik:rubik@cluster0.8hfwnjx.mongodb.net/Shop',).then((val) => {
  app.listen(PORT, () => {
    console.log(`Connected to MongoDB and server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.log(err);
})

app.get('/', (req, res) => {
   res.status(200).json({message: 'Hello World'})
}); 

app.use(fileUpload({
  // limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use('/products', router);
app.use('/users', userRouter);

