const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// Public
router.get('/public', (req, res) => {
  res.json({ message: 'This is public content — no auth required', access: 'everyone' });
});

// Any authenticated user
router.get('/user', authenticate, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}! This is user-level content.`,
    access: 'user, moderator, admin',
    yourRole: req.user.role,
  });
});

// Moderator + Admin
router.get('/moderator', authenticate, authorize('moderator', 'admin'), (req, res) => {
  res.json({
    message: 'Moderator content — manage posts, reports, flags',
    access: 'moderator, admin',
    yourRole: req.user.role,
    data: { pendingReports: 3, flaggedPosts: 7 },
  });
});

// Admin only
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    message: 'Admin Dashboard — full system access',
    access: 'admin only',
    yourRole: req.user.role,
    stats: { totalUsers: 42, activeUsers: 38, revenue: '$12,450' },
  });
});

module.exports = router;
