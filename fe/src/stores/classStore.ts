// src/stores/classStore.ts
import { defineStore } from 'pinia'
import classService, {
  type Class,
  type CreateClassData,
  type JoinClassData,
} from '@/services/classService'

interface ClassState {
  classes: Class[]
  currentClass: Class | null
  loading: boolean
  error: string | null
}

export const useClassStore = defineStore('class', {
  state: (): ClassState => ({
    classes: [],
    currentClass: null,
    loading: false,
    error: null,
  }),

  getters: {
    getClassById: (state) => (id: string) => {
      return state.classes.find((c) => c.id === id) || null
    },
    hasClasses: (state) => state.classes.length > 0,
  },

  actions: {
    async fetchClasses() {
      this.loading = true
      this.error = null

      try {
        this.classes = await classService.getClasses()
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors du chargement des classes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchClassById(id: string) {
      this.loading = true
      this.error = null

      try {
        this.currentClass = await classService.getClassById(id)
        return this.currentClass
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors du chargement de la classe'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createClass(data: CreateClassData) {
      this.loading = true
      this.error = null

      try {
        const newClass = await classService.createClass(data)
        this.classes.unshift(newClass) // Add to the beginning of the array
        return newClass
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la création de la classe'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClass(id: string, data: Partial<CreateClassData>) {
      this.loading = true
      this.error = null

      try {
        const updatedClass = await classService.updateClass(id, data)
        const index = this.classes.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.classes[index] = updatedClass
        }
        return updatedClass
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la mise à jour de la classe'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteClass(id: string) {
      this.loading = true
      this.error = null

      try {
        await classService.deleteClass(id)
        this.classes = this.classes.filter((c) => c.id !== id)
        return true
      } catch (error: any) {
        this.error = error.message || 'Une erreur est survenue lors de la suppression de la classe'
        throw error
      } finally {
        this.loading = false
      }
    },

    async joinClass(data: JoinClassData) {
      this.loading = true
      this.error = null

      try {
        const joinedClass = await classService.joinClass(data)
        const exists = this.classes.some((c) => c.id === joinedClass.id)
        if (!exists) {
          this.classes.unshift(joinedClass)
        }
        return joinedClass
      } catch (error: any) {
        this.error =
          error.message || 'Une erreur est survenue lors de la tentative de rejoindre la classe'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCurrentClass() {
      this.currentClass = null
    },
  },
})
