const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats
} = require('../controllers/productController');

// Get all products
router.get('/', getAllProducts);

// Get product statistics
router.get('/stats', getProductStats);

// Search products
router.get('/search', searchProducts);

// Get single product
router.get('/:id', getProductById);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
