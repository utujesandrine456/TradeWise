const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/sendEmail');



const registerUser = async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    let user = await User.findOne({ email });
    if (!user) user = new User({ email });

    user.verificationCode = code;
    user.codeExpires = codeExpires;
    await user.save();

    try {
        console.log("Sending email to:", email);
        await sendVerificationEmail(email, code);
        console.log("Email sent");
        res.json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Failed to send verification email' });
    }
};



const verifyCode = async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code || user.codeExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
};

module.exports = { registerUser, verifyCode };
