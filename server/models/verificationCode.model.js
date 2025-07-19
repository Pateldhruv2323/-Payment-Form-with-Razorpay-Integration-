const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: String,
  expiresAt: Date,
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
