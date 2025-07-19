const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const VerificationCode = require('../models/verificationCode.model');

router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const record = await VerificationCode.findOne({ userId: user._id, code });
  if (!record || record.expiresAt < Date.now())
    return res.status(400).json({ error: 'Invalid or expired code' });

  user.isVerified = true;
  await user.save();
  await VerificationCode.deleteMany({ userId: user._id });

  res.json({ message: 'Email verified successfully' });
});

module.exports = router;
