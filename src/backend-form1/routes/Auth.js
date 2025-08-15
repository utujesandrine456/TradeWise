const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const { sendVerificationEmail } = require('../utils/sendEmail');
const JWT_SECRET = 'securitymustbeyourpriority';
const JWT_EXPIRES_IN = '1h';

router.use(cookieParser());


const authentication = async (req, res, next) => {
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};



const authorization = (roles =[]) => {
    return (req, res, next) =>{
        try{
            if(!req.user?.role){
                return res.status(401).json({
                    message: 'No role assigned to the user'
                });
            }
            
            if(!roles.includes(req.user.role)){
                return res.status(403).json({
                    message:`Roles ${req.user.role} is not authorized`
                });
            }

            next();
        }catch(err){
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
    };
};



router.post('/verify-email', async(req, res) => {
    const {email, code} = req.body;

    try{
        const user = await User.findOne({ email });

        if(!User){
            return res.status(404).json({ message: "User nor found"});
        }

        if(user.verificationCode !== code){
            return res.status(400).json({ message: "Invalid verification code"})
        }

        if(user.codeExpires < new Date()){
            return res.status(400).json({ message: "Verificatin code has expired"});
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.codeExpires = undefined;
        await user.save();


        const token = jwt.sign({userId: user._id, role: user.role }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        res.cookie('token', token, {
            httpOnly: false,
            secure: 'production',
            sameSite: 'strict',
            maxAge: 20 * 24 * 60 * 60 * 1000
        })

        res.json({
            message: "Email verified successfully, your are now registered",
            token: token,
        });
        
    } catch(err){
        console.error('Verification error: ', err);
        res.status(500).json({message: "Verification failed", error: err.message });
    }
});


router.post('/resend-code', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        user.verificationCode = code;
        user.codeExpires = codeExpires;
        await user.save();

        await sendVerificationEmail(email, code);
        res.json({ message: 'New verification code sent' });

    } catch (error) {
        console.error('Error resending verification code:', error);
        res.status(500).json({ message: 'Failed to resend verification code' });
    }
});


router.post('/signup', async(req, res) => {

    const {fullName, email , password, confirmPassword, role} = req.body;

    if(password !== confirmPassword){
        return res.status(400).json({ message: "Passwords do not match!!"});
    }

    
    try{
        const existingUser = await User.findOne({email});

        if(existingUser && existingUser.isVerified){
            return res.status(400).json({ message: "Email is already registered!"});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now()  + 15 * 60 * 1000);

        let user;
        if(existingUser){
                user = existingUser;
                user.fullName = fullName;
                user.password = hashedPassword;
                user.role = role || 'user';

        }else{
            user = new User({
                fullName,
                email,
                password: hashedPassword,
                role: role || 'user',
                isVerified: false
            });
        }

        
        user.verificationCode = code;
        user.codeExpires = codeExpires;
        await user.save();

        await sendVerificationEmail(email, code);

        res.status(201).json({
            message: 'Verification email sent. Please check your email.',
            email: email
        });

    } catch(err){
        console.log("Signup Error", err)
        res.status(500).json({ 
            message: err.message 
        });
    }
});


router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ message: "Not Registered!!"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        
        const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000,
        })
        
        res.status(201).json({ message: 'Login successfully', token: token });
        
    }catch(err){
        console.error(err);
        res.status(500).json({ 
            message: err.message
        });
    }
})


router.get('/user', authentication, (req, res) => {
    res.json({
        message: `Welcome ${req.user.fullName}  to your Dashboard`
    })
})


router.get('/admin', authentication, authorization( ['admin']), (req, res) => {
    res.json({
        message: `Welcome Admin  to your Dashboard`
    })
})


router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.json({
        message: 'Logged out successfully'
    })

})


router.post('/table', authentication, (req,res) => {
    res.json({
        message: 'Not authenticated'
    });
})


router.get('/username', authentication, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('fullName');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ username: user.fullName });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching username', error: err.message });
    }
});


module.exports = router;
