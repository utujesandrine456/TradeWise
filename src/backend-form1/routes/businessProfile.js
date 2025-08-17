const express = require('express');
const router = express.Router();
const { authenticateToken, requireUser } = require('../middleware/auth');
const {
    createBusinessProfile,
    getBusinessProfile,
    getAllBusinessProfiles,
    deleteBusinessProfile
} = require('../controllers/businessProfileController');



router.post('/', authenticateToken, requireUser, createBusinessProfile);

router.get('/user/:user_id', authenticateToken, requireUser, getBusinessProfile);

router.get('/all', authenticateToken, requireUser, getAllBusinessProfiles);

router.delete('/:id', authenticateToken, requireUser, deleteBusinessProfile);

module.exports = router;
