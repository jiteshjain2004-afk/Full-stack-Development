const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { authenticate } = require('../middleware/auth');

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: 'Username or email already taken' });
    const user = await User.create({ username, email, password, bio });
    res.status(201).json({ success: true, token: sign(user), user });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await require('bcryptjs').compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, token: sign(user), user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/me', authenticate, (req, res) => res.json({ success: true, user: req.user }));

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { bio, avatar }, { new: true });
    res.json({ success: true, user });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
