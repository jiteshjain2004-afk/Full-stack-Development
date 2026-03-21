const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  tags:    [{ type: String, trim: true, lowercase: true }],
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views:   { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate excerpt from content
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/[#*`]/g, '').substring(0, 150) + '...';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
