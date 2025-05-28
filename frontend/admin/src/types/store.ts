export type UpdateStoreRequest = {
  name: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
  provinceCode: string;
  address: string;
};

export type StoreResponse = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  status: number;
  storeOwner: string;
  countryCode: string;
  provinceCode: string;
  address: string;
  maxProduct: number;
  maxLocation: number;
  maxUser: number;
  createdOn: string;
  startDate: string;
  endDate: string;
};

export type UpdateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  permissions?: string;
};

export type CreateUserRequest = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  permissions: string;
};

export type UsersResponse = {
  users: UserResponse[];
  count: number;
};

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "active" | "invited" | "requested" | "collaborator";
  active: boolean;
  accountOwner: boolean;
  permissions: string[];
};

export type CreateLocationRequest = {
  name: string;
  code: string;
  email: string;
  phone: string;
  countryCode: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address1: string;
  defaultLocation: boolean;
};

export type FilterLocationRequest = {
  query?: string;
  page?: number;
  limit?: number;
};

export type LocationsResponse = {
  locations: LocationResponse[];
  count: number;
};

export type LocationResponse = {
  id: number;
  storeId: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  defaultLocation: boolean;
  country: string;
  countryCode: string;
  province: string;
  provinceCode: string;
  district: string;
  districtCode: string;
  ward: string;
  wardCode: string;
  address1: string;
};
