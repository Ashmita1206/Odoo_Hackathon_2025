#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up StackIt Q&A Platform...\n')

// Check if Node.js version is compatible
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required')
  console.error(`Current version: ${nodeVersion}`)
  process.exit(1)
}

console.log(`✅ Node.js version: ${nodeVersion}`)

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../server/.env')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...')
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stackit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client Configuration
CLIENT_URL=http://localhost:3000
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env file')
} else {
  console.log('✅ .env file already exists')
}

// Install dependencies
console.log('\n📦 Installing dependencies...')

try {
  console.log('Installing root dependencies...')
  execSync('npm install', { stdio: 'inherit' })
  
  console.log('Installing server dependencies...')
  execSync('cd server && npm install', { stdio: 'inherit' })
  
  console.log('Installing client dependencies...')
  execSync('cd client && npm install', { stdio: 'inherit' })
  
  console.log('✅ All dependencies installed successfully')
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message)
  process.exit(1)
}

console.log('\n🎉 Setup completed successfully!')
console.log('\n📋 Next steps:')
console.log('1. Make sure MongoDB is running on your system')
console.log('2. Start the development servers: npm run dev')
console.log('3. Open http://localhost:3000 in your browser')
console.log('\n📚 For more information, check the README.md file') 