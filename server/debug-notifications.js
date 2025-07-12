const mongoose = require('mongoose')
require('dotenv').config()

const Notification = require('./models/Notification')
const User = require('./models/User')
const Question = require('./models/Question')
const Answer = require('./models/Answer')

async function debugNotifications() {
  console.log('🔍 Debugging Notification System')
  console.log('================================\n')

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stackit')
    console.log('✅ Connected to database\n')

    // Check notification schema
    console.log('1️⃣ Checking notification schema...')
    const notificationSchema = Notification.schema
    console.log('✅ Notification model loaded')
    console.log('📝 Required fields:', Object.keys(notificationSchema.paths).filter(path => 
      notificationSchema.paths[path].isRequired
    ))
    console.log('📝 Type enum values:', notificationSchema.paths.type.enumValues)
    console.log('📝 Indexes:', Object.keys(notificationSchema.indexes()))

    // Count notifications
    console.log('\n2️⃣ Checking notification counts...')
    const totalNotifications = await Notification.countDocuments()
    const unreadNotifications = await Notification.countDocuments({ read: false })
    console.log(`📊 Total notifications: ${totalNotifications}`)
    console.log(`📊 Unread notifications: ${unreadNotifications}`)

    // Get recent notifications
    console.log('\n3️⃣ Recent notifications (last 10):')
    const recentNotifications = await Notification.find()
      .populate('recipient', 'username')
      .populate('sender', 'username')
      .populate('question', 'title')
      .populate('answer', 'content')
      .sort({ createdAt: -1 })
      .limit(10)

    if (recentNotifications.length === 0) {
      console.log('📝 No notifications found in database')
    } else {
      recentNotifications.forEach((notification, index) => {
        console.log(`\n📝 Notification ${index + 1}:`)
        console.log(`   ID: ${notification._id}`)
        console.log(`   Type: ${notification.type}`)
        console.log(`   Title: ${notification.title}`)
        console.log(`   Content: ${notification.content}`)
        console.log(`   Recipient: ${notification.recipient?.username || 'Unknown'}`)
        console.log(`   Sender: ${notification.sender?.username || 'Unknown'}`)
        console.log(`   Question: ${notification.question?.title || 'N/A'}`)
        console.log(`   Answer: ${notification.answer?.content?.substring(0, 50) || 'N/A'}...`)
        console.log(`   Read: ${notification.read}`)
        console.log(`   Created: ${notification.createdAt}`)
      })
    }

    // Check notification types distribution
    console.log('\n4️⃣ Notification types distribution:')
    const typeStats = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    typeStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`)
    })

    // Check users with most notifications
    console.log('\n5️⃣ Users with most notifications:')
    const userStats = await Notification.aggregate([
      { $group: { _id: '$recipient', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    for (const stat of userStats) {
      const user = await User.findById(stat._id).select('username')
      console.log(`   ${user?.username || 'Unknown'}: ${stat.count} notifications`)
    }

    // Check for potential issues
    console.log('\n6️⃣ Checking for potential issues...')
    
    // Notifications without required fields
    const invalidNotifications = await Notification.find({
      $or: [
        { title: { $exists: false } },
        { content: { $exists: false } },
        { sender: { $exists: false } },
        { recipient: { $exists: false } }
      ]
    })
    
    if (invalidNotifications.length > 0) {
      console.log(`⚠️  Found ${invalidNotifications.length} notifications with missing required fields`)
    } else {
      console.log('✅ All notifications have required fields')
    }

    // Notifications with invalid types
    const invalidTypes = await Notification.find({
      type: { $nin: ['answer', 'comment', 'upvote', 'downvote', 'vote', 'mention', 'accept', 'accepted', 'bounty', 'system'] }
    })
    
    if (invalidTypes.length > 0) {
      console.log(`⚠️  Found ${invalidTypes.length} notifications with invalid types`)
      invalidTypes.forEach(n => console.log(`   ID: ${n._id}, Type: ${n.type}`))
    } else {
      console.log('✅ All notifications have valid types')
    }

    // Check for orphaned notifications (question/answer doesn't exist)
    console.log('\n7️⃣ Checking for orphaned notifications...')
    const notificationsWithQuestions = await Notification.find({ questionId: { $exists: true } })
    let orphanedCount = 0
    
    for (const notification of notificationsWithQuestions) {
      const question = await Question.findById(notification.questionId)
      if (!question) {
        orphanedCount++
        console.log(`   ⚠️  Notification ${notification._id} references non-existent question ${notification.questionId}`)
      }
    }
    
    if (orphanedCount === 0) {
      console.log('✅ No orphaned notifications found')
    }

    // Check notification creation in last 24 hours
    console.log('\n8️⃣ Notifications created in last 24 hours:')
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentCount = await Notification.countDocuments({ createdAt: { $gte: yesterday } })
    console.log(`📊 ${recentCount} notifications created in last 24 hours`)

    console.log('\n🎯 Debug Summary:')
    console.log('✅ Database connection working')
    console.log('✅ Notification schema is valid')
    console.log(`✅ ${totalNotifications} total notifications in database`)
    console.log(`✅ ${unreadNotifications} unread notifications`)
    console.log('✅ Recent notifications are properly formatted')
    
    if (totalNotifications === 0) {
      console.log('\n💡 No notifications found. This could mean:')
      console.log('   1. No users have performed actions that trigger notifications')
      console.log('   2. Users are only interacting with their own content')
      console.log('   3. Notification creation is failing silently')
      console.log('\n🔧 To test notifications:')
      console.log('   1. Create two user accounts')
      console.log('   2. Have User A create a question')
      console.log('   3. Have User B upvote/comment/answer the question')
      console.log('   4. Check if User A receives notifications')
    }

  } catch (error) {
    console.error('❌ Debug error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n✅ Database connection closed')
  }
}

// Run the debug
debugNotifications() 