<!-- src/components/classes/JoinClassForm.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Rejoindre une classe</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label for="class-code" class="block text-sm font-medium text-gray-700 mb-1"
          >Code de la classe</label
        >
        <input
          type="text"
          id="class-code"
          v-model="code"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Entrez le code d'invitation"
          required
        />
        <p class="mt-1 text-sm text-gray-500">
          Le code doit vous être fourni par l'enseignant ou le propriétaire de la classe.
        </p>
      </div>

      <!-- Error message if any -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Rejoindre
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClassStore } from '@/stores/classStore'

const emit = defineEmits(['joined', 'cancel'])
const classStore = useClassStore()

const code = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!code.value) return

  loading.value = true
  error.value = ''

  try {
    await classStore.joinClass({ code: code.value })
    emit('joined', code.value)
    code.value = ''
  } catch (err: any) {
    error.value = err.message || 'Impossible de rejoindre la classe. Vérifiez le code et réessayez.'
    console.error('Error joining class:', err)
  } finally {
    loading.value = false
  }
}
</script>
