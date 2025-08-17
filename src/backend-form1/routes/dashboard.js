const express = require('express');
const router = express.Router();
const { authenticateToken, requireUser } = require('../middleware/auth');
const {
    getDashboardData,
    getBusinessMetrics
} = require('../controllers/dashboardController');


router.get('/data', authenticateToken, requireUser, getDashboardData);
router.get('/metrics', authenticateToken, requireUser, getBusinessMetrics);

module.exports = router;
