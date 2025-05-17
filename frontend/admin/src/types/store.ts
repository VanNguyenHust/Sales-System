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
};

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountOwner: boolean;
  permissions: string[];
};
