import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading: false,
    error: null,
    items: [],
}

const affiliateSlice = createSlice({
    name: 'affiliate',
    initialState,
    reducers: {
        mainAffiliateEdit: (state, action) => {
            state.items = state.items.map((e) => {
                e.main = e.id === action?.payload?.id
                return e
            })
        },
        updateAffiliate: (state, action) => {
            state.items = action.payload
        },
    },
})

export const { mainAffiliateEdit, updateAffiliate } = affiliateSlice.actions

export default affiliateSlice.reducer