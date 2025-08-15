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

router.get('/', getAllPurchases);

router.get('/stats', getPurchaseStats);

router.get('/search', searchPurchases);

router.get('/:id', getPurchaseById);

router.post('/', createPurchase);

router.put('/:id', updatePurchase);

router.delete('/:id', deletePurchase);

module.exports = router;
