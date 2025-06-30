import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  active: false,
}
const sortAddresses = (items, active) => {
  if (!items || !items.length) return [];

  // Создаем безопасную копию
  const safeItems = [...items].filter(item => item && item.id);

  // Если нет активного адреса
  if (!active || !active.id) {
    return safeItems.sort((a, b) => {
      const aFull = a.full || '';
      const bFull = b.full || '';
      const aCity = a.city || '';
      const bCity = b.city || '';
      return aFull.localeCompare(bFull) || aCity.localeCompare(bCity);
    });
  }

  // Сортировка с активным адресом
  return safeItems.sort((a, b) => {
    if (a.id === active.id) return -1;
    if (b.id === active.id) return 1;

    const aCity = a.city || '';
    const bCity = b.city || '';
    const aIsActiveCity = aCity === (active.city || '');
    const bIsActiveCity = bCity === (active.city || '');

    if (aIsActiveCity && !bIsActiveCity) return -1;
    if (!aIsActiveCity && bIsActiveCity) return 1;

    return aCity.localeCompare(bCity) || (a.full || '').localeCompare(b.full || '');
  });
};
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.active = action?.payload
      state.items.push(action?.payload)
    },
    updateAddress: (state, action) => {
      state.active = action?.payload
      state.items = sortAddresses(state.items.map((e) => {
        if (e.id === action?.payload?.id) {
          e = action?.payload
        }
        return e
      }), action?.payload)
    },
    mainAddressEdit: (state, action) => {
      state.active = action?.payload
    },
    updateAddresses: (state, action) => {
      state.items = sortAddresses(action.payload)
    },
    deleteAddressSlice: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action?.payload)
    },
    resetAddresses: (state) => {
      return {
        ...initialState,
      };
    },
  },
})

export const { setAddress, updateAddress, mainAddressEdit, updateAddresses, deleteAddressSlice, resetAddresses } =
  addressSlice.actions

export default addressSlice.reducer
