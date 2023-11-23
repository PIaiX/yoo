import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: 0,
    order: 0,
    notification: 0,
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        updateNotification: (state, action) => {
            if (action?.payload?.message) {
                if (action?.payload?.message == -1) {
                    state.message = 0
                } else {
                    state.message++

                }
            }
            if (action?.payload?.order) {
                if (action?.payload?.order == -1) {
                    state.order = 0
                } else {
                    state.order++

                }
            }
            if (action?.payload?.notification) {
                if (action?.payload?.notification == -1) {
                    state.notification = 0
                } else {
                    state.notification++

                }
            }
        },
    },
})

export const { updateNotification } = notificationSlice.actions

export default notificationSlice.reducer
