const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER || 'sandrine',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sandrine',
    password: process.env.DB_PASSWORD || 'bubuna',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


const initializeDatabase = async () => {
    try {
        const schemaPath = path.join(__dirname, '../models/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('Database schema created successfully!');
        
        
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const { rows: existingAdmin } = await pool.query(
            'SELECT id FROM users WHERE business_email = $1',
            ['tradewise.app456@gmail.com']
        );
        
        if (existingAdmin.length === 0) {
            await pool.query(
                `INSERT INTO users (company_name, business_email, password, role, is_verified) 
                 VALUES ($1, $2, $3, $4, $5)`,
                ['TradeWise', 'tradewise.app456@gmail.com', hashedPassword, 'admin', true]
            );
        } else {
            console.log('Admin user already exists');
        }
        
       
        const { rows: adminUser } = await pool.query(
            'SELECT id FROM users WHERE business_email = $1',
            ['admin@tradewise.com']
        );
        
        if (adminUser.length > 0) {
            const { rows: existingProfile } = await pool.query(
                'SELECT id FROM business_profiles WHERE user_id = $1',
                [adminUser[0].id]
            );
            
            if (existingProfile.length === 0) {
                await pool.query(
                    `INSERT INTO business_profiles (
                        user_id, business_name, business_type, industry, description,
                        address, phone, website, annual_revenue, employee_count,
                        founded_year, business_hours, payment_methods, target_market
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
                    [
                        adminUser[0].id,
                        'TradeWise Corporation',
                        'Technology',
                        'Software Development',
                        'Leading business management software provider',
                        'Musanze , Northern Province',
                        '+250 785 805 869',
                        1000000,
                        50,
                        2020,
                        'Monday-Friday 9AM-6PM',
                        ['Credit Card', 'Bank Transfer', 'PayPal'],
                        'Small to Medium Businesses'
                    ]
                );
                console.log('Sample business profile created for admin');
            }
        }
        
        console.log(' Database initialization completed successfully!');
        console.log('\n Next steps:');
        console.log('   1. Start the server: npm run dev');
        console.log('   2. Access the application at: http://localhost:4000');
        console.log('   3. Login with admin credentials');
        console.log('   4. Complete your business profile');
        
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
            console.log(' Database setup completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database setup failed:', error);
            process.exit(1);
        });
}


module.exports = { initializeDatabase };
