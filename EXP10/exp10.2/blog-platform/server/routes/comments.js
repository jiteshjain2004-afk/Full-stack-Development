const router  = require('express').Router();
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/auth');

// POST /api/comments
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, postId } = req.body;
    if (!content || !postId) return res.status(400).json({ error: 'Content and postId required' });
    const comment = await Comment.create({ content, post: postId, author: req.user._id });
    await comment.populate('author', 'username avatar');
    res.status(201).json({ success: true, data: comment });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/comments/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'username avatar');
    res.json({ success: true, data: comment });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/comments/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
