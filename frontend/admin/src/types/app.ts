import { ProductFilter } from "./product";

export type PublicationResponse = {
  id: number;
  name: string;
  supports_future_publishing: boolean;
  small_icon?: string;
  large_icon?: string;
  client_id: string;
  deleted?: boolean;
  install_page_app?: boolean;
  app_installation_id?: number;
  support_bundles?: boolean;
  scopes?: string[];
  auto_publish?: boolean;
  task_status?: PublicationTaskStatus;
};

export type PublicationTaskStatus = "waiting" | "processing" | "failed" | "success";

export type ResourcePublicationResourceType = "product" | "collection";

export type AddPublicationsRequest = {
  publications: PublicationInputRequest[];
  resource_id: number;
  resource_type: ResourcePublicationResourceType;
};

export type UpdatePublicationRequest = { client_id: string; deleted?: boolean };

export type RemovePublicationsRequest = {
  publication_ids: number[];
  resource_id: number;
  resource_type: ResourcePublicationResourceType;
};

export type PublicationInputRequest = {
  publication_id: number;
  published_on?: string;
  resource_id?: number;
};

export type PublicationFilterRequest = {
  ignore_delete_status?: boolean;
  client_ids?: string;
};

export type PublicationResourceResponse = {
  id: number;
  name: string;
  published_on: string;
  published: boolean;
  active: boolean;
  client_id: string;
  supports_future_publishing?: boolean;
  small_icon?: string;
  large_icon?: string;
  support_bundles?: boolean;
};

export type ResourceFeedbackResponse = {
  id: number;
  resource_id: number;
  store_id: number;
  resource_type: string;
  state: string;
  client_id: string;
  messages: string;
  created_on: string;
  updated_on?: string;
  feedback_generated_on: string;
  link_url?: string;
  link_label?: string;
  resolved_link_external: boolean;
  resolved_link_url?: string;
};

export interface App {
  id: number;
  api_key: string;
  title: string;
  description?: string;
  app_store_app_url?: string;
  banner: Image;
  icon: Image;
  developer_name?: string;
  developer_email?: string;
  developer_url?: string;
  developer_type?: "partner" | "sapo";
  alias?: string;
  published: boolean;
  embedded: boolean;
  channel: boolean;
  scope?: string;
}

export interface AppResponse {
  app: App;
}

export interface AppsResponse {
  apps: App[];
}

export interface AppInstallation {
  id: number;
  access_scopes: AccessScope[];
  launch_url: string;
  app: App;
  installed_on: string;
  pinned: boolean;
  expired: boolean;
  expire_on?: string;
}

export interface AppInstallationResponse {
  app_installation: AppInstallation;
}

export interface AppInstallationsResponse {
  app_installations: AppInstallation[];
}

export interface AppLink {
  id: number;
  text: string;
  url: string;
  location: string;
  icon?: Image;
  app: App;
}

export interface AppLinksResponse {
  app_links: AppLink[];
}

export interface AppLinkRequest {
  type?: "products" | "variants" | "collections" | "articles" | "blogs" | "pages" | "orders" | "receive_inventories";
  location?: "index" | "show" | "action";
  resource_id?: number;
}

export interface SessionToken {
  token: string;
}

export interface SessionTokenResponse {
  session_token: SessionToken;
}

interface Image {
  src: string;
}

export enum AppCategory {
  channels = "channels",
  apps = "apps",
  apps_and_channels = "apps_and_channels",
  apps_and_channels_for_navigation = "apps_and_channels_for_navigation",
}

export interface AppInstallationFilterRequest extends Paging {
  category?: AppCategory;
  sort_key?: "id";
  reverse?: boolean;
}

export interface AppSuggestionFilterRequest extends Paging {}

export interface Paging {
  page?: number;
  limit?: number;
}

export interface PrivateApp {
  id: number;
  api_key: string;
  secret_key: string;
  title: string;
  contact_email?: string;
  access_scopes: AccessScope[];
  storefront_access_token?: {
    access_token: string;
    access_scopes: StorefrontAccessScope[];
  };
  created_on: string;
}

export interface PrivateAppFilterRequest extends Paging {
  sort_key?: "id";
  reverse?: boolean;
}

export interface PrivateAppCreateRequest {
  title: string;
  access_scopes: AccessScope[];
  contact_email?: string;
  storefront_access_token?: {
    access_scopes: StorefrontAccessScope[];
  };
}

export interface PrivateAppUpdateRequest {
  title?: string;
  access_scopes?: AccessScope[];
  contact_email?: string;
  storefront_access_token?: {
    access_scopes: StorefrontAccessScope[];
  };
}

export interface PrivateAppResponse {
  private_app: PrivateApp;
}

export interface PrivateAppsResponse {
  private_apps: PrivateApp[];
}

export type StorefrontAccessScope =
  | "unauthenticated_read_product_listings"
  | "unauthenticated_read_customers"
  | "unauthenticated_write_customers"
  | "unauthenticated_read_checkouts"
  | "unauthenticated_write_checkouts"
  | "unauthenticated_read_content";

export type AccessScope =
  | "read_content"
  | "write_content"
  | "read_customers"
  | "write_customers"
  | "read_orders"
  | "write_orders"
  | "read_products"
  | "write_products"
  | "read_themes"
  | "write_themes"
  | "read_script_tags"
  | "write_script_tags"
  | "read_price_rules"
  | "write_price_rules"
  | "read_draft_orders"
  | "write_draft_orders"
  | "read_product_listings"
  | "write_product_listings"
  | "read_resource_feedbacks"
  | "write_resource_feedbacks"
  | "read_inventory"
  | "write_inventory"
  | "read_reasons"
  | "write_reasons"
  | "read_vouchers"
  | "write_vouchers"
  | "write_payments"
  | "read_locations"
  | "write_reports"
  | "read_reports"
  | "write_publications"
  | "read_publications"
  | "write_receive_inventories"
  | "read_receive_inventories"
  | "write_supplier_returns"
  | "read_supplier_returns"
  | "write_suppliers"
  | "read_suppliers";

export type ResourcePublicationProductRequest = {
  publication_id: number;
  product_ids?: number[];
  all?: boolean;
  filter?: ProductFilter;
  operation: "publish" | "unpublish";
};

export type CreatePublicationRequest = {
  auto_publish_product?: boolean;
};
