require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve the static frontend (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Luxury Beauty API is running' });
});

// Fallback to home page for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
