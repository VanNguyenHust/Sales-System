import { CustomOption } from "app/components/AutocompleteCustom/AutocompleteSelect";
import { ShippingModalType } from "app/features/shipping/utils/shipping";
import { Location, MailingAddress, OrderLineItem, ShipmentBulkCreateItem } from "app/types";

import { SupportPartner } from "../features/shipping/utils/shipping";

export enum ShippingProvider {
  SAPO_EXPRESS = "SAPO_EXPRESS",
  VN_POST = "VN_POST",
  BEST_EXPRESS = "BEST_EXPRESS",
  SHOPEE_XPRESS = "SHOPEE_XPRESS",
  GHN = "GHN",
  GHTK = "GHTK",
  NINJA_VAN = "NINJA_VAN",
  GRAB_EXPRESS = "GRAB_EXPRESS",
  VIETTEL_POST = "VIETTEL_POST",
  AHAMOVE = "AHAMOVE",
  JNT_EXPRESS = "JNT_EXPRESS",
  NHAT_TIN_EXPRESS = "NHAT_TIN_EXPRESS",
}
export enum SEProviderCode {
  SHIPPO = "Shippo",
  GHN = "GHN Express",
  NINJA_VAN = "Ninja Van",
  BEST = "BEST Express",
  JNT = "J&T Express",
  DHL = "DHL eCommerce",
  SHIP60 = "Ship60",
  SNAPPY = "Snappy Express (Shippo)",
  NHAT_TIN = "Nhất Tín Express",
  SHOPEE_XPRESS = "Shopee Xpress",
}
//region clients
export interface ClientsResponse {
  sapo_express_client?: SapoExpressClient | null;
  ghtk_client?: GhtkClient | null;
  jnt_client?: JntClient | null;
  vtp_client?: VtpClient | null;
  ghn_client?: GhnClient | null;
  ahamove_client?: AhamoveClient | null;
  vnpost_client?: VnpostClient | null;
  best_express_client?: BestExpressClient | null;
  shopee_xpress_client?: ShopeeXpressClient | null;
  grab_express_client?: GrabExpressClient | null;
}

export interface SapoExpressClient {
  id?: number;
  store_id: number;
  status: string | "active" | "inactive";
  name: string;
  phone_number: string;
  email: string;
  financial_email: string;
  domain: string;
  city: string;
  district: string;
  address: string;
  invoice_required: boolean;
  invoice_company: InvoiceCompanyResponse;
  bank_account: BankAccountResponse;
  allow_insurance: boolean;
  created_on: string;
  modified_on: string;
}

export interface InvoiceCompanyResponse {
  company_name: string;
  tax_number: string;
  business_registration_number: string;
  owner_name: string;
  billing_address: string;
  shipping_address: string; //email
}
export interface BankAccountResponse {
  bank_id: string;
  bank_name: string;
  bank_branch_code: string;
  branch_name: string;
  account_name: string;
  account_number: string;
}

export interface GhtkClient {
  id: number;
  store_id: number;
  email: string;
  start_date: string;
  end_date: string;
  token: string;
  delivery_work_shift: WorkShift;
  pick_work_shift: WorkShift;
  status: Status;
  pick_option: boolean;
  freight_payer: FreightPayer;
  transport: Transport;
  allow_insurance: boolean;
  fragile_product: boolean;
  co_inspection: boolean;
  double_check: boolean;
  original_box: boolean;
  part_sign_pick_product: boolean;
  part_sign_exchange: boolean;
  collect_cancellation_money: boolean;
  letter_document: boolean;
  created_on: Date;
  modified_on: Date;
}

export interface JntClient {
  id: number;
  store_id: number;
  cus_code: string;
  status: Status;
  part_sign: boolean;
  pay_type: "CC_CASH" | "PP_CASH" | "PP_PM";
  allow_insurance: boolean;
  service_type: boolean;
  created_on: Date;
  modified_on: Date;
}

export interface VtpClient {
  id: number;
  store_id: number;
  email: string;
  phone: string;
  user_id: number;
  token: string;
  status: Status;
  freight_payer: FreightPayer;
  extra_services: string[];
  created_on: Date;
  modified_on: Date;
}

export interface GhnClient {
  id: number;
  store_id: number;
  client_id: number;
  token: string;
  status: Status;
  pickup_type: PickupType;
  freight_payer: FreightPayer;
  allow_insurance: boolean;
  partial_return?: boolean;
  created_on: Date;
  modified_on: Date;
}

export interface AhamoveClient {
  id: number;
  store_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city_id: number;
  district_id: number;
  status: Status;
  partner: string;
  token: string;
  thermal_bag_option: boolean;
  allow_insurance: boolean;
  bulky: boolean;
  payment_method: "BALANCE" | "CASH";
  freight_payer: FreightPayer;
  fragile: boolean;
  sender_infos: AhamoveSenderInfo[];
  feature?: AhamovePeliasAddress; // chỉ có trong request
}

export interface AhamoveSenderInfo {
  location_id: number;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  city_name: string;
  district_name: string;
  ward_name: string;
  detail_address: string;
  feature: AhamovePeliasAddress;
}

