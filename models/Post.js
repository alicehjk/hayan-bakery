const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  body: String
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
