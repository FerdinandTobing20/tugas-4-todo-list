<template>
  <!-- Empty State -->
  <div v-if="todos.length === 0" class="empty-state">
    <h3>{{ getEmptyMessage() }}</h3>
    <p>{{ getEmptyDescription() }}</p>
  </div>

  <!-- Todo Items -->
  <div v-else class="todo-list">
    <TodoItem 
      v-for="todo in todos" 
      :key="todo.id"
      :todo="todo"
      @toggle-todo="$emit('toggle-todo', $event)"
      @edit-todo="$emit('edit-todo', $event)"
      @delete-todo="$emit('delete-todo', $event)"
    />
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    todos: {
      type: Array,
      required: true
    },
    currentFilter: {
      type: String,
      required: true
    }
  },
  emits: ['toggle-todo', 'edit-todo', 'delete-todo'],
  methods: {
    getEmptyMessage() {
      switch (this.currentFilter) {
        case 'completed':
          return 'Belum ada tugas yang selesai'
        case 'pending':
          return 'Semua tugas sudah selesai! 🎉'
        default:
          return 'Belum ada tugas'
      }
    },
    getEmptyDescription() {
      switch (this.currentFilter) {
        case 'completed':
          return 'Tugas yang sudah selesai akan muncul di sini'
        case 'pending':
          return 'Luar biasa! Semua tugas sudah dikerjakan'
        default:
          return 'Mulai dengan menambahkan tugas pertama Anda'
      }
    }
  }
}
</script>