export interface AhamoveSenderInfoRequest {
  location_id: number;
  sender_name?: string;
  sender_phone?: string;
  sender_address?: string;
  city_name?: string;
  district_name?: string;
  ward_name?: string;
  detail_address?: string;
  feature?: AhamovePeliasAddress;
}

export interface VnpostClient {
  id: number;
  store_id: number;
  crm_code: string;
  contract_code: string;
  user_name: string;
  status: Status;
  pickup_type: PickupType;
  delivery_time: "S" | "C" | "N";
  vehicle: "BO" | "BAY";
  use_bao_phat: boolean;
  co_inspection: boolean;
  allow_insurance: boolean;
  use_invoice: boolean;
  storage: boolean;
  partial_delivery: boolean;
  partial_return_delivery: boolean;
  cancellation_fee: boolean;
  receiver_pay_freight: boolean;
  created_on: Date;
  modified_on: Date;
  is_broken: boolean;
}

export type BestExpressClient = {
  store_id: number;
  user_name: string;
  token_expiration_on: string;
  last_token_refresh_on: string;
  status: Status;
  pickup_type: PickupType;
  allow_insurance: boolean;
};

export type ShopeeXpressClient = {
  status: Status;
  user_id?: number;
  user_secret?: string;
  freight_payer?: FreightPayer;
};

export type GrabExpressClient = {
  status: Status;
  name?: string;
  email?: string;
  phone?: string;
  freight_payer?: FreightPayer;
};

export enum WorkShift {
  NONE = "none",
  MORNING = "morning",
  AFTERNOON = "afternoon",
  NIGHT = "night",
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum PickupType {
  POST_MAN = "post_man",
  DROP_OFF = "drop_off",
}

export enum FreightPayer {
  SHOP = "shop",
  CUSTOMER = "customer",
}

export enum Transport {
  FLY = "fly",
  ROAD = "road",
}
//endregion

export interface DeliveryServiceProviderFilter {
  ids?: string;
  statuses?: string;
  codes?: string;
  reference_account_ids?: string;
  include_deleted?: boolean;
  orderBy?: string;
  type?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryServiceProvider {
  id: number;
  name: string;
  code: string;
  type?: DeliveryServiceProviderType;
  status?: Status;
  start_date?: string;
  end_date?: string;
}
export interface DeliveryServiceProvidersResponse {
  data: DeliveryServiceProvider[];
  count: number;
}
/**
 * Type of delivery service provider
 * @enum {string}
 * @readonly
 * @property {string} INTERNAL_SHIPPER - giao hàng qua ship cửa hàng
 * @property {string} EXTERNAL_SHIPPER - giao hàng qua đối tác vận chuyển ngoài
 * @property {string} EXTERNAL_SERVICE - giao hàng qua đối tác vận chuyển tích hợp
 * @property {string} NONE - fulfillment chưa xác định hình thức giao hàng, hoặc không yêu cầu vận chuyển
 * @property {string} PICK_UP - lấy hàng tại cửa hàng
 * @property {string} RETAIL - bán tại cửa hàng bán lẻ
 * @property {string} ECOMMERCE - Sàn
 * @property {string} EMPLOYEE - Nhân viên
 */
export enum DeliveryServiceProviderType {
  INTERNAL_SHIPPER = "internal_shipper",
  EXTERNAL_SHIPPER = "external_shipper",
  EXTERNAL_SERVICE = "external_service",
  NONE = "none",
  PICK_UP = "pick_up",
  RETAIL = "retail",
  ECOMMERCE = "ecommerce",
  EMPLOYEE = "employee",
}

export interface ShippingState {
  clients: ClientsResponse | null;
  deliveryServiceProviders: DeliveryServiceProvider[] | null;
  inventoryMappings: InventoryMapping[] | null;
  ghtkInventories: GhtkInventory[] | null;
  sapoExpressInventories: SapoExpressInventory[] | null;
  vtpInventories: VtpInventory[] | null;
  ghnInventories: GhnInventory[] | null;
}

//region inventory
export interface InventoryMapping {
  id?: number;
  store_id?: number;
  inventory_id: number;
  location_id: number;
  provider: ShippingProvider;
}
export type InventoryMappingRequest = {
  location_id: number;
  inventory_id: number;
};
export interface InventoryMappingsResponse {
  data: InventoryMapping[];
}
export interface GhtkInventory {
  address: string;
  pick_address_id: number;
  pick_tel: string;
  pick_name: string;
}
export interface GhtkInventoriesResponse {
  data: GhtkInventory[];
}
export interface VtpInventory {
  group_address_id: number;
  cus_id: number;
  name: string;
  phone: string;
  address: string;
  province_id: number;
  district_id: number;
  ward_id: number;
}
export interface VtpInventoriesResponse {
  data: VtpInventory[];
}
export interface GhnInventory {
  id: number;
  name: string;
  phone: string;
  address: string;
  ward_code: string;
  district_id: number;
  client_id: number;
  bank_account_id: number;
  status: number;
}
export interface GhnInventoriesResponse {
  data: GhnInventory[];
}
export interface SapoExpressInventory {
  id: number;
  name: string;
  phone_number: string;
  domain: string;
  city_name: string;
  district_name: string;
  ward_name: string;
  address: string;
}
export interface SapoExpressInventoriesResponse {
  warehouses: SapoExpressInventory[];
}
export interface SapoExpressInventoriesFilter {
  page: number;
  limit: number;
  query?: string;
}
//endregion
export interface DeliveryServiceProviderState {
  deliveryServiceProviders: DeliveryServiceProvider[] | null;
}
export type AhamovePeliasAddress = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    accuracy: string;
    region: string;
    region_gid: string;
    region_a: string;
    county: string;
    county_gid: string;
    county_a: string;
    label: string;
    distance: number;
    housenumber: string;
    street: string;
    locality: string;
    locality_gid: string;
    locality_a: string;
  };
};

