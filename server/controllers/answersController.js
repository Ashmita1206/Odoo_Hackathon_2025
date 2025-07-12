const Answer = require('../models/Answer');
const Notification = require('../models/Notification');

// Helper function to create notifications
const createNotification = async (recipientId, senderId, type, content, questionId, answerId) => {
  try {
    // Don't create notification if user is voting on their own content
    if (recipientId.toString() === senderId.toString()) {
      return;
    }

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: type,
      questionId: questionId,
      answerId: answerId
    }).then(notification => {
      console.log('📩 Notification created:', notification);
    });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
  }
};

// Upvote Answer
exports.upvoteAnswer = async (req, res) => {
  try {
    console.log('⬆️ Upvote called:', req.params.answerId, 'User:', req.user._id);
    const answer = await Answer.findById(req.params.answerId).populate('author', 'username');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user._id.toString();
    
    // Check if user already upvoted
    const existingUpvote = answer.votes.upvotes.find(vote => vote.user.toString() === userId);
    const existingDownvote = answer.votes.downvotes.find(vote => vote.user.toString() === userId);
    
    if (existingUpvote) {
      // Remove upvote (toggle off)
      answer.votes.upvotes = answer.votes.upvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬆️ Upvote removed');
    } else {
      // Add upvote and remove downvote if exists
      answer.votes.upvotes.push({ user: req.user._id });
      answer.votes.downvotes = answer.votes.downvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬆️ Upvote added');
      
      // Create notification for answer author
      await createNotification(
        answer.author._id,
        req.user._id,
        'upvote',
        `${req.user.username} upvoted your answer`,
        answer.question,
        answer._id
      );
    }
    
    await answer.save();
    await answer.populate('author', 'username avatar reputation');
    
    console.log('✅ Upvote successful. New vote count:', answer.voteCount);
    res.status(200).json(answer);
  } catch (error) {
    console.error('❌ Upvote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Downvote Answer
exports.downvoteAnswer = async (req, res) => {
  try {
    console.log('⬇️ Downvote called:', req.params.answerId, 'User:', req.user._id);
    const answer = await Answer.findById(req.params.answerId).populate('author', 'username');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user._id.toString();
    
    // Check if user already downvoted
    const existingDownvote = answer.votes.downvotes.find(vote => vote.user.toString() === userId);
    const existingUpvote = answer.votes.upvotes.find(vote => vote.user.toString() === userId);
    
    if (existingDownvote) {
      // Remove downvote (toggle off)
      answer.votes.downvotes = answer.votes.downvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬇️ Downvote removed');
    } else {
      // Add downvote and remove upvote if exists
      answer.votes.downvotes.push({ user: req.user._id });
      answer.votes.upvotes = answer.votes.upvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬇️ Downvote added');
      
      // Create notification for answer author
      await createNotification(
        answer.author._id,
        req.user._id,
        'downvote',
        `${req.user.username} downvoted your answer`,
        answer.question,
        answer._id
      );
    }
    
    await answer.save();
    await answer.populate('author', 'username avatar reputation');
    
    console.log('✅ Downvote successful. New vote count:', answer.voteCount);
    res.status(200).json(answer);
  } catch (error) {
    console.error('❌ Downvote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 