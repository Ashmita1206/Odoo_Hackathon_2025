const request = require('supertest')
const mongoose = require('mongoose')
const { app } = require('../server/index')
const User = require('../server/models/User')
const Question = require('../server/models/Question')
const Answer = require('../server/models/Answer')

describe('Critical User Flows', () => {
  let testUser, testQuestion, testAnswer, authToken

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/stackit-test')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clean up test data
    await User.deleteMany({})
    await Question.deleteMany({})
    await Answer.deleteMany({})

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })

    authToken = loginResponse.body.token
  })

  describe('Authentication Flow', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).toHaveProperty('username', 'newuser')
    })

    test('should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).toHaveProperty('username', 'testuser')
    })

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
    })
  })

  describe('Question Flow', () => {
    test('should create a new question', async () => {
      const questionData = {
        title: 'Test Question',
        content: 'This is a test question content',
        tags: ['javascript', 'testing']
      }

      const response = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(questionData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('title', 'Test Question')
      expect(response.body.tags).toContain('javascript')
    })

    test('should get questions list', async () => {
      // Create a test question first
      testQuestion = await Question.create({
        title: 'Test Question',
        content: 'Test content',
        author: testUser._id,
        tags: ['javascript']
      })

      const response = await request(app)
        .get('/api/questions')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.questions)).toBe(true)
      expect(response.body.questions.length).toBeGreaterThan(0)
    })

    test('should get question by id', async () => {
      testQuestion = await Question.create({
        title: 'Test Question',
        content: 'Test content',
        author: testUser._id,
        tags: ['javascript']
      })

      const response = await request(app)
        .get(`/api/questions/${testQuestion._id}`)

      expect(response.status).toBe(200)
      expect(response.body.question).toHaveProperty('title', 'Test Question')
    })
  })

  describe('Answer Flow', () => {
    beforeEach(async () => {
      testQuestion = await Question.create({
        title: 'Test Question',
        content: 'Test content',
        author: testUser._id,
        tags: ['javascript']
      })
    })

    test('should create an answer', async () => {
      const answerData = {
        questionId: testQuestion._id,
        content: 'This is a test answer'
      }

      const response = await request(app)
        .post('/api/answers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(answerData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('content', 'This is a test answer')
    })

    test('should get answers for a question', async () => {
      // Create a test answer
      testAnswer = await Answer.create({
        question: testQuestion._id,
        content: 'Test answer',
        author: testUser._id
      })

      const response = await request(app)
        .get(`/api/questions/${testQuestion._id}`)

      expect(response.status).toBe(200)
      expect(response.body.answers).toBeDefined()
      expect(Array.isArray(response.body.answers)).toBe(true)
    })
  })

  describe('Voting Flow', () => {
    beforeEach(async () => {
      testQuestion = await Question.create({
        title: 'Test Question',
        content: 'Test content',
        author: testUser._id,
        tags: ['javascript']
      })
    })

    test('should upvote a question', async () => {
      const response = await request(app)
        .post(`/api/questions/${testQuestion._id}/vote`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ voteType: 'upvote' })

      expect(response.status).toBe(200)
      
      // Verify vote was recorded
      const updatedQuestion = await Question.findById(testQuestion._id)
      expect(updatedQuestion.votes.upvotes).toHaveLength(1)
    })

    test('should downvote a question', async () => {
      const response = await request(app)
        .post(`/api/questions/${testQuestion._id}/vote`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ voteType: 'downvote' })

      expect(response.status).toBe(200)
      
      // Verify vote was recorded
      const updatedQuestion = await Question.findById(testQuestion._id)
      expect(updatedQuestion.votes.downvotes).toHaveLength(1)
    })
  })

  describe('User Profile Flow', () => {
    test('should get user profile', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${testUser.username}`)

      expect(response.status).toBe(200)
      expect(response.body.user).toHaveProperty('username', 'testuser')
    })

    test('should update user profile', async () => {
      const updateData = {
        bio: 'Updated bio'
      }

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.user).toHaveProperty('bio', 'Updated bio')
    })
  })

  describe('Search and Filter Flow', () => {
    beforeEach(async () => {
      await Question.create([
        {
          title: 'JavaScript Question',
          content: 'How to use JavaScript?',
          author: testUser._id,
          tags: ['javascript']
        },
        {
          title: 'Python Question',
          content: 'How to use Python?',
          author: testUser._id,
          tags: ['python']
        }
      ])
    })

    test('should search questions', async () => {
      const response = await request(app)
        .get('/api/questions?search=JavaScript')

      expect(response.status).toBe(200)
      expect(response.body.questions.length).toBeGreaterThan(0)
      expect(response.body.questions[0].title).toContain('JavaScript')
    })

    test('should filter by tags', async () => {
      const response = await request(app)
        .get('/api/questions?tags=javascript')

      expect(response.status).toBe(200)
      expect(response.body.questions.length).toBeGreaterThan(0)
      expect(response.body.questions[0].tags).toContain('javascript')
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid question id', async () => {
      const invalidId = '507f1f77bcf86cd799439011'
      
      const response = await request(app)
        .get(`/api/questions/${invalidId}`)

      expect(response.status).toBe(404)
    })

    test('should handle unauthorized access', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({
          title: 'Test Question',
          content: 'Test content'
        })

      expect(response.status).toBe(401)
    })

    test('should handle invalid data', async () => {
      const response = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
        })

      expect(response.status).toBe(400)
    })
  })
}) 