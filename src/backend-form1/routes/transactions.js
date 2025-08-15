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


router.get('/', getAllTransactions);

router.get('/stats', getTransactionStats);

router.get('/search', searchTransactions);

router.get('/:id', getTransactionById);

router.post('/', createTransaction);

router.put('/:id', updateTransaction);

router.delete('/:id', deleteTransaction);


module.exports = router;
