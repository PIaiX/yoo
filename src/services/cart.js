import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authApi, $api } from "./index";
import { apiRoutes } from "../config/api";
import { resetCart, updateCartSync } from "../store/reducers/cartSlice";

const getCart = async () => {
  const response = await $api.get(apiRoutes.CART)
  return response?.data
}

const updateCart = createAsyncThunk(
  "cart/update",
  async (payloads, thunkAPI) => {
    const isAuth = thunkAPI.getState()?.auth?.isAuth;

    thunkAPI.dispatch(updateCartSync(payloads));

    if (isAuth) {
      try {
        const response = await $authApi.put(apiRoutes.CART, {
          product: payloads,
        });
        return response?.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

const deleteCart = createAsyncThunk(
  "cart/delete",
  async (payloads, thunkAPI) => {
    const isAuth = thunkAPI.getState()?.auth?.isAuth;

    thunkAPI.dispatch(resetCart());

    if (isAuth) {
      try {
        const response = await $authApi.delete(apiRoutes.CART);
        return response?.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export { getCart, updateCart, deleteCart };
