// eslint-disable-next-line import/named
import { combineReducers } from "@reduxjs/toolkit";

import { adminApi } from "@/api";
import authReducers from "@/features/auth/state/reducers";
// import orderReducers from "@/features/order/state/reducers";
// import productReducers from "@/features/product/state/reducer";

import coreReducers from "./reducers";

export const rootReducer = combineReducers({
  ...coreReducers,
  // ...productReducers,
  // ...orderReducers,
  ...authReducers,
  [adminApi.reducerPath]: adminApi.reducer,
});
