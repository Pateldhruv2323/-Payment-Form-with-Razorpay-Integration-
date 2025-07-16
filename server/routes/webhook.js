const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body;

  if (!signature || !rawBody) {
    return res.status(400).send('Bad Request');
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature === signature) {
    console.log('✅ Webhook verified');

    try {
      const event = JSON.parse(rawBody.toString('utf8'));

      if (event.event === 'payment.captured') {
        const paymentData = event.payload.payment.entity;
        console.log('💰 Payment captured:', paymentData.id, paymentData.amount);
        // Optional: You can update DB here if needed
      }

      res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('❌ JSON Parse Error:', err);
      res.status(400).send('Invalid JSON');
    }
  } else {
    console.warn('❌ Invalid Webhook Signature');
    res.status(400).json({ status: 'Invalid Signature' });
  }
});

module.exports = router;
