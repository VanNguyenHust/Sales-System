export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  storeId: number;
  resourceId: number;
  resourceType: string;
};