export type ShippingPageState = {
  isOpenModal: ShippingModalType | null;
  code?: ShippingProvider | null;
  formData?: any;
  error: string | null;
  success: string | null;
  locations: Location[] | null;
  location_id: number | null;
  activeTab: number | null;
  updatedLocations: Location[] | null;
  triggerSubmit: boolean | null;
};

//region connect
export type SapoExpressClientRequest = {
  city?: string;
  district?: string;
  address: string;
  name: string;
  email: string;
  phone_number: string;
  financial_email: string;
  invoice_required: boolean;
  bank_account: BankAccountResponse;
  invoice_company?: InvoiceCompanyResponse;
};
export type SapoExpressActiveClientRequest = {
  allow_terms_of_use?: boolean;
} & SapoExpressClientRequest;
export type SapoExpressUpdateClientRequest = {
  allow_insurance?: boolean;
} & SapoExpressClientRequest;

export type BestExpressActiveClientRequest = {
  username: string;
  password: string;
  allow_terms_of_use?: boolean;
};
export type JntExpressActiveClientRequest = {
  cus_code?: string;
  allow_terms_of_use?: boolean;
};
export type GhnActiveClientRequest = {
  token?: string;
  allow_terms_of_use?: boolean;
};
export type GhtkActiveClientRequest = {
  email?: string;
  password?: string;
  allow_terms_of_use?: boolean;
};
export type VtpActiveClientRequest = {
  email?: string;
  password?: string;
  allow_terms_of_use?: boolean;
};
export type VnPostActiveClientRequest = {
  username?: string;
  password?: string;
  customer_code?: string;
  contract_code?: string;
  allow_terms_of_use?: boolean;
};
export type AhaMoveActiveClientRequest = {
  name: string;
  phone: string;
  email: string;
  partner?: string;
  address?: string;
  feature?: AhamovePeliasAddress;
  allow_terms_of_use?: boolean;
};
export type ShopeeXpressActiveClientRequest = {
  user_id?: number;
  user_secret?: string;
  allow_terms_of_use?: boolean;
};
export type GrabExpressActiveClientRequest = {
  name: string;
  email: string;
  phone: string;
  allow_terms_of_use?: boolean;
};
//endregion

export type SapoExpressBank = {
  bank_code: string;
  bank_name: string;
};

export type SapoExpressBankBranch = {
  bank_name: string;
  bank_code: string;
  branch_name: string;
  branch_code: string;
  city_name: string;
  city_code: string;
};

export interface EstimateFeeShippingAddress {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  id?: number;
  address1: string;
  address2?: string | null;
  ward: string;
  ward_code: string;
  district: string;
  district_code: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  zip?: string | null;
}

export type ArrayElement<ArrayType extends ReadonlyArray<unknown>> = ArrayType extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never;
/**
 * @return NOT_CONNECTED: chưa kết nối
 * @return CONNECTING: đang kết nối
 * @return DISCONNECT: không kết nối
 * @return EXPIRED: hết hạn kết nối
 * @return LOCKED_CONNECTED: đã kết nối & bị chặn (SE)
 * @return LOCKED_DISCONNECT: chưa kết nối & bị chặn (SE)
 */
export enum ConnectStatus {
  NOT_CONNECTED = "NOT_CONNECTED",
  CONNECTING = "CONNECTING",
  DISCONNECT = "DISCONNECT",
  EXPIRED = "EXPIRED",
  LOCKED_CONNECTED = "LOCKED_CONNECTED",
  LOCKED_DISCONNECT = "LOCKED_DISCONNECT",
}
export interface EstimateFeeInfoType {
  location_id?: number;
  pickup_city?: string;
  pickup_city_code?: string;
  pickup_district?: string;
  pickup_district_code?: string;
  pickup_ward?: string;
  pickup_ward_code?: string;
  pickup_address?: string;
  pickup_name?: string;
  pickup_phone?: string;
  /**shipping address */
  customer_id?: number;
  shipping_id?: number;
  shipping_country?: string;
  shipping_country_code?: string;
  shipping_city?: string;
  shipping_city_code?: string;
  shipping_district?: string;
  shipping_district_code?: string;
  shipping_ward?: string;
  shipping_ward_code?: string;
  shipping_address?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone?: string;
  shipping_email?: string;
  shipping_zip_code?: string;
  /**package info */
  weight?: number;
  weight_type?: "kg" | "g";
  length?: number;
  width?: number;
  height?: number;
  /**fee info */
  cod?: number;
  package_value?: number;
  /**other info */
  delivery_request?: string;
  note?: string;
  notify_customer?: boolean;
  /**order info */
  order_id?: number;
  fulfillment_order_id?: number;
  total_item?: number;
  /** currencySymbol */
  currency_symbol?: string;
  currency?: string;
}
export interface DeliveryProviderType {
  id?: number;
  code: ShippingProvider;
  name: string;
  logo: string;
  miniLogo?: string;
  connect: ConnectStatus;
  isShowFull?: boolean;
  serviceShowMax: number;
}
export interface ServiceFeeType {
  id: string;
  name: string;
  initialFee: number;
  finalFee: number;
  expectedDeliveryTime?: number;
  expectedDeliveryTimeTxt?: string;
  disable?: boolean;
}
export interface SEServiceFeeType extends ServiceFeeType {
  SEserviceProvider: SEProviderCode;
  tags?: string[] | null;
  freeInsuranceValue?: number;
}
export interface DeliveryServiceType {
  services?: ServiceFeeType[] | null;
  code: ArrayElement<typeof SupportPartner> | string;
  isLoading?: boolean;
  errors?: ErrorResponse[] | null;
}

