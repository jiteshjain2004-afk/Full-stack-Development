const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  bio:       { type: String, default: '', maxlength: 200 },
  avatar:    { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = (plain) => bcrypt.compare(plain, this.password);
userSchema.methods.toJSON = function () {
  const obj = this.toObject(); delete obj.password; return obj;
};

module.exports = mongoose.model('User', userSchema);
