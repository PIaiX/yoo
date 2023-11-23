import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    promo: false,
    deliveryPrice: 0,
    items: [],
    zone: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCartSync: (state, action) => {
            const isCart = state.items.findIndex((e) => {
                var view = false
                if (e.id === action?.payload?.id) {
                    if (e?.cart?.data?.modifiers?.id && action?.payload?.cart?.data?.modifiers?.id) {
                        view = e.cart.data.modifiers.id == action.payload.cart.data.modifiers.id
                    }
                    if (action?.payload?.cart?.data?.additions?.length > 0) {
                        if (e?.cart?.data?.additions?.length > 0) {
                            view =
                                JSON.stringify(e.cart.data.additions) ==
                                JSON.stringify(action.payload.cart.data.additions)
                        } else {
                            view = false
                        }
                    } else if (
                        action?.payload?.cart?.data?.additions?.length === 0 &&
                        e?.cart?.data?.additions?.length > 0
                    ) {
                        view = false
                    }

                    if (
                        !e?.cart?.data?.modifiers?.id &&
                        !action?.payload?.cart?.data?.modifiers?.id &&
                        !e?.cart?.data?.additions?.length &&
                        !action?.payload?.cart?.data?.additions?.length
                    ) {
                        view = true
                    }
                }
                return view
            })

            if (isCart != -1 && action?.payload?.cart?.count === 0) {
                state.items.splice(isCart, 1)
            } else if (isCart != -1 && action?.payload) {
                state.items[isCart] = action.payload
            } else if (isCart == -1 && action?.payload) {
                state.items.push(action.payload)
            }
            return state
        },
        cartEditOptions: (state, action) => {
            let isCart = state.items[action.payload.index]
            if (isCart != -1 && isCart) {
                state.items[action.payload.index] = action.payload
            } else {
                state.items.push(action.payload)
            }
        },
        cartPromo: (state, action) => {
            if (action?.payload) {
                state.promo = action.payload
            }
        },
        cartZone: (state, action) => {
            if (action?.payload) {
                state.zone = action.payload
            }
        },
        cartDeletePromo: (state) => {
            state.promo = false
        },
        resetCart: (state) => {
            state.promo = false
            state.zone = false
            state.items = []
        },
    },
})

export const {
    updateCartSync,
    cartEditOptions,
    cartZone,
    cartDeliveryPrice,
    cartDeletePromo,
    resetCart,
} = cartSlice.actions

export default cartSlice.reducer
