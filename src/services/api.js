// services/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor untuk handling error
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const todoAPI = {
  // Get all todos
  getTodos() {
    return api.get('/todos')
  },

  // Get single todo
  getTodo(id) {
    return api.get(`/todos/${id}`)
  },

  // Create new todo
  createTodo(todo) {
    return api.post('/todos', {
      ...todo,
      completed: false,
      createdAt: new Date().toISOString()
    })
  },

  // Update todo
  updateTodo(id, todo) {
    return api.put(`/todos/${id}`, todo)
  },

  // Delete todo
  deleteTodo(id) {
    return api.delete(`/todos/${id}`)
  },

  // Toggle todo completion
  toggleTodo(id, completed) {
    return api.patch(`/todos/${id}`, { completed })
  }
}

export default api