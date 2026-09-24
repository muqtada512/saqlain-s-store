require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8'));

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxury_beauty';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully.`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

run();
