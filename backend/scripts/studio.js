require('dotenv').config();
const { spawn } = require('child_process');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

const studio = spawn('npx', ['prisma', 'studio', '--url', process.env.DATABASE_URL], {
  stdio: 'inherit',
  shell: true
});

studio.on('close', (code) => {
  process.exit(code);
});

studio.on('error', (err) => {
  console.error('Failed to start Prisma Studio:', err);
  process.exit(1);
});