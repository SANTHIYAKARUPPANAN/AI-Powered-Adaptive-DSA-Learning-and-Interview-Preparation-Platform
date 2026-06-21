import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Questions from './pages/Questions'
import Revisions from './pages/Revisions'
import Analytics from './pages/Analytics'
import Notes from './pages/Notes'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
        <Route path="/revisions" element={<ProtectedRoute><Revisions /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App