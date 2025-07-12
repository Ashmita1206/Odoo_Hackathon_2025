const express = require('express')
const { body, validationResult } = require('express-validator')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const User = require('../models/User')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/questions
// @desc    Get all questions with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'newest',
      search = '',
      tags = '',
      status = 'all',
      timeRange = 'all'
    } = req.query

    const skip = (page - 1) * limit
    const query = { isDeleted: false }

    // Search filter
    if (search) {
      query.$text = { $search: search }
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').filter(tag => tag.trim())
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray }
      }
    }

    // Status filter
    if (status === 'unanswered') {
      query.answerCount = 0
    } else if (status === 'answered') {
      query.answerCount = { $gt: 0 }
    } else if (status === 'accepted') {
      query.acceptedAnswer = { $exists: true, $ne: null }
    }

    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date()
      let startDate
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate }
      }
    }

    // Sort options
    let sortOption = {}
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'votes':
        sortOption = { 'votes.upvotes': -1 }
        break
      case 'answers':
        sortOption = { answerCount: -1 }
        break
      case 'views':
        sortOption = { viewCount: -1 }
        break
      case 'trending':
        // Simple trending algorithm: recent questions with votes
        sortOption = { 
          $expr: {
            $divide: [
              { $add: [{ $size: '$votes.upvotes' }, { $size: '$votes.downvotes' }] },
              { $add: [{ $subtract: [new Date(), '$createdAt'] }, 1] }
            ]
          }
        }
        break
    }

    const questions = await Question.find(query)
      .populate('author', 'username reputation avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    const total = await Question.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Add virtual fields
    const questionsWithVirtuals = questions.map(q => ({
      ...q,
      voteCount: q.votes.upvotes.length - q.votes.downvotes.length,
      totalVotes: q.votes.upvotes.length + q.votes.downvotes.length,
      isAnswered: q.answerCount > 0,
      isAccepted: !!q.acceptedAnswer
    }))

    res.json({
      questions: questionsWithVirtuals,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get questions error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/questions/:id
// @desc    Get a single question by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username reputation avatar bio createdAt')
      .populate('acceptedAnswer')
      .populate('closedBy', 'username')

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Increment view count
    await question.incrementViewCount()

    // Get answers
    const answers = await Answer.find({ 
      question: question._id,
      isDeleted: false 
    })
      .populate('author', 'username reputation avatar')
      .sort({ isAccepted: -1, 'votes.upvotes': -1, createdAt: 1 })
      .lean()

    // Add virtual fields to answers
    const answersWithVirtuals = answers.map(a => ({
      ...a,
      voteCount: a.votes.upvotes.length - a.votes.downvotes.length,
      totalVotes: a.votes.upvotes.length + a.votes.downvotes.length
    }))

    // Add virtual fields to question
    const questionWithVirtuals = {
      ...question.toObject(),
      voteCount: question.voteCount,
      totalVotes: question.totalVotes,
      isAnswered: question.isAnswered,
      isAccepted: question.isAccepted
    }

    res.json({
      question: questionWithVirtuals,
      answers: answersWithVirtuals
    })
  } catch (error) {
    console.error('Get question error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', [
  authenticateToken,
  body('title')
    .isLength({ min: 10, max: 150 })
    .withMessage('Title must be between 10 and 150 characters'),
  body('content')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters'),
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Must provide 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { title, content, tags } = req.body

    // Validate tags
    const validTags = tags.filter(tag => 
      typeof tag === 'string' && 
      tag.length >= 2 && 
      tag.length <= 20 &&
      /^[a-zA-Z0-9-]+$/.test(tag)
    )

    if (validTags.length === 0) {
      return res.status(400).json({ message: 'At least one valid tag is required' })
    }

    const question = new Question({
      title,
      content,
      author: req.user._id,
      tags: validTags.map(tag => tag.toLowerCase())
    })

    await question.save()

    // Populate author info
    await question.populate('author', 'username reputation avatar')

    res.status(201).json({
      message: 'Question created successfully',
      question: {
        ...question.toObject(),
        voteCount: question.voteCount,
        totalVotes: question.totalVotes,
        isAnswered: question.isAnswered,
        isAccepted: question.isAccepted
      }
    })
  } catch (error) {
    console.error('Create question error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('title')
    .optional()
    .isLength({ min: 10, max: 150 })
    .withMessage('Title must be between 10 and 150 characters'),
  body('content')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters'),
  body('tags')
    .optional()
    .isArray({ min: 1, max: 5 })
    .withMessage('Must provide 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const question = await Question.findById(req.params.id)

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Check permissions
    if (question.author.toString() !== req.user._id.toString() && !req.user.canEditOthers()) {
      return res.status(403).json({ message: 'Not authorized to edit this question' })
    }

    const { title, content, tags, reason } = req.body

    // Save edit history
    question.editHistory.push({
      content: question.content,
      editedBy: req.user._id,
      reason: reason || 'Updated question'
    })

    if (title) question.title = title
    if (content) question.content = content
    if (tags) {
      const validTags = tags.filter(tag => 
        typeof tag === 'string' && 
        tag.length >= 2 && 
        tag.length <= 20 &&
        /^[a-zA-Z0-9-]+$/.test(tag)
      )
      if (validTags.length > 0) {
        question.tags = validTags.map(tag => tag.toLowerCase())
      }
    }

    question.isEdited = true
    await question.save()

    await question.populate('author', 'username reputation avatar')

    res.json({
      message: 'Question updated successfully',
      question: {
        ...question.toObject(),
        voteCount: question.voteCount,
        totalVotes: question.totalVotes,
        isAnswered: question.isAnswered,
        isAccepted: question.isAccepted
      }
    })
  } catch (error) {
    console.error('Update question error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/questions/:id called')
    console.log('🗑️ Question ID:', req.params.id)
    console.log('🗑️ User ID:', req.user._id)
    
    const question = await Question.findById(req.params.id)

    if (!question || question.isDeleted) {
      console.log('❌ Question not found or already deleted')
      return res.status(404).json({ message: 'Question not found' })
    }

    // Check permissions
    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      console.log('❌ User not authorized to delete this question')
      return res.status(403).json({ message: 'Not authorized to delete this question' })
    }

    console.log('✅ User authorized, proceeding with deletion')
    await question.softDelete(req.user._id)
    console.log('✅ Question deleted successfully')

    res.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('❌ Delete question error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   POST /api/questions/:id/upvote
// @desc    Upvote a question
// @access  Private
router.post('/:id/upvote', authenticateToken, async (req, res) => {
  try {
    console.log('⬆️ Question upvote called:', req.params.id, 'User:', req.user._id);
    const question = await Question.findById(req.params.id).populate('author', 'username');

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const userId = req.user._id.toString();
    const existingUpvote = question.votes.upvotes.find(vote => vote.user.toString() === userId);
    const existingDownvote = question.votes.downvotes.find(vote => vote.user.toString() === userId);
    
    if (existingUpvote) {
      // Remove upvote (toggle off)
      question.votes.upvotes = question.votes.upvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬆️ Question upvote removed');
    } else {
      // Add upvote and remove downvote if exists
      question.votes.upvotes.push({ user: req.user._id });
      question.votes.downvotes = question.votes.downvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬆️ Question upvote added');
      
      // Create notification for question author (if not self)
      if (question.author._id.toString() !== req.user._id.toString()) {
        try {
          const notification = await require('../models/Notification').create({
            recipient: question.author._id,
            sender: req.user._id,
            type: 'upvote',
            questionId: question._id
          });
          console.log('📩 Notification created:', notification);
        } catch (error) {
          console.error('❌ Error creating question upvote notification:', error);
        }
      }
    }
    
    await question.save();
    await question.populate('author', 'username reputation avatar');
    
    console.log('✅ Question upvote successful. New vote count:', question.voteCount);
    res.status(200).json(question);
  } catch (error) {
    console.error('❌ Question upvote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/questions/:id/downvote
// @desc    Downvote a question
// @access  Private
router.post('/:id/downvote', authenticateToken, async (req, res) => {
  try {
    console.log('⬇️ Question downvote called:', req.params.id, 'User:', req.user._id);
    const question = await Question.findById(req.params.id).populate('author', 'username');

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const userId = req.user._id.toString();
    const existingDownvote = question.votes.downvotes.find(vote => vote.user.toString() === userId);
    const existingUpvote = question.votes.upvotes.find(vote => vote.user.toString() === userId);
    
    if (existingDownvote) {
      // Remove downvote (toggle off)
      question.votes.downvotes = question.votes.downvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬇️ Question downvote removed');
    } else {
      // Add downvote and remove upvote if exists
      question.votes.downvotes.push({ user: req.user._id });
      question.votes.upvotes = question.votes.upvotes.filter(vote => vote.user.toString() !== userId);
      console.log('⬇️ Question downvote added');
      
      // Create notification for question author (if not self)
      if (question.author._id.toString() !== req.user._id.toString()) {
        try {
          const notification = await require('../models/Notification').create({
            recipient: question.author._id,
            sender: req.user._id,
            type: 'downvote',
            questionId: question._id
          });
          console.log('📩 Notification created:', notification);
        } catch (error) {
          console.error('❌ Error creating question downvote notification:', error);
        }
      }
    }
    
    await question.save();
    await question.populate('author', 'username reputation avatar');
    
    console.log('✅ Question downvote successful. New vote count:', question.voteCount);
    res.status(200).json(question);
  } catch (error) {
    console.error('❌ Question downvote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/questions/:id/vote
// @desc    Vote on a question
// @access  Private
router.post('/:id/vote', [
  authenticateToken,
  body('voteType')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const question = await Question.findById(req.params.id)

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Check if user can vote
    if (!req.user.canVote()) {
      return res.status(403).json({ message: 'Insufficient reputation to vote' })
    }

    const { voteType } = req.body

    await question.addVote(req.user._id, voteType)

    // Update author reputation
    const reputationChange = voteType === 'upvote' ? 10 : -2
    await question.author.updateReputation(reputationChange)

    res.json({
      message: 'Vote recorded successfully',
      voteCount: question.voteCount,
      totalVotes: question.totalVotes
    })
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/questions/:id/accept-answer
// @desc    Accept an answer
// @access  Private
router.post('/:id/accept-answer', [
  authenticateToken,
  body('answerId')
    .isMongoId()
    .withMessage('Valid answer ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const question = await Question.findById(req.params.id)
    const answer = await Answer.findById(req.body.answerId)

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: 'Question not found' })
    }

    if (!answer || answer.isDeleted) {
      return res.status(404).json({ message: 'Answer not found' })
    }

    // Check permissions
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the question author can accept answers' })
    }

    // Accept the answer
    await answer.accept(req.user._id)
    await question.acceptAnswer(answer._id)

    // Award reputation to answer author
    await answer.author.updateReputation(15)

    // Create notification for answer author (if not self)
    if (answer.author.toString() !== req.user._id.toString()) {
      try {
        const notification = await require('../models/Notification').create({
          recipient: answer.author,
          sender: req.user._id,
          type: 'accepted',
          questionId: question._id,
          answerId: answer._id
        });
        console.log('📩 Notification created:', notification);
      } catch (error) {
        console.error('❌ Error creating answer accepted notification:', error);
      }
    }

    res.json({ message: 'Answer accepted successfully' })
  } catch (error) {
    console.error('Accept answer error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 