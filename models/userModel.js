// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  weight: Number,   // kg
  height: Number,   // cm
  goal: { 
    type: String, 
    enum: ['lose', 'maintain', 'gain'],
    default: 'maintain'
  },
  dailyBudget: Number,  // in CAD
  dietaryRestrictions: String, // e.g., "Vegan", "Halal"
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
