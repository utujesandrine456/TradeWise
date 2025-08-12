const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/Auth.js');
const productRoutes = require('./routes/products.js');
const purchaseRoutes = require('./routes/purchases.js');
const saleRoutes = require('./routes/sales.js');
const transactionRoutes = require('./routes/transactions.js');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/transactions', transactionRoutes);


const uri = process.env.MONGODB_URL;
const PORT = process.env.PORT || '4000';


mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});