// src/services/classService.ts
import PocketBase from 'pocketbase'

// Use environment variable for PocketBase URL
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090')

interface BaseRecord {
  id: string
  created: string
  updated: string
}

export interface User extends BaseRecord {
  username: string
  email: string
  name?: string
  avatar?: string
}

export interface Class extends BaseRecord {
  name: string
  description?: string
  expand?: {
    members?: ClassMember[]
  }
}

export interface ClassMember extends BaseRecord {
  class: string
  user: string
  role: 'owner' | 'admin' | 'member'
  joined: string
  expand?: {
    user?: User
  }
}

export interface CreateClassData {
  name: string
  description?: string
}

export interface JoinClassData {
  code: string
}

const classService = {
  async getClasses(): Promise<Class[]> {
    try {
      const records = await pb.collection('class_members').getFullList<ClassMember>({
        expand: 'class',
        filter: `user="${pb.authStore.model?.id}"`,
        sort: '-created',
      })

      return records.map((member) => member.expand?.class) as Class[]
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  async getClassById(id: string): Promise<Class> {
    try {
      const record = await pb.collection('classes').getOne<Class>(id, {
        expand: 'members(user)',
      })
      return record
    } catch (error) {
      console.error(`Error fetching class with ID ${id}:`, error)
      throw error
    }
  },

  async createClass(data: CreateClassData): Promise<Class> {
    try {
      // Create class (owner will be added via hook)
      const record = await pb.collection('classes').create<Class>(data)
      return record
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  },

  async updateClass(id: string, data: Partial<CreateClassData>): Promise<Class> {
    try {
      const record = await pb.collection('classes').update<Class>(id, data)
      return record
    } catch (error) {
      console.error(`Error updating class with ID ${id}:`, error)
      throw error
    }
  },

  async deleteClass(id: string): Promise<boolean> {
    try {
      await pb.collection('classes').delete(id)
      return true
    } catch (error) {
      console.error(`Error deleting class with ID ${id}:`, error)
      throw error
    }
  },

  async joinClass(code: string): Promise<ClassMember> {
    try {
      // First find class by invite code (you'll need to add this field)
      const targetClass = await pb
        .collection('classes')
        .getFirstListItem<Class>(`invite_code="${code}"`)

      // Add user as member
      const member = await pb.collection('class_members').create<ClassMember>({
        class: targetClass.id,
        user: pb.authStore.model?.id,
        role: 'member',
        joined: new Date().toISOString(),
      })

      return member
    } catch (error) {
      console.error('Error joining class:', error)
      throw error
    }
  },

  async getClassMembers(classId: string): Promise<ClassMember[]> {
    try {
      const records = await pb.collection('class_members').getFullList<ClassMember>({
        filter: `class="${classId}"`,
        expand: 'user',
        sort: 'joined',
      })
      return records
    } catch (error) {
      console.error(`Error fetching members for class ${classId}:`, error)
      throw error
    }
  },

  async getCurrentUserRole(classId: string): Promise<'owner' | 'admin' | 'member' | null> {
    try {
      const member = await pb
        .collection('class_members')
        .getFirstListItem<ClassMember>(`class="${classId}" && user="${pb.authStore.model?.id}"`)
      return member?.role || null
    } catch (error) {
      return null
    }
  },
}

export default classService
