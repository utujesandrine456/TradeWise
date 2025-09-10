const {Pool} = require('pg');


const pool = new Pool({
    user: process.env.DB_USER || 'sandrine',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'TradeWise',
    password: process.env.DB_PASSWORD || 'bubuna',
    port: process.env.DB_PORT || 5432,
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
})

pool.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error("Database connection error: ", err)) 



module.exports = pool;
