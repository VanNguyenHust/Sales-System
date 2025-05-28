// src/store/storeInfoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StoreInfoState = {
  id: number | null;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  countryCode: string;
  provinceCode: string;
  maxProduct: number;
  maxLocation: number;
  maxUser: number;
};

const initialState: StoreInfoState = {
  id: null,
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
  countryCode: "",
  provinceCode: "",
  maxProduct: 0,
  maxLocation: 0,
  maxUser: 0,
};

const storeInfoReducer = createSlice({
  name: "storeInfo",
  initialState,
  reducers: {
    setStoreInfo(state, action: PayloadAction<StoreInfoState>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.countryCode = action.payload.countryCode;
      state.provinceCode = action.payload.provinceCode;
      state.maxProduct = action.payload.maxProduct;
      state.maxLocation = action.payload.maxLocation;
      state.maxUser = action.payload.maxUser;
    },
    clearStoreInfo(state) {
      state.id = null;
      state.name = "";
      state.phoneNumber = "";
      state.email = "";
      state.address = "";
      state.countryCode = "";
      state.provinceCode = "";
      state.maxProduct = 0;
      state.maxLocation = 0;
      state.maxUser = 0;
    },
  },
});

export const { setStoreInfo, clearStoreInfo } = storeInfoReducer.actions;
export default storeInfoReducer.reducer;
