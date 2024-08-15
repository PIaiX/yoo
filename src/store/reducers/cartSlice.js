import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

const initialState = {
  promo: false,
  deliveryPrice: 0,
  items: [],
  zone: false,
  checking: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartSync: (state, action) => {
      const isCart = state.items.findIndex((cartItem) => {
        if (cartItem.id !== action.payload.data.id) {
          return false;
        }
        return (
          isEqual(
            cartItem?.cart?.data?.modifiers,
            action.payload?.data?.cart?.data?.modifiers
          ) &&
          isEqual(
            cartItem?.cart?.data?.additions,
            action.payload?.data?.cart?.data?.additions
          )
        );
      });

      if (isCart != -1 && action?.payload?.data?.cart?.count === 0) {
        state.items.splice(isCart, 1);
      } else if (isCart != -1 && action?.payload?.data) {
        if (action.payload?.plus) {
          state.items[isCart].cart.count += 1;
        } else {
          state.items[isCart] = action.payload.data;
        }
      } else if (isCart == -1 && action?.payload?.data) {
        state.items.push(action.payload.data);
      }
    },
    updateCartChecking: (state, action) => {
      let discounts = action.payload[0]?.discounts ?? state.checking[0]?.discounts ?? [];

      if (action.payload) {
        state.checking = action.payload
      }

      if (discounts?.length > 0) {
        state.items = [
          ...state.items.map((cartItem, index) => {
            return {
              ...cartItem,
              discount: discounts[index].discountSum,
            };
          }),
        ];
      }

      return state;
    },
    cartEditOptions: (state, action) => {
      let isCart =
        action.payload?.index >= 0 ? state.items[action.payload.index] : false;
      if (action.payload?.item) {
        if (isCart) {
          state.items[action.payload.index] = action.payload.item;
        } else {
          state.items.push(action.payload.item);
        }
      }
    },
    cartPromo: (state, action) => {
      if (action?.payload) {
        state.promo = action.payload;
      }
    },
    cartZone: (state, action) => {
      if (action?.payload) {
        state.zone = action.payload;
      }
    },
    cartDeletePromo: (state) => {
      state.promo = false;
    },
    cartDeleteProduct: (state, action) => {
      const isCart = state.items.findIndex((cartItem) => {
        if (cartItem.id !== action.payload.data.id) {
          return false;
        }
        return (
          isEqual(
            cartItem?.cart?.data?.modifiers,
            action.payload?.data?.cart?.data?.modifiers
          ) &&
          isEqual(
            cartItem?.cart?.data?.additions,
            action.payload?.data?.cart?.data?.additions
          )
        );
      });
      if (isCart != -1) {
        state.items.splice(isCart, 1);
      }
      return state;
    },
    resetCart: (state) => {
      state.promo = false;
      state.zone = false;
      state.items = [];
    },
  },
});

export const {
  updateCartSync,
  updateCartChecking,
  cartEditOptions,
  cartZone,
  cartPromo,
  cartDeliveryPrice,
  cartDeletePromo,
  cartDeleteProduct,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
