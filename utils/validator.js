import Joi from 'joi';
import joiValidator from 'express-joi-validation';



export const validate = joiValidator.createValidator({});

export const productSchema = Joi.object({
    title : Joi.string().min(3).max(100).required(),
    description : Joi.string().required(),
    price : Joi.number().required(),
category : Joi.string().valid('Men\'s Clothing', 'Women\'s Clothing', 'Electronics', 'Jewelery', 'Shoes', 'Watches', 'Bags').required(),
brand : Joi.string().valid('nike', 'adidas', 'reebok', 'puma', 'converse', 'dell', 'acer', 'macbook', 'iphone', 'samsung', 'sony', 'apple', 'gucci').required(),
stock : Joi.number().required(),

});


export const registerSchema = Joi.object({
    username : Joi.string().alphanum().min(3).max(30).required(),
    email : Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'string.min': 'Password must be at least 8 characters long.'
        }),
})