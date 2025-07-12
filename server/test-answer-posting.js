const axios = require('axios')

// Test configuration
const BASE_URL = 'http://localhost:5000/api'
const TEST_TOKEN = 'your-test-token-here' // Replace with actual token from browser

async function testAnswerPosting() {
  console.log('🧪 Testing Answer Posting Functionality')
  console.log('=====================================')
  
  try {
    // Test 1: Check server health
    console.log('\n1️⃣ Testing server health...')
    const healthResponse = await axios.get(`${BASE_URL}/health`)
    console.log('✅ Server health check passed:', healthResponse.data)
    
    // Test 2: Check if we can get questions (no auth required)
    console.log('\n2️⃣ Testing questions endpoint...')
    const questionsResponse = await axios.get(`${BASE_URL}/questions`)
    console.log('✅ Questions endpoint working:', questionsResponse.data.length, 'questions found')
    
    if (questionsResponse.data.length > 0) {
      const firstQuestion = questionsResponse.data[0]
      console.log('📝 First question ID:', firstQuestion._id)
      console.log('📝 First question title:', firstQuestion.title)
      
      // Test 3: Try to post answer (this will fail without auth, but we can see the error)
      console.log('\n3️⃣ Testing answer posting (will fail without auth)...')
      try {
        await axios.post(`${BASE_URL}/answers/${firstQuestion._id}`, {
          content: 'This is a test answer'
        })
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Expected 401 error (no auth token)')
          console.log('📝 Error message:', error.response.data.message)
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data)
        }
      }
    }
    
    console.log('\n✅ All tests completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Open http://localhost:3000 in your browser')
    console.log('2. Log in to get a valid token')
    console.log('3. Navigate to a question and try posting an answer')
    console.log('4. Check the server logs for detailed debug information')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000')
    }
  }
}

testAnswerPosting() 