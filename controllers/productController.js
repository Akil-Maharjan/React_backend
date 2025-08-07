import Product from "../models/Product.js";
import fs from 'fs';
import mongoose from "mongoose";

export const getProducts =async (req, res)=>{
 
 try{
    const products = await Product.find({});
    return res.status(200).json({products})
 }
 catch(err) {
   return res.status(500).json({err : `${err}`})
 }
}
export const getProduct =(req, res)=>{
    const {id} = req.params;
    
return res.status(200).json({
    message: 'single product'
})
}
export const addProduct =async (req, res)=>{
 
  const {title, description, price, category, brand, stock} = req.body;
    try{
      await Product.create({
        title,
        description,
        price,
        category,
        brand ,
        stock,
        image : req.imagePath
      })
 return res.status(200).json({
      message : "Product added"
    })
    }
    catch(err){
      // If a file was uploaded, attempt to delete it since DB insertion failed.
      if (req.imagePath) {
        fs.unlink(`./${req.imagePath}`, (unlinkErr) => {
          if (unlinkErr) console.log(`Error deleting file on failed product creation: ${unlinkErr}`);
        });
      }
      return res.status(500).json({err : `${err}`});
    }
}

export const updateProduct = async (req, res)=>{
    const {id} = req.params;
    
     try{
       if(!mongoose.isValidObjectId(id)){
        return res.status(404).json({
          message : "Invalid Product id"
        })
      }
      const product = await Product.findById(id);
      if(!product) return res.status(404).json({
        message : "Product not found"
      })
      product.title = req.body?.title || product.title;
      product.description = req.body?.description || product.description;
      product.price = req.body?.price || product.price;
      product.category = req.body?.category || product.category;
      product.brand = req.body?.brand || product.brand;
      product.stock = req.body?.stock || product.stock;
      
      if(req.imagePath){
        fs.unlink(`./${product.image}`, async (err) => {
        product.image =  req.imagePath;
        if (err)
        return res.status(404).json({
          message : `${err}`})
        await product.save();
       return res.status(200).json({
        message : "Product updated"
      })
        
        
      });
      }
      else{
        await product.save();
        return res.status(200).json({
          message : "Product updated"
        })
        
      }
    }
    catch(err){
       return res.status(400).json({message : `${err}`});
    }
  }


export const deleteProduct =async (req, res)=>{
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
      return res.status(404).json({
        message : "Invalid Product id"
      })
    }
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        message : "Product not found"
      })
    }
    fs.unlink(`./${product.image}`, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`); 
      }
    });
    await Product.findByIdAndDelete(id)
  return res.status(200).json({
    message : "Product deleted"
  })
}