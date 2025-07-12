const fs = require('fs')
const path = require('path')

console.log('🔍 Debug Environment Loading:')

// Method 1: Basic dotenv
console.log('\n1️⃣ Method 1: Basic dotenv')
require('dotenv').config()
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT LOADED')

// Method 2: With explicit path
console.log('\n2️⃣ Method 2: With explicit path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT LOADED')

// Method 3: Check if file exists
console.log('\n3️⃣ Method 3: Check file existence')
const envPath = path.join(__dirname, '.env')
console.log('File exists:', fs.existsSync(envPath))
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  console.log('File content length:', content.length)
  console.log('First 100 chars:', content.substring(0, 100))
  
  // Parse manually
  const lines = content.split('\n')
  const jwtLine = lines.find(line => line.startsWith('JWT_SECRET='))
  console.log('JWT line found:', !!jwtLine)
  if (jwtLine) {
    const jwtValue = jwtLine.split('=')[1]
    console.log('Manual JWT value:', jwtValue ? jwtValue.substring(0, 20) + '...' : 'undefined')
  }
}

// Method 4: Set environment variable directly
console.log('\n4️⃣ Method 4: Set directly')
process.env.JWT_SECRET = 'test-secret-key'
console.log('JWT_SECRET set directly:', process.env.JWT_SECRET ? 'YES' : 'NO') 