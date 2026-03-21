const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
};

const optionalAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) { try { const d = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(d.id); } catch {} }
  next();
};

module.exports = { authenticate, optionalAuth };
