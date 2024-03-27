import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    active: false,
    view: false,
    items: [],
    zones: []
}

const affiliateSlice = createSlice({
    name: 'affiliate',
    initialState,
    reducers: {
        mainAffiliateEdit: (state, action) => {
            if (action?.payload && state?.items?.length > 0) {
                state.items = state.items.map((e) => {
                    e.main = e.id === action?.payload?.id
                    return e
                })
                state.active = action?.payload
                state.view = true
            }
        },
        updateAffiliate: (state, action) => {
            if (!state.active && action.payload?.length > 0) {
                state.active = action.payload.find(e => e.main)
                state.items = action.payload.map((e) => {
                    e.main = e.id === state.active.id
                    return e
                })
            } else {
                state.items = action.payload.map((e) => {
                    e.main = e.id === state.active.id
                    return e
                })
            }
        },
        updateViewAffiliate: (state, action) => {
            state.view = !!action.payload
        },
        updateZone: (state, action) => {
            state.zones = action.payload
        },
    },
})

export const { mainAffiliateEdit, updateAffiliate, updateZone, updateViewAffiliate } = affiliateSlice.actions

export default affiliateSlice.reducer
