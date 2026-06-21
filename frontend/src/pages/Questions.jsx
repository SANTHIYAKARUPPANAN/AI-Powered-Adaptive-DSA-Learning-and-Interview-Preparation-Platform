import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getQuestions, getTopics, createQuestion, deleteQuestion, solveQuestion } from '../services/api'

export default function Questions() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [topics, setTopics] = useState([])
  const [filters, setFilters] = useState({ topic_id: '', difficulty: '', platform: '' })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', topic_id: '', difficulty: 'Easy',
    pattern: '', platform: 'LeetCode', url: '', company_tags: ''
  })

  useEffect(() => {
    loadQuestions()
    getTopics().then(r => setTopics(r.data))
  }, [filters])

  const loadQuestions = () => {
    const params = {}
    if (filters.topic_id) params.topic_id = filters.topic_id
    if (filters.difficulty) params.difficulty = filters.difficulty
    if (filters.platform) params.platform = filters.platform
    getQuestions(params).then(r => setQuestions(r.data))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await createQuestion({...form, topic_id: parseInt(form.topic_id)})
    setShowForm(false)
    setForm({ title: '', topic_id: '', difficulty: 'Easy', pattern: '', platform: 'LeetCode', url: '', company_tags: '' })
    loadQuestions()
  }

  const handleSolve = async (questionId) => {
    await solveQuestion({ user_id: user.id, question_id: questionId, status: 'Solved' })
    alert('Question marked as solved! Revisions scheduled.')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question?')) {
      await deleteQuestion(id)
      loadQuestions()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questions</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
          + Add Question
        </button>
      </div>

      {/* Add Question Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Question</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Question Title" required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            <select value={form.topic_id} onChange={e => setForm({...form, topic_id: e.target.value})} required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
              <option value="">Select Topic</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input value={form.pattern} onChange={e => setForm({...form, pattern: e.target.value})}
              placeholder="Pattern (e.g. Sliding Window)"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
              <option>LeetCode</option>
              <option>GeeksforGeeks</option>
              <option>HackerRank</option>
              <option>Codeforces</option>
            </select>
            <input value={form.url} onChange={e => setForm({...form, url: e.target.value})}
              placeholder="URL"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            <input value={form.company_tags} onChange={e => setForm({...form, company_tags: e.target.value})}
              placeholder="Company Tags (e.g. Google,Amazon)"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            <div className="flex gap-3">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold">Add</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={filters.topic_id} onChange={e => setFilters({...filters, topic_id: e.target.value})}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white">
          <option value="">All Topics</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white">
          <option value="">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={filters.platform} onChange={e => setFilters({...filters, platform: e.target.value})}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white">
          <option value="">All Platforms</option>
          <option>LeetCode</option>
          <option>GeeksforGeeks</option>
          <option>HackerRank</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No questions yet. Add your first question!</div>
        ) : (
          questions.map(q => (
            <div key={q.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{q.title}</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-gray-400">{q.pattern}</span>
                  <span className="text-xs text-gray-400">{q.platform}</span>
                  {q.company_tags && <span className="text-xs text-purple-400">{q.company_tags}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  q.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                  q.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>{q.difficulty}</span>
                {q.url && <a href={q.url} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:underline">Open</a>}
                <button onClick={() => handleSolve(q.id)} className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded-lg text-sm">✓ Solve</button>
                <button onClick={() => handleDelete(q.id)} className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-lg text-sm">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}