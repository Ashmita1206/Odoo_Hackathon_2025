# StackIt Q&A Platform - Deployment Guide

This guide will help you deploy the StackIt Q&A platform to Vercel (frontend) and Render (backend) with MongoDB Atlas.

## 🚀 Quick Deployment

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free tier available)

## 📋 Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier)

2. **Configure Database**
   - Create a database user with read/write permissions
   - Get your connection string
   - Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

3. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/stackit?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render)

1. **Connect to GitHub**
   - Go to [Render](https://render.com)
   - Sign up and connect your GitHub account
   - Import your repository

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Set the following configuration:
     - **Name**: `stackit-api`
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://stackit-api.onrender.com`)

### 3. Frontend Deployment (Vercel)

1. **Connect to GitHub**
   - Go to [Vercel](https://vercel.com)
   - Sign up and connect your GitHub account
   - Import your repository

2. **Configure Project**
   - Set the following configuration:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Environment Variables**
   Add these environment variables in Vercel:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://stackit-frontend.vercel.app`)

### 4. Update Backend Client URL

1. **Update Environment Variable**
   - Go back to Render dashboard
   - Update the `CLIENT_URL` environment variable with your Vercel URL
   - Redeploy the service

## 🔧 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stackit?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🧪 Testing Deployment

### 1. Health Check
- Backend: `https://your-backend-url.onrender.com/api/health`
- Should return: `{"status":"OK","timestamp":"..."}`

### 2. Frontend Test
- Visit your Vercel URL
- Try to register a new user
- Create a question
- Test all features

### 3. API Test
```bash
curl https://your-backend-url.onrender.com/api/health
```

## 🔒 Security Considerations

### 1. JWT Secret
- Use a strong, random JWT secret
- Generate one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 2. MongoDB Security
- Use strong database passwords
- Enable network access restrictions
- Use connection string with authentication

### 3. Environment Variables
- Never commit sensitive data to Git
- Use environment variables for all secrets
- Regularly rotate secrets

## 📊 Monitoring

### 1. Render Monitoring
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### 2. Vercel Analytics
- Enable Vercel Analytics
- Monitor performance metrics
- Track user behavior

### 3. MongoDB Atlas
- Monitor database performance
- Set up alerts for high usage
- Regular backups

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel/Render
   - Ensure all dependencies are in package.json
   - Verify build commands

2. **Database Connection**
   - Verify MongoDB connection string
   - Check IP whitelist in Atlas
   - Ensure database user has correct permissions

3. **CORS Issues**
   - Verify CLIENT_URL in backend environment
   - Check CORS configuration in server

4. **Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names
   - Redeploy after changing variables

### Debug Commands

```bash
# Check backend logs
curl https://your-backend-url.onrender.com/api/health

# Test database connection
# Add this to your backend temporarily
console.log('MongoDB URI:', process.env.MONGODB_URI)
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Both Vercel and Render support automatic deployments
- Push to main branch triggers deployment
- Preview deployments for pull requests

### Manual Deployments
- Vercel: Use Vercel CLI
- Render: Trigger from dashboard

## 📈 Performance Optimization

### 1. Frontend
- Enable Vercel Edge Functions
- Use CDN for static assets
- Optimize images and bundles

### 2. Backend
- Enable Render auto-scaling
- Use MongoDB Atlas M10+ for production
- Implement caching strategies

### 3. Database
- Create proper indexes
- Monitor query performance
- Use MongoDB Atlas performance advisor

## 🎯 Next Steps

1. **Custom Domain**
   - Add custom domain in Vercel
   - Configure DNS settings
   - Update environment variables

2. **SSL Certificate**
   - Automatically handled by Vercel/Render
   - Ensure HTTPS is enforced

3. **Backup Strategy**
   - Set up MongoDB Atlas backups
   - Regular database exports
   - Version control for code

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Performance monitoring
   - User analytics

---

**Need Help?** Create an issue in the repository or contact the development team. 