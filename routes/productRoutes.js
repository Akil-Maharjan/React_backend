import express from 'express';
import { addProduct, getProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { checkFile, updateCheckFile } from '../middlewares/checkFIle.js';
import { adminCheck, userCheck } from '../middlewares/auth.js';
import { validate, productSchema } from '../utils/validator.js';



const router = express.Router();

router.route('/').get(getProducts).post(userCheck, adminCheck, validate.body(productSchema), checkFile, addProduct);
router.route('/:id').get(getProduct).patch(userCheck, adminCheck, updateCheckFile, updateProduct).delete(userCheck, adminCheck, deleteProduct);


export default router;