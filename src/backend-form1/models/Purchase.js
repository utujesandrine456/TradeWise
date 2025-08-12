const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  supplier: {
    type: String,
    required: true,
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
  expectedDelivery: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Mobile Money', 'Check']
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

// Update the updatedAt field before saving
purchaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total price before saving
purchaseSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
