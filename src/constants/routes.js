export const ROUTES = {
  MAIN_PAGE: "mainpage",
  PRODUCT_DETAIL: "products/:product_name_convert",
  USER_PAGE: "user/:name",
  MENU: "collections/:category_name",
  CHECKOUT: "thanh-toan",

  // routes cho admin
  ADMIN: {
    PROFILE: "profile",
    ORDER_DETAIL: "order-detail/:order_detail_id",
    ICONS: "icons",
    NEW_ORDERS: "new-orders", 
    PAYMENT_HISTORY: "payment-history",
    LOGIN: "login"
  }
};
