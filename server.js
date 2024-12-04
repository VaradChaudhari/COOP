const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process'); // For running Python script to send email

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

// Route to serve the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the cart page
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

// Create Razorpay order
app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.totalAmount * 100, // Amount in paise
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
app.post('/payment-success', (req, res) => {
  // Log the payment details for debugging
  console.log('Payment Success:', req.body);

  // Trigger email after payment success
  exec('python send_email.py', (err, stdout, stderr) => {
    if (err) {
      console.error('Error running Python script:', err);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    console.log('Email sent successfully:', stdout);
    res.send('<h1>Payment Successful and Email Sent!</h1>');  // This will show after payment success
  });
});

// Route to handle payment failure
app.get('/failure', (req, res) => {
  res.send(`
    <h1>Payment Failed</h1>
    <p>Unfortunately, there was an issue with the payment. Please try again later.</p>
    <a href="/">Try Again</a>
  `);
});

// Route for payment success page
app.get('/payment-success', (req, res) => {
  res.send(`
    <h1>Payment Successful</h1>
    <p>Thank you for your order! Your payment was successful.</p>
    <a href="/">Go to Home</a>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
