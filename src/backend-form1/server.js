require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const productRoutes = require('./routes/products.js');
const purchaseRoutes = require('./routes/purchases.js');
const saleRoutes = require('./routes/sales.js');
const transactionRoutes = require('./routes/transactions.js');
const userRoutes = require('./routes/user.js');
const businessProfileRoutes = require('./routes/businessProfile.js');
const orderRoutes = require('./routes/orders.js');
const notificationRoutes = require('./routes/notifications.js');
const dashboardRoutes = require('./routes/dashboard.js');
const cookieParser = require('cookie-parser');


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/api', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/business-profile', businessProfileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || '4000';


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

