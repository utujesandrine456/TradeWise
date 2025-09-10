const pool = require('../config/db');
const { sendVerificationEmail } = require('../utils/sendEmail');


const registerUser = async (req, res) => {
    const { business_email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); 

    try {
        let { rows: existingUsers } = await pool.query(
            'SELECT * FROM users WHERE business_email = $1',
            [business_email]
        );

        if (existingUsers.length === 0) {
            await pool.query(
                `INSERT INTO users (business_email, verification_code, code_expires) 
                 VALUES ($1, $2, $3)`,
                [business_email, code, codeExpires]
            );
        } else {
            await pool.query(
                `UPDATE users 
                 SET verification_code = $1, code_expires = $2 
                 WHERE business_email = $3`,
                [code, codeExpires, business_email]
            );
        }

        try {
            console.log("Sending email to:", business_email);
            await sendVerificationEmail(business_email, code);
            console.log("Email sent");
            res.json({ message: 'Verification email sent' });
        } catch (error) {
            console.error('Error sending verification email:', error);
            res.status(500).json({ message: 'Failed to send verification email' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error occurred' });
    }
};



const verifyCode = async (req, res) => {
    const { business_email, code } = req.body;
    
    try {
        const { rows: users } = await pool.query(
            'SELECT * FROM users WHERE business_email = $1',
            [business_email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = users[0];

        if (user.verification_code !== code || user.code_expires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        await pool.query(
            `UPDATE users 
             SET is_verified = true, verification_code = NULL, code_expires = NULL 
             WHERE business_email = $1`,
            [business_email]
        );

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error occurred' });
    }
};

module.exports = { registerUser, verifyCode };
