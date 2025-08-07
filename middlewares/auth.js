import jwt from 'jsonwebtoken';


export const userCheck = (req, res, next)=>{
    const token = req.headers.token;
    const decode = jwt.decode(token, 'secret');
    if(!decode) return res.status(401).json({message: 'Unauthorized'});
    req.userId = decode.id;
    req.role =decode.role;
    next();

}

export const adminCheck =(req, res, next)=>{
    if(req.role !== 'Admin') return res.status(401).json({message: 'Unauthorized'});
    next();
}