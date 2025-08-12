const Transaction = require('../models/Transaction');

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};


// Get single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
};


// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error: error.message });
  }
};


// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
};


// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};


// Search transactions
const searchTransactions = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error searching transactions', error: error.message });
  }
};


// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const totalCredits = await Transaction.aggregate([
      { $match: { type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDebits = await Transaction.aggregate([
      { $match: { type: 'debit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const creditTotal = totalCredits[0]?.total || 0;
    const debitTotal = totalDebits[0]?.total || 0;
    const netBalance = creditTotal - debitTotal;

    res.status(200).json({
      totalTransactions,
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
