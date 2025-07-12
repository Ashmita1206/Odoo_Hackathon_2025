import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 text-navy-900 dark:text-white">
      <Outlet />
    </div>
  )
}

export default App 