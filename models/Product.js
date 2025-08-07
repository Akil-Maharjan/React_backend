import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
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
      "Nike",
      "Adidas",
      "Reebok",
      "Puma",
      "Converse",
      "Dell",
      "Acer",
      "MacBook",
      "iPhone",
      "Samsung",
      "Sony",
      "Apple",
      "Gucci",
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