export type SelectedService = {
  code: string;
  service?: ServiceFeeType;
};

export interface DeliveryServiceState {
  deliveryServices: DeliveryServiceType[] | null;
  formDetailService:
    | {
        [key in ShippingProvider]?: {
          [key: string]: any;
          errors?: ErrorResponse[] | null;
        };
      }
    | null;
  internalShipperFormService: {
    provider?: DeliveryServiceProvider;
    data: {
      freightPayer?: FreightPayer;
      fee?: number;
      deliveryMethod?: DeliveryMethod;
      trackingNumber?: string;
    };
  } | null;
  isLoading: boolean;
}
export interface FastestAndCheapestServiceType extends SelectedService {
  isFastest?: boolean;
  isCheapest?: boolean;
}
export interface SelectedServiceState {
  selectedService: SelectedService | null;
  warnings?: { key: string; label: string; priority: number }[] | null;
  isNotAllowFormDetail?: boolean;
  isChoreService?: {
    code: string;
    name: string;
    fee: number;
  } | null;
}

export interface DeliveryProviderState {
  deliveryProviders: DeliveryProviderType[] | null;
}
export interface DeliveryServiceFilterState {
  baseFilter?: EstimateFeeInfoType | null;
}

export interface EstimateFeeMetadataState {
  metadata:
    | {
        [key in ShippingProvider]?: {
          [key: string]: any;
        };
      }
    | null;
}
export interface ErrorResponse {
  field: string;
  message: string;
  code?: string;
}
//region estimate fee request
export interface BaseEstimateFeeRequest {
  type?: ShippingProvider;
  location_id: number;
  pickup_city: string;
  pickup_district: string;
  pickup_ward: string;
  pickup_address: string;
  shipping_country?: string;
  shipping_country_code?: string;
  shipping_city: string;
  shipping_city_code?: string;
  shipping_district: string;
  shipping_district_code?: string;
  shipping_ward: string;
  shipping_ward_code?: string;
  shipping_address: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone?: string;
  weight: number;
  weight_type?: "kg" | "g";
  width: number;
  height: number;
  length: number;
  cod?: number;
  insurance?: number;
  metadata?: ShipmentBulkCreateItem["metadata"];
  total_item?: number;
  currency?: string;
}

export type SapoExpressEstimateFeeRequest = {
  type: ShippingProvider.SAPO_EXPRESS;
  pickup_work_shift: SapoExpressWorkShift;
  shipping_work_shift: SapoExpressWorkShift;
  charge_type: SapoExpressChargeType;
  discount_codes?: string[];
} & BaseEstimateFeeRequest;
export enum SapoExpressChargeType {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}
export enum SapoExpressWorkShift {
  DEFAULT_WORK_SHIFT = "DEFAULT_WORK_SHIFT",
  EVENING = "EVENING",
}
export interface GhtkEstimateFeeRequest extends BaseEstimateFeeRequest {
  type: ShippingProvider.GHTK;
  location_id: number;
  inventory_id: number;
  freight_payer: FreightPayer;
  insurance: number;
  fragile_product?: boolean;
  co_inspection?: boolean;
  double_check?: boolean;
  original_box?: boolean;
  part_sign_pick_product?: boolean;
  part_sign_exchange?: boolean;
  letter_document?: boolean;
  transport?: Transport;
}
export interface BestExpressEstimateFeeRequest extends BaseEstimateFeeRequest {
  type: ShippingProvider.BEST_EXPRESS;
  discount_code?: string;
}
export interface AhamoveEstimateFeeRequest extends BaseEstimateFeeRequest {
  shipping_info?: {
    geometry: {
      type: string;
      coordinates: number[];
    };
  };
  discount_code?: string;
  thermal_bag_option?: boolean;
  bulky?: boolean;
  allow_insurance?: boolean;
  insurance?: number;
  round_trip?: boolean;
  fragile?: boolean;
}

