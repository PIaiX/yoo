import { createAsyncThunk } from "@reduxjs/toolkit";
import api from ".";
import { apiRoutes } from "../config/api";
import {
  deleteAddressSlice,
  mainAddressEdit,
} from "../store/reducers/addressSlice";

const getAddresses = async (page, limit) => {
  const response = await api.get(apiRoutes.ACCOUNT_ADDRESSES_GET, {
    params: { page, limit },
  });
  return response?.data;
};

const getAddress = async (addressId) => {
  if (!addressId) {
    return false;
  }
  const response = await api.get(apiRoutes.ACCOUNT_ADDRESS_GET, {
    params: { addressId },
  });
  return response?.data;
};

const mainAddress = createAsyncThunk(
  "address/main",
  async (payloads, thunkAPI) => {
    try {
      thunkAPI.dispatch(mainAddressEdit(payloads));
      const response = await api.put(
        apiRoutes.ACCOUNT_ADDRESS_MAIN,
        payloads
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const editAddress = async (payloads) => {
  const response = await api.put(apiRoutes.ACCOUNT_ADDRESS_EDIT, payloads);
  return response?.data;
};

const deleteAddress = createAsyncThunk(
  "address/delete",
  async (addressId, thunkAPI) => {
    thunkAPI.dispatch(deleteAddressSlice(addressId));
    const response = await api.delete(apiRoutes.ACCOUNT_ADDRESS_DELETE, {
      data: { addressId },
    });
    return response.data;
  }
);

const createAddress = async (data) => {
  const response = await api.post(apiRoutes.ACCOUNT_ADDRESS_CREATE, data);
  return response?.data;
};

export {
  getAddresses,
  getAddress,
  editAddress,
  mainAddress,
  createAddress,
  deleteAddress,
};
