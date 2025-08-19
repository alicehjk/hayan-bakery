const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  body: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
