import express from  'express';
import { userLogin, userRegister } from '../controllers/userController.js';
import { validate, registerSchema } from '../utils/validator.js';



const router = express.Router();
router.route('/login').post(userLogin);
router.route('/register').post(validate.body(registerSchema), userRegister);



export default router