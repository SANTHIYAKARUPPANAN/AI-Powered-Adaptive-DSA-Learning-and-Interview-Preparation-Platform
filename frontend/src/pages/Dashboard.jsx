import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getStreak, getReadiness, getWeakTopics, getTodayRevisions, getRecommendations } from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(null)
  const [readiness, setReadiness] = useState(null)
  const [weakTopics, setWeakTopics] = useState([])
  const [todayRevisions, setTodayRevisions] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (user) {
      getStreak(user.id).then(r => setStreak(r.data))
      getReadiness(user.id).then(r => setReadiness(r.data))
      getWeakTopics(user.id).then(r => setWeakTopics(r.data.weak_topics))
      getTodayRevisions(user.id).then(r => setTodayRevisions(r.data))
      getRecommendations(user.id).then(r => setRecommendations(r.data))
    }
  }, [user])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name} 👋</h1>
      <p className="text-gray-400 mb-8">Target: {user?.target_role} at {user?.target_company}</p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Current Streak</p>
          <p className="text-4xl font-bold text-orange-400 mt-1">{streak?.current_streak ?? 0} 🔥</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Solved Today</p>
          <p className="text-4xl font-bold text-green-400 mt-1">{streak?.solved_today ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Interview Readiness</p>
          <p className="text-4xl font-bold text-indigo-400 mt-1">{readiness?.readiness_score ?? 0}%</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Total Solved</p>
          <p className="text-4xl font-bold text-blue-400 mt-1">{readiness?.total_solved ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Revisions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">📅 Today's Revisions</h2>
          {todayRevisions.length === 0 ? (
            <p className="text-gray-400">No revisions due today!</p>
          ) : (
            <ul className="space-y-2">
              {todayRevisions.slice(0, 5).map(r => (
                <li key={r.id} className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg">
                  <span className="text-sm">{r.question_title || `Question #${r.question_id}`}</span>
                  <span className="text-xs text-indigo-400">{r.revision_type}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/revisions" className="text-indigo-400 text-sm mt-4 block hover:underline">View all revisions →</Link>
        </div>

        {/* Weak Topics */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">⚠️ Weak Areas</h2>
          {weakTopics.length === 0 ? (
            <p className="text-gray-400">No weak topics yet! Keep solving.</p>
          ) : (
            <ul className="space-y-2">
              {weakTopics.map((topic, i) => (
                <li key={i} className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg">
                  <span className="text-red-400 font-bold">#{i + 1}</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">🎯 Recommended Next</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-400">Add some questions to get recommendations!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.slice(0, 6).map(q => (
                <div key={q.id} className="bg-gray-800 px-4 py-3 rounded-lg flex justify-between items-center">
                  <span className="text-sm">{q.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    q.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                    q.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }`}>{q.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}