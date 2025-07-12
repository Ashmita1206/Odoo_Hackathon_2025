const axios = require('axios')

// Test configuration
const BASE_URL = 'http://localhost:5000/api'

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting Configuration')
  console.log('=====================================')
  
  try {
    // Test 1: Check server health
    console.log('\n1️⃣ Testing server health...')
    const healthResponse = await axios.get(`${BASE_URL}/health`)
    console.log('✅ Server health check passed:', healthResponse.data)
    
    // Test 2: Make multiple rapid requests to test rate limiting
    console.log('\n2️⃣ Testing rate limiting with rapid requests...')
    const requests = []
    
    // Make 20 rapid requests
    for (let i = 0; i < 20; i++) {
      requests.push(
        axios.get(`${BASE_URL}/health`)
          .then(response => ({ success: true, status: response.status }))
          .catch(error => ({ success: false, status: error.response?.status, message: error.response?.data?.message }))
      )
    }
    
    const results = await Promise.all(requests)
    const successful = results.filter(r => r.success).length
    const rateLimited = results.filter(r => !r.success && r.status === 429).length
    const otherErrors = results.filter(r => !r.success && r.status !== 429).length
    
    console.log(`📊 Results:`)
    console.log(`   ✅ Successful requests: ${successful}`)
    console.log(`   ⚠️  Rate limited (429): ${rateLimited}`)
    console.log(`   ❌ Other errors: ${otherErrors}`)
    
    if (rateLimited > 0) {
      console.log('🔒 Rate limiting is ACTIVE - some requests were blocked')
    } else {
      console.log('🔓 Rate limiting is DISABLED or very high - all requests succeeded')
    }
    
    // Test 3: Check rate limit headers
    console.log('\n3️⃣ Checking rate limit headers...')
    try {
      const response = await axios.get(`${BASE_URL}/health`)
      const rateLimitHeaders = {
        'RateLimit-Limit': response.headers['ratelimit-limit'],
        'RateLimit-Remaining': response.headers['ratelimit-remaining'],
        'RateLimit-Reset': response.headers['ratelimit-reset']
      }
      
      if (rateLimitHeaders['RateLimit-Limit']) {
        console.log('📋 Rate limit headers found:')
        console.log(`   Limit: ${rateLimitHeaders['RateLimit-Limit']}`)
        console.log(`   Remaining: ${rateLimitHeaders['RateLimit-Remaining']}`)
        console.log(`   Reset: ${rateLimitHeaders['RateLimit-Reset']}`)
      } else {
        console.log('📋 No rate limit headers found (rate limiting may be disabled)')
      }
    } catch (error) {
      console.log('❌ Error checking headers:', error.message)
    }
    
    console.log('\n✅ Rate limiting test completed!')
    console.log('\n📋 Configuration Summary:')
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   RATE_LIMIT_ENABLED: ${process.env.RATE_LIMIT_ENABLED || 'not set'}`)
    console.log(`   RATE_LIMIT_MAX: ${process.env.RATE_LIMIT_MAX || 'not set'}`)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('\n💡 Development Mode:')
      console.log('   - Rate limiting should be disabled or very high (1,000,000 requests)')
      console.log('   - To enable rate limiting in dev, set RATE_LIMIT_ENABLED=true')
      console.log('   - To set custom limit, set RATE_LIMIT_MAX=100')
    } else {
      console.log('\n💡 Production Mode:')
      console.log('   - Rate limiting should be active (100 requests per 15 minutes)')
      console.log('   - To disable rate limiting, set RATE_LIMIT_ENABLED=false')
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000')
    }
  }
}

testRateLimit() 