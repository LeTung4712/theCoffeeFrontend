<template>
  <div class="notifications-container">
    <notification-bar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import { useNotificationStore } from '@/stores/notification'
import NotificationBar from './NotificationBar.vue'

export default {
  name: 'NotificationList',
  
  components: {
    NotificationBar
  },

  computed: {
    notifications() {
      const store = useNotificationStore()
      return store.notifications
    }
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 0px;
  z-index: 9999;
}
</style> 