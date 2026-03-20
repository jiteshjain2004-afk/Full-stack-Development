const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    console.log('GET /api/protected HTTP/1.1\n  "error":"Missing token"\n  401');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('GET /api/protected HTTP/1.1\n  "error":"Invalid or expired token"\n  401');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
