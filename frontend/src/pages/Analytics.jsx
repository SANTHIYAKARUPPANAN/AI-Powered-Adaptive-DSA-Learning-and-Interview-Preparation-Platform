import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMastery, getReadiness, getStreak, getDailyProgress, getCompanyQuestions } from '../services/api'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const { user } = useAuth()
  const [mastery, setMastery] = useState([])
  const [readiness, setReadiness] = useState(null)
  const [streak, setStreak] = useState(null)
  const [dailyProgress, setDailyProgress] = useState([])
  const [company, setCompany] = useState('Google')
  const [companyQuestions, setCompanyQuestions] = useState([])

  useEffect(() => {
    if (user) {
      getMastery(user.id).then(r => setMastery(r.data))
      getReadiness(user.id).then(r => setReadiness(r.data))
      getStreak(user.id).then(r => setStreak(r.data))
      getDailyProgress(user.id).then(r => {
        const data = Object.entries(r.data.daily_progress).map(([date, count]) => ({ date, count }))
        setDailyProgress(data.slice(-7))
      })
    }
  }, [user])

  const loadCompanyQuestions = async () => {
    const res = await getCompanyQuestions(company)
    setCompanyQuestions(res.data)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Interview Readiness</p>
          <p className="text-5xl font-bold text-indigo-400 mt-2">{readiness?.readiness_score ?? 0}%</p>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
            <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${readiness?.readiness_score ?? 0}%`}}></div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Current Streak</p>
          <p className="text-5xl font-bold text-orange-400 mt-2">{streak?.current_streak ?? 0} 🔥</p>
          <p className="text-gray-400 text-sm mt-2">Longest: {streak?.longest_streak ?? 0} days</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Questions Solved</p>
          <p className="text-5xl font-bold text-green-400 mt-2">{readiness?.total_solved ?? 0}</p>
          <p className="text-gray-400 text-sm mt-2">of {readiness?.total_questions ?? 0} total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Daily Progress Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Daily Progress (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyProgress}>
              <XAxis dataKey="date" tick={{fill: '#9ca3af', fontSize: 10}} />
              <YAxis tick={{fill: '#9ca3af'}} />
              <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mastery Radar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Topic Mastery</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={mastery.slice(0, 8)}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="topic" tick={{fill: '#9ca3af', fontSize: 10}} />
              <Radar dataKey="mastery_score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mastery Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Topic Mastery Scores</h2>
        <div className="space-y-3">
          {mastery.map((m, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-gray-300 w-32 text-sm">{m.topic}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-3">
                <div className={`h-3 rounded-full ${m.mastery_score >= 70 ? 'bg-green-500' : m.mastery_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{width: `${m.mastery_score}%`}}></div>
              </div>
              <span className="text-sm text-gray-400 w-12">{m.mastery_score}%</span>
              <span className="text-xs text-gray-500">{m.solved}/{m.total_questions}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Questions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Company-Specific Questions</h2>
        <div className="flex gap-3 mb-4">
          {['Google', 'Amazon', 'Microsoft', 'Meta'].map(c => (
            <button key={c} onClick={() => setCompany(c)}
              className={`px-4 py-2 rounded-lg text-sm ${company === c ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
              {c}
            </button>
          ))}
          <button onClick={loadCompanyQuestions} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm">
            Search
          </button>
        </div>
        <div className="space-y-2">
          {companyQuestions.length === 0 ? (
            <p className="text-gray-400">Click Search to find {company} questions</p>
          ) : (
            companyQuestions.map(q => (
              <div key={q.id} className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg">
                <span className="text-sm">{q.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  q.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                  q.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>{q.difficulty}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}