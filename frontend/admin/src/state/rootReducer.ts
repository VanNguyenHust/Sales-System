// eslint-disable-next-line import/named
import { combineReducers } from "@reduxjs/toolkit";

import { adminApi } from "app/api";
import appBridgeReducers from "app/features/app/components/embedded-app/state/reducers";
import appReducers from "app/features/app/state/reducers";
import authReducers from "app/features/auth/state/reducers";
import checkoutReducers from "app/features/checkout/state/reducers";
import dashboardReducer from "app/features/dashboard/state/reducer";
import draftOrderReducers from "app/features/draft-order/state/reducers";
import orderReducers from "app/features/order/state/reducers";
import orderReturnReducer from "app/features/order-return/state/reducers";
import productReducers from "app/features/product/state/reducer";
import shipmentReducers from "app/features/shipment/state/reducers";
import shippingReducers from "app/features/shipping/state/reducers";

import coreReducers from "./reducers";

export const rootReducer = combineReducers({
  ...coreReducers,
  ...productReducers,
  ...checkoutReducers,
  ...dashboardReducer,
  ...orderReducers,
  ...orderReturnReducer,
  ...draftOrderReducers,
  ...authReducers,
  ...shippingReducers,
  ...shipmentReducers,
  ...appBridgeReducers,
  ...appReducers,
  [adminApi.reducerPath]: adminApi.reducer,
});
