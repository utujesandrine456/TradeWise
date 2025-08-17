const express = require('express');
const router = express.Router();
const { authenticateToken, requireUser } = require('../middleware/auth');
const {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount
} = require('../controllers/notificationController');


router.post('/', authenticateToken, requireUser, createNotification);

router.get('/user/:user_id', authenticateToken, requireUser, getUserNotifications);

router.put('/:notification_id/read', authenticateToken, requireUser, markNotificationAsRead);

router.put('/user/:user_id/read-all', authenticateToken, requireUser, markAllNotificationsAsRead);

router.delete('/:notification_id', authenticateToken, requireUser, deleteNotification);

router.get('/user/:user_id/unread-count', authenticateToken, requireUser, getUnreadCount);


module.exports = router;
