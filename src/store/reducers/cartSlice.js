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

              modifiers:
                cartItem?.cart?.modifiers?.length > 0 &&
                isProduct?.modifiers?.length > 0
                  ? cartItem.cart.modifiers.map((e) => {
                      let isModifier = isProduct?.modifiers.find(
                        (e2) => e2.id === e.id
                      );
                      if (isModifier) {
                        return { ...e, ...isModifier };
                      }
                    })
                  : [],
            },
          };
        }
      });
    },
    updateCartSync: (state, action) => {
      const isCart = state.items.findIndex((cartItem) => {
        if (cartItem?.id !== action.payload?.id) {
          return false;
        }
        return (
          isEqual(cartItem?.cart?.modifiers, action.payload?.cart?.modifiers) &&
          isEqual(cartItem?.cart?.additions, action.payload?.cart?.additions)
        );
      });

      if (isCart != -1 && action?.payload?.cart?.count === 0) {
        state.items.splice(isCart, 1);
      } else if (isCart != -1 && action?.payload) {
        state.items[isCart] = action.payload;
      } else if (isCart == -1 && action?.payload) {
        state.items.push(action.payload);
      }
    },
    createPromoProduct: (state, action) => {
      const isCart = state.items.findIndex(
        (cartItem) => cartItem?.id === action.payload?.id
      );

      if (isCart === -1) {
        state.items.push(action.payload);
      }
    },
    updateCartChecking: (state, action) => {
      return {
        ...state,
        checking: action.payload ?? state.checking ?? [],
        items:
          state?.items?.length > 0
            ? state.items.map((cartItem, index) => {
                const discount =
                  action.payload &&
                  action.payload[0] &&
                  action.payload[0]?.discounts &&
                  action.payload[0]?.discounts?.[index]?.discountSum
                    ? Number(action.payload[0].discounts[index].discountSum)
                    : 0;
                return {
                  ...cartItem,
                  discount: discount,
                };
              })
            : state?.items,
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
      state.promo = action.payload;
    },
    cartZone: (state, action) => {
      state.zone = action.payload;
    },
    cartDeletePromo: (state) => {
      state.promo = false;
      state.items = state.items.filter((item) => item.type != "promo");
      return state
    },
    cartDeleteProduct: (state, action) => {
      const isCart = state.items.findIndex((cartItem) => {
        if (cartItem?.id !== action.payload?.data?.id) {
          return false;
        }
        return (
          isEqual(cartItem?.cart?.modifiers, action.payload?.modifiers) &&
          isEqual(cartItem?.cart?.additions, action.payload?.additions)
        );
      });
      if (isCart != -1) {
        state.items.splice(isCart, 1);
      }
      return state;
    },
    cartDeleteGifts: (state, action) => {
      state.items = state.items.filter((item) => item.type != "gift");
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
  createPromoProduct,
  updateCartChecking,
  cartEditOptions,
  cartZone,
  cartPromo,
  cartDeleteGifts,
  cartDeliveryPrice,
  cartDeletePromo,
  cartDeleteProduct,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
