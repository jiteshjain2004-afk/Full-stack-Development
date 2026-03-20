// seed.js — run with: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  { name: 'Wireless Headphones', price: 2499 },
  { name: 'Mechanical Keyboard', price: 3999 },
  { name: 'USB-C Hub', price: 1299 },
  { name: 'Webcam HD 1080p', price: 1899 },
  { name: 'Laptop Stand', price: 899 },
  { name: 'Mouse Pad XL', price: 499 },
  { name: 'LED Desk Lamp', price: 749 },
  { name: 'Monitor 24"', price: 12999 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${inserted.length} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
