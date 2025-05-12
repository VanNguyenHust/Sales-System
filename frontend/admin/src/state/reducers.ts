import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { adminApi } from "@/api";
import { TenantState } from "@/types";
import { UIState } from "@/types/ui";

export const initialTenantState: TenantState = {
  initializing: 3,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState: initialTenantState,
  reducers: {
    setInventoryManagementSetting: (state, action: PayloadAction<string>) => {
      const setting = state.settings?.find((setting) => setting.setting_key === "inventory_management");
      if (setting?.setting_value !== action.payload) {
        state.settings = state.settings?.map((setting) => {
          if (setting.setting_key === "inventory_management") {
            return { ...setting, setting_value: action.payload };
          }
          return setting;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(adminApi.endpoints.getTenantWithCurrencyAndSetting.matchFulfilled, (state, action) => {
      state.tenant = action.payload.tenant;
      state.timezone = action.payload.timezone;
      state.settings = action.payload.settings;
      state.currency = state.currencies?.find((c) => c.code === action.payload.tenant.currency);
      if (state.initializing) {
        state.initializing -= 1;
      }
    });
    builder.addMatcher(adminApi.endpoints.getCurrencies.matchFulfilled, (state, action) => {
      state.currencies = action.payload;
      state.currency = action.payload.find((c) => c.code === state.tenant?.currency);
      if (state.initializing) {
        state.initializing -= 1;
      }
    });
    builder.addMatcher(adminApi.endpoints.getStoreFeature.matchFulfilled, (state, action) => {
      state.feature = action.payload;
      if (state.initializing) {
        state.initializing -= 1;
      }
    });
  },
});

export const tenantReducer = tenantSlice.reducer;

export const initialUIState: UIState = {
  navbarCollapsed: false,
  legacyFullscreen: false,
  locationPathname: location.pathname,
  locationSearch: location.search,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    setNavigationCollapsed: (state, action: PayloadAction<boolean>) => {
      state.navbarCollapsed = action.payload;
    },
    setLocationPathname: (state, action: PayloadAction<string>) => {
      state.locationPathname = action.payload;
    },
    setLocation: (state, action: PayloadAction<{ pathname: string; search: string }>) => {
      state.locationPathname = action.payload.pathname;
      state.locationSearch = action.payload.search;
    },
    exitLegacyFullscreen: (state) => {
      state.legacyFullscreen = false;
    },
    openLegacyFullscreen: (state) => {
      state.legacyFullscreen = true;
    },
    toggleLegacyFullscreen: (state) => {
      state.legacyFullscreen = !state.legacyFullscreen;
    },
  },
});

export const {
  setNavigationCollapsed,
  setLocationPathname,
  setLocation,
  exitLegacyFullscreen,
  openLegacyFullscreen,
  toggleLegacyFullscreen,
} = uiSlice.actions;
export const { setInventoryManagementSetting } = tenantSlice.actions;
export const uiReducer = uiSlice.reducer;

export default {
  tenant: tenantReducer,
  ui: uiReducer,
};
