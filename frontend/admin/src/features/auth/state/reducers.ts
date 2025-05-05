import { createSlice } from "@reduxjs/toolkit";

import { adminApi } from "app/api";
import { Permission } from "app/constants";
import { AuthState } from "app/types";

const initialState: AuthState = {
  isLoading: true,
  account: {} as AuthState["account"],
  tourGuides: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(adminApi.endpoints.getCurrentUser.matchPending, (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(adminApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
      state.account = action.payload.user;
      if (import.meta.env.VITE_DEV_PERMISSIONS) {
        state.account.permissions = import.meta.env.VITE_DEV_PERMISSIONS.split(",").map((t) => t.trim() as Permission);
      }
      state.isLoading = false;
    });
    builder.addMatcher(adminApi.endpoints.getCurrentUser.matchRejected, (state) => {
      state.isLoading = false;
    });
    builder.addMatcher(adminApi.endpoints.getTourguides.matchFulfilled, (state, action) => {
      state.tourGuides = action.payload;
    });
  },
});

export default {
  auth: authSlice.reducer,
};
