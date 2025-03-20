<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Sidebar Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
      :class="{ 'opacity-0 pointer-events-none': !isSidebarOpen, 'opacity-20': isSidebarOpen }"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Mobile Sidebar -->
    <div
      class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden"
      :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-indigo-600 text-white p-2 rounded-lg mr-3">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <div class="font-bold text-gray-800">Swiss Grade Manager</div>
            </div>
            <button
              @click="isSidebarOpen = false"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- User Info (if logged in) -->
        <div v-if="authStore.isLoggedIn" class="p-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"
            >
              {{ getUserInitials() }}
            </div>
            <div>
              <div class="font-medium">{{ authStore.user?.name || authStore.user?.email }}</div>
              <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 p-4 overflow-y-auto" v-if="authStore.isLoggedIn">
          <div class="space-y-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
              :class="[
                $route.path === item.href
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              @click="isSidebarOpen = false"
            >
              <i v-if="item.icon" :class="['mr-3', item.icon]"></i>
              {{ item.name }}
            </router-link>

            <!-- Logout Button (if logged in) -->
            <button
              v-if="authStore.isLoggedIn"
              @click="logout"
              class="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
            >
              <i class="fas fa-sign-out-alt mr-3"></i>
              Déconnexion
            </button>

            <!-- Login/Register (if not logged in) -->
            <template v-else>
              <router-link
                to="/login"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                @click="isSidebarOpen = false"
              >
                <i class="fas fa-sign-in-alt mr-3"></i>
                Connexion
              </router-link>
              <router-link
                to="/register"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150 ease-in-out mt-2"
                @click="isSidebarOpen = false"
              >
                <i class="fas fa-user-plus mr-3"></i>
                S'inscrire
              </router-link>
            </template>
          </div>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 text-xs text-gray-500">
          Swiss Grade Manager © {{ new Date().getFullYear() }}
        </div>
      </div>
    </div>

    <!-- Top Navbar -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="flex items-center justify-between h-16">
          <!-- Left Side: Logo and Mobile Menu Button -->
          <div class="flex items-center">
            <!-- Mobile Menu Button -->
            <button
              class="md:hidden mr-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              @click="isSidebarOpen = true"
              v-if="authStore.isLoggedIn"
            >
              <i class="fas fa-bars"></i>
            </button>

            <!-- Logo -->
            <div class="flex items-center">
              <div class="bg-indigo-600 text-white p-2 rounded-lg mr-3">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <div class="hidden md:block">
                <div class="font-semibold text-gray-800">Swiss Grade Manager</div>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-1" v-if="authStore.isLoggedIn">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
              :class="[
                $route.path === item.href
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Right Side: User Info and Actions -->
          <div class="flex items-center">
            <!-- User Info/Avatar for Desktop -->
            <div v-if="authStore.isLoggedIn" class="hidden md:flex items-center">
              <div class="text-sm text-gray-700 mr-2">
                {{ authStore.user?.name || authStore.user?.email }}
              </div>
              <div
                class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"
              >
                {{ getUserInitials() }}
              </div>
              <button
                @click="logout"
                class="ml-4 text-gray-500 hover:text-gray-700"
                title="Déconnexion"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>

            <!-- Login/Register Buttons for Desktop (if not logged in) -->
            <div v-else class="hidden md:flex items-center space-x-2">
              <router-link
                to="/login"
                class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
              >
                Connexion
              </router-link>
              <router-link
                to="/register"
                class="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150 ease-in-out"
              >
                S'inscrire
              </router-link>
            </div>

            <!-- Avatar for Mobile (only shows small avatar) -->
            <div v-if="authStore.isLoggedIn && isMobile" class="md:hidden">
              <div
                class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"
              >
                {{ getUserInitials() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 max-w-7xl">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)
const isMobile = ref(false)

// Navigation items - customize as needed
const navigationItems = [
  { name: 'Accueil', href: '/', icon: 'fas fa-home' },
  { name: 'Profil', href: '/profile', icon: 'fas fa-user' },
]

// Close sidebar when route changes
router.afterEach(() => {
  isSidebarOpen.value = false
})

// Initialize auth and set up responsive detection
onMounted(() => {
  // Check authentication
  authStore.checkAuth()

  // Set initial mobile state
  checkIfMobile()

  // Listen for resize events to update mobile state
  window.addEventListener('resize', checkIfMobile)

  // Listen for Escape key to close sidebar
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      isSidebarOpen.value = false
    }
  })
})

// Check if we're on mobile
const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Get user initials for avatar
const getUserInitials = () => {
  if (!authStore.user) return '?'

  if (authStore.user.name) {
    return authStore.user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return authStore.user.email ? authStore.user.email[0].toUpperCase() : '?'
}

// Logout handler
const logout = () => {
  authStore.logout()
  isSidebarOpen.value = false
  router.push('/login')
}
</script>
