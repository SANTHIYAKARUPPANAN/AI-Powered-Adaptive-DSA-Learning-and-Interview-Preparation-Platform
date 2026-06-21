import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTopics, createTopic, getMastery } from '../services/api'

const DSA_TOPICS = [
  'Arrays', 'Strings', 'Hashing', 'Sliding Window', 'Two Pointers',
  'Stack', 'Queue', 'Linked List', 'Binary Search', 'Trees',
  'Heap', 'Graph', 'Greedy', 'Backtracking', 'Dynamic Programming'
]

export default function Roadmap() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [mastery, setMastery] = useState([])
  const [newTopic, setNewTopic] = useState('')

  useEffect(() => {
    getTopics().then(r => setTopics(r.data))
    getMastery(user.id).then(r => setMastery(r.data))
  }, [])

  const handleAddTopic = async (name) => {
    const order = topics.length + 1
    await createTopic({ name, order })
    const res = await getTopics()
    setTopics(res.data)
  }

  const getMasteryForTopic = (name) => {
    const m = mastery.find(m => m.topic === name)
    return m ? m.mastery_score : 0
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">DSA Roadmap</h1>
      <p className="text-gray-400 mb-8">Track your progress across all DSA topics</p>

      {/* Quick Add Topics */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Add Topics</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {DSA_TOPICS.filter(t => !topics.find(top => top.name === t)).map(t => (
            <button key={t} onClick={() => handleAddTopic(t)}
              className="bg-gray-800 hover:bg-indigo-600 px-3 py-1 rounded-full text-sm transition-colors">
              + {t}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input value={newTopic} onChange={e => setNewTopic(e.target.value)}
            placeholder="Add custom topic..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
          <button onClick={() => { handleAddTopic(newTopic); setNewTopic('') }}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">Add</button>
        </div>
      </div>

      {/* Topics Progress */}
      <div className="space-y-4">
        {topics.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No topics yet. Add topics above!</div>
        ) : (
          topics.map((topic, i) => {
            const score = getMasteryForTopic(topic.name)
            return (
              <div key={topic.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">#{i + 1}</span>
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                  </div>
                  <span className={`text-sm font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{width: `${score}%`}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {score >= 70 ? '✅ Strong' : score >= 40 ? '⚠️ Needs practice' : '❌ Weak — focus here'}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}