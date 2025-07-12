# Contributing to StackIt Q&A Platform

Thank you for your interest in contributing to StackIt! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/stackit-qa-platform.git
   cd stackit-qa-platform
   ```

### 2. Setup Development Environment
1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Set up environment variables:
   ```bash
   cp server/env.example server/.env
   cp client/env.example client/.env
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 5. Test Your Changes
```bash
# Run all tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build the project
npm run build
```

### 6. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 7. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots (if UI changes)
- Link to related issues

## 📋 Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Use TypeScript for type safety (when possible)
- Write meaningful variable and function names

### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for critical flows
- Maintain good test coverage

### Documentation
- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Include usage examples

### Git Workflow
- Keep commits small and focused
- Use descriptive commit messages
- Rebase on main before submitting PR
- Squash commits when appropriate

## 🐛 Bug Reports

When reporting bugs, please include:
1. **Description** of the bug
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, browser, version)
6. **Screenshots** (if applicable)

## 💡 Feature Requests

When requesting features, please include:
1. **Description** of the feature
2. **Use case** and benefits
3. **Implementation suggestions** (if any)
4. **Mockups** or wireframes (if UI feature)

## 🔧 Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Local Development
```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Environment Variables
Create `.env` files in both `server/` and `client/` directories:

**Server (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- Unit tests for individual components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Mock external dependencies

## 📦 Building

### Production Build
```bash
# Build frontend
npm run build

# Build and start production server
npm start
```

### Docker (Optional)
```bash
# Build Docker image
docker build -t stackit .

# Run with Docker Compose
docker-compose up
```

## 🔍 Code Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - Build must succeed

2. **Manual Review**
   - Code quality review
   - Security review
   - Performance review
   - Documentation review

3. **Approval**
   - At least one maintainer approval required
   - All CI checks must pass
   - No merge conflicts

## 🚀 Release Process

1. **Version Bumping**
   - Update version in package.json
   - Update CHANGELOG.md
   - Create release notes

2. **Deployment**
   - Deploy to staging environment
   - Run integration tests
   - Deploy to production

3. **Post-Release**
   - Monitor for issues
   - Update documentation
   - Announce release

## 📞 Getting Help

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact maintainers directly
- **Documentation**: Check README.md and docs/

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- GitHub contributors page

## 📄 License

By contributing to StackIt, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StackIt! 🎉 