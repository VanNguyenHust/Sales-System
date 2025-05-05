import {
  FileTypeForPaymentMethod,
  PaymentMethodAction,
} from "app/features/setting/pages/payment-method/utils/constants";

import { PaginationFilter } from "./common";
import { Location } from "./location";

export type BeneficiaryAccount = {
  id?: number;
  bank_id?: number;
  bank_name?: string;
  bank_short_name?: string;
  bin?: string;
  account_name?: string;
  account_number?: string;
  note?: string;
  provider_id?: number;
  payment_method_name?: string;
  created_on?: string;
  modified_on?: string;
};

export type BeneficiaryAccountFilterRequest = PaginationFilter & {
  ids?: string;
  query?: string;
  account_name?: string;
  account_number?: string;
  bank_code?: string;
};

export type AccountInfoRequest = {
  account_name?: string;
  account_number?: string;
  bank_code?: string;
};

export type BeneficiaryAccountResponse = {
  beneficiary_account: BeneficiaryAccount;
};

export type BeneficiaryAccountsResponse = {
  beneficiary_accounts: BeneficiaryAccount[];
};

export type BeneficiaryAccountRequest = {
  bank_id?: string;
  account_name?: string;
  account_number?: string;
  note?: string;
  allow_create_payment_method?: boolean;
  provider_id?: string;
  payment_method_name?: string;
};

export type BeneficiaryAccountForm = {
  bankModel: string | null | undefined;
  accountNumber: string;
  accountName: string;
  note: string | null | undefined;
  paymentMethodType: string | null | undefined;
  paymentMethodName: string | null | undefined;
  allowCreatePaymentMethod: boolean | undefined;
};

interface IdentifyMutation {
  type: "order_payment" | "checkout";
  checkout_token?: string;
  order_id?: number;
}

export interface PaymentOrderForm {
  payment_method_id: number;
  amount: number;
  currency: string | null | undefined;
  reference: string | null | undefined;
}

export interface PaymentOrderFormV2 {
  beneficiary_account_id: number;
  amount: number;
  currency: string | null | undefined;
  reference: string | null | undefined;
}

export type PaymentBank = {
  id?: number;
  code?: string;
  name?: string;
  bin?: string;
  short_name?: string;
  vnpay_code?: string;
};

export type PaymentQRCode = {
  base64: string;
  base64_integrated: string;
};

export interface PaymentQRCodeResquest {
  bid: string;
  cid: string;
  purpose: string;
  amount: number;
  size?: number;
  name: string;
  integrated: boolean;
  unhide: boolean;
}

export type PaymentMethods = {
  id: number;
  provider_id: number;
  provider_name?: string;
  name: string;
  description: string;
  created_on: string;
  modified_on: string;
  settings: Settings[];
};

type Settings = {
  id: number;
  payment_method_id: number;
  setting_name: string;
  setting_value: string;
  modified_on: string;
};

type Setting = {
  id: number;
  payment_method_id: number;
  setting_name: string;
  setting_value: string;
  created_on: string;
  modified_on: string;
};

export type PaymentMethod = {
  id: number;
  provider_id: number;
  name: string;
  status: string;
  description: string;
  created_on: string;
  modified_on: string;
  settings: Setting[];
  beneficiary_accounts: BeneficiaryAccount[];
  beneficiary_account_id: number;
  auto_posting_receipt: boolean;
};

export interface PaymentMethodRequest {
  provider_id: number;
  name: string;
  status?: string;
  description?: string;
  beneficiary_account_id?: number;
  auto_posting_receipt?: boolean;
}

export type PaymentMethodIntegratedRequest = {
  name?: string;
  description?: string;
  auto_posting_receipt: boolean;
};

export type PaymentMethodResponse = { payment_method: PaymentMethod };

export type PaymentMethodsResponse = { payment_methods: PaymentMethod[] };

export type ConnectRequest = PaymentIntegrationRequest | KBankRequest;

