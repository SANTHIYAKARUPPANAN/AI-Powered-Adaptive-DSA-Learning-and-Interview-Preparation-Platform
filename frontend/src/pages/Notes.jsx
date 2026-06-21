import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserNotes, createNote, updateNote, deleteNote, getBookmarks, createBookmark, deleteBookmark, getQuestions } from '../services/api'

export default function Notes() {
  const { user } = useAuth()
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [questions, setQuestions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ question_id: '', key_idea: '', pattern: '', mistakes: '', revision_notes: '' })
  const [bookmarkForm, setBookmarkForm] = useState({ question_id: '', tag: 'Important' })

  useEffect(() => {
    getUserNotes(user.id).then(r => setNotes(r.data))
    getBookmarks(user.id).then(r => setBookmarks(r.data))
    getQuestions().then(r => setQuestions(r.data))
  }, [])

  const getQuestionTitle = (id) => {
    const q = questions.find(q => q.id === id)
    return q ? q.title : `Question #${id}`
  }

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
    return 'Something went wrong'
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    try {
      await createNote({ ...form, user_id: user.id, question_id: parseInt(form.question_id) })
      setShowForm(false)
      setForm({ question_id: '', key_idea: '', pattern: '', mistakes: '', revision_notes: '' })
      const res = await getUserNotes(user.id)
      setNotes(res.data)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleAddBookmark = async (e) => {
    e.preventDefault()
    try {
      await createBookmark({ ...bookmarkForm, user_id: user.id, question_id: parseInt(bookmarkForm.question_id) })
      const res = await getBookmarks(user.id)
      setBookmarks(res.data)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  const handleDeleteNote = async (id) => {
    await deleteNote(id)
    setNotes(notes.filter(n => n.id !== id))
  }

  const handleDeleteBookmark = async (id) => {
    await deleteBookmark(id)
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Notes & Bookmarks</h1>

      <div className="flex gap-3 mb-6">
        {['notes', 'bookmarks'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'notes' && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg mb-6">
            + Add Note
          </button>
          {showForm && (
            <form onSubmit={handleAddNote} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 space-y-4">
              <select value={form.question_id} onChange={e => setForm({...form, question_id: e.target.value})}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                <option value="">Select a question</option>
                {questions.map(q => <option key={q.id} value={q.id}>{q.title} ({q.difficulty})</option>)}
              </select>
              <textarea value={form.key_idea} onChange={e => setForm({...form, key_idea: e.target.value})}
                placeholder="Key Idea" rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <input value={form.pattern} onChange={e => setForm({...form, pattern: e.target.value})}
                placeholder="Pattern"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <textarea value={form.mistakes} onChange={e => setForm({...form, mistakes: e.target.value})}
                placeholder="Mistakes to avoid" rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <textarea value={form.revision_notes} onChange={e => setForm({...form, revision_notes: e.target.value})}
                placeholder="Revision notes" rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <div className="flex gap-3">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          )}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No notes yet. Add your first note!</div>
            ) : (
              notes.map(n => (
                <div key={n.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{getQuestionTitle(n.question_id)}</h3>
                    <button onClick={() => handleDeleteNote(n.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  </div>
                  {n.key_idea && <p className="text-sm text-gray-300 mb-2"><span className="text-indigo-400">Key Idea:</span> {n.key_idea}</p>}
                  {n.pattern && <p className="text-sm text-gray-300 mb-2"><span className="text-green-400">Pattern:</span> {n.pattern}</p>}
                  {n.mistakes && <p className="text-sm text-gray-300 mb-2"><span className="text-red-400">Mistakes:</span> {n.mistakes}</p>}
                  {n.revision_notes && <p className="text-sm text-gray-300"><span className="text-yellow-400">Revision:</span> {n.revision_notes}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'bookmarks' && (
        <>
          <form onSubmit={handleAddBookmark} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex gap-4">
            <select value={bookmarkForm.question_id} onChange={e => setBookmarkForm({...bookmarkForm, question_id: e.target.value})}
              required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
              <option value="">Select a question</option>
              {questions.map(q => <option key={q.id} value={q.id}>{q.title} ({q.difficulty})</option>)}
            </select>
            <select value={bookmarkForm.tag} onChange={e => setBookmarkForm({...bookmarkForm, tag: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
              <option>Important</option>
              <option>Interview Favorite</option>
              <option>Need Revision</option>
            </select>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg">Bookmark</button>
          </form>
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No bookmarks yet!</div>
            ) : (
              bookmarks.map(b => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{getQuestionTitle(b.question_id)}</p>
                    <span className="text-xs text-indigo-400">{b.tag}</span>
                  </div>
                  <button onClick={() => handleDeleteBookmark(b.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}