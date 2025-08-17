const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');


const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'TradeWise',
  password: process.env.DB_PASSWORD || 'utuje001$',
  port: process.env.DB_PORT || 5432,
});


const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'models/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('Database initialized successfully!');

    const { rows } = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection test successful:', rows[0].current_time);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;

  } finally {
    await pool.end();
  }
};


if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}



module.exports = { initializeDatabase };
