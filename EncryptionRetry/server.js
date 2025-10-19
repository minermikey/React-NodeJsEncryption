// --------------------
// Load environment variables from .env file
// --------------------
require("dotenv").config();

// --------------------
// Import required packages
// --------------------
// express: web framework for Node.js
// jsonwebtoken: for creating and verifying JWT tokens
// bcrypt: for hashing passwords securely
// crypto: for hashing emails with SHA-256
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// --------------------
// Middleware to parse JSON requests
// --------------------
app.use(express.json());

// --------------------
// In-memory array for testing users
// --------------------
const users = [];

// --------------------
// Get JWT secret from environment
// --------------------
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

// --------------------
// Register user route
// --------------------
app.post('/users', async (req, res) => {
  try {
    // Generate a salt for bcrypt
    const salt = await bcrypt.genSalt(10);

    // Hash the user's password
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Hash the user's email with SHA-256
    const emailHash = crypto.createHash('sha256').update(req.body.email).digest('hex');

    console.log("Salt:", salt);
    console.log("Hashed Password:", hashPassword);

    const user = {
      name: req.body.name,
      password: hashPassword, // bcrypt stores the salt inside the hash
      email: emailHash || null
    };

    // Add the user to the in-memory array
    users.push(user);

    // Return the created user
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// --------------------
// List users route (for testing only — do not use in production)
// --------------------
app.get('/users', (req, res) => {
  res.send(users);
});

// --------------------
// Login route
// --------------------
app.post('/users/login', async (req, res) => {
  // Find user by name
  const user = users.find(u => u.name === req.body.name);

  if (!user) return res.status(400).send('User not found');

  // Compare passwords using bcrypt
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  // Hash the provided email to compare
  const validEmail = crypto.createHash('sha256').update(req.body.email).digest('hex');

  if (validPassword && user.email === validEmail) {
    // Generate a JWT token valid for 10 hours
    const token = jwt.sign(
      { name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '10h' }
    );

    // Return the token and success message
    res.send({ message: 'Login successful', token });
  } else {
    res.status(400).send('Invalid password or email');
  }
});

// --------------------
// JWT Authentication middleware
// --------------------
function authentication(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Extract the token from the header ("Bearer <token>")
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send('Access denied: no token provided');

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid or expired token');
    req.user = user; // attach user info to request
    next();
  });
}

// --------------------
// Protected route
// --------------------
app.get('/protected', authentication, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

// --------------------
// Start server
// --------------------
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// --------------------
// Packages needed to install:
// --------------------
// npm install express
// npm install jsonwebtoken
// npm install bcrypt
// npm install dotenv
