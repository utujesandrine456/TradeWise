const pool = require('../config/db');


const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { rows: transactions } = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};


const getTransactionById = async (req, res) => {
  try {
    const { rows: transactions } = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [req.params.id]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transactions[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
};



const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { type, category, description, amount, date, time, status, payment_method, reference, notes } = req.body;
    
    const { rows: newTransaction } = await pool.query(
      `INSERT INTO transactions (user_id, type, category, description, amount, date, time, status, payment_method, reference, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [userId, type, category, description, amount, date, time, status, payment_method, reference, notes]
    );
    
    res.status(201).json({message: "Your transaction has been saved", savedTransaction: newTransaction[0]});
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error: error.message });
  }
};



const updateTransaction = async (req, res) => {
  try {
    const { type, category, description, amount, date, time, status, payment_method, reference, notes } = req.body;
    
    const { rows: updatedTransaction } = await pool.query(
      `UPDATE transactions 
       SET type = $1, category = $2, description = $3, amount = $4, date = $5, time = $6, 
           status = $7, payment_method = $8, reference = $9, notes = $10, updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [type, category, description, amount, date, time, status, payment_method, reference, notes, req.params.id]
    );

    if (updatedTransaction.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
};



const deleteTransaction = async (req, res) => {
  try {
    const { rows: deletedTransaction } = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (deletedTransaction.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};


const searchTransactions = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    let query = 'SELECT * FROM transactions WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (description ILIKE $${paramCount} OR category ILIKE $${paramCount} OR reference ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (category) {
      paramCount++;
      query += ` AND category ILIKE $${paramCount}`;
      params.push(`%${category}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const { rows: transactions } = await pool.query(query, params);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error searching transactions', error: error.message });
  }
};


// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const totalTransactions = await pool.query('SELECT COUNT(*) FROM transactions');
    const totalCredits = await pool.query('SELECT SUM(amount) FROM transactions WHERE type = $1', ['credit']);
    const totalDebits = await pool.query('SELECT SUM(amount) FROM transactions WHERE type = $1', ['debit']);

    const creditTotal = totalCredits.rows[0]?.sum || 0;
    const debitTotal = totalDebits.rows[0]?.sum || 0;
    const netBalance = creditTotal - debitTotal;

    res.status(200).json({
      totalTransactions: totalTransactions.rows[0]?.count || 0,
      totalCredits: creditTotal,
      totalDebits: debitTotal,
      netBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction statistics', error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  searchTransactions,
  getTransactionStats
};
