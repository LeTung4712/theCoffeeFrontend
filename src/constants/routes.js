export const ROUTES = {
  MAIN_PAGE: "mainpage",
  PRODUCT_DETAIL: "products/:product_name_convert",
  USER_PAGE: "user/:name",
  BLOG_PAGE: "blog",
  MENU: "collections/:category_name/:category_id",
  CHECKOUT: "thanh-toan",
  BLOG_DETAIL: "blog/:blog_name_convert",
  // routes cho admin
  ADMIN: {
    PROFILE: "profile",
    ORDER_DETAIL: "order-detail/:order_code",
    ANALYZE: "analyze",
    SHOPPING_BEHAVIOR: "shopping-behavior",
    MANAGE_PRODUCTS: "manage-products",
    MANAGE_VOUCHERS: "manage-vouchers",
    MANAGE_TOPPINGS: "manage-toppings",
    NEW_ORDERS: "new-orders", 
    PAYMENT_HISTORY: "payment-history",
    DELIVERY_ORDERS: "delivery-orders",
    LOGIN: "login"
  }
};
