import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
  view: false,
  items: [],
  zones: [],
  cities: [],
  city: false,
  gps: false,
  tables: [],
  table: false,
};

const affiliateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {
    mainAffiliateEdit: (state, action) => {
      if (action?.payload && state?.items?.length > 0) {
        state.items = state.items.map((e) => {
          e.main = e.id === action?.payload?.id;
          return e;
        });
        state.active = action?.payload;
        state.view = true;
      }
    },
    updateAffiliate: (state, action) => {
      if (!state.active && action.payload?.length > 0) {
        let active = action.payload.find((e) => e.main) ?? action.payload[0];
        state.active = active;
        state.items = action.payload.map((e) => {
          return {
            ...e,
            main: e?.id === active?.id,
          };
        });
      } else if (action.payload?.length > 0) {
        let affiliateActive = state?.active?.id
          ? action.payload.find((e) => e.id == state.active.id) ??
            action.payload[0]
          : action.payload[0];

        state.items = action.payload.map((e) => {
          return {
            ...e,
            main: e?.id === affiliateActive?.id,
          };
        });
        state.active = affiliateActive;
      }

      if (state?.active?.halls?.length > 0) {
        let tables = [];
        state.active?.halls.forEach((e) => {
          e.tables?.length > 0 &&
            e.tables.forEach((table) => tables.push(table));
        });
        state.tables = tables;
        state.table =
          state.table?.id &&
          tables?.length > 0 &&
          tables.find((e) => e.id === state.table.id)
            ? state.table
            : tables[0];
      }
      return state;
    },
    updateViewAffiliate: (state, action) => {
      state.view = !!action.payload;
    },
    updateZone: (state, action) => {
      state.zones = action.payload;
    },
    updateGps: (state, action) => {
      state.gps = action.payload;
    },
    updateCity: (state, action) => {
        state.city = action.payload
        state.items = action.payload?.affiliates ?? []
        state.active = action.payload?.affiliates[0] ?? false
    },
    updateCities: (state, action) => {
        state.cities = action.payload
    },
    updateTable: (state, action) => {
      state.tables = action.payload;
      state.table =
        state.table?.id &&
        state.tables?.length > 0 &&
        state.tables.find((e) => e.id === state.table.id)
          ? state.table
          : action.payload[0];
      return state;
    },
    mainTableEdit: (state, action) => {
      if (action?.payload && state?.tables?.length > 0) {
        state.table = action?.payload;
      }
    },
  },
});

export const {
  mainAffiliateEdit,
  mainTableEdit,
  updateTable,
  updateAffiliate,
  updateCities,
  updateCity,
  updateGps,
  updateZone,
  updateViewAffiliate,
} = affiliateSlice.actions;

export default affiliateSlice.reducer;
