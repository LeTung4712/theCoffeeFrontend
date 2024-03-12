<template>
<v-container>
    <userHeader :dialog="false"/>
    <v-row>
        <v-col cols="12" md="4" lg="3" style="margin: 30px 0">
            <v-treeview v-model="selection" :open="initiallyOpen" :items="menuItems" activatable item-key="name" open-on-click transition @input="categoryType = items.id" @update:open="clickParent" @update:active="clickParentActive">
                <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.file">
                        {{ open ? "mdi-coffee-to-go-outline" : "" }}
                    </v-icon>
                    <v-icon v-else>
                        {{ files[item.file] }}
                    </v-icon>

                </template>
            </v-treeview>
        </v-col>

        <v-col cols="12" sm="12" md="8" lg="9" style="margin: 30px 0">
            <v-row class="menu_bar">
                <v-col cols="12" sm="12" md="6" lg="4" v-for="item in items" :key="item.name" @click="handleProduct(item.id, item.name)">
                    <Item_User :image_url="item.image_url" :name="item.name" :description="item.description" :price="item.price" />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import { getAllCategories } from "@/api/category";
import { getAllProducts,getProductsByCategoryId } from "@/api/product";
export default {
    name: "menuCategory",
    components: {
        Item_User: () => import("@/components/productComponents/Item_User"),
        userHeader: () => import("@/layouts/header/userHeader"),
    },

    props: {
        menuType: String,
    },

    data() {
        return {
            categoryType: 0,
            categoryName: "tat-ca",
            currentPath: this.$route.path,
            initiallyOpen: ["public"],
            selection: [],
            files: {
                dots: "mdi-circle-small",
            },
            parent_type: [],
            children_type: [],
            menuItems: [],
            categories: [],
            items: [],
        };
    },
    created() {
        this.getItems();
        console.log("Categories:");
        this.getCategories();
        console.log("path:", this.currentPath)
        console.log("Category Type: ", this.categoryType)
    },
    methods: {
        clickParent(e) {
            // ignore initial open
            this.categoryType = 3

            console.log('toggle arrow clicked', e)
            this.parent_type = e
        },

        clickParentActive(e) {
            console.log('active:')
            console.log(e)
            this.children_type = e
        },

        // Get id of category by name of that category in this.categories
        getIDByNameCatgory(name) {
            for (let index in this.categories) {
                const category = this.categories[index]
                if (category.name == name) {
                    return category.id
                }
            }
            return 0
        },
        getNameByIDCatgory(id) {
            if (id == 0)
                return "menu"
            for (let index in this.categories) {
                const category = this.categories[index]
                if (category.id == id) {
                    return removeVietnameseTones(category.name).replaceAll(' ', '-').toLowerCase()
                }
            }
            return 0
        },
        getIDByPath(path) {
            console.log("input path: ", path)
            for (let index in this.categories) {
                const category = this.categories[index]
                console.log(removeVietnameseTones(category.name).replaceAll(' ', '-').toLowerCase())
                if (removeVietnameseTones(category.name).replaceAll(' ', '-').toLowerCase() == path) {
                    return category.id
                }
            }
            return 0
        },
        appendObjTo(thatArray, newObj) {
            const frozenObj = Object.freeze(newObj);
            return Object.freeze(thatArray.concat(frozenObj));
        },

        // Create this.menuItem from this.categories (load from database)
        makeMenuItem() {
            this.menuItems= []
            this.menuItems.push({
                name: "Tất cả",
                id: '0',
            })
            const tmp_category = {
                name: "",
                id: 0,
                children: [],
            }
            const child_category = {
                name: "",
                id: 0,
                file: "dots",
            }
            // console.log(this.categories)
            for (let index in this.categories) {
                // console.log("=====Singe category=====")
                const category = this.categories[index]
                // console.log(category.name)
                if (category.parent_id == 0) {
                    // // console.log("1")
                    tmp_category.name = category.name
                    tmp_category.id = category.id
                    for (const index2 in this.categories) {
                        const category_child = this.categories[index2]
                        // console.log("Bat dau quet:")
                        // console.log(category_child.name)
                        if (category_child.parent_id == category.id) {
                            // console.log("Child:", category_child.name)
                            child_category.name = category_child.name
                            child_category.id = category_child.id
                            // console.log("Children truoc do:", tmp_category.children[0], tmp_category.children[1])
                            // console.log("Da them:", child_category.name)
                            tmp_category.children.push({
                                name: category_child.name,
                                id: category_child.id,
                                file: "dots"
                            })
                            // tmp_category.children = this.appendObjTo(tmp_category.children, child_category);
                            // console.log("Children hien tai:", tmp_category.children[0], tmp_category.children[1])
                            // console.log("tmp hien tai:")
                            // console.log(tmp_category)
                            // console.log(tmp_category.children[0], tmp_category.children[1])
                        }
                    }
                    if (tmp_category.children.length == 0) {
                        tmp_category.children.push({
                            name: tmp_category.name,
                            id: tmp_category.id,
                            file: "dots"
                        })
                    }
                    // // console.log("3")
                    this.menuItems.push({
                        name: tmp_category.name,
                        id: tmp_category.id,
                        children: tmp_category.children,
                    })
                    tmp_category.children = []
                    // // console.log(this.menuItems[1].children[0], this.menuItems.children[1])
                }
            }
            // console.log("REAL MENUITEMS")
            // console.log(this.menuItems)
        },

        // get all categories from database => this.categories
        async getCategories () {
            try {
                const response = await getAllCategories()
                this.categories = response.data.categories
                console.log('cate',this.categories)
                this.makeMenuItem()
                this.handlePath()
            } catch (error) {
                console.log(error.response)
            }
        },

        // get all items from database => this.items
        async getItems() {
            try {
                const response = await getAllProducts()
                this.items = response.data.products
            } catch (error) {
                console.log(error.response)
            }
        },
        
        async getItemsbyCategoryId() {
            try {
                const response = await getProductsByCategoryId(
                    {
                        params: {
                            category_id: this.categoryType
                        }
                    }
                )
                this.items = response.data.products
            } catch (error) {
                console.log(error.response)
            }
        },

        onUpdate(selection) {
            console.log(selection)
        },

        handlePath() {
            this.categoryType = this.getIDByPath(this.currentPath.replace("/collections/", ""))
        },
        handleProduct(product_id, product_name) {
            this.product_id = product_id;
            this.product_name = product_name;
            console.log(this.product_name_convert),
                this.$router.push({
                    path: `/${this.product_id}`,
                    name: "productInfo",
                    params: {
                        product_id: `${this.product_id}`,
                        product_name_convert: `${this.product_name_convert_computed}`
                    },
                });
        },
    },
    computed: {
        product_name_convert_computed() {
            return removeVietnameseTones(this.product_name).replaceAll(' ', '-').toLowerCase()
        }
    },
    watch: {
        selection(newValue) {
            this.onUpdate(newValue)
        },

        children_type(newArr, oldArr) {
            let clickName = []
            if (oldArr.length > newArr.length)
                clickName = oldArr.filter(x => !newArr.includes(x))
            else
                clickName = newArr.filter(x => !oldArr.includes(x))
            console.log(clickName)
            this.categoryType = this.getIDByNameCatgory(clickName)
            console.log(this.categoryType)
        },

        parent_type(newArr, oldArr) {
            let clickName = []
            if (oldArr.length > newArr.length)
                clickName = oldArr.filter(x => !newArr.includes(x))
            else
                clickName = newArr.filter(x => !oldArr.includes(x))
            console.log(clickName)
            this.categoryType = this.getIDByNameCatgory(clickName)
            console.log(this.categoryType)
        },

        categoryType() {
            if (this.categoryType == 0) {
                this.getItems()
            } else
                this.getItemsbyCategoryId()
            this.categoryName = this.getNameByIDCatgory(this.categoryType)
            console.log(this.categoryName)
            this.$router.push({
                path: `/${this.categoryName}`,
                name: "menuMenu",
                params: {
                    category_name: `${this.categoryName}`,
                    category_id: `${this.categoryType}`
                }
            })
        },

        '$route.params'(to, from) {
            console.log("To: ", to)
            console.log("From: ", from)
            this.categoryType = this.getIDByPath(to.category_name)
        }
    },
    
    
};
</script>

<style scoped>
.menu_bar::after {
    content: "";
    position: absolute;
    width: 2px;
    top: 12px;
    background: #00000026;
}
</style>
