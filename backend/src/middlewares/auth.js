import { verifyToken } from '../utils/auth.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    // Will be implemented with role-based access control
    next();
  };
};
