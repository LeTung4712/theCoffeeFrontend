<template>
    <v-container class="blog-page">
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 font-weight-bold text-center my-5">Blog Coffee Shop</h1>
            </v-col>
        </v-row>

        <!-- Thanh tìm kiếm và bộ lọc -->
        <v-row>
            <v-col cols="12" md="8" lg="9">
                <v-text-field v-model="search" label="Tìm kiếm bài viết" prepend-inner-icon="mdi-magnify"
                    variant="outlined" hide-details class="mb-4" @update:model-value="handleSearch"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-select v-model="selectedCategory" :items="categories" label="Danh mục" variant="outlined"
                    hide-details @update:model-value="handleCategoryChange"></v-select>
            </v-col>
        </v-row>

        <!-- Hiển thị thông báo khi không có bài viết -->
        <v-row v-if="isLoading">
            <v-col cols="12" class="d-flex justify-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>
        </v-row>

        <v-row v-else-if="filteredPosts.length === 0">
            <v-col cols="12">
                <v-alert type="info" text="Không tìm thấy bài viết nào"></v-alert>
            </v-col>
        </v-row>

        <!-- Danh sách bài viết -->
        <v-row v-else>
            <v-col v-for="post in paginatedPosts" :key="post.id" cols="12" md="6" lg="4">
                <v-card class="blog-card h-100" :to="'/blogs/' + post.slug">
                    <v-img :src="post.thumbnail || '/images/blog/default.jpg'" height="200px" cover
                        class="blog-thumbnail"></v-img>

                    <v-card-title class="text-h6 font-weight-bold">{{ post.title }}</v-card-title>

                    <v-card-subtitle class="pt-2">
                        <v-row no-gutters align="center">
                            <v-col cols="auto" class="mr-2">
                                <v-icon size="small" color="primary">mdi-calendar</v-icon>
                            </v-col>
                            <v-col>{{ formatDate(post.published_at) }}</v-col>
                        </v-row>
                    </v-card-subtitle>

                    <v-card-text>
                        <p class="text-truncate-2">{{ post.excerpt }}</p>
                        <v-chip size="small" color="primary" text-color="white" class="mt-2">
                            {{ post.category }}
                        </v-chip>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn variant="text" color="primary" :to="'/blog/' + post.slug" class="text-none">
                            Đọc tiếp
                            <v-icon right>mdi-arrow-right</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Phân trang -->
        <v-row v-if="totalPages > 1" class="mt-6">
            <v-col cols="12" class="d-flex justify-center">
                <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" rounded></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'BlogPage',

    data() {
        return {
            posts: [],
            search: '',
            selectedCategory: 'all',
            categories: [
                { title: 'Tất cả', value: 'all' },
                { title: 'Cà phê', value: 'coffee' },
                { title: 'Pha chế', value: 'brewing' },
                { title: 'Sức khỏe', value: 'health' },
                { title: 'Tin tức', value: 'news' }
            ],
            isLoading: true,
            currentPage: 1,
            perPage: 9
        }
    },

    computed: {
        filteredPosts() {
            let result = [...this.posts];

            // Lọc theo danh mục
            if (this.selectedCategory !== 'all') {
                result = result.filter(post => post.category_value === this.selectedCategory);
            }

            // Lọc theo tìm kiếm
            if (this.search) {
                const searchLower = this.search.toLowerCase();
                result = result.filter(post =>
                    post.title.toLowerCase().includes(searchLower) ||
                    post.excerpt.toLowerCase().includes(searchLower)
                );
            }

            return result;
        },

        totalPages() {
            return Math.ceil(this.filteredPosts.length / this.perPage);
        },

        paginatedPosts() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredPosts.slice(start, end);
        }
    },

    mounted() {
        this.fetchPosts();
    },

    methods: {
        async fetchPosts() {
            this.isLoading = true;

            try {
                // Giả lập API gọi danh sách bài viết
                setTimeout(() => {
                    this.posts = [
                        {
                            id: 1,
                            title: 'Cách phân biệt cà phê Arabica và Robusta',
                            slug: 'cach-phan-biet-ca-phe-arabica-va-robusta',
                            excerpt: 'Arabica và Robusta là hai loại cà phê phổ biến nhất trên thế giới, có nhiều đặc điểm khác biệt về hương vị, caffein và cách trồng...',
                            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2024-11-15T08:00:00Z',
                            category: 'Cà phê',
                            category_value: 'coffee'
                        },
                        {
                            id: 2,
                            title: 'Bí quyết pha cà phê Pour Over hoàn hảo tại nhà',
                            slug: 'bi-quyet-pha-ca-phe-pour-over-hoan-hao-tai-nha',
                            excerpt: 'Pour Over là phương pháp pha cà phê thủ công được ưa chuộng vì khả năng làm nổi bật hương vị đặc trưng của từng loại cà phê...',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2024-11-10T10:30:00Z',
                            category: 'Pha chế',
                            category_value: 'brewing'
                        },
                        {
                            id: 3,
                            title: 'Lợi ích sức khỏe không ngờ từ việc uống cà phê đều đặn',
                            slug: 'loi-ich-suc-khoe-khong-ngo-tu-viec-uong-ca-phe-deu-dan',
                            excerpt: 'Nghiên cứu khoa học gần đây đã chỉ ra rằng uống cà phê đều đặn có thể mang lại nhiều lợi ích sức khỏe như giảm nguy cơ mắc bệnh Parkinson...',
                            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2024-11-05T09:15:00Z',
                            category: 'Sức khỏe',
                            category_value: 'health'
                        },
                        {
                            id: 4,
                            title: 'Coffee Shop khai trương chi nhánh mới tại quận 2',
                            slug: 'coffee-shop-khai-truong-chi-nhanh-moi-tai-quan-2',
                            excerpt: 'Chúng tôi vui mừng thông báo về việc khai trương chi nhánh mới tại Quận 2, TP.HCM vào ngày 01/12/2024 với nhiều ưu đãi hấp dẫn...',
                            thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80',
                            published_at: '2024-11-01T14:00:00Z',
                            category: 'Tin tức',
                            category_value: 'news'
                        }
                    ];

                    // Thêm dữ liệu mẫu để kiểm tra phân trang
                    for (let i = 5; i <= 15; i++) {
                        this.posts.push({
                            id: i,
                            title: `Bài viết mẫu ${i}`,
                            slug: `bai-viet-mau-${i}`,
                            excerpt: 'Đây là nội dung mẫu để kiểm tra giao diện hiển thị của trang blog...',
                            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
                            published_at: '2024-10-20T08:00:00Z',
                            category: 'Cà phê',
                            category_value: 'coffee'
                        });
                    }

                    this.isLoading = false;
                }, 1000);

                // gọi API từ backend
                // const response = await blogAPI.getPosts();
                // this.posts = response.data;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu blog:', error);
            } finally {
                // this.isLoading = false;
            }
        },

        formatDate(dateString) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        },

        handleSearch() {
            this.currentPage = 1;
        },

        handleCategoryChange() {
            this.currentPage = 1;
        }
    }
}
</script>

<style scoped>
.blog-card {
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
}

.blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.blog-thumbnail {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
