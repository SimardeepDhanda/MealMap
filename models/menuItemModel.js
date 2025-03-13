// models/menuItemModel.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number, 
  fat: Number,
  price: Number,
  location: String,
  date: Date,  // which day this menu item applies to
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
