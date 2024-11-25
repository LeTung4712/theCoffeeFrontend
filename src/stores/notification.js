import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    nextId: 1
  }),

  actions: {
    add(notification) {
      console.log('Adding notification:', notification)
      const id = this.nextId++
      this.notifications.push({
        id,
        message: notification.message,
        type: notification.type || 'info', // success, error, warning, info
        duration: notification.duration || 3000,
        timestamp: new Date()
      })
      console.log('Current notifications:', this.notifications)

      // Tự động xóa sau duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          this.remove(id)
        }, notification.duration)
      }

      return id
    },

    remove(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    // Các helper methods
    success(message, duration) {
      return this.add({ message, type: 'success', duration })
    },

    error(message, duration) {
      return this.add({ message, type: 'error', duration })
    },

    warning(message, duration) {
      return this.add({ message, type: 'warning', duration })
    },

    info(message, duration) {
      return this.add({ message, type: 'info', duration })
    }
  }
}) 