export type PaymentIntegrationRequest = {
  action?: string;
  provider_id?: number;
  auto_posting_receipt?: boolean;
  payment_method_name?: string;
  payment_method_description?: string;
};

export type PaymentIntegrationResponse = {
  payment_method_id?: number;
  request_id?: string;
  status?: string;
  partner_provider?: string;
  terminals: PaymentTerminalResponse[];
  auto_posting_receipt?: boolean;
  payment_method_name?: string;
  payment_method_description?: string;
  merchant: VietQrMerchantResponse | PaymentMerchantResponse;
};

export type PaymentTerminalResponse = {
  id?: string;
  merchant_id?: string;
  merchant_name?: string;
  merchant_phone?: string;
  merchant_identity_card?: string;
  terminal_id?: string;
  terminal_name?: string;
  terminal_address?: string;
  partner_terminal_id?: string;
  status?: string;
  location_id?: number;
  location_name?: string;
  ip_address?: string;
  client_id?: string;
  deleted?: boolean;
  tcb_qr_basic?: string;
  sso?: string;
};

export type VnpayLoginTerminalRequest = {
  vnpay_terminal_id: string;
  vnpay_terminal_name: string;
  vnpay_terminal_address: string;
  location_ids?: number[];
};

export interface VnpayLoginRequest extends PaymentIntegrationRequest {
  merchant_id: string;
  merchant_brand: string;
  email_presenter?: string;
  terminals: VnpayLoginTerminalRequest[];
}

export type VnpayLoginTerminalResponse = {
  terminal_id: string;
  terminal_name: string;
  terminal_address: string;
  location_ids?: string;
};

export type VnpayLoginResponse = {
  action?: string;
  provider_id?: number;
  merchant_id: string;
  merchant_brand: string;
  email_presenter?: string;
  terminals: VnpayLoginTerminalResponse[];
};

export interface VnpayDetailResponse {
  payment_method_id?: number;
  request_id?: string;
  status?: string;
  partner_provider?: string;
  merchant: VnpayMerchant;
  auto_posting_receipt?: boolean;
  terminals: VNPAYTerminal[];
  payment_method_name?: string;
  payment_method_description?: string;
}

export type VNPAYTerminal = {
  merchant_id?: string;
  terminal_id: any;
  terminal_name?: string;
  terminal_address?: string;
  partner_terminal_id?: string;
  status?: string;
  location_id?: number;
  created_on?: Date;
  modified_on?: Date;
  location: string;
  location_ids: number[];
};

export type VnpayMerchant = {
  id?: string | null;
  status?: string | null;
  note?: string | null;
  tag?: string | null;
  merchant_id?: string | null;
  merchant_name?: string | null;
  rejected_reason?: string | null;
};

export interface VnpayTerminalRequest extends PaymentIntegrationRequest {
  terminal_id?: string;
  terminal_name?: string;
  terminal_type?: string;
  terminal_description?: string;
  terminal_address?: string;
  terminal_city?: string;
  terminal_district?: string;
  terminal_ward?: string;
  terminal_contact_name?: string;
  terminal_contact_phone?: string;
  terminal_contact_email?: string;
  location_ids?: number[];
  beneficiary_id?: number;
  terminal_bank_branch_name?: string;
}

export type SapoPayIndustry = {
  id: string;
  code: string;
  name: string;
};
export type TerminalModel = {
  terminalName: string;
  bankBranch: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  industryCode: string;
  locationIds: number[] | undefined;
  terminalAddress: string;
  wardName: string;
  beneficiaryAccountId: number;
  district: string;
  province: string;
};

export type LocationOption = {
  key: string;
  value: Location[];
};

export type ImageInputType = {
  label?: string;
  labelTooltip?: string;
  requiredIndicator?: boolean;
  fileType?: FileTypeForPaymentMethod;
};

