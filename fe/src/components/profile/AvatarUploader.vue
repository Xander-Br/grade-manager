<!-- src/components/profile/AvatarUploader.vue -->
<template>
  <div class="flex flex-col items-center">
    <div
      class="relative mb-4 w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
      @click="triggerFileInput"
    >
      <!-- Show either preview, existing avatar, or placeholder -->
      <img
        v-if="previewUrl || existingUrl"
        :src="previewUrl || existingUrl"
        alt="Avatar"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <i class="fas fa-user text-3xl"></i>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        <span class="text-white text-sm font-medium">
          <i class="fas fa-camera mr-1"></i>
          Changer
        </span>
      </div>
    </div>

    <!-- Hidden file input -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />

    <!-- Remove button only shown when we have an avatar -->
    <button
      v-if="previewUrl || existingUrl"
      @click.prevent="removeAvatar"
      class="text-sm text-red-600 hover:text-red-800"
      type="button"
    >
      <i class="fas fa-trash-alt mr-1"></i>
      Supprimer
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null,
  },
  existingUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

// Create preview when file changes
watch(
  () => props.modelValue,
  (newFile) => {
    if (newFile instanceof File) {
      createPreview(newFile)
    } else if (newFile === null) {
      previewUrl.value = null
    }
  },
)

// Open file dialog
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    emit('update:modelValue', file)
    createPreview(file)
  }
}

// Create image preview
const createPreview = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Remove avatar
const removeAvatar = () => {
  emit('update:modelValue', null)
  emit('remove')
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
