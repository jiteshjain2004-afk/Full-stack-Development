const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content:  { type: String, required: true, maxlength: 2000 },
  image:    { type: String, default: '' },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags:     [{ type: String, trim: true, lowercase: true }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
