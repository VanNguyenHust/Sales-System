import { type ToastProps } from "@/ui-components";

import { ToastOptions } from "./type";

export function createToastStateFromOptions(options: ToastOptions) {
  let toast: Partial<ToastProps> | undefined = undefined;
  if (options?.toastError) {
    toast = {
      content: options.toastError,
      error: true,
    };
  } else if (options?.toastSuccess) {
    toast = {
      content: options.toastSuccess,
      success: true,
    };
  }
  if (toast) {
    return { toast };
  }
  return undefined;
}
