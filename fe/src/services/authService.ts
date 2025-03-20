// src/services/authService.ts
import PocketBase from 'pocketbase'

// Initialisation de PocketBase
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090')

// Types
export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  passwordConfirm: string
  name?: string
}

export default {
  // Récupérer l'utilisateur actuel
  getUser(): AuthUser | null {
    if (!pb.authStore.isValid) return null

    const user = pb.authStore.model
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar ? pb.files.getUrl(user, user.avatar) : undefined,
    }
  },

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return pb.authStore.isValid
  },

  // Connexion avec email/password
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(credentials.email, credentials.password)

      return this.getUser() as AuthUser
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  },

  // Inscription avec email/password
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    try {
      const user = await pb.collection('users').create({
        email: credentials.email,
        password: credentials.password,
        passwordConfirm: credentials.passwordConfirm,
        name: credentials.name || '',
        emailVisibility: true,
      })

      // Connexion automatique après inscription
      return await this.login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      throw error
    }
  },

  // Connexion avec Google en utilisant la méthode de popup
  async loginWithGoogle(): Promise<AuthUser> {
    try {
      // Cette méthode initialise une connexion en temps réel et ouvre une fenêtre popup
      // avec la page de Google pour l'authentification.
      // Une fois l'authentification externe terminée, la fenêtre popup se ferme
      // automatiquement et les données OAuth2 sont renvoyées via la connexion établie.
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
      })

      return this.getUser() as AuthUser
    } catch (error) {
      console.error("Erreur lors de l'authentification OAuth:", error)
      throw error
    }
  },

  // Déconnexion
  logout(): void {
    pb.authStore.clear()
  },

  // Récupérer l'instance PocketBase (pour accès avancé)
  getPocketBase(): PocketBase {
    return pb
  },
}
