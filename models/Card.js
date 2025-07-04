const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  username: String,
  cardType: String,
  serial: String,
  code: String,
  amount: Number,  // 💰 Số tiền nạp
  status: { type: String, default: 'pending' }, // pending, processing, approved
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', cardSchema);
