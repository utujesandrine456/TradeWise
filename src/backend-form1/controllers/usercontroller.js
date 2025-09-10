const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'passwordismysecurity';
const SALT_ROUNDS = 10;
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../utils/emailService');


const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role, company_id: user.company_id },
        JWT_SECRET,
        {expiresIn: '7d' }
    );
};

const getAllusers = async(req, res) => {
    try{
        const {rows: users } = await pool.query('SELECT id, company_name, business_email, role, created_at FROM users');

        res.status(200).json({ success: true, data: users });
    }catch(err){
        res.status(500).json({success: false, message: "Error fetching all users", error: err.message})
    }
}

const getUserbyId = async(req, res) => {
    try{
        const {rows: users} = await pool.query(
                `SELECT id, company_name, business_email, role, created_at FROM users WHERE id = $1`,
             [req.params.id]
        );

        if(users.length === 0){
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({ success: true, data: users[0] });

    }catch(err){
        res.status(500).json({
            success: false, 
            message: "Error fetching Company", 
            error: err.message 
        });
    }
};

const createUser = async(req, res) => {
    
    const {company_name, business_email, password, role = 'user' } = req.body;

    console.log('Creating user with data:', { company_name, business_email, role });

    try{
        // Check if database is connected
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();

        const { rows: existingUsers } = await pool.query(
            `SELECT id FROM users WHERE business_email = $1`, [business_email]
        );

        if(existingUsers.length > 0){
            return res.status(400).json({
                success: false,
                message: "User with this business_email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        console.log('Password hashed successfully');
        
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        console.log('About to insert user into database...');
        const { rows: newUser } = await pool.query(
            `INSERT INTO users (company_name, business_email, password, role, verification_code, code_expires) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, company_name, business_email, role, created_at, verification_code`, 
            [company_name, business_email, hashedPassword, role, verificationCode, codeExpires]
        );
        console.log('User inserted successfully:', newUser[0]);

        // Send verification email
        try {
            await sendVerificationEmail(business_email, verificationCode, company_name);
            console.log('Verification email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the user creation if email fails
        }

        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification.",
            user: {
                id: newUser[0].id,
                company_name: newUser[0].company_name,
                business_email: newUser[0].business_email,
                role: newUser[0].role
            }
        });

    }catch(err){
        console.error('User creation error:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({success: false, message: "Error creating user", error: err.message})
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { company_name, business_email, role = 'user' } = req.body;
    

    try {
        
        const { rows: existingUser } = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );
        

        if (existingUser.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        const { rows: updatedUser } = await pool.query(
            `UPDATE users 
             SET company_name = $1, business_email = $2, role = $3, updated_at = NOW() 
             WHERE id = $4 
             RETURNING id, company_name, business_email, role, created_at`,
            [company_name, business_email, role, id]
        );
        
        res.status(200).json({ 
            success: true, 
            message: "User updated successfully",
            data: updatedUser[0] 
        });


    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ 
            success: false, 
            message: "Error updating user",
            error: err.message 
        });
    }
};

const deleteUser = async(req, res) => {
    try{
        
        const {rows: deleteuser} = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if(deleteuser.length === 0){
            return res.status(404).json({ success: false ,message: "User not found"})
        }

        res.status(200).json({message: "User deleted successfully ", deleteuser})

    }catch(err){
        res.status(500).json({ 
            message: "Error updating user", 
            error: err.message 
        });
    }
}

const loginuser = async(req, res) => {

    const {business_email, password} = req.body;

    console.log('Login attempt for:', business_email);

    try{
        // Check if database is connected
        const client = await pool.connect();
        console.log('Database connection successful for login');
        client.release();

        const { rows } = await pool.query(
            'SELECT * FROM users WHERE business_email = $1', [business_email]
        );

        console.log('User query result:', rows.length > 0 ? 'User found' : 'User not found');

        const user = rows[0];
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation:', isPasswordValid ? 'Valid' : 'Invalid');
        
        if(!isPasswordValid){
            return res.status(401).json({ success: false, message: " Invalid credentials" });
        }

        console.log('User verification status:', user.is_verified);
        
        if (!user.is_verified) {
            return res.status(401).json({ 
                success: false, 
                message: "Please verify your email address before logging in. Check your email for the verification code.",
                requiresVerification: true
            });
        }

        const token = generateToken(user);
        console.log('Login successful, token generated');

        res.status(200).json({ success: true, message: "Login successfully", token, user: {
            id: user.id,
            company_name: user.company_name,
            business_email: user.business_email,
            role: user.role
        }});
    }catch(err){
        console.error('Login error:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};


const getUserDashboard = async(req, res) => {
    try {
        const userId = req.user.id; 
        
        
        const { rows: userData } = await pool.query(
            'SELECT company_name, business_email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (userData.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = userData[0];

        
        const { rows: todaySales } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM sales 
             WHERE DATE(created_at) = CURRENT_DATE AND user_id = $1`,
            [userId]
        );

        
        const { rows: todayPurchases } = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(total_price), 0) as total 
             FROM purchases 
             WHERE DATE(created_at) = CURRENT_DATE AND user_id = $1`,
            [userId]
        );

        
        const { rows: lowStockItems } = await pool.query(
            `SELECT name, quantity, min_stock_level 
             FROM products 
             WHERE user_id = $1 AND quantity <= min_stock_level AND quantity > 0`,
            [userId]
        );

        
        const { rows: outOfStockItems } = await pool.query(
            `SELECT name, category 
             FROM products 
             WHERE user_id = $1 AND quantity = 0`,
            [userId]
        );

        
        const { rows: recentTransactions } = await pool.query(
            `SELECT type, amount, description, created_at 
             FROM transactions 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        const dashboardData = {
            user: {
                company_name: user.company_name,
                business_email: user.business_email,
                role: user.role,
                member_since: user.created_at
            },
            today: {
                sales: {
                    count: parseInt(todaySales[0]?.count || 0),
                    total: parseFloat(todaySales[0]?.total || 0)
                },
                purchases: {
                    count: parseInt(todayPurchases[0]?.count || 0),
                    total: parseFloat(todayPurchases[0]?.total || 0)
                }
            },
            inventory: {
                low_stock: lowStockItems,
                out_of_stock: outOfStockItems
            },
            recent_transactions: recentTransactions
        };

        res.status(200).json({ success: true, data: dashboardData });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard data', error: error.message });
    }
};


const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE business_email = $1 AND verification_code = $2',
            [email, verificationCode]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code or email"
            });
        }

        const user = rows[0];

        
        if (new Date() > new Date(user.code_expires)) {
            return res.status(400).json({
                success: false,
                message: "Verification code has expired. Please request a new one."
            });
        }

        
        await pool.query(
            'UPDATE users SET is_verified = true, verification_code = NULL, code_expires = NULL WHERE id = $1',
            [user.id]
        );

        res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in to your account."
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: "Error verifying email",
            error: error.message
        });
    }
};


const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
       
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE business_email = $1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = rows[0];

        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        
        await pool.query(
            'UPDATE users SET verification_code = $1, code_expires = $2 WHERE id = $3',
            [verificationCode, codeExpires, user.id]
        );

        
        try {
            await sendVerificationEmail(email, verificationCode, user.company_name);
            res.status(200).json({
                success: true,
                message: "Verification email sent successfully. Please check your email."
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(500).json({
                success: false,
                message: "Failed to send verification email. Please try again."
            });
        }

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: "Error resending verification email",
            error: error.message
        });
    }
};

module.exports = {
    getAllusers, 
    getUserbyId, 
    createUser, 
    updateUser, 
    deleteUser, 
    loginuser,
    getUserDashboard,
    verifyEmail,
    resendVerificationEmail
}

