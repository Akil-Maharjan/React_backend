
import path from 'path';

const supExtType = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

export const checkFile = (req, res, next)=>{
   const image = req.files?.image;
  

   
   if(image){
   const extType = path.extname(image.name);
   const imagePath = `uploads/${image.name}`;
   if(supExtType.includes(extType)){
    
    image.mv(`./uploads/${image.name}`, (err)=>{
        if(err) res.status(500).json({message: `${err}`});
        req.imagePath = imagePath;
        next();
    });
    
   }
   else{
    res.status(400).json({message: 'Please provide valid Image'});
   } 
}
else{
    res.status(400).json({message: 'Please provide Image'})
   }
}
export const updateCheckFile = (req, res, next)=>{
    const image = req.files?.image;
    if(!image) return next();
     const extType = path.extname(image.name);
   const imagePath = `uploads/${image.name}`;
   if(supExtType.includes(extType)){
    
    image.mv(`./uploads/${image.name}`, (err)=>{
        if(err) res.status(500).json({message: `${err}`});
        req.imagePath = imagePath;
        next();
    });
    
   }
   else{
    res.status(400).json({message: 'Please provide valid Image'});
   } 
    

}