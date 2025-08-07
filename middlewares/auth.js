import jwt from 'jsonwebtoken';

export const userCheck = (req, res, next) => {
  const token = req.headers.token;

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

export const adminCheck = (req, res, next) => {
  if (req.role !== 'Admin') return res.status(403).json({ message: 'Access denied: Admin only' });
  next();
};
