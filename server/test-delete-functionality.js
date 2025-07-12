const axios = require('axios')

// Test configuration
const BASE_URL = 'http://localhost:5000/api'

async function testDeleteFunctionality() {
  console.log('🧪 Testing Delete Functionality')
  console.log('===============================')
  
  try {
    // Test 1: Check server health
    console.log('\n1️⃣ Testing server health...')
    const healthResponse = await axios.get(`${BASE_URL}/health`)
    console.log('✅ Server health check passed:', healthResponse.data)
    
    // Test 2: Get questions to find one to test deletion
    console.log('\n2️⃣ Getting questions...')
    const questionsResponse = await axios.get(`${BASE_URL}/questions?limit=1`)
    console.log('✅ Questions endpoint working:', questionsResponse.data.questions.length, 'questions found')
    
    if (questionsResponse.data.questions.length > 0) {
      const question = questionsResponse.data.questions[0]
      console.log('📝 Question ID:', question._id)
      console.log('📝 Question title:', question.title)
      console.log('📝 Question author:', question.author.username)
      
      // Test 3: Try to delete question (will fail without auth, but we can see the error)
      console.log('\n3️⃣ Testing question deletion (will fail without auth)...')
      try {
        await axios.delete(`${BASE_URL}/questions/${question._id}`)
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Expected 401 error (no auth token)')
          console.log('📝 Error message:', error.response.data.message)
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data)
        }
      }
      
      // Test 4: Get answers for the question
      console.log('\n4️⃣ Getting answers for the question...')
      try {
        const answersResponse = await axios.get(`${BASE_URL}/answers/question/${question._id}`)
        console.log('✅ Answers endpoint working:', answersResponse.data.length, 'answers found')
        
        if (answersResponse.data.length > 0) {
          const answer = answersResponse.data[0]
          console.log('📝 Answer ID:', answer._id)
          console.log('📝 Answer author:', answer.author.username)
          
          // Test 5: Try to delete answer (will fail without auth)
          console.log('\n5️⃣ Testing answer deletion (will fail without auth)...')
          try {
            await axios.delete(`${BASE_URL}/answers/${answer._id}`)
          } catch (error) {
            if (error.response?.status === 401) {
              console.log('✅ Expected 401 error (no auth token)')
              console.log('📝 Error message:', error.response.data.message)
            } else {
              console.log('❌ Unexpected error:', error.response?.status, error.response?.data)
            }
          }
        } else {
          console.log('📝 No answers found for this question')
        }
      } catch (error) {
        console.log('❌ Error getting answers:', error.response?.data?.message || error.message)
      }
    }
    
    console.log('\n✅ All delete functionality tests completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Open http://localhost:3000 in your browser')
    console.log('2. Log in to get a valid token')
    console.log('3. Create a question and answer')
    console.log('4. Try deleting your own questions and answers')
    console.log('5. Verify that delete buttons only appear for your own content')
    console.log('6. Check the server logs for detailed debug information')
    console.log('7. Verify that deleted items are removed from the UI immediately')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000')
    }
  }
}

testDeleteFunctionality() 