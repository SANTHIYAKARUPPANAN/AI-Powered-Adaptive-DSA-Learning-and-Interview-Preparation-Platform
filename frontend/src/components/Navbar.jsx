import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-400">
          DSA Tracker
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          <Link to="/roadmap" className="text-gray-300 hover:text-white">Roadmap</Link>
          <Link to="/questions" className="text-gray-300 hover:text-white">Questions</Link>
          <Link to="/revisions" className="text-gray-300 hover:text-white">Revisions</Link>
          <Link to="/analytics" className="text-gray-300 hover:text-white">Analytics</Link>
          <Link to="/notes" className="text-gray-300 hover:text-white">Notes</Link>
          <span className="text-gray-400">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}