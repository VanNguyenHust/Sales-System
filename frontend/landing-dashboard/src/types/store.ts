export type RegisterStoreRequest = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  province: string;
};

export type EnableStoreRequest = {
  confirmCode: string;
  name: string;
  password: string;
  confirmPassword: string;
}
