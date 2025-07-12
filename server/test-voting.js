const axios = require('axios')

// Test configuration
const BASE_URL = 'http://localhost:5000/api'

async function testVoting() {
  console.log('🧪 Testing Voting Functionality')
  console.log('===============================')
  
  try {
    // Test 1: Check server health
    console.log('\n1️⃣ Testing server health...')
    const healthResponse = await axios.get(`${BASE_URL}/health`)
    console.log('✅ Server health check passed:', healthResponse.data)
    
    // Test 2: Get questions to find one to vote on
    console.log('\n2️⃣ Getting questions...')
    const questionsResponse = await axios.get(`${BASE_URL}/questions?limit=1`)
    console.log('✅ Questions endpoint working:', questionsResponse.data.questions.length, 'questions found')
    
    if (questionsResponse.data.questions.length > 0) {
      const question = questionsResponse.data.questions[0]
      console.log('📝 Question ID:', question._id)
      console.log('📝 Question title:', question.title)
      console.log('📝 Current vote count:', question.voteCount)
      
      // Test 3: Try to upvote question (will fail without auth, but we can see the error)
      console.log('\n3️⃣ Testing question upvote (will fail without auth)...')
      try {
        await axios.post(`${BASE_URL}/questions/${question._id}/upvote`)
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Expected 401 error (no auth token)')
          console.log('📝 Error message:', error.response.data.message)
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data)
        }
      }
      
      // Test 4: Try to downvote question
      console.log('\n4️⃣ Testing question downvote (will fail without auth)...')
      try {
        await axios.post(`${BASE_URL}/questions/${question._id}/downvote`)
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Expected 401 error (no auth token)')
          console.log('📝 Error message:', error.response.data.message)
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data)
        }
      }
    }
    
    console.log('\n✅ All voting tests completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Open http://localhost:3000 in your browser')
    console.log('2. Log in to get a valid token')
    console.log('3. Navigate to a question and try voting')
    console.log('4. Check the server logs for detailed debug information')
    console.log('5. Verify that vote counts update in the UI')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000')
    }
  }
}

testVoting() 