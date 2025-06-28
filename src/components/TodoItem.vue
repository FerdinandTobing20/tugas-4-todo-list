<template>
  <div 
    class="todo-item"
    :class="{ completed: todo.completed }"
  >
    <div class="todo-checkbox">
      <input 
        type="checkbox" 
        :checked="todo.completed"
        @change="handleToggle"
        class="checkbox"
      >
    </div>
    
    <div class="todo-content">
      <h3 class="todo-title" :class="{ completed: todo.completed }">
        {{ todo.title }}
      </h3>
      <p v-if="todo.description" class="todo-description">
        {{ todo.description }}
      </p>
      <span class="todo-date">
        {{ formatDate(todo.createdAt) }}
      </span>
    </div>
    
    <div class="todo-actions">
      <button 
        @click="handleEdit" 
        class="btn btn-sm btn-edit"
        title="Edit"
      >
        ✏️
      </button>
      <button 
        @click="handleDelete" 
        class="btn btn-sm btn-delete"
        title="Hapus"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle-todo', 'edit-todo', 'delete-todo'],
  methods: {
    handleToggle() {
      this.$emit('toggle-todo', this.todo.id)
    },
    handleEdit() {
      this.$emit('edit-todo', this.todo)
    },
    handleDelete() {
      this.$emit('delete-todo', this.todo.id)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Hari ini'
      if (diffDays === 1) return 'Kemarin'
      if (diffDays < 7) return `${diffDays} hari lalu`
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }
}
</script>