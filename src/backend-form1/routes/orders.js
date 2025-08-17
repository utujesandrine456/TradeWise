const express = require('express');
const router = express.Router();
const { authenticateToken, requireUser } = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');


router.post('/', authenticateToken, requireUser, createOrder);

router.get('/user/:user_id', authenticateToken, requireUser, getUserOrders);

router.get('/:order_id', authenticateToken, requireUser, getOrderDetails);

router.put('/:order_id/status', authenticateToken, requireUser, updateOrderStatus);

router.get('/all', authenticateToken, requireUser, getAllOrders);

module.exports = router;
