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
        const updatedProduct = action.payload.find((e) => e.id === cartItem.id);

        // Если товар не найден в обновлении - оставляем без изменений
        if (!updatedProduct) return cartItem;

        return {
          ...cartItem,       // Сохраняем существующие данные
          ...updatedProduct,  // Обновляем основные поля
          cart: {
            ...cartItem.cart, // Сохраняем существующие данные корзины
            // Обновляем модификаторы (с защитой от undefined)
            modifiers: cartItem.cart?.modifiers && updatedProduct.modifiers
              ? cartItem.cart.modifiers
                .map((modifier) => {
                  const updatedModifier = updatedProduct.modifiers.find(m => m.id === modifier.id);
                  return updatedModifier ? { ...modifier, ...updatedModifier } : modifier;
                })
                .filter(Boolean) // Удаляем возможные undefined
              : cartItem.cart?.modifiers || [], // Если нет новых модификаторов - оставляем старые

            // Аналогично для additions (если нужно)
            additions: cartItem.cart?.additions && updatedProduct.additions
              ? cartItem.cart.additions
                .map((addition) => {
                  const updatedAddition = updatedProduct.additions.find(a => a.id === addition.id);
                  return updatedAddition ? { ...addition, ...updatedAddition } : addition;
                })
                .filter(Boolean)
              : cartItem.cart?.additions || []
          }
        };
      }).filter(Boolean); // Защита на случай undefined элементов
    },
    updateCartSync: (state, action) => {
      const { payload } = action;
      if (!payload) return;

      const itemIndex = state.items.findIndex((cartItem) =>
        cartItem?.id === payload?.id &&
        isEqual(cartItem?.cart?.modifiers, payload?.cart?.modifiers) &&
        isEqual(cartItem?.cart?.additions, payload?.cart?.additions)
      );

      if (itemIndex !== -1) {
        if (payload?.cart?.count === 0) {
          // Удаляем элемент (иммутабельно)
          state.items = state.items.filter((_, index) => index !== itemIndex);
        } else {
          // Обновляем элемент (иммутабельно)
          state.items = state.items.map((item, index) =>
            index === itemIndex ? payload : item
          );
        }
      } else if (payload) {
        // Добавляем новый элемент (иммутабельно)
        state.items = [...state.items, payload];
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
