import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    active: false,
    view: false,
    items: [],
    zones: [],
    cities: [],
    city: false,
    gps: false
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
                let active = action.payload.find(e => e.main);
                state.active = active?.id ? active : action.payload[0];
                state.items = action.payload.map(e => {
                    return {
                        ...e,
                        main: e.id === state.active.id,
                    };
                });
            } else if (action.payload?.length > 0) {
                let affiliateActive = state?.active?.id ? action.payload.find(e => e.id == state.active.id) ?? action.payload[0] : action.payload[0]

                state.items = action.payload.map(e => {
                    return {
                        ...e,
                        main: e.id === affiliateActive.id,
                    };
                });
                state.active = affiliateActive
            }
            return state
        },
        updateViewAffiliate: (state, action) => {
            state.view = !!action.payload
        },
        updateZone: (state, action) => {
            state.zones = action.payload
        },
        updateCity: (state, action) => {
            state.city = action.payload
        },
        updateGps: (state, action) => {
            state.gps = action.payload
        },
        updateCities: (state, action) => {
            state.cities = action.payload
        },
    },
})

export const { mainAffiliateEdit, updateAffiliate, updateCities, updateCity, updateGps, updateZone, updateViewAffiliate } = affiliateSlice.actions

export default affiliateSlice.reducer
