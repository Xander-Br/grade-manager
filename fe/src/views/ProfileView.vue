<!-- src/views/ProfileView.vue -->
<template>
  <div class="max-w-3xl mx-auto">
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mon Profil</h1>
      <p class="text-gray-600">Gérez vos informations personnelles</p>
    </div>

    <!-- Profile editor card -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Card header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700">Informations personnelles</h2>
      </div>

      <!-- Success message -->
      <div
        v-if="profileStore.successMessage"
        class="m-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700"
      >
        <div class="flex">
          <i class="fas fa-check-circle text-green-500 mr-3"></i>
          <p>{{ profileStore.successMessage }}</p>
        </div>
      </div>

      <!-- Error message -->
      <div
        v-if="profileStore.error"
        class="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700"
      >
        <div class="flex">
          <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
          <p>{{ profileStore.error }}</p>
        </div>
      </div>

      <!-- Profile form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Avatar column -->
          <div class="flex flex-col items-center">
            <AvatarUploader
              v-model="formData.avatar"
              :existing-url="profileStore.avatarUrl"
              @remove="removeAvatar"
            />
          </div>

          <!-- Profile details column -->
          <div class="md:col-span-2 space-y-6">
            <!-- Name field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Votre nom complet"
              />
            </div>

            <!-- Email field (read-only) -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                :value="authStore.user?.email"
                type="email"
                class="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
              <p class="mt-1 text-xs text-gray-500">L'adresse email ne peut pas être modifiée</p>
            </div>
          </div>
        </div>

        <!-- Form actions -->
        <div class="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import AvatarUploader from '@/components/profile/AvatarUploader.vue'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

// Check if user is logged in
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // Load avatar URL and initialize form
  profileStore.loadAvatarUrl()
  resetForm()
})

// Form data
const formData = reactive({
  name: '',
  avatar: null as File | null,
  removeAvatar: false,
})

// Computed properties
const isLoading = computed(() => profileStore.loading)

// Handle form submission
const handleSubmit = async () => {
  profileStore.clearMessages()

  try {
    await profileStore.updateProfile({
      name: formData.name,
      avatar: formData.removeAvatar ? null : formData.avatar,
    })

    // Reset the avatar file input but keep the form data
    formData.avatar = null
    formData.removeAvatar = false

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      profileStore.clearMessages()
    }, 3000)
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

// Reset form to current user data
const resetForm = () => {
  formData.name = authStore.user?.name || ''
  formData.avatar = null
  formData.removeAvatar = false
  profileStore.clearMessages()
}

// Mark avatar for removal
const removeAvatar = () => {
  formData.removeAvatar = true
}
</script>