export interface VpBankRegisterRequest extends PaymentIntegrationRequest {
  address: string;
  business_code: string;
  business_type: string;
  city: string;
  district: string;
  card_accepting_unit: string;
  mcc: string;
  email_presenter: string;
  ward: string;
  email: string;
  name: string;
  phone: string;
  industry: string;
  number_pos: number;
  card_accepting_unit_address: string;
  beneficiary_id?: number;
}

export type VpbankUpdateTerminalModel = {
  terminalName: string;
  ipAddress: string;
  terminalAddress: string;
};

export interface VpbankUpdateTerminalRequest extends PaymentIntegrationRequest {
  terminal_name: string;
  terminal_id: string;
  terminal_ip: string;
  terminal_address: string;
}

export type VpBankCreateTerminalModel = {
  terminals: TerminalVpbankModel[];
};

export type TerminalVpbankModel = {
  terminalAddress: string;
  quantity: number;
};

export interface VpbankCreateTerminalRequest extends PaymentIntegrationRequest {
  terminals: {
    terminal_address: string;
  }[];
}

export type IntegrationFileRequest = {
  base64?: string;
  file_name?: string;
  file_type?: string;
};

export type VietQrRegisterModel = {
  name?: string;
  phone?: string;
  account_number?: string;
  identity_card?: string;
  email?: string;
  email_presenter?: string;
  otp_code?: string;
  type?: string;
  mcc?: string;
  location?: PaymentLocationRequest;
  vietqr_basic?: string;
  auto_posting_receipt?: boolean;
  policy_confirm?: boolean;
};

export interface VietQrRegisterRequest extends PaymentIntegrationRequest {
  name?: string;
  identity_card?: string;
  phone?: string;
  account_number?: string;
  email?: string;
  email_presenter?: string;
  reference_id?: number;
  reference_name?: string;
  terminal_id?: string;
  address?: string;
  type?: string;
  mcc?: string;
  locations?: PaymentLocationRequest[];
}

export interface VietQrConfirmOtpRequest extends PaymentIntegrationRequest {
  request_id?: string;
  otp_code?: string;
  partner_terminal_id?: string;
}

export type VietQrMerchantResponse = {
  name?: string;
  phone?: string;
  identity_card?: string;
  account_number?: string;
  completed_date?: Date;
  email?: string;
  email_presenter?: string;
  type?: string;
  mcc?: string;
};

export type PaymentMerchantResponse = {
  name?: string;
  business_type?: string;
  phone?: string;
  business_code?: string;
  mcc?: string;
  email?: string;
  email_presenter?: string;
  account_number?: string;
  account_name?: string;
  bank_code?: string;
  bank_name?: string;
  tag?: string;
  note?: string;
  store_name?: string;
};

export type PaymentLocationRequest = {
  location_id: number;
  location_name: string;
  location_reference: string;
};

export interface AfteeLoginRequest extends PaymentIntegrationRequest {
  private_key?: string;
  public_key?: string;
  email_presenter?: string;
}

export interface AfteeRegisterRequest extends PaymentIntegrationRequest {
  mcc?: string;
  business_type?: string;
  business_code?: string;
  beneficiary_id?: number;
  name?: string;
  phone?: string;
  email?: string;
  email_presenter?: string;
  payment_method_name?: string;
  note?: string;
}

export interface EcopayLoginRequest extends PaymentIntegrationRequest {
  email_presenter?: string;
  beneficiary_id?: number;
  mer_id: string;
  secret_key: string;
  store_code: string;
  terminal_code: string;
}

export interface EcopayRegisterRequest extends PaymentIntegrationRequest {
  mcc?: string;
  business_type?: string;
  business_code?: string;
  beneficiary_id?: number;
  name?: string;
  phone?: string;
  email?: string;
  email_presenter?: string;
  payment_method_name?: string;
  note?: string;
}

export type PaymentPrivateKeyResponse = object;

export type AfteePrivateKeyResponse = PaymentPrivateKeyResponse & {
  private_key?: string;
  public_key?: string;
};

