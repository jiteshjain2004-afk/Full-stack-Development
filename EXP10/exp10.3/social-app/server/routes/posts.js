const router  = require('express').Router();
const Post    = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticate, optionalAuth } = require('../middleware/auth');

// GET /api/posts — global feed
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const posts = await Post.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Post.countDocuments(filter);
    res.json({ success: true, data: posts, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/posts/feed — posts from following
router.get('/feed', authenticate, async (req, res) => {
  try {
    const user  = req.user;
    const posts = await Post.find({ author: { $in: [...user.following, user._id] } })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/posts/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post     = await Post.findById(req.params.id).populate('author', 'username avatar bio');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comments = await Comment.find({ post: post._id }).populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json({ success: true, data: { ...post.toObject(), comments } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/posts
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, image, tags } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
    const post = await Post.create({ content, image, tags, author: req.user._id });
    await post.populate('author', 'username avatar');
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/posts/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author', 'username avatar');
    res.json({ success: true, data: updated });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/posts/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/posts/:id/like
router.patch('/:id/like', authenticate, async (req, res) => {
  try {
    const post  = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const liked = post.likes.includes(req.user._id);
    liked ? post.likes.pull(req.user._id) : post.likes.push(req.user._id);
    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: !liked });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/posts/:id/comments
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
    const comment = await Comment.create({ content, post: req.params.id, author: req.user._id });
    await comment.populate('author', 'username avatar');
    res.status(201).json({ success: true, data: comment });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/posts/:id/comments/:commentId
router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
