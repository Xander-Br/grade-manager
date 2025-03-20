<!-- src/views/ClassesView.vue -->
<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Mes Classes</h1>

      <div class="flex space-x-2">
        <button
          @click="showJoinForm = true"
          class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
        >
          <i class="fas fa-user-plus mr-1"></i>
          Rejoindre
        </button>

        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <i class="fas fa-plus mr-1"></i>
          Créer
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="classStore.error"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-500"></i>
        </div>
        <div class="ml-3">
          <p>{{ classStore.error }}</p>
        </div>
      </div>
    </div>

    <!-- Class List -->
    <ClassList
      :classes="classStore.classes"
      :loading="classStore.loading"
      @view="navigateToClass"
      @edit="editClass"
      @create="showCreateForm = true"
      @delete="handleClassDeleted"
    />

    <!-- Create/Edit Class Modal -->
    <div
      v-if="showCreateForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-1 w-full max-w-lg mx-4">
        <CreateClassForm
          :class-id="editingClassId"
          @created="handleClassCreated"
          @updated="handleClassUpdated"
          @cancel="closeCreateForm"
        />
      </div>
    </div>

    <!-- Join Class Modal -->
    <div
      v-if="showJoinForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-1 w-full max-w-lg mx-4">
        <JoinClassForm @joined="handleClassJoined" @cancel="showJoinForm = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '@/stores/classStore'
import ClassList from '@/components/classes/ClassList.vue'
import CreateClassForm from '@/components/classes/CreateClassForm.vue'
import JoinClassForm from '@/components/classes/JoinClassForm.vue'
import type { Class } from '@/services/classService'

const router = useRouter()
const classStore = useClassStore()

const showCreateForm = ref(false)
const showJoinForm = ref(false)
const editingClassId = ref('')

onMounted(async () => {
  await classStore.fetchClasses()
})

const navigateToClass = (classId: string) => {
  router.push(`/classes/${classId}`)
}

const editClass = (classId: string) => {
  editingClassId.value = classId
  showCreateForm.value = true
}

const closeCreateForm = () => {
  showCreateForm.value = false
  editingClassId.value = ''
}

const handleClassCreated = (newClass: Class) => {
  showCreateForm.value = false
  // Optionally navigate to the new class
  router.push(`/classes/${newClass.id}`)
}

const handleClassUpdated = () => {
  showCreateForm.value = false
  editingClassId.value = ''
}

const handleClassJoined = () => {
  showJoinForm.value = false
}

const handleClassDeleted = () => {
  // Nothing specific needed here as the store already updates the classes array
}
</script>
