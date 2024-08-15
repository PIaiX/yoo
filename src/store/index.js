import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authSlice from "./reducers/authSlice";
import cartSlice from "./reducers/cartSlice";
import checkoutSlice from "./reducers/checkoutSlice";
import favoriteSlice from "./reducers/favoriteSlice";
import settingsSlice from "./reducers/settingsSlice";
import affiliateSlice from "./reducers/affiliateSlice";
import addressSlice from "./reducers/addressSlice";
import notificationSlice from "./reducers/notificationSlice";
import statusSlice from "./reducers/statusSlice";
import { homeApi } from "../services/home";
import { encryptTransform } from "redux-persist-transform-encrypt";

const rootReducer = combineReducers({
  settings: settingsSlice,
  notification: notificationSlice,
  auth: authSlice,
  cart: cartSlice,
  favorite: favoriteSlice,
  checkout: checkoutSlice,
  address: addressSlice,
  affiliate: affiliateSlice,
  status: statusSlice,
  [homeApi.reducerPath]: homeApi.reducer,
});

const encryptor = encryptTransform({ secretKey: "yooVooVoo1010!" });

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptor],
  // whitelist: ["checkout", "cart", "auth", "favorite", "settings"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(homeApi.middleware),
});

const persistor = persistStore(store);

export { persistor };
export default store;
