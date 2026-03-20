require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const verifyToken = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Pre-hashed demo users (no DB needed) ──────────────────
// Passwords: admin→admin123, user→user123, jitesh→jitesh123
const USERS = [
  { id: 1, username: 'admin',  email: 'admin@demo.com',  passwordHash: bcrypt.hashSync('admin123',  10), role: 'Administrator' },
  { id: 2, username: 'user',   email: 'user@demo.com',   passwordHash: bcrypt.hashSync('user123',   10), role: 'Student'       },
  { id: 3, username: 'jitesh', email: 'jitesh@demo.com', passwordHash: bcrypt.hashSync('jitesh123', 10), role: 'Developer'     },
];

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

// Request logger — matches expected output in screenshot
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    console.log(`${req.method} ${req.path} HTTP/1.1`);
    console.log(`  ${JSON.stringify(body)}`);
    console.log(`  ${res.statusCode}`);
    return originalJson(body);
  };
  next();
});

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JWT Auth Server running', timestamp: new Date().toISOString() });
});

// ── POST /api/login ────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() ||
           u.email.toLowerCase()    === username.toLowerCase()
  );

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    console.log('POST /api/login HTTP/1.1\n  "error":Invalid credentials"\n  401');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Sign JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// ── POST /api/register (bonus) ─────────────────────────────
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const exists = USERS.find((u) => u.username === username || u.email === email);
  if (exists) return res.status(409).json({ error: 'User already exists' });

  const newUser = {
    id: USERS.length + 1,
    username, email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'User',
  };
  USERS.push(newUser);
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return res.status(201).json({
    message: 'Registration successful',
    token,
    user: { id: newUser.id, username, email, role: newUser.role },
  });
});

// ── GET /api/protected (JWT required) ─────────────────────
app.get('/api/protected', verifyToken, (req, res) => {
  console.log(`GET /api/protected HTTP/1.1\n  "message":"Welcome ${req.user.username}", user:{"id":${req.user.id},"username":"${req.user.username}"}\n  200`);
  return res.json({
    message: `Welcome ${req.user.username}`,
    user: { id: req.user.id, username: req.user.username, role: req.user.role },
  });
});

// ── GET /api/profile (JWT required) ───────────────────────
app.get('/api/profile', verifyToken, (req, res) => {
  const user = USERS.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// ── GET /api/admin (admin role only) ──────────────────────
app.get('/api/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  return res.json({ message: 'Admin dashboard data', users: USERS.map(({ passwordHash, ...u }) => u) });
});

// ── 404 ────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
