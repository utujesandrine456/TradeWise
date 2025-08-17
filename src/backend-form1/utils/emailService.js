const nodemailer = require('nodemailer');
require('dotenv').config();


const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};


const sendVerificationEmail = async (email, verificationCode, companyName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TradeWise - Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #BE741E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">TradeWise</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to TradeWise!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hi ${companyName},<br><br>
              Thank you for signing up with TradeWise! To complete your registration and access your business dashboard, 
              please verify your email address by entering the verification code below:
            </p>
            
            <div style="background-color: #BE741E; color: white; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h1>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This verification code will expire in 24 hours for security reasons.<br><br>
              If you didn't create this account, please ignore this email.<br><br>
              Best regards,<br>
              The TradeWise Team
            </p>
          </div>
          
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 TradeWise. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};


const sendPasswordResetEmail = async (email, resetCode, companyName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TradeWise - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #BE741E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">TradeWise</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hi ${companyName},<br><br>
              We received a request to reset your password. Use the code below to create a new password:
            </p>
            
            <div style="background-color: #BE741E; color: white; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${resetCode}</h1>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This reset code will expire in 1 hour for security reasons.<br><br>
              If you didn't request a password reset, please ignore this email.<br><br>
              Best regards,<br>
              The TradeWise Team
            </p>
          </div>
          
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2025 TradeWise. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
