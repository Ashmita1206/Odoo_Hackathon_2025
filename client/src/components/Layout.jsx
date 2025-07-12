import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useSocket } from '../contexts/SocketContext'
import { 
  FiHome, 
  FiSearch, 
  FiPlus, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiShield
} from 'react-icons/fi'
import NotificationDropdown from './NotificationDropdown'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { unreadCount } = useSocket()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/questions', icon: FiHome },
    { name: 'Ask Question', href: '/ask', icon: FiPlus },
    { name: 'Profile', href: `/profile/${user?.username}`, icon: FiUser },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ]

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: FiShield })
  }

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-navy-900 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-navy-800 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-navy-200 dark:border-navy-700">
            <Link to="/" className="text-2xl font-bold gradient-text">
              StackIt
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-navy-800 border-r border-navy-200 dark:border-navy-700">
          <div className="flex items-center p-4 border-b border-navy-200 dark:border-navy-700">
            <Link to="/" className="text-2xl font-bold gradient-text">
              StackIt
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-white dark:bg-navy-800 border-b border-navy-200 dark:border-navy-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 py-2 w-64 border border-navy-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
                />
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-navy-900 dark:text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">
                    {user?.reputation || 0} reputation
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 