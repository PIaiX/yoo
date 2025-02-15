import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

const initialState = {
  promo: false,
  deliveryPrice: 0,
  items: [],
  zone: false,
  checking: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartAll: (state, action) => {
      state.items = state.items.map((cartItem) => {
        let isProduct = action.payload.find((e) => e.id === cartItem.id);
        if (cartItem.id === isProduct?.id) {
          return {
            ...cartItem,
            title: isProduct.title,
            description: isProduct.description,
            code: isProduct.code,
            price: isProduct.price,
            discount: isProduct.discount,
            medias: isProduct.medias,
            options: isProduct.options,
            cart: {
              ...cartItem.cart,
              data: {
                ...cartItem.cart.data,
                modifiers:
                  cartItem?.cart?.data?.modifiers?.length > 0 &&
                    isProduct?.modifiers?.length > 0
                    ? cartItem.cart.data.modifiers.map((e) => {
                      let isModifier = isProduct?.modifiers.find(
                        (e2) => e2.id === e.id
                      );
                      if (isModifier) {
                        return { ...e, ...isModifier };
                      }
                    })
                    : [],
              },
            },
          };
        }
      });
    },
    updateCartSync: (state, action) => {
      const isCart = state.items.findIndex((cartItem) => {
        if (cartItem?.id !== action.payload?.data?.id) {
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
      return {
        ...state,
        checking: action.payload ?? state.checking,
        items: state.items.map((cartItem, index) => {
          const discount = action.payload[0]?.discounts?.[index]?.discountSum || 0;
          return {
            ...cartItem,
            discount: discount,
          };
        }),
      };
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
        if (cartItem?.id !== action.payload?.data?.id) {
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
  updateCartAll,
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
