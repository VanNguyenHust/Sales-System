export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  storeId: number;
  domain: string;
  resourceId: number;
  resourceType: string;
};
