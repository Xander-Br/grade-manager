// src/stores/profileStore.ts
import { defineStore } from 'pinia'
import profileService, { type ProfileUpdateData } from '@/services/profileService'
import { useAuthStore } from '@/stores/authStore'

interface ProfileState {
  loading: boolean
  error: string | null
  avatarUrl: string | null
  successMessage: string | null
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    loading: false,
    error: null,
    avatarUrl: null,
    successMessage: null,
  }),

  actions: {
    async updateProfile(data: ProfileUpdateData) {
      this.loading = true
      this.error = null
      this.successMessage = null

      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        this.error = 'Utilisateur non connecté'
        this.loading = false
        throw new Error('Utilisateur non connecté')
      }

      try {
        const updatedUser = await profileService.updateProfile(authStore.user.id, data)

        // Update the auth store with the new user data
        authStore.$patch({
          user: {
            ...authStore.user,
            ...updatedUser,
          },
        })

        // Update avatar URL if needed
        this.avatarUrl = updatedUser.avatar
          ? await profileService.getAvatarUrl(authStore.user.id)
          : null

        this.successMessage = 'Profil mis à jour avec succès'
        return updatedUser
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la mise à jour du profil'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadAvatarUrl() {
      const authStore = useAuthStore()
      if (!authStore.user?.id || !authStore.user?.avatar) {
        this.avatarUrl = null
        return
      }

      try {
        this.avatarUrl = await profileService.getAvatarUrl(authStore.user.id)
      } catch (error) {
        console.error('Error loading avatar URL:', error)
        this.avatarUrl = null
      }
    },

    clearMessages() {
      this.error = null
      this.successMessage = null
    },
  },
})
