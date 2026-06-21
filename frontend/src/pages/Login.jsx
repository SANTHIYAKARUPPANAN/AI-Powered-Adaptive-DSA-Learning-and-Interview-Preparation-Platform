import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      const token = res.data.access_token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRes = await getUser(payload.sub)
      loginUser(userRes.data, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-6">Login to your DSA Tracker</p>
        {error && <div className="bg-red-900 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mt-1 text-white focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mt-1 text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
        <p className="text-gray-400 mt-2 text-center">
          <Link to="/reset-password" className="text-indigo-400 hover:underline text-sm">Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}