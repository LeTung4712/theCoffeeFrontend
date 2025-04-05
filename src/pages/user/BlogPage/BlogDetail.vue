<template>
    <v-container class="blog-detail">
        <v-row v-if="isLoading">
            <v-col cols="12" class="d-flex justify-center align-center" style="min-height: 400px;">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>
        </v-row>

        <template v-else-if="post">
            <!-- Breadcrumbs -->
            <v-row>
                <v-col cols="12">
                    <v-breadcrumbs :items="breadcrumbs" divider=">"></v-breadcrumbs>
                </v-col>
            </v-row>

            <!-- Blog header -->
            <v-row>
                <v-col cols="12">
                    <h1 class="text-h3 font-weight-bold mb-4">{{ post.title }}</h1>

                    <div class="d-flex align-center mb-6">
                        <v-chip color="primary" class="mr-3">{{ post.category }}</v-chip>
                        <v-icon small class="mr-2">mdi-calendar</v-icon>
                        <span class="text-body-2">{{ formatDate(post.published_at) }}</span>
                    </div>
                </v-col>
            </v-row>

            <!-- Feature image -->
            <v-row>
                <v-col cols="12">
                    <v-img :src="post.thumbnail" height="400px" :aspect-ratio="16 / 9" class="rounded-lg" cover></v-img>
                </v-col>
            </v-row>

            <!-- Blog content -->
            <v-row class="mt-6">
                <v-col cols="12" md="8">
                    <div class="blog-content">
                        <div v-html="post.content"></div>
                    </div>
                </v-col>

                <!-- Sidebar -->
                <v-col cols="12" md="4">
                    <v-card class="mb-6">
                        <v-card-title>Bài viết mới nhất</v-card-title>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item v-for="relatedPost in recentPosts" :key="relatedPost.id"
                                :to="'/blog/' + relatedPost.slug" class="py-2">
                                <template v-slot:prepend>
                                    <v-avatar size="50" rounded>
                                        <v-img :src="relatedPost.thumbnail" cover></v-img>
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="text-subtitle-2 font-weight-medium">
                                    {{ relatedPost.title }}
                                </v-list-item-title>

                                <v-list-item-subtitle>
                                    {{ formatDate(relatedPost.published_at) }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card>

                    <v-card>
                        <v-card-title>Danh mục</v-card-title>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item v-for="category in categories" :key="category.value"
                                :to="`/blog?category=${category.value}`">
                                <v-list-item-title>{{ category.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Related posts -->
            <v-row class="mt-8">
                <v-col cols="12">
                    <h2 class="text-h5 font-weight-bold mb-4">Bài viết liên quan</h2>
                </v-col>

                <v-col v-for="relatedPost in relatedPosts" :key="relatedPost.id" cols="12" md="4">
                    <v-card class="blog-card h-100" :to="'/blog/' + relatedPost.slug">
                        <v-img :src="relatedPost.thumbnail" height="180px" cover class="blog-thumbnail"></v-img>

                        <v-card-title class="text-subtitle-1 font-weight-bold">
                            {{ relatedPost.title }}
                        </v-card-title>

                        <v-card-subtitle class="pt-2">
                            {{ formatDate(relatedPost.published_at) }}
                        </v-card-subtitle>

                        <v-card-text>
                            <p class="text-truncate-2">{{ relatedPost.excerpt }}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>

        <!-- Hiển thị khi không tìm thấy bài viết -->
        <v-row v-else>
            <v-col cols="12">
                <v-alert type="warning" text="Không tìm thấy bài viết" class="mb-4"></v-alert>
                <v-btn color="primary" to="/blog">Quay lại trang Blog</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'BlogDetail',

    data() {
        return {
            post: null,
            isLoading: true,
            recentPosts: [],
            relatedPosts: [],
            categories: [
                { title: 'Tất cả', value: 'all' },
                { title: 'Cà phê', value: 'coffee' },
                { title: 'Pha chế', value: 'brewing' },
                { title: 'Sức khỏe', value: 'health' },
                { title: 'Tin tức', value: 'news' }
            ]
        }
    },

    computed: {
        slug() {
            return this.$route.params.slug;
        },

        breadcrumbs() {
            return [
                {
                    title: 'Trang chủ',
                    to: '/'
                },
                {
                    title: 'Blog',
                    to: '/blog'
                },
                {
                    title: this.post?.title || 'Chi tiết bài viết',
                    disabled: true
                }
            ]
        }
    },

    watch: {
        slug: {
            immediate: true,
            handler() {
                this.fetchPostDetail();
            }
        }
    },

    methods: {
        async fetchPostDetail() {
            this.isLoading = true;

            try {
                // Giả lập API gọi chi tiết bài viết
                setTimeout(() => {
                    // Tìm bài viết theo slug
                    this.post = {
                        id: 1,
                        title: 'Cách phân biệt cà phê Arabica và Robusta',
                        slug: 'cach-phan-biet-ca-phe-arabica-va-robusta',
                        excerpt: 'Arabica và Robusta là hai loại cà phê phổ biến nhất trên thế giới, có nhiều đặc điểm khác biệt về hương vị, caffein và cách trồng...',
                        thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                        published_at: '2023-11-15T08:00:00Z',
                        category: 'Cà phê',
                        category_value: 'coffee',
                        content: `
              <p class="text-body-1">Cà phê là một trong những đồ uống phổ biến nhất thế giới, với hai loại chính là <strong>Arabica</strong> và <strong>Robusta</strong>. Mỗi loại có những đặc điểm riêng biệt về hương vị, hàm lượng caffeine và điều kiện canh tác.</p>
              
              <h2 class="text-h5 font-weight-bold mt-6 mb-3">1. Hương vị đặc trưng</h2>
              
              <p>Arabica được biết đến với hương vị tinh tế, phong phú và đa dạng. Đặc trưng của cà phê Arabica là vị chua thanh, hương thơm nhẹ nhàng với các nốt hương hoa, trái cây và đôi khi có vị ngọt của caramel hoặc chocolate. Điều này khiến Arabica trở thành lựa chọn phổ biến cho các loại cà phê chuyên biệt (specialty coffee).</p>
              
              <p>Ngược lại, Robusta có vị đắng mạnh hơn, vị chua ít hơn và thường có hương vị mạnh mẽ, đôi khi hơi khô và có thể mang vị đất hoặc gỗ. Robusta thường được sử dụng nhiều trong cà phê rang xay thông thường và đặc biệt là cà phê espresso vì nó tạo ra lớp crema dày và đẹp mắt.</p>
              
              <h2 class="text-h5 font-weight-bold mt-6 mb-3">2. Hàm lượng caffeine</h2>
              
              <p>Một trong những điểm khác biệt lớn nhất giữa Arabica và Robusta là hàm lượng caffeine:</p>
              
              <ul class="ml-4 my-3">
                <li>Arabica: Chứa khoảng 1.2-1.5% caffeine</li>
                <li>Robusta: Chứa khoảng 2-2.7% caffeine, gần gấp đôi so với Arabica</li>
              </ul>
              
              <p>Hàm lượng caffeine cao hơn này là một trong những lý do khiến Robusta có vị đắng mạnh hơn và cũng giúp cây cà phê Robusta kháng sâu bệnh tốt hơn.</p>
              
              <h2 class="text-h5 font-weight-bold mt-6 mb-3">3. Điều kiện canh tác</h2>
              
              <p>Arabica thường được trồng ở độ cao từ 600-2000m so với mực nước biển, cần khí hậu mát mẻ (15-24°C) và lượng mưa ổn định. Cây Arabica khá nhạy cảm với thời tiết và sâu bệnh, đặc biệt là bệnh gỉ sắt lá cà phê.</p>
              
              <p>Robusta thích nghi tốt hơn với các điều kiện khắc nghiệt, có thể phát triển ở độ cao thấp hơn (từ 0-800m), chịu được nhiệt độ cao hơn (24-30°C) và ít bị ảnh hưởng bởi sâu bệnh. Điều này cũng giúp giải thích tại sao Robusta thường có giá thành thấp hơn Arabica.</p>
              
              <h2 class="text-h5 font-weight-bold mt-6 mb-3">4. Cách phân biệt bằng mắt thường</h2>
              
              <p>Về hình dáng, hạt Arabica thường có dạng oval dài, với đường cong chữ S rõ ràng và khe nứt giữa hơi lượn sóng. Hạt Robusta thường tròn hơn, với đường nứt thẳng hơn.</p>
              
              <h2 class="text-h5 font-weight-bold mt-6 mb-3">5. Kết luận</h2>
              
              <p>Cả Arabica và Robusta đều có những ưu điểm riêng. Arabica thường được đánh giá cao hơn về mặt hương vị, trong khi Robusta lại có lợi thế về độ đắng và lượng caffeine. Trong thực tế, nhiều loại cà phê thương mại là sự pha trộn giữa hai loại này để tạo ra sự cân bằng giữa hương vị và độ đậm đà.</p>
              
              <p>Tùy vào sở thích cá nhân, bạn có thể lựa chọn Arabica cho những tách cà phê nhẹ nhàng, tinh tế hoặc Robusta cho những tách cà phê đậm đà, mạnh mẽ hơn.</p>
            `
                    };

                    // Tạo dữ liệu mẫu cho các bài viết liên quan
                    this.relatedPosts = [
                        {
                            id: 2,
                            title: 'Bí quyết pha cà phê Pour Over hoàn hảo tại nhà',
                            slug: 'bi-quyet-pha-ca-phe-pour-over-hoan-hao-tai-nha',
                            excerpt: 'Pour Over là phương pháp pha cà phê thủ công được ưa chuộng vì khả năng làm nổi bật hương vị đặc trưng của từng loại cà phê...',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-11-10T10:30:00Z',
                            category: 'Pha chế',
                            category_value: 'brewing'
                        },
                        {
                            id: 3,
                            title: 'Lợi ích sức khỏe không ngờ từ việc uống cà phê đều đặn',
                            slug: 'loi-ich-suc-khoe-khong-ngo-tu-viec-uong-ca-phe-deu-dan',
                            excerpt: 'Nghiên cứu khoa học gần đây đã chỉ ra rằng uống cà phê đều đặn có thể mang lại nhiều lợi ích sức khỏe như giảm nguy cơ mắc bệnh Parkinson...',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-11-05T09:15:00Z',
                            category: 'Sức khỏe',
                            category_value: 'health'
                        },
                        {
                            id: 5,
                            title: 'Bài viết mẫu 5',
                            slug: 'bai-viet-mau-5',
                            excerpt: 'Đây là nội dung mẫu để kiểm tra giao diện hiển thị của trang blog...',
                            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-10-20T08:00:00Z',
                            category: 'Cà phê',
                            category_value: 'coffee'
                        }
                    ];

                    // Bài viết mới nhất
                    this.recentPosts = [
                        {
                            id: 1,
                            title: 'Cách phân biệt cà phê Arabica và Robusta',
                            slug: 'cach-phan-biet-ca-phe-arabica-va-robusta',
                            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-11-15T08:00:00Z',
                        },
                        {
                            id: 2,
                            title: 'Bí quyết pha cà phê Pour Over hoàn hảo tại nhà',
                            slug: 'bi-quyet-pha-ca-phe-pour-over-hoan-hao-tai-nha',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-11-10T10:30:00Z',
                        },
                        {
                            id: 3,
                            title: 'Lợi ích sức khỏe không ngờ từ việc uống cà phê đều đặn',
                            slug: 'loi-ich-suc-khoe-khong-ngo-tu-viec-uong-ca-phe-deu-dan',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2023-11-05T09:15:00Z',
                        },
                        {
                            id: 4,
                            title: 'Coffee Shop khai trương chi nhánh mới tại quận 2',
                            slug: 'coffee-shop-khai-truong-chi-nhanh-moi-tai-quan-2',
                            thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80',
                            published_at: '2023-11-01T14:00:00Z',
                        }
                    ];

                    this.isLoading = false;
                }, 1000);

                //  gọi API từ backend
                // const response = await blogAPI.getPostBySlug(this.slug);
                // this.post = response.data;
                // this.fetchRelatedPosts(this.post.category_value);
            } catch (error) {
                console.error('Lỗi khi tải chi tiết bài viết:', error);
            }
        },

        formatDate(dateString) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        }
    }
}
</script>

<style scoped>
.blog-content {
    line-height: 1.8;
}

.blog-content :deep(p) {
    margin-bottom: 1rem;
}

.blog-content :deep(h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

.blog-card {
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
}

.blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
