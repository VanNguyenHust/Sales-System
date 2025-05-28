export const IS_PROD = import.meta.env.PROD;
export const CLIENT_DELAY = import.meta.env.VITE_CLIENT_DELAY
  ? parseInt(import.meta.env.VITE_CLIENT_DELAY)
  : null;
export const DEV_ENABLE_MSW =
  !IS_PROD && import.meta.env.VITE_DEV_ENABLE_MSW === "true" ? true : false;
export const DEV_ENABLE_REACT_STRICT_MODE =
  !IS_PROD && import.meta.env.VITE_DEV_ENABLE_REACT_STRICT_MODE === "false"
    ? false
    : true;

export enum LegacyPermissions {
  FULL = "full",
  DASHBOARD = "dashboard",
  ORDER = "orders",
  PRODUCT = "products",
  CUSTOMERS = "customers",
  DOMAINS = "domains",
  CHANNELS = "channels",
}

/** permissions */
export enum Permissions {
  FULL = "full",
  // order
  ORDER = "orders",
  READ_ORDER = "read_orders",
  CREATE_ORDER = "create_orders",
  UPDATE_ORDER = "update_orders",
  DELETE_ORDER = "delete_orders",
  // product
  PRODUCT = "products",
  READ_PRODUCT = "read_products",
  CREATE_PRODUCT = "create_products",
  UPDATE_PRODUCT = "update_products",
  DELETE_PRODUCT = "delete_products",
  // customer
  CUSTOMERS = "customers",
  READ_CUSTOMERS = "read_customers",
  CREATE_CUSTOMERS = "create_customers",
  UPDATE_CUSTOMERS = "update_customers",
  DELETE_CUSTOMERS = "delete_customers",
  //setting
  STORE_SETIINGS = "store_settings",
  LOCATION_SETTINGS = "location_settings",
  USER_SETTINGS = "user_settings",
}
export type LegacyPermission = `${LegacyPermissions}`;
export type Permission = `${Permissions}`;

export enum ReadInventoryPermissions {
  CREATE = "create",
  DRAFT = "draft",
  EDIT = "edit",
}

export type ReadInventoryPermission = `${ReadInventoryPermissions}`;
