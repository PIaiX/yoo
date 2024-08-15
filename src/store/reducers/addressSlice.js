import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoading: false,
    error: null,
    items: [],
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddress: (state, action) => {
            state.items = state.items.map((e) => {
                e.main = false
                return e
            })
            state.items.push({...action?.payload})
        },
        updateAddress: (state, action) => {
            if (action?.payload.main) {
                state.items = state.items.map((e) => {
                    e.main = false
                    return e
                })
                state.items = state.items.map((e) => {
                    if (e.id === action?.payload?.id) {
                        e = action?.payload
                    }
                    return e
                })
            }
        },
        mainAddressEdit: (state, action) => {
            state.items = state.items.map((e) => {
                e.main = e.id === action?.payload?.id
                return e
            })
        },
        updateAddresses: (state, action) => {
            state.items = action.payload
        },
        deleteAddressSlice: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action?.payload)
        },
        resetAddresses: (state) => {
            state.isLoading = false
            state.error = null
            state.items = []
        },
    },
})

export const {setAddress, updateAddress, mainAddressEdit, updateAddresses, deleteAddressSlice, resetAddresses} =
    addressSlice.actions

export default addressSlice.reducer
