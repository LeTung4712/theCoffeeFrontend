import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user'))
      : null,
    isAuthenticated: !!localStorage.getItem('user')
  }),

  actions: {
    login(userData) {
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },

    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user', JSON.stringify(this.user))
    }
  },

  getters: {
    userInfo: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  }
})