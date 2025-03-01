const DOMAIN = "totospizza.ru"; //window.location.hostname;
const BASE_URL = "https://api.yooapp.ru";
const IO_URL = "https://io.yooapp.ru";
const DADATA_URL_STREET =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const DADATA_URL_GEO =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
const DADATA_TOKEN = "6487a33dcdff42183e8f0c4aa3ad43acdc5a7b62";
const FILE_URL = BASE_URL + "/file";

const apiRoutes = {
  GET_PROMO: "/promo/one",

  // auth
  AUTH_REGISTRATION: "/auth/registration",
  AUTH_ACTIVATE: "/auth/activate",
  AUTH_NEW_KEY_ACTIVATE: "/auth/newKeyActivate",
  AUTH_NEW_KEY_RECOVERY: "/auth/newKeyRecovery",
  AUTH_LOGIN: "/auth/login",
  AUTH_CHECK: "/auth/check",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_RECOVERY: "/auth/recovery",
  AUTH_EDIT_EMAIL: "/auth/editEmail",
  AUTH_QR_GENERATE: "/auth/qrGenerate",

  // account
  ACCOUNT_EDIT: "/user/edit",
  ACCOUNT_SAVE_PUSHTOKEN: "/auth/pushToken",
  ACCOUNT_ADDRESSES_GET: "/address/all",
  ACCOUNT_ADDRESS_GET: "/address/one/",
  ACCOUNT_ADDRESS_CREATE: "/address/create",
  ACCOUNT_ADDRESS_EDIT: "/address/",
  ACCOUNT_ADDRESS_MAIN: "/address/main",
  ACCOUNT_ADDRESS_DELETE: "/address/",

  ACCOUNT_ORDERS_GET: "/order/",
  ACCOUNT_ORDER_GET: "/order/one",

  ACCOUNT_NOTIFICATIONS_GET: "/notification/all",
  ACCOUNT_NOTIFICATION_DELETE: "/notification/delete",

  ACCOUNT: "/user",

  // Options
  OPTIONS: "/catalog/options",

  // category
  CATEGORY_ALL: "/catalog/categories",
  CATEGORY_ONE: "/catalog/category",
  CATEGORIES_LIST: "/catalog/categoryList",

  // product
  PRODUCT: "/catalog/product",
  PRODUCTS: "/catalog/products",
  PRODUCT_RECOMMENDATIONS: "/product/recommendations",
  PRODUCT_GIFTS: "/product/gifts",
  PRODUCT_FREE: "/product/free",

  HOME: "/catalog/home",

  // cart
  CART: "/cart",

  // Checkout, Order
  ORDER_CREATE: "/order/create",
  ORDER_DELIVERY: "/order/delivery",

  // Message
  MESSAGES: "/message/",
  MESSAGE: "/message/one",
  MESSAGES_VIEW: "/message/view",

  // Search
  SEARCH_GET: "/search",

  // Sale
  SALES_GET: "/sale",
  SALES_GET_PRODUCTS: "/sale/products",
  SALE_GET: "/sale/one",
  GIFTS_GET: "/sale/gifts",

  // Blog
  BLOGS: "/blog",
  BLOG: "/blog/one",

  // Banner
  BANNERS: "/banner",
  BANNER: "/banner/one",

  // Story
  STORIES: "/story",
  STORY: "/story/one",

  // Favorite
  FAVORITES: "/favorite",
  FAVORITES_LIST: "/favorite/list",

  // Document
  DOCUMENTS: "/document",
  DOCUMENT: "/document/one",
};

export {
  IO_URL,
  BASE_URL,
  FILE_URL,
  DADATA_URL_GEO,
  DADATA_URL_STREET,
  DADATA_TOKEN,
  DOMAIN,
  apiRoutes,
};
