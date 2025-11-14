// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  name: String,
  role: { type: String, default: 'admin' }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.createFromPlain = async function(email, plainPassword) {
  const hash = bcrypt.hashSync(plainPassword, 10);
  return this.create({ email, passwordHash: hash, name: 'Admin' });
};

module.exports = mongoose.model('User', userSchema);
