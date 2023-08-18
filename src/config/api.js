const BASE_URL = process.env.REACT_APP_BASE_URL;
const FILE_URL = process.env.REACT_APP_BASE_URL + "/file";

const apiRoutes = {
  // Auth
  AUTH_REGISTRATION: BASE_URL + "/auth/registration",
  AUTH_ACTIVATE: BASE_URL + "/auth/activate",
  AUTH_ACTIVATE_EMAIL: BASE_URL + "/auth/activateEmail",
  AUTH_EDIT_PASSWORD: BASE_URL + "/user/editPassword",
  AUTH_NEW_KEY_ACTIVATE: BASE_URL + "/auth/newActivate",
  AUTH_RECOVERY: BASE_URL + "/auth/recovery",
  AUTH_EDIT_EMAIL: BASE_URL + "/user/editEmail",
  AUTH_EDIT_PHONE: BASE_URL + "/user/editPhone",
  AUTH_LOGIN: BASE_URL + "/auth/login",
  AUTH_CHECK: BASE_URL + "/auth/check",
  AUTH_REFRESH: BASE_URL + "/auth/refresh",
  AUTH_LOGOUT: BASE_URL + "/auth/logout",

  SESSIONS_GET: BASE_URL + "/user/sessions",

  // Account
  ACCOUNT_EDIT: BASE_URL + "/user/edit",
  ACCOUNT_EDIT_AVATAR: BASE_URL + "/user/editAvatar",

  // Order
  ORDERS_GET: BASE_URL + "/order",
  ORDER_GET: BASE_URL + "/order/one",
  ORDER_CREATE: BASE_URL + "/order/create",
  ORDER_EDIT: BASE_URL + "/order/edit",
  ORDER_NOTE_CREATE: BASE_URL + "/order/createNote",
  ORDER_NOTES_GET: BASE_URL + "/order/notes",
  ORDER_EDIT_STATUS: BASE_URL + "/order/editStatus",
  ORDER_DELETE: BASE_URL + "/order/delete",

  // Category
  CATEGORIES: BASE_URL + "/category",
  CATEGORY: BASE_URL + "/category/one",
  CATEGORY_CREATE: BASE_URL + "/category/create",

  // Member
  MEMBERS_GET: BASE_URL + "/member",
  MEMBER_GET: BASE_URL + "/member/one",
  MEMBER_CREATE: BASE_URL + "/member/create",

  // Invoice
  INVOICES: BASE_URL + "/invoice",
  INVOICE: BASE_URL + "/invoice/one",

  // Product
  PRODUCTS: BASE_URL + "/product",
  PRODUCT: BASE_URL + "/product/one",
  PRODUCT_CREATE: BASE_URL + "/product/create",

  // Sale
  SALES: BASE_URL + "/sale",
  SALE: BASE_URL + "/sale/one",
  SALE_CREATE: BASE_URL + "/sale/create",

  // Addition
  ADDITIONS: BASE_URL + "/addition",
  ADDITION: BASE_URL + "/addition/one",
  ADDITION_CREATE: BASE_URL + "/addition/create",

  // Zones
  ZONES: BASE_URL + "/zone",
  ZONE: BASE_URL + "/zone/one",

  // Modules
  MODULES: BASE_URL + "/module",
  MODULE: BASE_URL + "/module/one",
  PAYMENT: BASE_URL + "/module/payment",

  // Storage
  STORAGES: BASE_URL + "/storage",
  STORAGE: BASE_URL + "/storage/one",
  STORAGE_CREATE: BASE_URL + "/storage/create",

  // Ingredient
  INGREDIENTS: BASE_URL + "/ingredient",
  INGREDIENT: BASE_URL + "/ingredient/one",
  INGREDIENT_CREATE: BASE_URL + "/ingredient/create",

  // Modifier
  MODIFIERS: BASE_URL + "/modifier",
  MODIFIER: BASE_URL + "/modifier/one",
  MODIFIER_CREATE: BASE_URL + "/modifier/create",

  // Affiliate
  AFFILIATE: BASE_URL + "/affiliate",
  AFFILIATE_ONE: BASE_URL + "/affiliate/one",
  AFFILIATE_CREATE: BASE_URL + "/affiliate/create",
  AFFILIATE_MAIN: BASE_URL + "/affiliate/main",

  // Brand
  BRANDS: BASE_URL + "/brand",
  BRAND: BASE_URL + "/brand/one",
  BRAND_CREATE: BASE_URL + "/brand/create",
  BRAND_MAIN: BASE_URL + "/brand/main",

  // Document
  DOCUMENTS: BASE_URL + "/document",
  DOCUMENT: BASE_URL + "/document/one",
  DOCUMENT_CREATE: BASE_URL + "/document/create",

  // Statistic
  STATISTIC: BASE_URL + "/statistic",

  // User
  USER: BASE_URL + "/user",
  USER_ONE: BASE_URL + "/user/one",
  USER_CREATE: BASE_URL + "/user/create",
  USER_DELETE_SESSION:  BASE_URL + "/user/deleteSession",

  // Options
  OPTIONS: BASE_URL + "/option/",

  // Sync
  EPR_CATEGORY: BASE_URL + "/sync/category",
  EPR_PRODUCT: BASE_URL + "/sync/product",
  EPR_MODIFIER: BASE_URL + "/sync/modifier",
  EPR_ORGANIZATION: BASE_URL + "/sync/organization",
  EPR_TEPES_DELIVERY: BASE_URL + "/sync/delivery",
  EPR_TYPES_PAYMENT: BASE_URL + "/sync/payment",
  EPR_TERMINAL: BASE_URL + "/sync/terminal",
};

