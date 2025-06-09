import { defineStore } from "pinia";
import pusher from "@/plugins/pusher";

// Hàm helper để lưu thông báo vào localStorage
const saveNotificationsToStorage = (notifications) => {
  try {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Lỗi khi lưu thông báo:", error);
  }
};

// Hàm helper để đọc thông báo từ localStorage
const loadNotificationsFromStorage = () => {
  try {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const notifications = JSON.parse(stored);
      // Chuyển đổi chuỗi timestamp thành Date object
      return notifications.map((notification) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
      }));
    }
  } catch (error) {
    console.error("Lỗi khi đọc thông báo:", error);
  }
  return [];
};

export const useOrderStore = defineStore("order", {
  state: () => ({
    newOrders: [],
    notifications: loadNotificationsFromStorage(), // Khôi phục thông báo từ localStorage
    isListening: false,
    channel: null,
    maxNotifications: 10,
    maxStoredNotifications: 50,
  }),

  getters: {
    activeNotifications: (state) => {
      return state.notifications.slice(0, state.maxNotifications);
    },
    unreadNotifications: (state) => {
      return state.notifications.filter((n) => !n.read);
    },
    totalStoredNotifications: (state) => {
      return state.notifications.length;
    },
  },

  actions: {
    addNotification(notification) {
      this.notifications.unshift(notification);

      if (this.notifications.length > this.maxStoredNotifications) {
        this.notifications = this.notifications.slice(
          0,
          this.maxStoredNotifications
        );
      }

      // Lưu thông báo vào localStorage sau khi thêm mới
      saveNotificationsToStorage(this.notifications);
    },

    startListening() {
      if (this.isListening) return;

      try {
        this.channel = pusher.subscribe("orders");

        this.channel.bind("pusher:subscription_succeeded", () => {
          this.isListening = true;
        });

        this.channel.bind("pusher:subscription_error", (error) => {
          console.error("Lỗi kết nối Pusher:", error);
          this.isListening = false;
        });

        this.channel.bind("new-order", (data) => {
          console.log(data);
          const newNotification = {
            id: Date.now(),
            message: `Đơn hàng mới #${data.order_code}`,
            type: "success",
            timestamp: new Date(),
            read: false,
            orderId: data.order_id,
            orderCode: data.order_code,
          };

          this.addNotification(newNotification);
          this.newOrders.unshift(data);
          this.playNotificationSound();
        });

        pusher.connection.bind("error", (error) => {
          console.error("Lỗi kết nối Pusher:", error);
        });
      } catch (error) {
        console.error("Lỗi khi kết nối Pusher:", error);
        this.isListening = false;
      }
    },

    stopListening() {
      if (!this.isListening || !this.channel) return;

      try {
        this.channel.unbind("new-order");
        pusher.unsubscribe("orders");
        this.channel = null;
        this.isListening = false;
      } catch (error) {
        console.error("Lỗi khi ngắt kết nối Pusher:", error);
      }
    },

    playNotificationSound() {
      try {
        const audio = new Audio("/notification-sound.mp3");
        audio.play().catch(() => {});
      } catch (error) {
        console.error("Lỗi khi phát âm thanh:", error);
      }
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
      // Lưu thông báo vào localStorage sau khi xóa
      saveNotificationsToStorage(this.notifications);
    },

    clearNotifications() {
      this.notifications = [];
      // Xóa thông báo khỏi localStorage
      localStorage.removeItem("notifications");
    },

    markNotificationAsRead(id) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
        // Lưu thông báo vào localStorage sau khi đánh dấu đã đọc
        saveNotificationsToStorage(this.notifications);
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach((notification) => {
        notification.read = true;
      });
      // Lưu thông báo vào localStorage sau khi đánh dấu tất cả đã đọc
      saveNotificationsToStorage(this.notifications);
    },
  },
});
