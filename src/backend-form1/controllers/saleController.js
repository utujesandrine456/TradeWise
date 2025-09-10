const pool = require('../config/db');


const getAllSales = async (req, res) => {
  try {
    const { rows: sales } = await pool.query(
      'SELECT * FROM sales ORDER BY created_at DESC'
    );
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};

// Get single sale by ID
const getSaleById = async (req, res) => {
  try {
    const { rows: sales } = await pool.query(
      'SELECT * FROM sales WHERE id = $1',
      [req.params.id]
    );
    
    if (sales.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.status(200).json(sales[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error: error.message });
  }
};

// Create new sale
const createSale = async (req, res) => {
  try {
    const { product, customer, customer_phone, customer_email, quantity, unit_price, total_price, date, status, payment_method, notes } = req.body;
    
    const { rows: newSale } = await pool.query(
      `INSERT INTO sales (product, customer, customer_phone, customer_email, quantity, unit_price, total_price, date, status, payment_method, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [product, customer, customer_phone, customer_email, quantity, unit_price, total_price, date, status, payment_method, notes]
    );
    
    res.status(201).json({message: "Sale created successfully", sale: newSale[0]});
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale', error: error.message });
  }
};

// Update sale
const updateSale = async (req, res) => {
  try {
    const { product, customer, customer_phone, customer_email, quantity, unit_price, total_price, date, status, payment_method, notes } = req.body;
    
    const { rows: updatedSale } = await pool.query(
      `UPDATE sales 
       SET product = $1, customer = $2, customer_phone = $3, customer_email = $4, quantity = $5, 
           unit_price = $6, total_price = $7, date = $8, status = $9, payment_method = $10, 
           notes = $11, updated_at = NOW()
       WHERE id = $12 
       RETURNING *`,
      [product, customer, customer_phone, customer_email, quantity, unit_price, total_price, date, status, payment_method, notes, req.params.id]
    );

    if (updatedSale.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.status(200).json(updatedSale[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sale', error: error.message });
  }
};

// Delete sale
const deleteSale = async (req, res) => {
  try {
    const { rows: deletedSale } = await pool.query(
      'DELETE FROM sales WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (deletedSale.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error: error.message });
  }
};

// Search sales
const searchSales = async (req, res) => {
  try {
    const { search, status, payment_method } = req.query;
    let query = 'SELECT * FROM sales WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (product ILIKE $${paramCount} OR customer ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (payment_method) {
      paramCount++;
      query += ` AND payment_method = $${paramCount}`;
      params.push(payment_method);
    }

    query += ' ORDER BY created_at DESC';

    const { rows: sales } = await pool.query(query, params);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error searching sales', error: error.message });
  }
};

// Get sale statistics
const getSaleStats = async (req, res) => {
  try {
    const totalSales = await pool.query('SELECT COUNT(*) FROM sales');
    const totalRevenue = await pool.query('SELECT SUM(total_price) FROM sales WHERE status = $1', ['completed']);
    const pendingSales = await pool.query('SELECT COUNT(*) FROM sales WHERE status = $1', ['pending']);

    res.status(200).json({
      totalSales: totalSales.rows[0]?.count || 0,
      totalRevenue: totalRevenue.rows[0]?.sum || 0,
      pendingSales: pendingSales.rows[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale statistics', error: error.message });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  searchSales,
  getSaleStats
};
