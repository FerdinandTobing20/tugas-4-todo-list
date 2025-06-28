<template>
  <div class="todo-form">
    <div class="form-group">
      <input 
        v-model="form.title" 
        type="text" 
        placeholder="Judul tugas..." 
        class="form-input"
        @keyup.enter="handleSubmit"
      >
    </div>
    <div class="form-group">
      <textarea 
        v-model="form.description" 
        placeholder="Deskripsi tugas (opsional)..." 
        class="form-textarea"
        rows="3"
      ></textarea>
    </div>
    <div>
      <button 
        @click="handleSubmit" 
        class="btn btn-primary"
        :disabled="!form.title.trim()"
      >
        {{ editingId ? 'Update' : 'Tambah' }}
      </button>
      <button 
        v-if="editingId" 
        @click="handleCancel" 
        class="btn btn-secondary"
      >
        Batal
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoForm',
  props: {
    form: {
      type: Object,
      required: true
    },
    editingId: {
      type: [Number, String, null],
      default: null
    }
  },
  emits: ['add-todo', 'update-todo', 'cancel-edit'],
  methods: {
    handleSubmit() {
      if (!this.form.title.trim()) return
      
      if (this.editingId) {
        this.$emit('update-todo')
      } else {
        this.$emit('add-todo')
      }
    },
    handleCancel() {
      this.$emit('cancel-edit')
    }
  }
}
</script>