export interface VtpEstimateFeeRequest extends BaseEstimateFeeRequest {
  inventory_id: number;
  inventory_city_id: number;
  inventory_district_id: number;
  inventory_ward_id: number;
  extra_services: string[];
  insurance: number;
  //Không ảnh hưởng đến phí vận chuyển
  freight_payer?: FreightPayer;
  service_code?: string;
}
export interface JntExpressEstimateFeeRequest extends BaseEstimateFeeRequest {
  insurance: number;
}
export interface GhnEstimateFeeRequest extends BaseEstimateFeeRequest {
  inventory_id: number;
  inventory_district_id: number;
  coupon?: string;
}
export type VnpostEstimateFeeRequest = {
  total_item: number;
  vehicle: "BO" | "BAY";
  use_bao_phat: boolean;
  co_inspection: boolean;
  use_invoice: boolean;
  storage: boolean;
  partial_delivery: boolean;
  partial_return_delivery: boolean;
  cancellation_fee: boolean;
  receiver_pay_freight: boolean;
  cancellation_fee_value: number;
  insurance: number;
} & BaseEstimateFeeRequest;

export type ShopeeXpressEstimateFeeRequest = {
  freight_payer?: FreightPayer;
  product_name?: string;
  voucher_code?: string;
} & BaseEstimateFeeRequest;

export type GrabExpressEstimateFeeRequest = {
  service_type?: "SAME_DAY" | "INSTANT";
  total_item: number;
  /**
   * @deprecated
   */
  payment_method?: "CASH" | "CASHLESS";
  discount_code?: string;
} & BaseEstimateFeeRequest;
//endregion

//region estimate fee response
export interface SapoEstimateFeeResponse {
  tags: string[];
  delivery_service_provider: SEProviderCode;
  delivery_service_code: string;
  delivery_service_title: string;
  estimated_delivery_fee: number;
  original_delivery_fee: number;
  original_pickup_plan: string;
  pick_shifts: null;
  expected_delivery_time: string;
  expected_delivery_time_in_hours: number;
  fees: SapoExpressFee[];
  discounts: {
    estimated_delivery_fee: number;
  }[];
  free_insurance_value: number;
}
export interface SapoExpressFee {
  amount: number;
  charge_type: string;
  delivery_fee_type: string;
}
export interface SapoExpressEstimateFeesResponse {
  sapo_express_estimate_fees: SapoEstimateFeeResponse[];
}
export interface GhtkEstimateFeeResponse {
  name: string;
  fee: number;
  insurance_fee: number;
  delivery_type: string;
  expected_delivery_time_text: string;
  expected_delivery_time: number;
  ext_fees: GhtkExtFee[];
  ship_fee_only: number;
  service_name: string;
  service_code: string;
}
export interface GhtkExtFee {
  display: string;
  title: string;
  amount: number;
  type: string;
}
export interface AhamoveEstimateFeeResponse {
  service_code: string;
  service_name: string;
  description: string;
  amount: number;
  partner_discount: number;
  partner_fee: number;
  partner_pay: number;
  commission_type: string;
  commission_value?: number;
  cod: number;
  max_cod: number;
  duration: number;
  fee_description: string;
  opening_hours: null;
  icon_url: string;
  map_icon_url: string;
  expected_delivery_time_text: string;
  expected_delivery_time: number;
  requests: AhamoveRequest[];
}
export interface AhamoveRequest {
  name: string;
  _id: string;
  service_id: string;
  name_vi_vn: string;
  tier_list: AhamoveTier[];
}
export type AhamoveTier = {
  code?: string;
  description_vi_vn?: string;
  name_vi_vn?: string;
  price_description_vi_vn?: string;
  price?: number;
  label?: string;
  value?: string;
};
export interface VtpEstimateFeeResponse {
  fee: number;
  expected_delivery_time_text: string;
  expected_delivery_time: number;
  service_name: string;
  service_code: string;
}
export interface JntExpressEstimateFeeResponse {
  total_fee: number;
  service_name: string;
  service_code: string;
}
export interface GhnEstimateFeeResponse {
  fee: number;
  expected_delivery_time_text: string;
  expected_delivery_time: number;
  service_name: string;
  service_code: string;
  discount_fee: number;
  insurance_fee: number;
  service_type_id: number;
}

export interface BestExpressEstimateFeeResponse {
  service_id: string;
  service_name: string;
  initial_fee: number;
  final_fee: number;
  expected_delivery_time: number;
}
export interface VnpostEstimateFeeResponse {
  total_fee: number;
  service_name: string;
  service_code: string;
}
export type ShopeeXpressEstimateFeeResponse = {
  service_id: string;
  service_name: string;
  final_fee: number;
  initial_fee: number;
};
//endregion

