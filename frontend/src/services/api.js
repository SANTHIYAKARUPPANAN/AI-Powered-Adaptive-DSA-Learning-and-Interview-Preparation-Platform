import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',

export const signup = (data) => API.post('/auth/signup', data)
export const login = (data) => API.post('/auth/login', data)
export const resetPassword = (data) => API.post('/auth/reset-password', data)
export const getTopics = () => API.get('/topics/')
export const createTopic = (data) => API.post('/topics/', data)
export const getQuestions = (params) => API.get('/questions/', { params })
export const createQuestion = (data) => API.post('/questions/', data)
export const updateQuestion = (id, data) => API.put(`/questions/${id}`, data)
export const deleteQuestion = (id) => API.delete(`/questions/${id}`)
export const solveQuestion = (data) => API.post('/revisions/solve', data)
export const getTodayRevisions = (userId) => API.get(`/revisions/today/${userId}`)
export const getWeekendRevisions = (userId) => API.get(`/revisions/weekend/${userId}`)
export const getOverdueRevisions = (userId) => API.get(`/revisions/overdue/${userId}`)
export const completeRevision = (revisionId, userId) => API.put(`/revisions/complete/${revisionId}/${userId}`)
export const getMastery = (userId) => API.get(`/analytics/mastery/${userId}`)
export const getReadiness = (userId) => API.get(`/analytics/readiness/${userId}`)
export const getWeakTopics = (userId) => API.get(`/analytics/weak-topics/${userId}`)
export const getRecommendations = (userId) => API.get(`/analytics/recommendations/${userId}`)
export const getStreak = (userId) => API.get(`/analytics/streak/${userId}`)
export const getDailyProgress = (userId) => API.get(`/analytics/daily-progress/${userId}`)
export const getCompanyQuestions = (company) => API.get(`/analytics/company/${company}`)
export const createNote = (data) => API.post('/notes/', data)
export const getUserNotes = (userId) => API.get(`/notes/${userId}`)
export const updateNote = (noteId, data) => API.put(`/notes/${noteId}`, data)
export const deleteNote = (noteId) => API.delete(`/notes/${noteId}`)
export const createBookmark = (data) => API.post('/bookmarks/', data)
export const getBookmarks = (userId) => API.get(`/bookmarks/${userId}`)
export
