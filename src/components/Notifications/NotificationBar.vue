<template>
  <v-snackbar
    v-model="isVisible"
    :color="notification.type"
    :timeout="notification.duration"
    location="top right"
    class="notification-bar"
  >
    <div class="d-flex align-center">
      <v-icon
        :icon="getIcon"
        class="mr-2"
        size="small"
      />
      {{ notification.message }}
    </div>

    <template v-slot:actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="close"
      />
    </template>
  </v-snackbar>
</template>

<script>
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'NotificationBar',
  
  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isVisible: true
    }
  },

  computed: {
    getIcon() {
      const icons = {
        success: 'mdi-check-circle',
        error: 'mdi-alert-circle',
        warning: 'mdi-alert',
        info: 'mdi-information'
      }
      return icons[this.notification.type] || icons.info
    }
  },

  methods: {
    close() {
      this.isVisible = false
      const store = useNotificationStore()
      store.remove(this.notification.id)
    }
  }
}
</script>

<style scoped>
.notification-bar {
  z-index: 9999;
}
</style> 