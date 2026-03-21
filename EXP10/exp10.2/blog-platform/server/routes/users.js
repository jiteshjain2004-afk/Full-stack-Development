const router = require('express').Router();
const User   = require('../models/User');
const Post   = require('../models/Post');

// GET /api/users/:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user  = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 }).select('title excerpt tags likes views createdAt');
    res.json({ success: true, data: { user, posts, postCount: posts.length } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
