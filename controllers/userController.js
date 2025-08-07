import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




export const userLogin = async(req, res)=>{
  const{username, email, password} = req.body;
  try{
      const user = await User.findOne({email});
      if(!user) return res.status(400).json({message: 'Invalid email'});
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({message: 'Invalid password'});
      const token = jwt.sign({id: user._id, role: user.role }, process.env.JWT_SECRET);
      return res.status(200).json({token,
        message: `Welcome ${user.username}`

      });
      
      
  }
  catch(err){
     return res.status(500).json({message : `${err}`})
  }
}

export const userRegister = async (req, res)=>{
    const {username, email, password} = req.body;
  try{
    const isExist = await User.findOne({email});
    if(isExist) return res.status(400).json({message: 'User already exist'});
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password : hash
    })
    return res.status(200).json({message: 'user registered'})
  }
  catch(err){
   return res.status(500).json({message : `${err}`})
  
  }
}