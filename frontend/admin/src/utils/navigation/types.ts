import { type NavigateOptions as NavigateOptionsRRD, type To } from "react-router-dom";

export interface ToResource extends Pick<To, "search"> {
  name: "customers" | "products" | "orders" | "discounts" | "draft_orders" | "dashboard";
  resource?: {
    id?: number;
    create?: boolean;
  };
  params?: { [key: string]: any };
}

export interface NavigateOptions extends NavigateOptionsRRD {
  toast?: {
    content: string;
    error?: boolean;
    notify?: boolean;
  };
  saveBackAction?: boolean;
  restoreBackAction?: boolean;
}

export type NavigateTo = To | ToResource;
