import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../services/api'

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    college: '', graduation_year: '', target_role: '', target_company: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signup({...form, graduation_year: parseInt(form.graduation_year)})
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-10">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Create Account</h1>
        <p className="text-gray-400 mb-6">Start tracking your DSA journey</p>
        {error && <div className="bg-red-900 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Santhiya' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'College', key: 'college', type: 'text', placeholder: 'Your College' },
            { label: 'Graduation Year', key: 'graduation_year', type: 'number', placeholder: '2026' },
            { label: 'Target Role', key: 'target_role', type: 'text', placeholder: 'Software Engineer' },
            { label: 'Target Company', key: 'target_company', type: 'text', placeholder: 'Google' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-gray-400 text-sm">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({...form, [key]: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mt-1 text-white focus:outline-none focus:border-indigo-500"
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold mt-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}