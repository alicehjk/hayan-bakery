const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  desc: String,
  category: String,
  image: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Product', ProductSchema);
