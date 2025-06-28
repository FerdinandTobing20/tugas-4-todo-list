<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>✨ Todo List App</h1>
      <p>Kelola tugas Anda dengan mudah dan efisien</p>
    </div>

    <!-- Todo Form -->
    <TodoForm 
      :form="form"
      :editing-id="editingId"
      @add-todo="addTodo"
      @update-todo="updateTodo"
      @cancel-edit="cancelEdit"
    />

    <!-- Filter Controls -->
    <div class="filter-controls">
      <button 
        @click="currentFilter = 'all'" 
        class="filter-btn"
        :class="{ active: currentFilter === 'all' }"
      >
        Semua ({{ todos.length }})
      </button>
      <button 
        @click="currentFilter = 'pending'" 
        class="filter-btn"
        :class="{ active: currentFilter === 'pending' }"
      >
        Belum Selesai ({{ pendingCount }})
      </button>
      <button 
        @click="currentFilter = 'completed'" 
        class="filter-btn"
        :class="{ active: currentFilter === 'completed' }"
      >
        Selesai ({{ completedCount }})
      </button>
    </div>

    <!-- Todo List -->
    <TodoList 
      :todos="filteredTodos"
      :current-filter="currentFilter"
      @toggle-todo="toggleTodo"
      @edit-todo="editTodo"
      @delete-todo="deleteTodo"
    />

    <!-- Statistics -->
    <div v-if="todos.length > 0" class="stats">
      <div class="stat-item">
        <span class="stat-number">{{ todos.length }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ completedCount }}</span>
        <span class="stat-label">Selesai</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ pendingCount }}</span>
        <span class="stat-label">Pending</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ completionPercentage }}%</span>
        <span class="stat-label">Progress</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import TodoForm from './TodoForm.vue'
import TodoList from './TodoList.vue'

// API Base URL - pastikan JSON Server berjalan di port 3000
const API_BASE_URL = 'http://localhost:3000'

export default {
  name: 'TodoApp',
  components: {
    TodoForm,
    TodoList
  },
  setup() {
    const todos = ref([])
    const form = ref({
      title: '',
      description: ''
    })
    const currentFilter = ref('all')
    const editingId = ref(null)

    // Computed Properties
    const completedCount = computed(() => 
      todos.value.filter(todo => todo.completed).length
    )

    const pendingCount = computed(() => 
      todos.value.filter(todo => !todo.completed).length
    )

    const completionPercentage = computed(() => {
      if (todos.value.length === 0) return 0
      return Math.round((completedCount.value / todos.value.length) * 100)
    })

    const filteredTodos = computed(() => {
      switch (currentFilter.value) {
        case 'completed':
          return todos.value.filter(todo => todo.completed)
        case 'pending':
          return todos.value.filter(todo => !todo.completed)
        default:
          return todos.value
      }
    })

    // Methods
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos`)
        todos.value = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
      } catch (error) {
        console.error('Error fetching todos:', error)
        alert('Gagal memuat data. Pastikan JSON Server berjalan di port 3000')
      }
    }

    const addTodo = async () => {
      if (!form.value.title.trim()) return

      try {
        const newTodo = {
          title: form.value.title.trim(),
          description: form.value.description.trim(),
          completed: false,
          createdAt: new Date().toISOString()
        }

        const response = await axios.post(`${API_BASE_URL}/todos`, newTodo)
        todos.value.unshift(response.data)
        resetForm()
      } catch (error) {
        console.error('Error adding todo:', error)
        alert('Gagal menambah tugas')
      }
    }

    const updateTodo = async () => {
      if (!form.value.title.trim() || !editingId.value) return

      try {
        const updatedTodo = {
          ...todos.value.find(t => t.id === editingId.value),
          title: form.value.title.trim(),
          description: form.value.description.trim()
        }

        await axios.put(`${API_BASE_URL}/todos/${editingId.value}`, updatedTodo)
        
        const index = todos.value.findIndex(t => t.id === editingId.value)
        if (index !== -1) {
          todos.value[index] = updatedTodo
        }
        
        cancelEdit()
      } catch (error) {
        console.error('Error updating todo:', error)
        alert('Gagal mengupdate tugas')
      }
    }

    const deleteTodo = async (id) => {
      if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return

      try {
        await axios.delete(`${API_BASE_URL}/todos/${id}`)
        todos.value = todos.value.filter(todo => todo.id !== id)
      } catch (error) {
        console.error('Error deleting todo:', error)
        alert('Gagal menghapus tugas')
      }
    }

    const toggleTodo = async (id) => {
      try {
        const todo = todos.value.find(t => t.id === id)
        const updatedTodo = { ...todo, completed: !todo.completed }

        await axios.put(`${API_BASE_URL}/todos/${id}`, updatedTodo)
        
        const index = todos.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todos.value[index] = updatedTodo
        }
      } catch (error) {
        console.error('Error toggling todo:', error)
        alert('Gagal mengubah status tugas')
      }
    }

    const editTodo = (todo) => {
      form.value.title = todo.title
      form.value.description = todo.description || ''
      editingId.value = todo.id
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
      resetForm()
      editingId.value = null
    }

    const resetForm = () => {
      form.value.title = ''
      form.value.description = ''
    }

    // Lifecycle
    onMounted(() => {
      fetchTodos()
    })

    return {
      todos,
      form,
      currentFilter,
      editingId,
      completedCount,
      pendingCount,
      completionPercentage,
      filteredTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      editTodo,
      cancelEdit
    }
  }
}
</script>