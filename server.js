const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Razorpay instance initialization with hardcoded keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_JllmlG2FU6eGXY', // Your Razorpay Key ID
  key_secret: '3LKV3NmE3eQNz5GJQLGHEi4k', // Your Razorpay Key Secret
});

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the product page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create Razorpay order
app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: 50000, // Amount in paise (50000 = ₹500)
      currency: 'INR',
      receipt: 'receipt#1',
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // Send the order details to the frontend
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send({ message: 'Failed to create order' });
  }
});

// Route to handle payment success
app.get('/success', (req, res) => {
  res.send('<h1>Payment Successful</h1>');
});

// Route to handle payment failure
app.get('/failure', (req, res) => {
  res.send(`
    <h1>Payment Failed</h1>
    <p>Unfortunately, there was an issue with the payment. Please try again later.</p>
    <a href="/">Try Again</a>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
