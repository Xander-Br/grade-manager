<!-- src/components/classes/ClassCard.vue -->
<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    @click="$emit('view', classData.id)"
  >
    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">{{ classData.name }}</h3>
        <div class="flex space-x-1">
          <button
            v-if="isOwner"
            @click.stop="$emit('edit', classData.id)"
            class="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Modifier"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            v-if="isOwner"
            @click.stop="confirmDelete"
            class="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer"
          >
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <p v-if="classData.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ classData.description }}
      </p>
      <p v-else class="text-gray-400 text-sm italic mb-4">Aucune description</p>

      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>
          <span class="inline-block bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
            {{ isOwner ? 'Propriétaire' : 'Membre' }}
          </span>
        </span>
        <span>Créée le {{ formatDate(classData.created) }}</span>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmer la suppression</h3>
        <p class="mb-6">
          Êtes-vous sûr de vouloir supprimer la classe <strong>{{ classData.name }}</strong> ? Cette
          action est irréversible.
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            @click="deleteClass"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            :disabled="isDeleting"
          >
            <i v-if="isDeleting" class="fas fa-spinner fa-spin mr-2"></i>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useClassStore } from '@/stores/classStore'
import type { Class } from '@/services/classService'

const props = defineProps<{
  classData: Class
}>()

const emit = defineEmits(['view', 'edit', 'delete'])

const authStore = useAuthStore()
const classStore = useClassStore()

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const isOwner = computed(() => {
  return props.classData.owner === authStore.user?.id
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const confirmDelete = (event: Event) => {
  event.stopPropagation()
  showDeleteConfirm.value = true
}

const deleteClass = async () => {
  isDeleting.value = true
  try {
    await classStore.deleteClass(props.classData.id)
    showDeleteConfirm.value = false
    emit('delete', props.classData.id)
  } catch (error) {
    console.error('Error deleting class:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
