import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        updateStatus: (state, action) => {
            state.items = action.payload
        },
    },
})

export const {updateStatus} = statusSlice.actions

export default statusSlice.reducer