//region metadata
export interface SapoExpressFromMetadata {
  service?:
    | (ServiceFeeType & {
        provider_code?: SEProviderCode;
        discounts?: any[];
      })
    | null;
  pickupType?: PickupType;
  partialReturn?: boolean;
  allowInsurance?: boolean;
  insurance?: number;
  pickShift?: GhnPickShift | null;
  pickStation?: GhnStation | null;
  spxPickupTime?: ShopeeXpressPickupTime;
  promoCode?: string;
}
export type SapoExpressMetadata = {
  shipping_provider: string;
  shipping_service_code: string;
  detail: any;
  promotion_code?: string;
};
export interface ShopeeXpressPickupTime {
  id?: string;
  range_id: number;
  time_range: string;
  date: string;
  pickup_time: number;
}
export type ShopeeXpressVoucher = {
  voucher_code: string;
  voucher_name: string;
};
export interface GhtkFormMetadata {
  service?: ServiceFeeType | null;
  inventory?: GhtkInventory;
  transport?: Transport; //phương tiện vc road-bộ,fly-bay
  pickDate?: Date | null; //hẹn ngày lấy hàng YYYY/MM/DD
  pickWorkShift?: WorkShift; //0,1-sáng,2-chiều,3-tối  hẹn ca lấy hàng
  deliveryWorkShift?: WorkShift; //0,1-sáng,2-chiều,3-tối  dự kiến ca giao hàng
  pickOption?: boolean;
  freightPayer?: FreightPayer; //ng trả phí customer, shop
  insurance?: number; //giá trị hàng hóa
  returnAddress?: ReturnAddress | null; //địa chỉ trả hàng
  addressDetail?: string | null; //địa chỉ chi tiết
  allowInsurance?: boolean; //khai giá hàng hóa
  fragileProduct?: boolean;
  coInspection?: boolean;
  doubleCheck?: boolean;
  originalBox?: boolean;
  partSignPickProduct?: boolean;
  partSignExchange?: boolean;
  letterDocument?: boolean;
  collectCancellationMoney?: boolean;
  notDeliveredFee?: number; //phí trả hàng
}
export type GhtkMetadata = {
  inventory: GhtkInventory;
  pick_date: string;
  transport: Transport;
  pick_option: boolean;
  pick_work_shift?: WorkShift;
  delivery_work_shift?: WorkShift;
  freight_payer: FreightPayer;
  allow_insurance: boolean;
  insurance: number;
  return_address?: ReturnAddress;
  address_detail?: string;
  fragile_product?: boolean;
  co_inspection?: boolean;
  double_check?: boolean;
  original_box?: boolean;
  part_sign_pick_product?: boolean;
  part_sign_exchange?: boolean;
  letter_document?: boolean;
  not_delivered_fee?: number;
  collect_cancellation_money?: boolean;
};
export interface GhnFormMetadata {
  service?: ServiceFeeType & {
    serviceTypeId: number;
  };
  inventory?: GhnInventory;
  returnAddress?: ReturnAddress | null;
  pickupType?: PickupType;
  allowInsurance?: boolean;
  insurance?: number;
  pickShift?: GhnPickShift | null;
  pickStation?: GhnStation | null;
  freightPayer?: FreightPayer;
  coupon?: string;
  partialReturn?: boolean;
}
export type GhnMetadata = {
  shop_id: number;
  service_id: number;
  service_type_id?: number;
  pickup_type: PickupType;
  pick_shifts?: GhnPickShift[] | null;
  pick_station_id?: number | null;
  coupon?: string;
  freight_payer: FreightPayer;
  partial_return?: boolean;
};
export type VnPostFormMetadata = {
  service?: ServiceFeeType | null;
  useBaoPhat?: boolean; //sử dụng dv báo phát
  receiverPayFreight?: boolean; // cộng cước vào tiền thu hộ
  allowInsurance?: boolean; //khai giá hàng hóa
  insurance?: number; //giá trị khai giá
  pickupType?: PickupType;
  cancellationFee?: boolean;
  coInspection?: boolean;
  partialDelivery?: boolean;
  partialReturnDelivery?: boolean;
  storage?: boolean;
  useInvoice?: boolean;
  isBroken?: boolean;
  vehicle?: "BO" | "BAY";
  deliveryTime?: "S" | "C" | "N";
  cancellationFeeValue?: number;
};
export type VnPostMetadata = {
  use_bao_phat: boolean;
  receiver_pay_freight: boolean;
  allow_insurance: boolean;
  insurance: number;
  pickup_type: PickupType;
  cancellation_fee: boolean;
  co_inspection: boolean;
  partial_delivery: boolean;
  partial_return_delivery: boolean;
  storage: boolean;
  use_invoice: boolean;
  is_broken: boolean;
  vehicle: "BO" | "BAY";
  delivery_time: "S" | "C" | "N";
  cancellation_fee_value: number;
};
export interface ViettelPostFormMetadata {
  service?: ServiceFeeType;
  inventory?: VtpInventory;
  extraServices?: string[];
  freightPayer?: FreightPayer;
  discountCode?: string;
  listExtraServices?: ViettelPostExtraService[];
  extraMoney?: number;
  insurance?: number;
}
export type ViettelPostMetadata = {
  inventory: VtpInventory;
  extra_services: string;
  promo_code?: string;
  freight_payer: FreightPayer;
  extra_money?: number;
};
export interface JntExpressFormMetadata {
  service?: ServiceFeeType;
  allowInsurance?: boolean;
  serviceType?: boolean;
  insurance?: number;
  partSign?: boolean;
  payType?: "CC_CASH" | "PP_CASH" | "PP_PM";
}
export type JntExpressMetadata = {
  part_sign?: boolean;
  pay_type?: JntExpressFormMetadata["payType"];
  service_type?: boolean;
  allow_insurance?: boolean;
};
export interface AhamoveFormMetadata {
  service?: ServiceFeeType & {
    tierList?: AhamoveTier[] | null;
    requests?: AhamoveRequest[] | null;
  };
  tier?: AhamoveTier | null;
  shippingInfo?: AhamovePeliasAddress;
  paymentMethod?: "BALANCE" | "CASH";
  thermalBagOption?: boolean;
  allowInsurance?: boolean;
  insurance?: number;
  bulky?: boolean;
  discountCode?: string;
  roundTrip?: boolean;
  freightPayer?: FreightPayer;
  fragile?: boolean;
}
export type AhamoveMetadata = {
  thermal_bag_option?: boolean;
  payment_method?: "BALANCE" | "CASH";
  allow_insurance?: boolean;
  receiver_lat?: number;
  receiver_lng?: number;
  promo_code?: string;
  tier?: AhamoveTier;
  round_trip?: boolean;
  freight_payer?: FreightPayer;
  fragile?: boolean;
};
export interface BestExpressFormMetadata {
  service?: ServiceFeeType;
  insurance?: number;
  discountCode?: string;
  allowInsurance?: boolean;
  pickupType?: PickupType;
}
export type BestExpressMetadata = {
  insurance?: number;
  discount_code?: string;
  allow_insurance?: boolean;
  pickup_type?: PickupType;
};
export type ShopeeXpressFormMetadata = {
  service?: ServiceFeeType;
  insurance?: number;
  freightPayer?: FreightPayer;
  pickupTime?: ShopeeXpressPickupTime;
  voucherCode?: string;
};
export type ShopeeXpressMetadata = {
  insurance?: number;
  freight_payer?: FreightPayer;
  range_id?: number;
  pickup_time?: number;
  voucher_code?: string;
};
export type GrabExpressFormMetadata = {
  service?: ServiceFeeType;
  insurance?: number;
  /**
   * @deprecated
   */
  paymentMethod?: "CASH" | "CASHLESS";
  serviceType?: "SAME_DAY" | "INSTANT";
  discountCode?: string;
  freightPayer?: FreightPayer;
};
export type GrabExpressMetadata = {
  insurance?: number;
  /**
   * @deprecated
   */
  payment_method?: GrabExpressFormMetadata["paymentMethod"];
  service_type?: GrabExpressFormMetadata["serviceType"];
  discount_code?: string;
};
//endregion
export interface ReturnAddress {
  id: number;
  provider?: ShippingProvider;
  name: string;
  phone: string;
  cityName: string;
  districtName: string;
  wardName: string;
  address: string;
}
export type WardResponse = {
  id: number;
  name: string;
  city: string;
  city_id: number;
  district: string;
  district_id: number;
};
export type CityDistrict = {
  id: string;
  district_id: number;
  city_id: number;
  city_name: string;
  district_name: string;
};
export interface ServiceWarning {
  key: string;
  label: string;
  priority: number;
}

