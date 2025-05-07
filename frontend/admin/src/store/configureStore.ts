import { configureStore as reduxConfigureStore } from "@reduxjs/toolkit";

import { adminApi } from "@/api";
import { IS_PROD } from "@/constants";
import { rootReducer } from "@/state/rootReducer";
import { StoreState } from "@/types/store";

import { setStore } from "./store";

export { rootReducer };

export function configureStore(initialState?: Partial<StoreState>) {
  const store = reduxConfigureStore({
    reducer: rootReducer,
    devTools: !IS_PROD,
    preloadedState: {
      ...initialState,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApi.middleware),
  });

  setStore(store);
  return store;
}

export type RootState = ReturnType<ReturnType<typeof configureStore>["getState"]>;
export type AppDispatch = ReturnType<typeof configureStore>["dispatch"];
