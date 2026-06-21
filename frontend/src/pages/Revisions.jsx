import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTodayRevisions, getWeekendRevisions, getOverdueRevisions, completeRevision } from '../services/api'

export default function Revisions() {
  const { user } = useAuth()
  const [tab, setTab] = useState('today')
  const [revisions, setRevisions] = useState([])

  useEffect(() => {
    loadRevisions()
  }, [tab])

  const loadRevisions = async () => {
    let res
    if (tab === 'today') res = await getTodayRevisions(user.id)
    else if (tab === 'weekend') res = await getWeekendRevisions(user.id)
    else res = await getOverdueRevisions(user.id)
    setRevisions(res.data)
  }

  const handleComplete = async (revisionId) => {
    await completeRevision(revisionId, user.id)
    loadRevisions()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Revisions</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {['today', 'weekend', 'overdue'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Revisions List */}
      <div className="space-y-3">
        {revisions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {tab === 'today' ? '🎉 No revisions due today!' :
             tab === 'weekend' ? '😊 No weekend revisions!' :
             '✅ No overdue revisions!'}
          </div>
        ) : (
          revisions.map(r => (
            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{r.question_title || `Question #${r.question_id}`}</p>
                  {r.question_difficulty && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.question_difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                      r.question_difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>{r.question_difficulty}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Due: {new Date(r.revision_date).toLocaleDateString()} •
                  <span className="text-indigo-400 ml-1">{r.revision_type}</span>
                </p>
              </div>
              <button onClick={() => handleComplete(r.id)}
                className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg text-sm">
                ✓ Done
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}