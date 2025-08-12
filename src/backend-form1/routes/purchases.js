const express = require('express');
const router = express.Router();
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  searchPurchases,
  getPurchaseStats
} = require('../controllers/purchaseController');

// Get all purchases
router.get('/', getAllPurchases);

// Get purchase statistics
router.get('/stats', getPurchaseStats);

// Search purchases
router.get('/search', searchPurchases);

// Get single purchase
router.get('/:id', getPurchaseById);

// Create new purchase
router.post('/', createPurchase);

// Update purchase
router.put('/:id', updatePurchase);

// Delete purchase
router.delete('/:id', deletePurchase);

module.exports = router;
