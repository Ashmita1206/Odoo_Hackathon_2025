import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('🔍 API Debug - Token exists:', !!token)
    console.log('🔍 API Debug - Request URL:', config.url)
    console.log('🔍 API Debug - Request method:', config.method)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔍 API Debug - Authorization header set:', `Bearer ${token.substring(0, 20)}...`)
    } else {
      console.log('⚠️ API Debug - No token found in localStorage')
    }
    return config
  },
  (error) => {
    console.log('❌ API Debug - Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔍 API Debug - Response error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Authentication failed'
      console.log('🔍 API Debug - 401 error message:', errorMessage)
      
      // Only redirect if it's a token-related error, not other auth issues
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        console.log('🔍 API Debug - Token error detected, clearing localStorage and redirecting')
        localStorage.removeItem('token')
        
        // Use a flag to prevent multiple redirects
        if (!window.isRedirecting) {
          window.isRedirecting = true
          setTimeout(() => {
            window.location.href = '/login'
            window.isRedirecting = false
          }, 100)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api 