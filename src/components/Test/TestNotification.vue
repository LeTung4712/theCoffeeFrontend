<template>
    <v-card class="ma-4 pa-4">
        <v-card-title>Test Thông Báo</v-card-title>
        <v-card-text>
            <v-btn color="primary" class="mb-4" @click="sendTestNotification" :loading="sending">
                Gửi thông báo test
            </v-btn>

            <v-alert v-if="testResult" :type="testResult.type" :text="testResult.message" class="mt-4"></v-alert>

            <div class="mt-4">
                <h3>Trạng thái kết nối:</h3>
                <v-list>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon :color="isConnected ? 'success' : 'error'">
                                {{ isConnected ? 'mdi-check-circle' : 'mdi-close-circle' }}
                            </v-icon>
                        </template>
                        <v-list-item-title>
                            {{ isConnected ? 'Đã kết nối' : 'Chưa kết nối' }}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-bell</v-icon>
                        </template>
                        <v-list-item-title>
                            Số thông báo chưa đọc: {{ unreadCount }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import pusher from '@/plugins/pusher';

export default {
    name: 'TestNotification',

    setup() {
        const orderStore = useOrderStore();
        const { notifications } = storeToRefs(orderStore);

        return {
            orderStore,
            notifications
        };
    },

    data() {
        return {
            sending: false,
            testResult: null,
            isConnected: false,
            testChannel: null
        };
    },

    computed: {
        unreadCount() {
            return this.notifications.filter(n => !n.read).length;
        }
    },

    mounted() {
        // Kiểm tra kết nối Pusher
        this.testChannel = pusher.subscribe('orders');

        this.testChannel.bind('pusher:subscription_succeeded', () => {
            this.isConnected = true;
            console.log('Test: Kết nối thành công');
        });

        this.testChannel.bind('pusher:subscription_error', () => {
            this.isConnected = false;
            console.log('Test: Kết nối thất bại');
        });
    },

    beforeUnmount() {
        if (this.testChannel) {
            pusher.unsubscribe('orders');
        }
    },

    methods: {
        async sendTestNotification() {
            this.sending = true;
            this.testResult = null;

            try {
                // Gửi request test đến backend
                const response = await fetch('/api/test-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: 'Đơn hàng test #' + Date.now(),
                        type: 'success'
                    })
                });

                if (!response.ok) {
                    throw new Error('Không thể gửi thông báo test');
                }

                this.testResult = {
                    type: 'success',
                    message: 'Đã gửi thông báo test thành công'
                };
            } catch (error) {
                console.error('Lỗi khi gửi thông báo test:', error);
                this.testResult = {
                    type: 'error',
                    message: 'Lỗi: ' + error.message
                };
            } finally {
                this.sending = false;
            }
        }
    }
};
</script>