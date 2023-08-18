import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isConnected: true,
    options: {
        name: 'ru.yooapp.app',
        title: 'YooApp',
        authType: 'email',
        qrType: 'phone',
        supportVisible: false,
        colorBtn: '#009640',
        payments: {
            card: true,
            cash: true,
            online: false,
        },
        colorMain: '#009640',
        versionIos: '0.0.1',
        versionAndroid: '0.0.1',
        colorMainBg: '#4caf50',
        giftVisible: false,
        promoVisible: true,
        themeProduct: 0,
        themeAddition: 0,
        profilePointVisible: true,
        productEnergyVisible: true,
    },
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateConnect: (state, action) => {
            state.isConnected = action.payload
        },
        updateOptions: (state, action) => {
            state.options = action.payload
        },
    },
})

export const {updateConnect, updateOptions} = settingsSlice.actions

export default settingsSlice.reducer
