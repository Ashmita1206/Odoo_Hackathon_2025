const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: {
    type: String,
    enum: ['question', 'answer'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  votes: {
    upvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    downvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes
commentSchema.index({ contentType: 1, contentId: 1 })
commentSchema.index({ author: 1, createdAt: -1 })

// Virtual for vote count
commentSchema.virtual('voteCount').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length
})

// Virtual for vote status (for a specific user)
commentSchema.methods.getVoteStatus = function(userId) {
  if (!userId) return null
  
  const upvoted = this.votes.upvotes.some(vote => vote.user.toString() === userId.toString())
  const downvoted = this.votes.downvotes.some(vote => vote.user.toString() === userId.toString())
  
  if (upvoted) return 'upvote'
  if (downvoted) return 'downvote'
  return null
}

// Method to add vote
commentSchema.methods.addVote = function(userId, voteType) {
  // Remove existing votes from this user
  this.votes.upvotes = this.votes.upvotes.filter(vote => vote.user.toString() !== userId.toString())
  this.votes.downvotes = this.votes.downvotes.filter(vote => vote.user.toString() !== userId.toString())
  
  // Add new vote
  if (voteType === 'upvote') {
    this.votes.upvotes.push({ user: userId })
  } else if (voteType === 'downvote') {
    this.votes.downvotes.push({ user: userId })
  }
  
  return this.save()
}

// Pre-save middleware to mark as edited
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true
  }
  next()
})

// Ensure virtuals are serialized
commentSchema.set('toJSON', { virtuals: true })
commentSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Comment', commentSchema) 