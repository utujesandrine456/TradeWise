# Email Configuration Setup

## Why emails aren't being sent

The email service is now configured to actually send emails using nodemailer, but you need to set up your email credentials in the environment variables.

## Setup Instructions

### 1. Create a `.env` file in the backend directory

Create a file called `.env` in your `backend` folder with the following content:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tradewise"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tradewise.app456@gmail.com"
SMTP_PASS="tradewise123"

# Node Environment
NODE_ENV="development"
```

### 2. Choose your email provider

#### Option A: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password (not your regular Gmail password)

3. **Update your `.env` file**:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
```

#### Option B: Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

#### Option C: Yahoo

```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

#### Option D: Custom SMTP Server

```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yourdomain.com"
SMTP_PASS="your-password"
```

### 3. Restart your backend server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run start:dev
```

### 4. Test the email functionality

1. Try signing up with a new account
2. Check your email inbox (and spam folder)
3. You should receive a verification email

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**: 
   - Make sure you're using an App Password for Gmail (not your regular password)
   - Check that 2FA is enabled on your Gmail account

2. **"Connection timeout" error**:
   - Check your internet connection
   - Verify the SMTP host and port are correct

3. **"Authentication failed" error**:
   - Double-check your email and password
   - For Gmail, make sure you're using an App Password

4. **Emails going to spam**:
   - Check your spam/junk folder
   - Add the sender email to your contacts

### Testing with a different email service:

If you want to use a different email service, you can also use:

- **SendGrid** (recommended for production)
- **Mailgun**
- **Amazon SES**
- **Postmark**

## Production Recommendations

For production, consider using:
- **SendGrid** or **Mailgun** for better deliverability
- **Amazon SES** for cost-effectiveness
- **Postmark** for transactional emails

The current setup with nodemailer works great for development and small-scale applications.
