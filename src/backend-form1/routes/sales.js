const express = require('express');
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  searchSales,
  getSaleStats
} = require('../controllers/saleController');

// Get all sales
router.get('/', getAllSales);

// Get sale statistics
router.get('/stats', getSaleStats);

// Search sales
router.get('/search', searchSales);

// Get single sale
router.get('/:id', getSaleById);

// Create new sale
router.post('/', createSale);

// Update sale
router.put('/:id', updateSale);

// Delete sale
router.delete('/:id', deleteSale);

module.exports = router;
