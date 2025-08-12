const Sale = require('../models/Sale');

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};


// Get single sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error: error.message });
  }
};


// Create new sale
const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale', error: error.message });
  }
};


// Update sale
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sale', error: error.message });
  }
};


// Delete sale
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
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
    const { search, status, customer } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { product: { $regex: search, $options: 'i' } },
        { customer: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (customer) {
      query.customer = { $regex: customer, $options: 'i' };
    }

    const sales = await Sale.find(query).sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error searching sales', error: error.message });
  }
};


// Get sale statistics
const getSaleStats = async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();
    const completedSales = await Sale.countDocuments({ status: 'completed' });
    const pendingSales = await Sale.countDocuments({ status: 'pending' });
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      totalSales,
      completedSales,
      pendingSales,
      totalRevenue: totalRevenue[0]?.total || 0
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