export type EcopayPrivateKeyResponse = PaymentPrivateKeyResponse & {
  secret_key?: string;
  mer_id?: string;
  store_code?: string;
  terminal_code?: string;
};

export type VnpayGatewayPrivateKeyResponse = PaymentPrivateKeyResponse & {
  tmn_code?: string;
  secret_key?: string;
  profile_id?: string;
};

export type VNPayGatwayRegisterRequest = PaymentIntegrationRequest & {
  business_type: string;
  business_code: string;
  mcc: string;
  name: string;
  phone: string;
  email: string;
  beneficiary_id?: number;
  email_presenter?: string;
  tmn_code: string;
  secret_key: string;
};

export type PaymentFilterRequest = {
  type?: "integrates" | "no_integrates";
  limit?: number;
  page?: number;
  ids?: string;
  statuses?: ("active" | "inactive")[];
};

export type VpbankGatewayLoginRequest = PaymentIntegrationRequest & {
  profile_id?: string;
  private_key?: string;
  public_key?: string;
  email_presenter?: string;
};

export type VpbankGatewayRegisterRequest = PaymentIntegrationRequest & {
  store_name?: string;
  mcc?: string;
  name?: string;
  email?: string;
  business_type?: string;
  business_code?: string;
  beneficiary_id?: number;
  phone?: string;
  email_presenter?: string;
  payment_method_name?: string;
};

export type ZaloPayPrivateKeyResponse = PaymentPrivateKeyResponse & {
  app_id?: number;
  key1?: string;
  key2?: string;
};

export type ZaloPayConnectRequest = PaymentIntegrationRequest & {
  name?: string;
  business_type?: string;
  phone?: string;
  business_code?: string;
  mcc?: string;
  email?: string;
  email_presenter?: string;
  beneficiary_id?: number;
  app_id?: number;
  key1?: string;
  key2?: string;
};

export type EPayLoginRequest = PaymentIntegrationRequest & {
  email_presenter?: string;
  mer_id?: string;
  encode_key?: string;
  beneficiary_id?: number;
};

export type EPayPrivateKeyResponse = PaymentPrivateKeyResponse & {
  mer_id?: string;
  encode_key?: string;
};

export type FundiinConnectRequest = PaymentIntegrationRequest & {
  name?: string;
  business_type?: string;
  phone?: string;
  business_code?: string;
  mcc?: string;
  email?: string;
  email_presenter?: string;
  beneficiary_id?: number;
  client_id?: string;
  merchant_id?: string;
  secret_key?: string;
};

export type FundiinPrivateKeyResponse = PaymentPrivateKeyResponse & {
  client_id?: string;
  merchant_id?: string;
  secret_key?: string;
};

export type KBankRequest = PaymentIntegrationRequest &
  (KBankLoginRequest | KBankRegisterRequest | KBankRegisterTerminalRequest);

export type KBankLoginRequest = {
  action:
    | PaymentMethodAction.KBANK_LOGIN
    | PaymentMethodAction.KBANK_UPDATE_TERMINAL
    | PaymentMethodAction.KBANK_CREATE_TERMINAL;
  id?: string;
  muid?: string;
  sso?: string;
  terminal_name?: string;
  terminal_address?: string;
  location_id?: number;
  location_name?: string;
};

export type KBankRegisterRequest = {
  action: PaymentMethodAction.KBANK_REGISTER;
  mcc?: string;
  business_type?: string;
  business_code?: string;
  beneficiary_id?: number;
  name?: string;
  phone?: string;
  email?: string;
  store_name?: string;
  email_presenter?: string;
};

export type KBankRegisterTerminalRequest = {
  action: PaymentMethodAction.KBANK_REGISTER_TERMINAL;
  terminals: KBankTerminalRequest[];
};

export type KBankTerminalRequest = {
  terminal_address?: string;
  location_id?: number;
  location_name?: string;
};
