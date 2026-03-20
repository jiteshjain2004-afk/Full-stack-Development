const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Verify JWT ─────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  const auth  = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── Role-based guard ───────────────────────────────────────
// Usage: authorize('admin') or authorize('admin', 'moderator')
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Access Denied',
      message: `This route requires one of: [${roles.join(', ')}]. Your role: ${req.user.role}`,
    });
  }
  next();
};

module.exports = { authenticate, authorize };
