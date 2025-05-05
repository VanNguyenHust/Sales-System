import { type ToastProps } from "@sapo/ui-components";

/**
 * @deprecated using admin ContextualSaveBar component don't need using this
 */
export const DISCARD_CONFIRMED = {};
export const NEW_CREATE_STATE_TOKEN = {};

type ToastState = Pick<ToastProps, "content" | "duration" | "error" | "success">;

type WithStatesOptions = {
  newCreate?: boolean;
  discardConfirmed?: boolean;
  toastSuccess?: string;
  toastError?: string;
  toast?: ToastState;
};

export type NavigateState = {
  newCreate?: boolean;
  discardConfirmed?: boolean;
  toast?: ToastState;
};

export function withStates({ toastError, toastSuccess, ...rest }: WithStatesOptions): NavigateState {
  return {
    ...rest,
    toast: rest.toast
      ? rest.toast
      : toastSuccess
      ? {
          content: toastSuccess,
          success: true,
        }
      : toastError
      ? {
          content: toastError,
          error: true,
        }
      : undefined,
  };
}
