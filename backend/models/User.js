const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','cashier'], required: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (async/await, no next)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
}

module.exports = mongoose.model('User', userSchema);
