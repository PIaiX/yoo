const API_TOKEN = "igiuxdxheuhu3htgbsfy723t6tgfajkfsiug7vjb";
const DOMAIN = "yakinori.ru";
const SITE_URL = "https://yooapp.ru";
const BASE_URL = "https://api.yooapp.ru";
const ADMIN_URL = "https://admin.yooapp.ru";
const IO_URL = "https://io.yooapp.ru";
const DADATA_URL_STREET =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const DADATA_URL_ADDRESS =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address";
const DADATA_TOKEN = "6487a33dcdff42183e8f0c4aa3ad43acdc5a7b62";
const SERVICE_ACCOUNT = "/auth";
const SERVICE_USER = "/user";
const SERVICE_CATALOG = "/catalog";
const SERVICE_FAVORITE = "/favorite";
const SERVICE_ADDRESS = "/address";
const SERVICE_CART = "/cart";
const SERVICE_DOCUMENT = "/document";
const SERVICE_ORDER = "/order";
const FILE_URL = BASE_URL + "/file";

const apiRoutes = {
  GET_PROMO: "/promo/one",

  // auth
  AUTH_REGISTRATION: SERVICE_ACCOUNT + "/registration",
  AUTH_ACTIVATE: SERVICE_ACCOUNT + "/activate",
  AUTH_NEW_KEY_ACTIVATE: SERVICE_ACCOUNT + "/newKeyActivate",
  AUTH_NEW_KEY_RECOVERY: SERVICE_ACCOUNT + '/newKeyRecovery',
  AUTH_LOGIN: SERVICE_ACCOUNT + "/login",
  AUTH_CHECK: SERVICE_ACCOUNT + "/check",
  AUTH_REFRESH: SERVICE_ACCOUNT + "/refresh",
  AUTH_LOGOUT: SERVICE_ACCOUNT + "/logout",
  AUTH_RECOVERY: SERVICE_ACCOUNT + "/recovery",
  AUTH_EDIT_EMAIL: SERVICE_ACCOUNT + "/editEmail",

  // account
  ACCOUNT_EDIT: SERVICE_USER + "/edit",
  ACCOUNT_SAVE_PUSHTOKEN: SERVICE_ACCOUNT + "/pushToken",
  ACCOUNT_ADDRESSES_GET: SERVICE_ADDRESS + "/all",
  ACCOUNT_ADDRESS_GET: SERVICE_ADDRESS + "/one/",
  ACCOUNT_ADDRESS_CREATE: SERVICE_ADDRESS + "/create",
  ACCOUNT_ADDRESS_EDIT: SERVICE_ADDRESS + "/",
  ACCOUNT_ADDRESS_MAIN: SERVICE_ADDRESS + "/main",
  ACCOUNT_ADDRESS_DELETE: SERVICE_ADDRESS + "/",

  ACCOUNT_ORDERS_GET: SERVICE_ORDER + "/",
  ACCOUNT_ORDER_GET: SERVICE_ORDER + "/one",

  ACCOUNT_NOTIFICATIONS_GET: "/notification/all",
  ACCOUNT_NOTIFICATION_DELETE: "/notification/delete",

  ACCOUNT_DELETE: "/user/deleteAccount",

  // Options
  OPTIONS: SERVICE_CATALOG + "/options",

  // category
  CATEGORY_ALL: SERVICE_CATALOG + "/categories",
  CATEGORY_ONE: SERVICE_CATALOG + "/category",

  // product
  PRODUCT: SERVICE_CATALOG + "/product",
  PRODUCTS: SERVICE_CATALOG + "/products",
  PRODUCT_GIFTS: "/product/gifts",
  PRODUCT_FREE: "/product/free",

  // cart
  CART: SERVICE_CART,

  // Checkout, Order
  ORDER_CREATE: SERVICE_ORDER + "/create",
  ORDER_DELIVERY: SERVICE_ORDER + "/delivery",

  // Search
  SEARCH_GET: "/search",

  // Sale
  SALES_GET: "/sale",
  SALES_GET_PRODUCTS: "/sale/products",
  SALE_GET: "/sale/one",
  GIFTS_GET: "/sale/gifts",

  // Banners
  BANNERS: "/banner",
  BANNER_PRODUCTS: "/banner/products",
  BANNER: "/banner/one",

  // Favorite
  FAVORITES: SERVICE_FAVORITE,
  FAVORITES_LIST: SERVICE_FAVORITE + "/list",

  // Document
  DOCUMENTS: SERVICE_DOCUMENT,
  DOCUMENT: SERVICE_DOCUMENT + "/one",
};

export {
  ADMIN_URL,
  BASE_URL,
  SITE_URL,
  FILE_URL,
  IO_URL,
  DOMAIN,
  API_TOKEN,
  DADATA_URL_STREET,
  DADATA_URL_ADDRESS,
  DADATA_TOKEN,
  apiRoutes,
};
