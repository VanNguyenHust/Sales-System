import {
  type TypedUseSelectorHook,
  useDispatch as useDispatchUntyped,
  useSelector as useSelectorUntyped,
} from "react-redux";
import type {
  Action,
  AsyncThunk,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  PayloadAction,
  ThunkAction,
  ThunkDispatch as GenericThunkDispatch,
} from "@reduxjs/toolkit";
import { createAsyncThunk as createAsyncThunkUntyped } from "@reduxjs/toolkit";

import { AppDispatch, rootReducer, RootState } from "src/store/configureStore";

export type StoreState = ReturnType<typeof rootReducer>;

/*
 * Utility type to get strongly types thunks
 */
export type ThunkResult<R> = ThunkAction<R, StoreState, undefined, PayloadAction<any>>;

export type ThunkDispatch = GenericThunkDispatch<StoreState, undefined, Action>;

// Typed useDispatch & useSelector hooks
export const useDispatch: () => AppDispatch = useDispatchUntyped;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorUntyped;

type DefaultThunkApiConfig = { dispatch: AppDispatch; state: StoreState };
export const createAsyncThunk = <
  Returned,
  ThunkArg = void,
  ThunkApiConfig extends { [key: string]: any } = DefaultThunkApiConfig
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> =>
  createAsyncThunkUntyped<Returned, ThunkArg, ThunkApiConfig>(typePrefix, payloadCreator, options);
