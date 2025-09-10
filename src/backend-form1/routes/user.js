const express = require('express');
const router = express.Router();
const { getAllusers, getUserbyId, createUser, updateUser, deleteUser, loginuser, getUserDashboard, verifyEmail, resendVerificationEmail } = require('../controllers/usercontroller');
const { authenticateToken, requireRole } = require('../middleware/auth');


router.post('/register', createUser);
router.post('/login', loginuser);


router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);


router.get('/users', authenticateToken, requireRole(['admin']), getAllusers);
router.get('/users/:id', authenticateToken, requireRole(['admin']), getUserbyId);
router.put('/users/:id', authenticateToken, requireRole(['admin']), updateUser);
router.delete('/users/:id', authenticateToken, requireRole(['admin']), deleteUser);


router.get('/dashboard', authenticateToken, getUserDashboard);

module.exports = router;
