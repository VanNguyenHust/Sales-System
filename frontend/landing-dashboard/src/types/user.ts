export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  storeId: number;
  storeAlias: string;
  resourceId: number;
  resourceType: string;
};
