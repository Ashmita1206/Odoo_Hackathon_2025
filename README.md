# StackIt - Professional Q&A Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js" alt="Node.js 18" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB 6.0" />
  <img src="https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite" alt="Vite 5.0" />
  <img src="https://img.shields.io/badge/Tailwind-3.3-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS 3.3" />
</div>

<br />

<div align="center">
  <h3>🚀 Live Demo</h3>
  <p><strong>Frontend:</strong> <a href="https://stackit-frontend.vercel.app">https://stackit-frontend.vercel.app</a></p>
  <p><strong>Backend API:</strong> <a href="https://stackit-api.onrender.com">https://stackit-api.onrender.com</a></p>
  <p><strong>Demo Video:</strong> <a href="https://youtu.be/your-demo-video">Watch Demo</a></p>
</div>

<br />

A modern, full-stack Q&A platform built with React, Node.js, and MongoDB. StackIt provides a professional environment for asking questions, sharing knowledge, and building reputation through collaborative learning.

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Landing+Page" alt="Landing Page" width="400" />
  <img src="https://via.placeholder.com/800x400/10B981/FFFFFF?text=Questions+Feed" alt="Questions Feed" width="400" />
  <br />
  <img src="https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Question+Detail" alt="Question Detail" width="400" />
  <img src="https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Admin+Dashboard" alt="Admin Dashboard" width="400" />
</div>

## 🎥 Demo Video

[![StackIt Demo]()]()

*Click the image above to watch a comprehensive demo of StackIt features*

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Questions & Answers**: Rich text editor with markdown support
- **Voting System**: Upvote/downvote questions and answers
- **Accepted Answers**: Question owners can accept the best answer
- **Tag System**: Categorize questions with multiple tags
- **Search & Filter**: Advanced search with multiple filter options
- **Real-time Notifications**: WebSocket-based notifications for new answers, comments, and mentions

### User Experience
- **Modern UI**: Clean, professional design with dark/light mode
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Rich Text Editor**: Full-featured editor with formatting options
- **Real-time Updates**: Live notifications and updates
- **User Profiles**: Detailed user profiles with reputation system

### Advanced Features
- **Reputation System**: Users gain reputation through helpful contributions
- **Admin Dashboard**: Comprehensive moderation tools
- **Content Moderation**: Flag inappropriate content
- **Edit History**: Track changes to questions and answers
- **Bounty System**: Offer reputation points for answers (planned)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **React Quill** - Rich text editor
- **Framer Motion** - Smooth animations
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time bidirectional communication
- **Express Validator** - Input validation
- **Helmet** - Security middleware

## ⚡ Quick Start

### Option 1: Deploy to Production (Recommended)
1. **Fork this repository**
2. **Follow the [Deployment Guide](DEPLOYMENT.md)**
3. **Access your live application in minutes!**

### Option 2: Local Development

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashmita1206/Odoo_Hackathon_2025.git
   cd stackit-qa-platform
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, server, client)
   npm run install-all
   ```

3. **Environment Configuration**
   
   Copy the example environment files:
   ```bash
   # Server environment
   cp server/env.example server/.env
   
   # Client environment (optional for local dev)
   cp client/env.example client/.env
   ```
   
   Update `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

6. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Project Structure

```
stackit-qa-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── package.json
│   └── index.js
├── package.json            # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question
- `POST /api/questions/:id/accept-answer` - Accept answer

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/questions` - Get user's questions
- `GET /api/users/:username/answers` - Get user's answers

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags

### Admin (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/questions/:id/moderate` - Moderate question

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main brand color
- **Navy**: Dark blue (#1E293B) - Text and backgrounds
- **Accent**: Light blue (#0EA5E9) - Highlights and accents
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Warnings
- **Error**: Red (#EF4444) - Errors and destructive actions

### Typography
- **Primary Font**: Inter - Clean, modern sans-serif
- **Code Font**: JetBrains Mono - For code blocks

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent card design with hover effects
- **Forms**: Styled form inputs with validation
- **Badges**: Tag and status indicators
- **Modals**: Overlay dialogs for confirmations

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Comprehensive validation on all inputs
- **Rate Limiting** - Prevent abuse with request limiting
- **CORS Protection** - Configured for production security
- **Helmet.js** - Security headers and protection
- **MongoDB Injection Protection** - Mongoose ODM protection

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `client/dist` folder
3. Set environment variables for API URL

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB database
2. Configure environment variables
3. Deploy the server directory
4. Set up build scripts

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

👥 Team
Built with ❤️ during the hackathon by:
Ashmita Goyal
Gargi Bajpai
Lipika Tomar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Stack Overflow and other Q&A platforms
- Built with modern web technologies
- Designed for optimal user experience
- Focused on community and knowledge sharing

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**StackIt** - Where knowledge meets community! 🚀 