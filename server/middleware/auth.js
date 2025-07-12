const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    console.log('🔍 Auth Debug - Header:', authHeader)
    
    const token = authHeader && authHeader.split(' ')[1]
    console.log('🔍 Auth Debug - Token:', token ? token.substring(0, 20) + '...' : 'No token')

    if (!token) {
      console.log('❌ No token provided')
      return res.status(401).json({ message: 'Access token required' })
    }

    console.log('🔍 Auth Debug - JWT_SECRET exists:', !!process.env.JWT_SECRET)
    console.log('🔍 Auth Debug - JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0)
    
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is not configured')
      return res.status(500).json({ message: 'Server configuration error' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('🔍 Auth Debug - Decoded token:', { userId: decoded.userId, exp: decoded.exp })
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.log('❌ Token expired')
      return res.status(401).json({ message: 'Token expired' })
    }
    
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      console.log('❌ User not found for token')
      return res.status(401).json({ message: 'Invalid token' })
    }

    console.log('✅ Auth successful for user:', user.username)
    req.user = user
    next()
  } catch (error) {
    console.log('❌ Auth error:', error.name, error.message)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Token not active' })
    }
    
    console.log('❌ Unexpected auth error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    
    if (!token) {
      return next(new Error('Authentication error'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return next(new Error('Authentication error'))
    }

    socket.userId = user._id.toString()
    socket.user = user
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = {
  authenticateToken,
  authenticateSocket,
  requireAdmin
} 