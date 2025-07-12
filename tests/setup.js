// Jest setup file
process.env.NODE_ENV = 'test'
process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/stackit-test'
process.env.JWT_SECRET = 'test-secret-key'

// Increase timeout for all tests
jest.setTimeout(10000) 