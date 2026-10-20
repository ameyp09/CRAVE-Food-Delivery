const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Food description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Food price is required'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Food image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  available: {
    type: Boolean,
    default: true
  },
  prepTime: {
    type: String,
    default: '25-35 mins',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text indexing for fast search
foodSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Food', foodSchema);
