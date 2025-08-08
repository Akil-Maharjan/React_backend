import jwt from 'jsonwebtoken';

export const userCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

export const adminCheck = (req, res, next) => {
  if (req.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};