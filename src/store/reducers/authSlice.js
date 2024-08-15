import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loadingLogin: false,
    isAuth: false,
    user: {},
    pushToken: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPushToken: (state, action) => {
            state.pushToken = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setAuth: (state, action) => {
            state.isAuth = action.payload
        },
        setLoadingLogin: (state, action) => {
            state.loadingLogin = action.payload
        },
    },
})

export const { setLoadingLogin, setLoadingRefresh, setUser, setToken, setAuth, setLoginError, setPushToken } =
    authSlice.actions

export default authSlice.reducer
