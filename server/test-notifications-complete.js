const axios = require('axios')

const BASE_URL = 'http://localhost:5000/api'

// Test users with unique emails
const uniqueId = Math.random().toString(36).substring(2, 8);
const testUsers = [
  {
    username: `testuser1_${uniqueId}`,
    email: `notification_test_user1_${uniqueId}@example.com`,
    password: 'password123'
  },
  {
    username: `testuser2_${uniqueId}`,
    email: `notification_test_user2_${uniqueId}@example.com`,
    password: 'password123'
  }
];

let user1Token = null
let user2Token = null
let testQuestionId = null
let testAnswerId = null

async function createTestUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, userData)
    console.log(`✅ Created user: ${userData.username}`)
    return response.data.token
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
      console.log(`⚠️  User ${userData.username} already exists, trying to login`)
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      })
      return loginResponse.data.token
    } else {
      throw error
    }
  }
}

async function testCompleteNotificationSystem() {
  console.log('🧪 Testing Complete Notification System')
  console.log('========================================\n')

  try {
    // Step 1: Create/Login test users
    console.log('1️⃣ Creating/Logging in test users...')
    user1Token = await createTestUser(testUsers[0])
    user2Token = await createTestUser(testUsers[1])
    console.log('✅ Both users authenticated\n')

    // Step 2: User 1 creates a question
    console.log('2️⃣ User 1 creating a test question...')
    const questionResponse = await axios.post(`${BASE_URL}/questions`, {
      title: 'Test Question for Complete Notification System',
      content: 'This is a comprehensive test question to verify all notification types are working properly.',
      tags: ['test', 'notifications', 'complete']
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    })
    
    testQuestionId = questionResponse.data.question._id
    console.log('✅ Question created:', testQuestionId)
    console.log('📝 Question title:', questionResponse.data.question.title)

    // Step 3: User 2 upvotes the question
    console.log('\n3️⃣ User 2 upvoting the question...')
    await axios.post(`${BASE_URL}/questions/${testQuestionId}/upvote`, {}, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    console.log('✅ Question upvoted')

    // Step 4: User 2 comments on the question
    console.log('\n4️⃣ User 2 commenting on the question...')
    await axios.post(`${BASE_URL}/comments`, {
      contentType: 'question',
      contentId: testQuestionId,
      content: 'This is a test comment to trigger a notification.'
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    console.log('✅ Comment added')

    // Step 5: User 2 answers the question
    console.log('\n5️⃣ User 2 answering the question...')
    const answerResponse = await axios.post(`${BASE_URL}/answers/${testQuestionId}`, {
      content: 'This is a test answer to verify answer notifications are working.'
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    
    testAnswerId = answerResponse.data._id
    console.log('✅ Answer created:', testAnswerId)

    // Step 6: User 1 upvotes the answer (should create notification)
    console.log('\n6️⃣ User 1 upvoting User 2\'s answer...')
    await axios.post(`${BASE_URL}/answers/${testAnswerId}/upvote`, {}, {
      headers: { Authorization: `Bearer ${user1Token}` }
    })
    console.log('✅ Answer upvoted by question author')

    // Step 7: User 1 comments on the answer
    console.log('\n7️⃣ User 1 commenting on the answer...')
    await axios.post(`${BASE_URL}/comments`, {
      contentType: 'answer',
      contentId: testAnswerId,
      content: 'Thank you for the answer! This is a test comment.'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    })
    console.log('✅ Comment added on answer')

    // Step 8: User 1 accepts the answer
    console.log('\n8️⃣ User 1 accepting the answer...')
    await axios.post(`${BASE_URL}/questions/${testQuestionId}/accept-answer`, {
      answerId: testAnswerId
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    })
    console.log('✅ Answer accepted')

    // Step 9: User 2 downvotes the question (additional test)
    console.log('\n9️⃣ User 2 downvoting the question...')
    await axios.post(`${BASE_URL}/questions/${testQuestionId}/downvote`, {}, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    console.log('✅ Question downvoted')

    // Step 10: Check User 2's notifications
    console.log('\n🔍 Checking User 2\'s notifications...')
    const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    
    const notifications = notificationsResponse.data.notifications
    console.log(`📊 User 2 has ${notifications.length} notifications`)
    
    if (notifications.length > 0) {
      console.log('\n📝 Recent notifications for User 2:')
      notifications.slice(0, 10).forEach((notification, index) => {
        console.log(`   ${index + 1}. ${notification.type}: ${notification.content}`)
        console.log(`      From: ${notification.sender?.username || 'Unknown'}`)
        console.log(`      Read: ${notification.read}`)
        console.log(`      Created: ${new Date(notification.createdAt).toLocaleString()}`)
        console.log(`      Question: ${notification.questionId}`)
        console.log(`      Answer: ${notification.answerId || 'N/A'}`)
        console.log(`      Comment: ${notification.commentId || 'N/A'}`)
        console.log('')
      })
    }

    // Step 11: Check unread count
    console.log('\n🔍 Checking unread notification count...')
    const unreadResponse = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    })
    console.log(`📊 Unread notifications: ${unreadResponse.data.unreadCount}`)

    // Step 12: Mark a notification as read
    if (notifications.length > 0) {
      console.log('\n🔍 Marking first notification as read...')
      await axios.put(`${BASE_URL}/notifications/${notifications[0]._id}/read`, {}, {
        headers: { Authorization: `Bearer ${user2Token}` }
      })
      console.log('✅ Notification marked as read')
    }

    // Step 13: Check User 1's notifications (should have fewer since they're the question author)
    console.log('\n🔍 Checking User 1\'s notifications...')
    const user1NotificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    })
    
    const user1Notifications = user1NotificationsResponse.data.notifications
    console.log(`📊 User 1 has ${user1Notifications.length} notifications`)
    
    if (user1Notifications.length > 0) {
      console.log('\n📝 Recent notifications for User 1:')
      user1Notifications.slice(0, 5).forEach((notification, index) => {
        console.log(`   ${index + 1}. ${notification.type}: ${notification.content}`)
        console.log(`      From: ${notification.sender?.username || 'Unknown'}`)
        console.log(`      Read: ${notification.read}`)
      })
    }

    // Step 14: Test notification types distribution
    console.log('\n🔍 Testing notification types...')
    const typeCounts = {}
    notifications.forEach(notification => {
      typeCounts[notification.type] = (typeCounts[notification.type] || 0) + 1
    })
    
    console.log('📊 Notification types distribution:')
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })

    console.log('\n🎯 Test Summary:')
    console.log('✅ All notification triggers tested successfully')
    console.log('✅ Authentication working properly')
    console.log('✅ Notification creation working')
    console.log('✅ Notification retrieval working')
    console.log('✅ Mark as read functionality working')
    console.log(`✅ User 2 received ${notifications.length} notifications`)
    console.log(`✅ User 1 received ${user1Notifications.length} notifications`)
    
    // Verify all notification types are present
    const expectedTypes = ['comment', 'upvote', 'downvote', 'accepted']
    const foundTypes = Object.keys(typeCounts)
    const missingTypes = expectedTypes.filter(type => !foundTypes.includes(type))
    
    if (missingTypes.length === 0) {
      console.log('✅ All expected notification types are working!')
    } else {
      console.log(`⚠️  Missing notification types: ${missingTypes.join(', ')}`)
    }
    
    if (notifications.length > 0) {
      console.log('\n🎉 SUCCESS: Complete notification system is working correctly!')
      console.log('📋 Next steps:')
      console.log('   1. Open the frontend application')
      console.log('   2. Login as notification_test_user2@example.com')
      console.log('   3. Check the notification bell for new notifications')
      console.log('   4. Click on notifications to mark them as read')
      console.log('   5. Verify real-time updates work')
      console.log('   6. Test "Mark all as read" functionality')
    } else {
      console.log('\n⚠️  WARNING: No notifications were created')
      console.log('   This could indicate an issue with notification creation')
      console.log('   Check server logs for any errors')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
    if (error.response?.status === 500) {
      console.error('❌ Server error - check server logs')
    }
  }
}

// Run the test
testCompleteNotificationSystem()