export interface GhtkState {
  addressDetail: { value: string; label: string }[] | null;
}
export interface SapoExpressState {
  pickShifts: GhnPickShift[] | null;
  ghnStations: GhnStation[] | null;
  spxPickupTimes: SpxPickupTime[] | null;
}
export interface GhnState {
  pickShifts: GhnPickShift[] | null;
  stations: GhnStation[] | null;
}
export interface AhamoveState {
  shippingInfo: AhamovePeliasAddress[] | null;
  isLoadingShippingInfo: boolean;
}
export interface GhnPickShift {
  id: number;
  title: string;
}

export interface GhtkAddressDetailFilter {
  address: string;
  city_name: string;
  district_name: string;
  ward_name: string;
}
export interface GhtkAddressLevel4 {
  data: string[];
}
export interface GHTKExtraService {
  value: string;
  label: string;
  isSelected?: boolean;
  tooltip?: string;
}
export interface GhnStationFilter {
  city_name?: string;
  district_name?: string;
  ghn_district_id?: number;
}
export interface GhnStation {
  address: string;
  location_code: string;
  location_id: number;
  location_name: string;
  parent_location: string[];
  email: string;
  latitude: number;
  longitude: number;
}
export interface SpxPickupTime {
  id: string;
  range_id: number;
  date: string;
  pickup_time: number;
  time_range: string;
}
export interface ShopeeXpressResponse {
  pickup_times: SpxPickupTime[];
}
export interface ViettelPostExtraService {
  service_code: string;
  service_name: string;
  description: string | null;
}
export interface ViettelPostExtraServicesResponse {
  data: ViettelPostExtraService[];
}

export type EstimateFeeModalState = {
  // dataInfo: EstimateFeeInfoType;
  dataInfoTemp: EstimateFeeInfoType | null;
  isOpenModal: string | null;
  customer_id: number | null;
  customer_address_id: number | null;
  error: string | null;
  success: string | null;
  triggerShippingAddress: EstimateFeeShippingAddress | null;
  locations: (Location & CustomOption)[];
  defaultShippingAddress: (MailingAddress & { id: number }) | null;
  isFocusInput?: boolean;
  baseFilter?: EstimateFeeInfoType | null;
  filter?: BaseEstimateFeeRequest | null;
};

