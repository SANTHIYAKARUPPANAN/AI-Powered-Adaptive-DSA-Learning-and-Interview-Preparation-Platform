import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../services/api'

export default function ResetPassword() {
  const [form, setForm] = useState({ email: '', new_password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await resetPassword(form)
      setMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Reset Password</h1>
        <p className="text-gray-400 mb-6">Enter your email and new password</p>
        {error && <div className="bg-red-900 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
        {message && <div className="bg-green-900 text-green-300 p-3 rounded-lg mb-4">{message}</div>}
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
            <label className="text-gray-400 text-sm">New Password</label>
            <input
              type="password"
              value={form.new_password}
              onChange={(e) => setForm({...form, new_password: e.target.value})}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          <Link to="/login" className="text-indigo-400 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}