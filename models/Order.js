const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number }],
  note: String,
  status: { type: String, default: 'new' }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
