export const IS_PROD = import.meta.env.PROD;
export const CLIENT_DELAY = import.meta.env.VITE_CLIENT_DELAY ? parseInt(import.meta.env.VITE_CLIENT_DELAY) : null;
export const DEV_ENABLE_MSW = !IS_PROD && import.meta.env.VITE_DEV_ENABLE_MSW === "true" ? true : false;
export const DEV_ENABLE_REACT_STRICT_MODE =
  !IS_PROD && import.meta.env.VITE_DEV_ENABLE_REACT_STRICT_MODE === "false" ? false : true;

export const TOTAL_RECORD_HEADER = "x-bizweb-total-record";

export const SAPO_HOTLINE = "1900 6750";

export enum LegacyPermissions {
  FULL = "full",
  DASHBOARD = "dashboard",
  //order
  ORDER = "orders",
  DARFT_ORDERS = "draft_orders",
  // product
  PRODUCT = "products",
  // customer
  CUSTOMERS = "customers",
  // report
  REPORTS = "reports",
  // // overview
  // OVERVIEWS = "overviews",
  // marketing
  MARKETING = "marketing",
  // application
  APPLICATIONS = "applications",
  // preference
  PREFERENCES = "preferences",
  // theme
  THEMES = "themes",
  // page
  PAGES = "pages",
  // link
  LINKS = "links",
  // domain
  DOMAINS = "domains",
  CHANNELS = "channels",
}

/** permissions */
export enum Permissions {
  FULL = "full",
  DASHBOARD = "dashboard",
  //order
  ORDER = "orders",
  READ_ORDER = "read_orders",
  READ_ASSIGNED_ORDER = "read_assigned_orders",
  CREATE_ORDER = "create_orders",
  UPDATE_ORDER = "update_orders",
  DELETE_ORDER = "delete_orders",
  CANCEL_ORDER = "cancel_orders",
  EXPORT_ORDER = "export_orders",
  WRITE_PAYMENTS = "write_payments",
  // RESOLVE_PAYMENT = "resolve_payments",
  //draft_order
  DARFT_ORDERS = "draft_orders",
  READ_DRAFT_ORDER = "read_draft_orders",
  CREATE_DRAFT_ORDER = "create_draft_orders",
  EXPORT_DRAFT_ORDER = "export_draft_orders",
  ADD_CUSTOM_ITEMS = "add_custom_items",
  APPLY_DISCOUNTS = "apply_discounts",
  //abandon_checkouts
  ABANDONED_CHECKOUTS = "abandoned_checkouts",
  //return_order
  READ_RETURNS = "read_returns",
  CREATE_RETURNS = "create_returns",
  REFUND_RETURNS = "refund_returns",
  RESTOCK_RETURNS = "restock_returns",
  CANCEL_RETURNS = "cancel_returns",
  // product
  PRODUCT = "products",
  READ_PRODUCT = "read_products",
  CREATE_PRODUCT = "create_products",
  UPDATE_PRODUCT = "update_products",
  DELETE_PRODUCT = "delete_products",
  EXPORT_PRODUCT = "export_products",
  UPDATE_PRODUCT_PRICE = "update_product_price",
  READ_COST_PRICE = "read_cost_price",
  UPDATE_COST_PRICE = "update_cost_price",
  READ_INVENTORIES = "read_inventories",
  WRITE_INVENTORIES = "write_inventories",
  EXPORT_INVENTORIES = "export_inventories",
  RECEIVE_INVENTORIES = "receive_inventories",
  PURCHASE_ORDERS = "purchase_orders",
  SUPPLIER_RETURNS = "supplier_returns",
  SUPPLIERS = "suppliers",
  STOCK_TRANSFERS = "stock_transfers",
  COLLECTIONS = "collections",
  // gift card
  GIFT_CARDS = "gift_cards",
  // customer
  CUSTOMERS = "customers",
  READ_CUSTOMERS = "read_customers",
  CREATE_CUSTOMERS = "create_customers",
  UPDATE_CUSTOMERS = "update_customers",
  DELETE_CUSTOMERS = "delete_customers",
  EXPORT_CUSTOMERS = "export_customers",
  // report
  REPORTS = "reports",
  CUSTOMER_REPORTS = "customer_reports",
  SALE_REPORTS = "sale_reports",
  TOTAL_PROFIT_REPORTS = "total_profit_reports",
  PAYMENT_REPORTS = "payment_reports",
  INVENTORY_REPORTS = "inventory_reports",
  VISIT_REPORTS = "visit_reports",
  // overview
  OVERVIEWS = "overviews",
  // marketing
  MARKETING = "marketing",
  READ_PRICE_RULES = "read_price_rules",
  WRITE_PRICE_RULES = "write_price_rules",
  // application
  APPLICATIONS = "applications",
  LIMITED_APPLICATIONS = "limited_applications",
  // preference
  PREFERENCES = "preferences",
  // theme
  THEMES = "themes",
  // page
  PAGES = "pages",
  // link
  LINKS = "links",
  // domain
  DOMAINS = "domains",
  // location
  LOCATIONS = "locations",
  // channel
  CHANNELS = "channels",
  //setting
  STORE_SETIINGS = "store_settings",
  LOCATION_SETTINGS = "location_settings",
  PLANS_SETTINGS = "plans_settings",
  NOTIFICATIONS = "notifications",
  FILES = "files",
  TAX_SETIINGS = "tax_settings",
  PAYMENT_SETTING = "payment_settings",
  CHECKOUT_SETTINGS = "checkout_settings",
  USER_PERMISSIONS = "user_permissions",
  WEBSITE_SETTINGS = "website_settings",
  // shipping roles
  /** Cấu hình vận chuyển */
  SHIPPING_SETTINGS = "shipping_settings",
  /** Xem đối tác vận chuyển */
  READ_CARRIERS = "read_carriers",
  /** Quản lý đối tác vận chuyển */
  WRITE_CARRIERS = "write_carriers",
  /** Quản lý vận đơn */
  SHIPMENTS = "shipments",
  //voucher
  READ_VOUCHERS = "read_vouchers",
  WRITE_VOUCHERS = "write_vouchers",
  DELETE_VOUCHERS = "delete_vouchers",
  READ_REASONS = "read_reasons",
  WRITE_REASONS = "write_reasons",
}
export type LegacyPermission = `${LegacyPermissions}`;
export type Permission = `${Permissions}`;
export const namePermissions = (permission: Permission) => {
  switch (permission) {
    case "create_products":
      return "Tạo sản phẩm";
    case "update_products":
      return "Sửa sản phẩm";
    case "delete_products":
      return "Xóa sản phẩm";
    case "update_cost_price":
      return "Sửa giá vốn";
    case "write_inventories":
      return "Khởi tạo & sửa tồn kho sản phẩm";
    default:
      return "";
  }
};

export enum ReadInventoryPermissions {
  CREATE = "create",
  DRAFT = "draft",
  EDIT = "edit",
}

export type ReadInventoryPermission = `${ReadInventoryPermissions}`;
