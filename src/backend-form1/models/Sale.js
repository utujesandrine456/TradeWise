const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  customer: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Mobile Money', 'Bank Transfer', 'Credit Card', 'Check']
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



saleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total price before saving
saleSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
