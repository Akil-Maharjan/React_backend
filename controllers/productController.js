import Product from "../models/Product.js";
import fs from 'fs/promises';
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addProduct = async (req, res) => {
  const { title, description, price, category, brand, stock } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      brand,
      stock,
      image: req.imagePath || null,
    });

    await newProduct.save();
    return res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    if (req.imagePath) {
      try {
        await fs.unlink(`./${req.imagePath}`);
      } catch (unlinkErr) {
        console.error(`Error deleting file: ${unlinkErr}`);
      }
    }
    return res.status(500).json({ err: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    product.title = req.body?.title || product.title;
    product.description = req.body?.description || product.description;
    product.price = req.body?.price || product.price;
    product.category = req.body?.category || product.category;
    product.brand = req.body?.brand || product.brand;
    product.stock = req.body?.stock || product.stock;

    if (req.imagePath) {
      try {
        await fs.unlink(`./${product.image}`);
      } catch (err) {
        console.error(`Error deleting old image: ${err}`);
      }
      product.image = req.imagePath;
    }

    await product.save();
    return res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      try {
        await fs.unlink(`./${product.image}`);
      } catch (err) {
        console.error(`Error deleting image: ${err}`);
      }
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