const apiResponseMessages = {
  // Admin
  ADMIN_CATEGORY_CREATE: "Категория успешно создана",
  ADMIN_CATEGORY_EDIT: "Категория успешно изменена",
  ADMIN_CATEGORY_DELETE: "Категория успешно удалена",
  ADMIN_OPTIONS_EDIT: "Настройки успешно сохранены",
  ADMIN_PRODUCT_CREATE: "Товар успешно создана",
  ADMIN_PRODUCT_EDIT: "Товар успешно изменен",
  ADMIN_PRODUCT_DELETE: "Товар успешно удалена",

  ADMIN_ORDER_EDIT: "Заказ успешно изменен",
  ADMIN_ORDER_DELETE: "Заказ успешно удален",

  ADMIN_SALE_CREATE: "Акция успешно создана",
  ADMIN_SALE_EDIT: "Акция успешно изменена",
  ADMIN_SALE_DELETE: "Акция успешно удалена",

  ADMIN_MARK_CREATE: "Метка успешно создана",
  ADMIN_MARK_EDIT: "Метка успешно изменена",
  ADMIN_MARK_DELETE: "Метка успешно удалена",

  ADMIN_USER_EDIT: "Клиент успешно изменен",
  ADMIN_USER_DELETE: "Клиент успешно удален",

  ADMIN_NOTIFICATION_CREATE: "Уведомление успешно отправлено",
  ADMIN_NOTIFICATION_DELETE: "Уведомление успешно удалено",
};

const apiRejectMessages = {
  DEFAULT: "Что-то пошло не так, повторите попытку позже",
  INVALID_KEY: "Неверный ключ подтверждения",
  USER_EXISTS: "Пользователь с таким номером уже существует",
  USER_NOT_FOUND: "Такого пользователя не существует",
  USER_NOT_EXIST: "Такого пользователя не существует",
  CART_NOT_VALID_COUNT: "Значение не может быть меньше 1",
  PAGE_ERROR:
    "Не удалось загрузить страницу, вернитесь назад или перезагрузите страницу",
};

const apiErrors = {
  INVALID_KEY: "INVALID_KEY",
  USER_EXISTS: "USER_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_NOT_EXIST: "USER_NOT_EXIST",
};

export {
  BASE_URL,
  FILE_URL,
  apiRoutes,
  apiResponseMessages,
  apiRejectMessages,
  apiErrors,
};
