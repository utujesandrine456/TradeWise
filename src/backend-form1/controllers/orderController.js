const pool = require('../config/db');

// Create new order from cart
const createOrder = async (req, res) => {
    try {
        const {
            user_id,
            items,
            total_amount,
            shipping_address,
            payment_method,
            customer_name,
            customer_email,
            customer_phone,
            notes
        } = req.body;

        // Start transaction
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Create order
            const { rows: order } = await client.query(
                `INSERT INTO orders (
                    user_id, total_amount, shipping_address, payment_method, 
                    customer_name, customer_email, customer_phone, notes, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
                RETURNING id`,
                [user_id, total_amount, shipping_address, payment_method, 
                 customer_name, customer_email, customer_phone, notes]
            );

            const orderId = order[0].id;

            // Create order items
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items (
                        order_id, product_id, product_name, quantity, unit_price, total_price
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
                );

                // Update product quantity
                await client.query(
                    `UPDATE products 
                     SET quantity = quantity - $1, updated_at = NOW()
                     WHERE id = $2`,
                    [item.quantity, item.id]
                );

                // Update product status if quantity becomes 0
                await client.query(
                    `UPDATE products 
                     SET status = 'Out of Stock', updated_at = NOW()
                     WHERE id = $2 AND quantity = 0`,
                    [item.id]
                );
            }

            // Create transaction record
            await client.query(
                `INSERT INTO transactions (
                    user_id, type, amount, description, payment_method, reference
                ) VALUES ($1, 'debit', $2, $3, $4, $5)`,
                [user_id, total_amount, `Order #${orderId}`, payment_method, `ORDER-${orderId}`]
            );

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: {
                    order_id: orderId,
                    total_amount,
                    status: 'pending'
                }
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { rows: orders } = await pool.query(
            `SELECT o.*, 
                    COUNT(oi.id) as item_count,
                    STRING_AGG(oi.product_name, ', ') as products
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [user_id]
        );

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get order details
const getOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.params;

        // Get order info
        const { rows: order } = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [order_id]
        );

        if (order.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Get order items
        const { rows: items } = await pool.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [order_id]
        );

        res.status(200).json({
            success: true,
            data: {
                order: order[0],
                items
            }
        });

    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;

        const { rows: updatedOrder } = await pool.query(
            `UPDATE orders 
             SET status = $1, updated_at = NOW()
             WHERE id = $2 
             RETURNING *`,
            [status, order_id]
        );

        if (updatedOrder.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder[0]
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
    try {
        const { rows: orders } = await pool.query(
            `SELECT o.*, u.company_name, u.business_email,
                    COUNT(oi.id) as item_count,
                    STRING_AGG(oi.product_name, ', ') as products
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             GROUP BY o.id, u.company_name, u.business_email
             ORDER BY o.created_at DESC`
        );

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus,
    getAllOrders
};
