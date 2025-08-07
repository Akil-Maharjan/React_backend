import { timeStamp } from "console";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // min : [3, 'Title must be at least 3 characters long'],
    // max : [100, 'Title must be at most 100 characters long'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Men's Clothing",
      "Women's Clothing",
      "Electronics",
      "Jewelery",
      "Shoes",
      "Watches",
      "Bags",
    ],
    required: true,
  },
  brand: {
    type: String,
    enum: [
      "nike",
      "adidas",
      "reebok",
      "puma",
      "converse",
      "dell",
      "acer",
      "macbook",
      "iphone",
      "samsung",
      "sony",
      "apple",
      "gucci",
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;