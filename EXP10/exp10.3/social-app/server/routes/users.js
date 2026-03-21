const router = require('express').Router();
const User   = require('../models/User');
const Post   = require('../models/Post');
const { authenticate } = require('../middleware/auth');

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user  = await User.findById(req.params.id).select('-password').populate('followers following', 'username avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 }).populate('author', 'username avatar');
    res.json({ success: true, data: { user, posts, postCount: posts.length } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users — search users
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { username: { $regex: search, $options: 'i' } } : {};
    const users  = await User.find(filter).select('-password').limit(20);
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/users/:id/follow
router.patch('/:id/follow', authenticate, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ error: 'Cannot follow yourself' });
    const target   = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    const isFollowing = req.user.following.includes(req.params.id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
    }
    res.json({ success: true, following: !isFollowing });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
