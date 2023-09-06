import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authApi } from ".";
import { apiRoutes } from "../config/api";

const getAddresses = async (page, limit) => {
      const response = await $authApi.get(apiRoutes.ACCOUNT_ADDRESSES_GET, { params: { page, limit } })
      return response?.data
}

const getAddress = async (addressId) => {
      if (!addressId) {
            return false
      }
      const response = await $authApi.get(apiRoutes.ACCOUNT_ADDRESS_GET, { params: { addressId } })
      return response?.data
}

const mainAddress = createAsyncThunk('address/main', async (payloads, thunkAPI) => {
      try {
            thunkAPI.dispatch(mainAddressEdit(payloads))
            const response = await $authApi.put(apiRoutes.ACCOUNT_ADDRESS_MAIN, payloads)
            return response?.data
      } catch (error) {
            return thunkAPI.rejectWithValue(error)
      }
})

const editAddress = async (payloads) => {
      const response = await $authApi.put(apiRoutes.ACCOUNT_ADDRESS_EDIT, payloads)
      return response?.data
}


const deleteAddress = createAsyncThunk('address/delete', async (addressId, thunkAPI) => {
      try {
            thunkAPI.dispatch(deleteAddressSlice(addressId))
            showMessage({
                  message: 'Адрес успешно удален',
                  type: 'success',
            })
            const response = await $authApi.delete(apiRoutes.ACCOUNT_ADDRESS_DELETE, { data: { addressId } })
            return response.data
      } catch (err) {
            showMessage({
                  message: err?.response?.data?.message?.text ?? 'Ошибка в запросе',
                  type: 'danger',
            })
      }
})

const createAddress = async (data) => {
      const response = await $authApi.post(apiRoutes.ACCOUNT_ADDRESS_CREATE, data)
      return response?.data
}

export {
      getAddresses,
      getAddress,
      editAddress,
      mainAddress,
      createAddress,
      deleteAddress
};
