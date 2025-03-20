// src/services/profileService.ts
import PocketBase from 'pocketbase'

// Use environment variable for PocketBase URL
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090')

export interface ProfileUpdateData {
  name?: string
  avatar?: File | null
}

const profileService = {
  async updateProfile(userId: string, data: ProfileUpdateData): Promise<any> {
    try {
      const formData = new FormData()

      if (data.name) {
        formData.append('name', data.name)
      }

      if (data.avatar) {
        formData.append('avatar', data.avatar)
      } else if (data.avatar === null) {
        // If avatar is explicitly set to null, it means we want to remove it
        formData.append('avatar', '')
      }

      const record = await pb.collection('users').update(userId, formData)
      return record
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      const record = await pb.collection('users').getOne(userId)

      if (!record.avatar) {
        console.warn('User has no avatar')
        return null
      }

      const url = pb.files.getUrl(record, record.avatar)
      console.log('Avatar URL:', url)
      return url
    } catch (error) {
      console.error('Error fetching avatar URL:', error)
      return null
    }
  },
}

export default profileService
