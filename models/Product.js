const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  price: Number,
  category: String,
  image: String,
  desc: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
