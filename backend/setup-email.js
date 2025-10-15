const fs = require('fs');
const path = require('path');


const envTemplate = `# Database
DATABASE_URL="postgresql://sangwa_admin:utuje001\$@localhost:5432/tradewise"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Email Configuration (SMTP)
# For Gmail (requires App Password):
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tradewise.app456@gmail.com"
SMTP_PASS="tradewise123"

# For Outlook/Hotmail (easier setup):
# SMTP_HOST="smtp-mail.outlook.com"
# SMTP_PORT="587"
# SMTP_SECURE="false"
# SMTP_USER="tradewise.app456@outlook.com"
# SMTP_PASS="tradewise123"

# Node Environment
NODE_ENV="development"
`;

const envPath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    
} else {
    console.log(' .env file already exists. Please update it manually with your email credentials.');
    console.log(' See EMAIL_SETUP.md for detailed instructions');
}
