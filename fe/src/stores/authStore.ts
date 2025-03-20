// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import authService, {
  type AuthUser,
  type LoginCredentials,
  type RegisterCredentials,
} from '@/services/authService'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: authService.getUser(),
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        this.user = await authService.login(credentials)
        return this.user
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la connexion'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(credentials: RegisterCredentials) {
      this.loading = true
      this.error = null

      try {
        this.user = await authService.register(credentials)
        return this.user
      } catch (error: any) {
        this.error = error.message || "Une erreur est survenue lors de l'inscription"
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null

      try {
        this.user = await authService.loginWithGoogle()
        return this.user
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la connexion avec Google'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      authService.logout()
      this.user = null
    },

    // Vérifier et recharger l'état d'authentification (utile lors de l'initialisation de l'app)
    checkAuth() {
      this.user = authService.getUser()
    },
  },
})
