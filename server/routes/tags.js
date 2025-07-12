const express = require('express')
const router = express.Router()
const Tag = require('../models/Tag')
const Question = require('../models/Question')

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50 } = req.query
    let query = { isActive: true }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const tags = await Tag.find(query)
      .sort({ questionCount: -1, name: 1 })
      .limit(parseInt(limit))

    res.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get popular tags
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const tags = await Tag.getPopularTags(parseInt(limit))
    res.json(tags)
  } catch (error) {
    console.error('Error fetching popular tags:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get trending tags
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const tags = await Tag.getTrendingTags(parseInt(limit))
    res.json(tags)
  } catch (error) {
    console.error('Error fetching trending tags:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Search tags
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const tags = await Tag.searchTags(q, parseInt(limit))
    res.json(tags)
  } catch (error) {
    console.error('Error searching tags:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get tag by name
router.get('/:name', async (req, res) => {
  try {
    const tag = await Tag.findOne({ 
      name: req.params.name.toLowerCase(),
      isActive: true 
    })

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }

    res.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get questions by tag
router.get('/:name/questions', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'newest' } = req.query
    const skip = (page - 1) * limit

    const tag = await Tag.findOne({ 
      name: req.params.name.toLowerCase(),
      isActive: true 
    })

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }

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
      case 'views':
        sortOption = { viewCount: -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const questions = await Question.find({ tags: tag.name })
      .populate('author', 'username')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Question.countDocuments({ tags: tag.name })

    res.json({
      tag,
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tag questions:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 