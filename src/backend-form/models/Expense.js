const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: Date,
    startup: Number,
    food: Number,
    trCom: Number,
    clothes: Number,
    shoes: Number,
    tExpense: Number,
    savings: Number,
    rate: String,
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
