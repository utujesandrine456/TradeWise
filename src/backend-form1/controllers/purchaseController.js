const pool = require('../config/db');

// Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const { rows: purchases } = await pool.query(
      'SELECT * FROM purchases ORDER BY created_at DESC'
    );
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
};

// Get single purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    const { rows: purchases } = await pool.query(
      'SELECT * FROM purchases WHERE id = $1',
      [req.params.id]
    );
    
    if (purchases.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.status(200).json(purchases[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase', error: error.message });
  }
};

// Create new purchase
const createPurchase = async (req, res) => {
  try {
    const { product, supplier, quantity, unit_price, total_price, date, expected_delivery, status, payment_method, notes } = req.body;
    
    const { rows: newPurchase } = await pool.query(
      `INSERT INTO purchases (product, supplier, quantity, unit_price, total_price, date, expected_delivery, status, payment_method, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [product, supplier, quantity, unit_price, total_price, date, expected_delivery, status, payment_method, notes]
    );
    
    res.status(201).json({message: "Purchase created successfully", purchase: newPurchase[0]});
  } catch (error) {
    res.status(400).json({ message: 'Error creating purchase', error: error.message });
  }
};

// Update purchase
const updatePurchase = async (req, res) => {
  try {
    const { product, supplier, quantity, unit_price, total_price, date, expected_delivery, status, payment_method, notes } = req.body;
    
    const { rows: updatedPurchase } = await pool.query(
      `UPDATE purchases 
       SET product = $1, supplier = $2, quantity = $3, unit_price = $4, total_price = $5, 
           date = $6, expected_delivery = $7, status = $8, payment_method = $9, 
           notes = $10, updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [product, supplier, quantity, unit_price, total_price, date, expected_delivery, status, payment_method, notes, req.params.id]
    );

    if (updatedPurchase.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.status(200).json(updatedPurchase[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating purchase', error: error.message });
  }
};

// Delete purchase
const deletePurchase = async (req, res) => {
  try {
    const { rows: deletedPurchase } = await pool.query(
      'DELETE FROM purchases WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (deletedPurchase.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error: error.message });
  }
};

// Search purchases
const searchPurchases = async (req, res) => {
  try {
    const { search, status, supplier } = req.query;
    let query = 'SELECT * FROM purchases WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (product ILIKE $${paramCount} OR supplier ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (supplier) {
      paramCount++;
      query += ` AND supplier ILIKE $${paramCount}`;
      params.push(`%${supplier}%`);
    }

    query += ' ORDER BY created_at DESC';

    const { rows: purchases } = await pool.query(query, params);
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error searching purchases', error: error.message });
  }
};

// Get purchase statistics
const getPurchaseStats = async (req, res) => {
  try {
    const totalPurchases = await pool.query('SELECT COUNT(*) FROM purchases');
    const totalSpent = await pool.query('SELECT SUM(total_price) FROM purchases WHERE status = $1', ['completed']);
    const pendingPurchases = await pool.query('SELECT COUNT(*) FROM purchases WHERE status = $1', ['pending']);

    res.status(200).json({
      totalPurchases: totalPurchases.rows[0]?.count || 0,
      totalSpent: totalSpent.rows[0]?.sum || 0,
      pendingPurchases: pendingPurchases.rows[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase statistics', error: error.message });
  }
};

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  searchPurchases,
  getPurchaseStats
};
