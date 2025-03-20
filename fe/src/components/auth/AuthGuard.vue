<!-- src/components/auth/AuthGuard.vue -->
<template>
  <slot v-if="canAccess"></slot>
  <div v-else-if="loading" class="w-full h-screen flex items-center justify-center">
    <div class="text-center p-6">
      <div
        class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
      ></div>
      <h2 class="text-xl font-medium text-gray-700">Vérification de l'authentification...</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  requireAuth: {
    type: Boolean,
    default: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const canAccess = ref(false)

onMounted(async () => {
  // Vérifier l'état d'authentification
  authStore.checkAuth()

  const isLoggedIn = authStore.isLoggedIn

  if (props.requireAuth && !isLoggedIn) {
    // L'utilisateur n'est pas connecté mais la route nécessite une authentification
    router.push('/login')
  } else if (!props.requireAuth && isLoggedIn) {
    // L'utilisateur est déjà connecté mais essaie d'accéder à une page d'authentification
    router.push('/')
  } else {
    // L'accès est autorisé
    canAccess.value = true
  }

  loading.value = false
})
</script>
