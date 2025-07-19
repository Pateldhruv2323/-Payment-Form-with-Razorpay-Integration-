# -Payment-Form-with-Razorpay-Integration-

## Setup

### Frontend
cd client
npm install
npm start


### Backend
cd server
npm install
cp .env.example .env
node index.js

1. Create Order API
Endpoint:
POST /create-order

Description:
Creates a new Razorpay order based on user input (amount + tip) and returns configuration needed for Razorpay Checkout.

Request Body (JSON):
{name: "Dhruv", email: "D@gmail.com", phone: "8844556611", address: "Valsad", anonymous: false,…}
address: "Valsad"
amount: 4000 
anonymous: false
email: "D@gmail.com"
name: "Dhruv"
phone: "8844556611"
tip: 18


Logic:

Calculates tipAmount = amount * tip / 100
Total = amount + tipAmount
Converts to paise (total * 100)
Creates a Razorpay order (or mocks it if credentials not available)

Sample Response:
{
    "orderId": "order_853018",
    "amount": 472000,
    "currency": "INR",
    "key": "RAZORPAY_KEY_ID",
    "name": "Dhruv"
}

If anonymous is true:
sample request:

{name: "Ankit", email: "A@gmail.com", phone: "8866441155", address: "Valsad", anonymous: true,…}
address: "Valsad"
amount: 2500
anonymous:true
email: "A@gmail.com"
name: "Ankit"
phone: "8866441155"
tip: 18

sample Response:
{
    "orderId": "order_079169",
    "amount": 295000,
    "currency": "INR",
    "key": "RAZORPAY_KEY_ID",
    "name": "Anonymous Donor"
}


Webhook Handler API (Bonus)
Endpoint:
POST /api/webhook

Purpose:
Used by Razorpay to send payment confirmation events after checkout. Must verify the x-razorpay-signature to validate authenticity.

Headers:
Content-Type: application/json
x-razorpay-signature: <signature>

Raw Request Body Example:
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_LKgZ9wuDj38Eds",
        "amount": 295000,
        "currency": "INR",
        "status": "captured"
      }
    }
  }
}
Sample Response:
{
  "status": "ok"
}
Invalid Signature Response:
{
  "status": "invalid signature"
}
