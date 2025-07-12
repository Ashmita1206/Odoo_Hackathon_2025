const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  color: {
    type: String,
    default: '#3B82F6',
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v)
      },
      message: 'Color must be a valid hex color'
    }
  },
  questionCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  trendingScore: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  synonyms: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  relatedTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes
tagSchema.index({ name: 1 })
tagSchema.index({ questionCount: -1 })
tagSchema.index({ trendingScore: -1 })
tagSchema.index({ isActive: 1 })

// Virtual for tag URL
tagSchema.virtual('url').get(function() {
  return `/questions?tag=${this.name}`
})

// Method to increment question count
tagSchema.methods.incrementQuestionCount = function() {
  this.questionCount += 1
  this.trendingScore += 1
  return this.save()
}

// Method to decrement question count
tagSchema.methods.decrementQuestionCount = function() {
  this.questionCount = Math.max(0, this.questionCount - 1)
  this.trendingScore = Math.max(0, this.trendingScore - 1)
  return this.save()
}

// Method to increment view count
tagSchema.methods.incrementViewCount = function() {
  this.viewCount += 1
  this.trendingScore += 0.1
  return this.save()
}

// Static method to find or create tag
tagSchema.statics.findOrCreate = async function(tagName) {
  let tag = await this.findOne({ name: tagName.toLowerCase() })
  
  if (!tag) {
    tag = new this({
      name: tagName.toLowerCase(),
      description: `Questions about ${tagName}`,
      color: this.getRandomColor()
    })
    await tag.save()
  }
  
  return tag
}

// Static method to get random color
tagSchema.statics.getRandomColor = function() {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Static method to get popular tags
tagSchema.statics.getPopularTags = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ questionCount: -1, trendingScore: -1 })
    .limit(limit)
}

// Static method to get trending tags
tagSchema.statics.getTrendingTags = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ trendingScore: -1, questionCount: -1 })
    .limit(limit)
}

// Static method to search tags
tagSchema.statics.searchTags = function(query, limit = 10) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { synonyms: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  })
    .sort({ questionCount: -1 })
    .limit(limit)
}

// Pre-save middleware to ensure name is lowercase
tagSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.toLowerCase()
  }
  next()
})

// Ensure virtuals are serialized
tagSchema.set('toJSON', { virtuals: true })
tagSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Tag', tagSchema) 