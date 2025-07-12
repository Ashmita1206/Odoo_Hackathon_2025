import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'
import { SocketProvider } from '../contexts/SocketContext'
import { Toaster } from 'react-hot-toast'

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppProviders 