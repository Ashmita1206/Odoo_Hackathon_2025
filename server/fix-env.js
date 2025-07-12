// Manually set JWT_SECRET if .env is not loading
if (!process.env.JWT_SECRET) {
  console.log('🔧 Setting JWT_SECRET manually')
  process.env.JWT_SECRET = 'stackit-super-secret-jwt-key-2024-change-in-production'
  process.env.PORT = '5000'
  process.env.NODE_ENV = 'development'
  process.env.MONGODB_URI = 'mongodb://localhost:27017/stackit'
  process.env.CLIENT_URL = 'http://localhost:3000'
}

console.log('✅ Environment variables set:')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT LOADED')
console.log('PORT:', process.env.PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)

// Now start the server
require('./index.js') 