export interface EstimateFeeRequest {
  fulfillment_order_id?: number;
  line_items?: OrderLineItem[];
  notify_customer?: boolean;
  pickup_address?: Location;
  shipping_info?: ShippingInfo;
  shipping_address: MailingAddress & {
    id?: number;
  };
  service?: string | ShippingProvider;
  delivery_method?: DeliveryMethod;
  sales_channel?: string;
  customer_id?: number;
  customer_mail?: string;
  total_outstanding?: number;
  order_id?: number;
}
/**
 * @typedef {string} DeliveryMethod
 * @enum {string}
 * @property {string} INTERNAL_SHIPPER - giao hàng qua Ship ngoài
 * @property {string} EXTERNAL_SHIPPER - giao hàng qua Shipper ngoài
 * @property {string} EXTERNAL_SERVICE - giao hàng qua Đối tác vận chuyển tích hợp
 * @property {string} OUTSIDE_SHIPPER - giao hàng qua Đối tác vận chuyển ngoài
 * @property {string} NONE - fulfillment chưa xác định hình thức giao hàng, hoặc không yêu cầu vận chuyển
 * @property {string} PICK_UP - lấy hàng tại cửa hàng
 * @property {string} RETAIL - bán tại cửa hàng bán lẻ
 * @property {string} ECOMMERCE - Sàn
 * @property {string} EMPLOYEE - Nhân viên
 */
export enum DeliveryMethod {
  EXTERNAL_SERVICE = "external_service",
  EXTERNAL_SHIPPER = "external_shipper",
  /**
   * @deprecated
   * @description use EXTERNAL_SHIPPER instead
   */
  INTERNAL_SHIPPER = "internal_shipper",
  OUTSIDE_SHIPPER = "outside_shipper",
  NONE = "none",
  PICK_UP = "pick_up",
  RETAIL = "retail",
  ECOMMERCE = "ecommerce",
  EMPLOYEE = "employee",
}

export interface ShippingInfo {
  carrier_code?: string;
  carrier_name?: string;
  service_code?: string | number;
  service_name?: string;
  service_fee?: number;
  cod_amount?: number;
  insurance_value?: number;
  freight_payer?: string;
  note?: string;
  metadata?: any;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  requirement?: number;
}

export interface EstimateFeeShippingAddress {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  id?: number;
  address1: string;
  address2?: string | null;
  ward: string;
  ward_code: string;
  district: string;
  district_code: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  zip?: string | null;
}

export type ShippingRequest = {
  fulfillment_order_id: number;
  send_notification: boolean;
  estimated_delivery_on?: string;
  delivery_method: DeliveryMethod;
  shipping_info: ShippingInfo;
  pickup_address: Location & {
    location_id: number;
  };
  shipping_address: MailingAddress & unknown;
  fulfillment_order_line_items?: {
    id: number;
    quantity: number;
  }[];
  note: string;
  tracking_info?: {
    carrier?: string;
    carrier_name?: string;
    service?: string | number;
    service_name?: string;
    tracking_number?: string;
  };
};

export type SpxBatchLabelRequest = {
  tracking_nos: string[];
};

export interface SpxBatchLabelResponse {
  awb_link?: string;
  fail_list?: {
    rest_code: number;
    message: string;
    tracking_no: string;
  }[];
}
//region shippment bulk action
export interface ShipmentEstimateFeeRequest extends BaseEstimateFeeRequest {
  order_id: number;
  fulfillment_order_id: number;
  total_item_load?: number;
  line_items?: OrderLineItem[];
}
export type ShipmentBulkFeeResult = {
  service?: ServiceFeeType;
  errors?: any;
  input?: ShipmentEstimateFeeRequest;
  data?: ServiceFeeType[];
};
//endregion

export type CalculateShippingRateRequest = {
  location_id: number;
  shipping_province_id: number;
};

export type CalculateFeeRequest = {
  location_id: number;
  destination: {
    country: string;
    country_code: string;
    province: string;
    province_code: string;
    district: string;
    district_code: string;
    ward: string;
    ward_code: string;
    address1: string;
    address2?: string;
    name: string;
    phone: string;
    email?: string;
  };
  total_weight: number;
  items: OrderLineItem[];
  shipping_rate_type?: "carrier" | "customized";
  total_price: number;
};

export type CalculateFeeResponse = {
  customized_shipping_rates: { alias: string; price: number; title: string }[];
};
/**type của address dùng cho các modal shipping - giữ nguyên của team fulfillment ko sửa gì thêm */
export type StateMaillingAddress = {
  country?: string;
  countryCode?: string;
  province?: string;
  provinceCode?: string;
  district?: string;
  districtCode?: string;
  ward?: string;
  wardCode?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

//MARK: Discount SE
export type SapoExpressPromotion = {
  title: number;
  discount_code: string;
  discount_value: number;
  shipping_providers: SEProviderCode[];
  starts_on: string;
  ends_on: string;
  discount_type: "FIX_AMOUNT" | "PERCENTAGE" | "PARITY";
  usage_limit_per_domain: number;
  discount_maximum_amount?: number;
};
