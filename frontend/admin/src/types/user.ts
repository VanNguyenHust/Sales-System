import { Permission } from "src/constants";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  url?: string;
  description?: string;
  last_login?: string;
  account_owner?: boolean;
  received_announcements?: boolean;
  created_on?: string;
  modified_on?: string;
  permissions: Permission[];
  user_permissions: UserPermission[];
  app_permission: AppPermission;
  start_session?: string;
  user_type?: string;
  roles?: string;
  no_password?: boolean;
  sso?: boolean;
  guide_line_dashboard?: boolean;
  guide_line_product?: boolean;
  login_identity?: LoginIdentity;
  tfa_enabled?: boolean;
  active: boolean;
};

export type LoginIdentity = "EMAIL" | "PHONE_NUMBER";

export type UserPermission = {
  store_role_id: number;
  location_id: number;
  permissions: Permission[];
  merge_permissions: Permission[];
};

export type CurrentUser = {
  user: {
    id: number;
    email?: string;
    phoneNumber?: string;
    name: string;
    first_name: string;
    last_name?: string;
    account_owner: boolean;
    permissions: Permission[];
    user_permissions: UserPermission[];
    app_permission: AppPermission;
    avatar?: {
      src: string;
    };
    active?: boolean;
  };
  csrf_token: string;
};

export type UserFilter = {
  page?: number;
  limit?: number;
  query?: string;
  ids?: string;
  user_type?: string;
  account_owner?: boolean;
  active?: boolean;
};

export type UserCreateRequest = {
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  url?: string | null;
  description?: string | null;
  received_announcements: boolean;
  password?: string;
  confirm_password?: string;
  limited_access: boolean;
  login_identity: LoginIdentity;
};

export type UserEditRequest = {
  url?: string;
  description?: string;
  received_announcements?: boolean;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  active?: boolean;
};
export type UserChangePasswordRequest = {
  password: string;
  actor_confirm_password: string;
};

export type UserEditSSORequest = {
  id: number;
  received_announcements: boolean;
  limited_access: boolean;
  permissions: Permission[];
};

export type UserLoginHistory = {
  id: number;
  user_id: number;
  ip: string;
  isp: string;
  location: string;
  login_date: Date;
  agent: string;
  email: string;
};

export type UserLoginHistoryFilter = {
  limit?: number;
};

export type UserLoginHistoriesResponse = {
  login_histories: UserLoginHistory[];
};

export type InviteStaffRequest = {
  country_code: string;
  phone_number: string;
  domain: string;
  store_name: string;
  full_name: string;
  email: string;
  login_identity: string;
};

export type InviteStaffResponse = {
  is_success: boolean;
};

export type StoreRole = {
  id: number;
  name: string;
  permissions: Permission[];
  note?: string;
};

export type StoreRolesResponse = {
  store_roles: StoreRole[];
};

export type StoreRoleResponse = {
  store_role: StoreRole;
};

export type StoreRoleRequest = {
  name: string;
  permissions: Permission[];
  note?: string;
};

export type UserPermissionRequest = {
  store_role_id?: number;
  location_id: number;
  permissions: Permission[];
};

export type UserPermissionResponse = {
  user_permission: UserPermission;
};

export type UserAuthenticateRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  user: User;
};

export type UsersResponse = {
  users: User[];
};

export type AppPermission = {
  permission?: string;
  app_installation_ids: number[];
};

export type AppPermissionResponse = {
  app_permission: AppPermission;
};

export type AppPermissionRequest = {
  app_installation_ids: number[];
  permission: "applications" | "limited_applications" | null;
};

export type ManageStore = {
  id: number;
  status: "pending" | "removed" | "active" | "declined";
};

export type ManageStoreResponse = {
  manage_store: ManageStore;
};

export type UserSetRequest = {
  operation: "active" | "inactive";
  ids: number[];
};
export type UserSetResponse = {
  success_ids: number[];
  failed_ids: UserSetError[];
};

export type UserSetError = {
  user_id: number;
  error: any;
};
