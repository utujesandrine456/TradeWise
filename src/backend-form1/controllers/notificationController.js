const pool = require('../config/db');

// Create notification
const createNotification = async (req, res) => {
    try {
        const {
            user_id,
            type,
            title,
            message,
            priority,
            related_id,
            related_type
        } = req.body;

        const { rows: notification } = await pool.query(
            `INSERT INTO notifications (
                user_id, type, title, message, priority, related_id, related_type, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
            RETURNING *`,
            [user_id, type, title, message, priority, related_id, related_type]
        );

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: notification[0]
        });

    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message
        });
    }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { status = 'all', limit = 50 } = req.query;

        let query = 'SELECT * FROM notifications WHERE user_id = $1';
        let params = [user_id];

        if (status !== 'all') {
            query += ' AND status = $2';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const { rows: notifications } = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error('Get user notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const { rows: notification } = await pool.query(
            `UPDATE notifications 
             SET status = 'read', read_at = NOW()
             WHERE id = $1 
             RETURNING *`,
            [notification_id]
        );

        if (notification.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification[0]
        });

    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification',
            error: error.message
        });
    }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { rows: notifications } = await pool.query(
            `UPDATE notifications 
             SET status = 'read', read_at = NOW()
             WHERE user_id = $1 AND status = 'unread'
             RETURNING id`,
            [user_id]
        );

        res.status(200).json({
            success: true,
            message: `${notifications.length} notifications marked as read`,
            data: { updated_count: notifications.length }
        });

    } catch (error) {
        console.error('Mark all notifications as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notifications',
            error: error.message
        });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const { rows: deletedNotification } = await pool.query(
            'DELETE FROM notifications WHERE id = $1 RETURNING *',
            [notification_id]
        );

        if (deletedNotification.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: deletedNotification[0]
        });

    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { rows: count } = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND status = $2',
            [user_id, 'unread']
        );

        res.status(200).json({
            success: true,
            data: { unread_count: parseInt(count[0]?.count || 0) }
        });

    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error.message
        });
    }
};

// Auto-create low stock notifications
const checkLowStockNotifications = async (user_id) => {
    try {
        const { rows: lowStockProducts } = await pool.query(
            `SELECT id, name, quantity, min_stock_level 
             FROM products 
             WHERE user_id = $1 AND quantity <= min_stock_level AND quantity > 0`,
            [user_id]
        );

        for (const product of lowStockProducts) {
            // Check if notification already exists
            const { rows: existingNotification } = await pool.query(
                `SELECT id FROM notifications 
                 WHERE user_id = $1 AND type = 'low_stock' AND related_id = $2 AND status = 'unread'`,
                [user_id, product.id]
            );

            if (existingNotification.length === 0) {
                await pool.query(
                    `INSERT INTO notifications (
                        user_id, type, title, message, priority, related_id, related_type
                    ) VALUES ($1, 'low_stock', 'Low Stock Alert', $2, 'medium', $3, 'product')`,
                    [user_id, `${product.name} is running low on stock (${product.quantity} remaining)`, product.id]
                );
            }
        }
    } catch (error) {
        console.error('Check low stock notifications error:', error);
    }
};

// Auto-create out of stock notifications
const checkOutOfStockNotifications = async (user_id) => {
    try {
        const { rows: outOfStockProducts } = await pool.query(
            `SELECT id, name 
             FROM products 
             WHERE user_id = $1 AND quantity = 0`,
            [user_id]
        );

        for (const product of outOfStockProducts) {
            // Check if notification already exists
            const { rows: existingNotification } = await pool.query(
                `SELECT id FROM notifications 
                 WHERE user_id = $1 AND type = 'out_of_stock' AND related_id = $2 AND status = 'unread'`,
                [user_id, product.id]
            );

            if (existingNotification.length === 0) {
                await pool.query(
                    `INSERT INTO notifications (
                        user_id, type, title, message, priority, related_id, related_type
                    ) VALUES ($1, 'out_of_stock', 'Out of Stock Alert', $2, 'high', $3, 'product')`,
                    [user_id, `${product.name} is out of stock`, product.id]
                );
            }
        }
    } catch (error) {
        console.error('Check out of stock notifications error:', error);
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount,
    checkLowStockNotifications,
    checkOutOfStockNotifications
};
