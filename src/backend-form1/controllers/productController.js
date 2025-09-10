const pool = require('../config/db');


const getAllProducts = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { rows: products } = await pool.query(
      'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const { rows: products } = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, category, description, purchase_price, selling_price, quantity, supplier, min_stock_level, status } = req.body;
    
    const { rows: newProduct } = await pool.query(
      `INSERT INTO products (name, category, description, purchase_price, selling_price, quantity, supplier, min_stock_level, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [name, category, description, purchase_price, selling_price, quantity, supplier, min_stock_level, status]
    );
    
    res.status(201).json({message: "Product created successfully", product: newProduct[0]});
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, category, description, purchase_price, selling_price, quantity, supplier, min_stock_level, status } = req.body;
    
    const { rows: updatedProduct } = await pool.query(
      `UPDATE products 
       SET name = $1, category = $2, description = $3, purchase_price = $4, selling_price = $5, 
           quantity = $6, supplier = $7, min_stock_level = $8, status = $9, updated_at = NOW()
       WHERE id = $10 
       RETURNING *`,
      [name, category, description, purchase_price, selling_price, quantity, supplier, min_stock_level, status, req.params.id]
    );

    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { rows: deletedProduct } = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR supplier ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const { rows: products } = await pool.query(query, params);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await pool.query('SELECT COUNT(*) FROM products');
    const inStockProducts = await pool.query('SELECT COUNT(*) FROM products WHERE status = $1', ['In Stock']);
    const lowStockProducts = await pool.query('SELECT COUNT(*) FROM products WHERE status = $1', ['Low Stock']);
    const outOfStockProducts = await pool.query('SELECT COUNT(*) FROM products WHERE status = $1', ['Out of Stock']);

    res.status(200).json({
      totalProducts: totalProducts.rows[0]?.count || 0,
      inStockProducts: inStockProducts.rows[0]?.count || 0,
      lowStockProducts: lowStockProducts.rows[0]?.count || 0,
      outOfStockProducts: outOfStockProducts.rows[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product statistics', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats
};
