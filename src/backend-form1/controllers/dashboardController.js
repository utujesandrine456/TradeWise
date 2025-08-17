const pool = require('../config/db');


const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's company information
        const { rows: userData } = await pool.query(
            'SELECT company_name, business_email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (userData.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = userData[0];

        // Get today's date
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Today's metrics
        const { rows: todaySales } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM sales 
             WHERE DATE(created_at) = CURRENT_DATE AND user_id = $1`,
            [userId]
        );

        const { rows: todayPurchases } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM purchases 
             WHERE DATE(created_at) = CURRENT_DATE AND user_id = $1`,
            [userId]
        );

        const { rows: todayTransactions } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE DATE(created_at) = CURRENT_DATE AND user_id = $1`,
            [userId]
        );

        // This month's metrics
        const { rows: monthSales } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM sales 
             WHERE created_at >= $1 AND user_id = $2`,
            [startOfMonth, userId]
        );

        const { rows: monthPurchases } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM purchases 
             WHERE created_at >= $1 AND user_id = $2`,
            [startOfMonth, userId]
        );

        // This year's metrics
        const { rows: yearSales } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM sales 
             WHERE created_at >= $1 AND user_id = $2`,
            [startOfYear, userId]
        );

        const { rows: yearPurchases } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM purchases 
             WHERE created_at >= $1 AND user_id = $2`,
            [startOfYear, userId]
        );

        // Inventory status
        const { rows: inventoryStats } = await pool.query(
            `SELECT 
                COUNT(*) as total_products,
                COUNT(CASE WHEN status = 'In Stock' THEN 1 END) as in_stock,
                COUNT(CASE WHEN status = 'Low Stock' THEN 1 END) as low_stock,
                COUNT(CASE WHEN status = 'Out of Stock' THEN 1 END) as out_of_stock,
                COALESCE(SUM(purchase_price * quantity), 0) as inventory_value
             FROM products 
             WHERE user_id = $1`,
            [userId]
        );

        // Low stock alerts
        const { rows: lowStockItems } = await pool.query(
            `SELECT name, quantity, min_stock_level, category 
             FROM products 
             WHERE user_id = $1 AND quantity <= min_stock_level AND quantity > 0
             ORDER BY quantity ASC
             LIMIT 5`,
            [userId]
        );

        // Out of stock alerts
        const { rows: outOfStockItems } = await pool.query(
            `SELECT name, category, supplier 
             FROM products 
             WHERE user_id = $1 AND quantity = 0
             ORDER BY updated_at DESC
             LIMIT 5`,
            [userId]
        );

        // Recent sales
        const { rows: recentSales } = await pool.query(
            `SELECT product, customer, total_price, created_at 
             FROM sales 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        // Recent purchases
        const { rows: recentPurchases } = await pool.query(
            `SELECT product, supplier, total_price, created_at 
             FROM sales 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        // Recent transactions
        const { rows: recentTransactions } = await pool.query(
            `SELECT type, amount, description, created_at 
             FROM transactions 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        // Top selling products
        const { rows: topProducts } = await pool.query(
            `SELECT product, COUNT(*) as sales_count, SUM(total_price) as total_revenue
             FROM sales 
             WHERE user_id = $1 AND created_at >= $2
             GROUP BY product 
             ORDER BY total_revenue DESC 
             LIMIT 5`,
            [userId, startOfMonth]
        );

        // Business profile information
        const { rows: businessProfile } = await pool.query(
            `SELECT business_name, business_type, industry, annual_revenue, employee_count
             FROM business_profiles 
             WHERE user_id = $1`,
            [userId]
        );

        // Unread notifications count
        const { rows: notificationCount } = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND status = $2',
            [userId, 'unread']
        );

        const dashboardData = {
            user: {
                company_name: user.company_name,
                business_email: user.business_email,
                role: user.role,
                member_since: user.created_at
            },
            business_profile: businessProfile[0] || null,
            today: {
                sales: {
                    count: parseInt(todaySales[0]?.count || 0),
                    total: parseFloat(todaySales[0]?.total || 0)
                },
                purchases: {
                    count: parseInt(todayPurchases[0]?.count || 0),
                    total: parseFloat(todayPurchases[0]?.total || 0)
                },
                transactions: {
                    count: parseInt(todayTransactions[0]?.count || 0),
                    total: parseFloat(todayTransactions[0]?.total || 0)
                }
            },
            this_month: {
                sales: {
                    count: parseInt(monthSales[0]?.count || 0),
                    total: parseFloat(monthSales[0]?.total || 0)
                },
                purchases: {
                    count: parseInt(monthPurchases[0]?.count || 0),
                    total: parseFloat(monthPurchases[0]?.total || 0)
                }
            },
            this_year: {
                sales: {
                    count: parseInt(yearSales[0]?.count || 0),
                    total: parseFloat(yearSales[0]?.total || 0)
                },
                purchases: {
                    count: parseInt(yearPurchases[0]?.count || 0),
                    total: parseFloat(yearPurchases[0]?.total || 0)
                }
            },
            inventory: {
                stats: inventoryStats[0] || {
                    total_products: 0,
                    in_stock: 0,
                    low_stock: 0,
                    out_of_stock: 0,
                    inventory_value: 0
                },
                low_stock_alerts: lowStockItems,
                out_of_stock_alerts: outOfStockItems
            },
            recent_activity: {
                sales: recentSales,
                purchases: recentPurchases,
                transactions: recentTransactions
            },
            top_products: topProducts,
            notifications: {
                unread_count: parseInt(notificationCount[0]?.count || 0)
            }
        };

        res.status(200).json({ success: true, data: dashboardData });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard data', error: error.message });
    }
};

