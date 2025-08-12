const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  searchTransactions,
  getTransactionStats
} = require('../controllers/transactionController');

// Get all transactions
router.get('/', getAllTransactions);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Search transactions
router.get('/search', searchTransactions);

// Get single transaction
router.get('/:id', getTransactionById);

// Create new transaction
router.post('/', createTransaction);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
