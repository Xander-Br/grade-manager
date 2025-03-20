<!-- src/components/classes/CreateClassForm.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      {{ isEditing ? 'Modifier la classe' : 'Créer une nouvelle classe' }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="class-name" class="block text-sm font-medium text-gray-700 mb-1"
          >Nom de la classe</label
        >
        <input
          type="text"
          id="class-name"
          v-model="form.name"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="ex: Mathématiques"
          required
        />
      </div>

      <div class="mb-6">
        <label for="class-description" class="block text-sm font-medium text-gray-700 mb-1"
          >Description (optionnel)</label
        >
        <textarea
          id="class-description"
          v-model="form.description"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Décrivez brièvement cette classe..."
          rows="3"
        ></textarea>
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
          :disabled="classStore.loading"
        >
          <span v-if="classStore.loading">
            <i class="fas fa-spinner fa-spin mr-2"></i>
          </span>
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useClassStore } from '@/stores/classStore'
import type { Class } from '@/services/classService'

const props = defineProps({
  classId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['created', 'updated', 'cancel'])

const classStore = useClassStore()
const isEditing = ref(false)

const form = reactive({
  name: '',
  description: '',
})

onMounted(async () => {
  if (props.classId) {
    isEditing.value = true
    try {
      // If we already have the class in store, use it
      let classData = classStore.getClassById(props.classId)

      // If not, fetch it
      if (!classData) {
        classData = await classStore.fetchClassById(props.classId)
      }

      if (classData) {
        form.name = classData.name
        form.description = classData.description || ''
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
    }
  }
})

const handleSubmit = async () => {
  try {
    let result: Class

    if (isEditing.value) {
      result = await classStore.updateClass(props.classId, {
        name: form.name,
        description: form.description || undefined,
      })
      emit('updated', result)
    } else {
      result = await classStore.createClass({
        name: form.name,
        description: form.description || undefined,
      })
      emit('created', result)
    }

    // Reset form after successful submission
    form.name = ''
    form.description = ''
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
</script>
