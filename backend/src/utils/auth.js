import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'y8934792';
  console.log('Generating token with secret:', secret ? '✓ set' : '✗ not set');
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'y8934792';
  return jwt.verify(token, secret);
};

export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const comparePassword = (password, hash) => {
  return hashPassword(password) === hash;
};

export const generateId = () => {
  return crypto.randomBytes(16).toString('hex');
};
