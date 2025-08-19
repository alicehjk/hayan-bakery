const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

UserSchema.plugin(plm);

module.exports = mongoose.model('User', UserSchema);
