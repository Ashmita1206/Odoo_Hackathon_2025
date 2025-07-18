const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

console.log('🔍 Environment Test:')
console.log('Current directory:', __dirname)
console.log('.env file path:', path.join(__dirname, '.env'))
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0)
console.log('JWT_SECRET value:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 20) + '...' : 'undefined')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', process.env.PORT || 5000) 