// Get business performance metrics
const getBusinessMetrics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = 'month' } = req.query;

        let startDate;
        const today = new Date();

        switch (period) {
            case 'week':
                startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                startDate = new Date(today.getFullYear(), quarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        }

        // Sales metrics
        const { rows: salesMetrics } = await pool.query(
            `SELECT 
                COUNT(*) as total_sales,
                COALESCE(SUM(total_price), 0) as total_revenue,
                COALESCE(AVG(total_price), 0) as avg_sale_value,
                COUNT(DISTINCT customer) as unique_customers
             FROM sales 
             WHERE created_at >= $1 AND user_id = $2`,
            [startDate, userId]
        );

        // Purchase metrics
        const { rows: purchaseMetrics } = await pool.query(
            `SELECT 
                COUNT(*) as total_purchases,
                COALESCE(SUM(total_price), 0) as total_spent,
                COALESCE(AVG(total_price), 0) as avg_purchase_value,
                COUNT(DISTINCT supplier) as unique_suppliers
             FROM sales 
             WHERE created_at >= $1 AND user_id = $2`,
            [startDate, userId]
        );

        // Profit calculation (simplified)
        const totalRevenue = parseFloat(salesMetrics[0]?.total_revenue || 0);
        const totalSpent = parseFloat(purchaseMetrics[0]?.total_spent || 0);
        const grossProfit = totalRevenue - totalSpent;
        const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

        const metrics = {
            period,
            start_date: startDate,
            end_date: today,
            sales: salesMetrics[0] || {
                total_sales: 0,
                total_revenue: 0,
                avg_sale_value: 0,
                unique_customers: 0
            },
            purchases: purchaseMetrics[0] || {
                total_purchases: 0,
                total_spent: 0,
                avg_purchase_value: 0,
                unique_suppliers: 0
            },
            financial: {
                gross_profit: grossProfit,
                profit_margin: profitMargin,
                net_cash_flow: totalRevenue - totalSpent
            }
        };

        res.status(200).json({ success: true, data: metrics });

    } catch (error) {
        console.error('Business metrics error:', error);
        res.status(500).json({ success: false, message: 'Error fetching business metrics', error: error.message });
    }
};

module.exports = {
    getDashboardData,
    getBusinessMetrics
};
