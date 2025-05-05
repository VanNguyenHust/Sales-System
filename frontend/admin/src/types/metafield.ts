import { PaginationFilter } from "./common";
import { BaseSearchFilter } from "./order";

export type MetafieldRequest = {
  id?: number;
  description?: string;
  key?: string;
  namespace?: string;
  owner_id?: number;
  owner_name: string;
  owner_resource: string;
  value?: string;
  value_type?: MetafieldDefinitionType | "string" | "integer";
};

export type Metafield = {
  id: number;
  store_id: number;
  description?: string;
  key: string;
  namespace: string;
  owner_resource: string;
  owner_id: number;
  owner_name: string;
  value: string;
  value_type: MetafieldDefinitionType;
  error_message?: string;
};

export type MetafieldFilterRequest = BaseSearchFilter & {
  since_id?: number;
  created_on_max?: string;
  created_on_min?: string;
  modified_on_max?: string;
  modified_on_min?: string;
  namespace?: string;
  key?: string;
  value_type?: string;
};

export type MetafieldDefinitionAppliedResponse = {
  metafield_definition: MetafieldDefinitionResponse;
  metafield?: Metafield;
};

export type MetafieldDefinitionAppliedFilter = PaginationFilter & {
  owner_resource: MetafieldDefinitionOwnerResource;
  resource_id?: number;
  pin?: boolean;
  sort_key?: "id" | "pinned_position";
};

export type MetafieldUnstructuredResponse = Metafield & {
  count: number;
};

export type MetafieldFilterBulkEditRequest = {
  key: string;
  namespace: string;
  resource_ids: number[];
  owner_resource: MetafieldDefinitionOwnerResource;
};

/* enum */
export enum MetafieldDefinitionOwnerResource {
  PRODUCT = "product",
  VARIANT = "variant",
  COLLECTION = "collection",
  ORDER = "order",
  CUSTOMER = "customer",
}

export enum MetafieldDefinitionType {
  BOOLEAN = "boolean",
  COLOR = "color",
  DATE = "date",
  DATE_TIME = "date_time",
  DIMENSION = "dimension",
  JSON = "json",
  MONEY = "money",
  MULTI_LINE_TEXT_FIELD = "multi_line_text_field",
  NUMBER_DECIMAL = "number_decimal",
  NUMBER_INTEGER = "number_integer",
  RATING = "rating",
  RICH_TEXT_FIELD = "rich_text_field",
  SINGLE_LINE_TEXT_FIELD = "single_line_text_field",
  URL = "url",
  VOLUME = "volume",
  WEIGHT = "weight",
  COLLECTION_REFERENCE = "collection_reference",
  FILE_REFERENCE = "file_reference",
  PAGE_REFERENCE = "page_reference",
  PRODUCT_REFERENCE = "product_reference",
  VARIANT_REFERENCE = "variant_reference",

  LIST_COLOR = "list.color",
  LIST_DATE = "list.date",
  LIST_DATE_TIME = "list.date_time",
  LIST_DIMENSION = "list.dimension",
  LIST_NUMBER_DECIMAL = "list.number_decimal",
  LIST_NUMBER_INTEGER = "list.number_integer",
  LIST_RATING = "list.rating",
  LIST_SINGLE_LINE_TEXT_FIELD = "list.single_line_text_field",
  LIST_URL = "list.url",
  LIST_VOLUME = "list.volume",
  LIST_WEIGHT = "list.weight",
  LIST_COLLECTION_REFERENCE = "list.collection_reference",
  LIST_FILE_REFERENCE = "list.file_reference",
  LIST_PAGE_REFERENCE = "list.page_reference",
  LIST_PRODUCT_REFERENCE = "list.product_reference",
  LIST_VARIANT_REFERENCE = "list.variant_reference",
}

export enum MetafieldDefinitionValidationStatus {
  ALL_VALID = "all_valid",
  IN_PROGRESS = "in_progress",
  SOME_INVALID = "some_invalid",
}

export enum MetafieldDefinitionValidationName {
  MIN = "min",
  MAX = "max",
  LIST_MIN = "list.min",
  LIST_MAX = "list.max",
  MAX_PRECISION = "max_precision",
  SCHEMA = "schema",
  FILE_TYPE_OPTIONS = "file_type_options",
  ALLOWED_DOMAINS = "allowed_domains",
  CHOICES = "choices",
  REGEX = "regex",
}

export enum MetafieldDefinitionDimensionUnit {
  CM = "cm",
  IN = "in",
  FT = "ft",
  YD = "yd",
  MM = "mm",
  M = "m",
  KM = "km",
}

export enum MetafieldDefinitionVolumeUnit {
  ML = "ml",
  CL = "cl",
  L = "l",
  M3 = "m3",
  OZ = "oz",
  QT = "qt",
  PT = "pt",
  GAL = "gal",
}

export enum MetafieldDefinitionWeightUnit {
  KG = "kg",
  G = "g",
  LB = "lb",
  OZ = "oz",
}

export type MetafieldDefinitionUnit =
  | MetafieldDefinitionDimensionUnit
  | MetafieldDefinitionVolumeUnit
  | MetafieldDefinitionWeightUnit;

export enum MetafieldDefinitionTypeFilter {
  LIST_CHOICE_FILTER = "list_choice_filter",
  PAGINATED_LIST_CHOICE_FILTER = "paginated_list_choice_filter",
}

export type MetafieldJsonObject = {
  value?: number | string;
  min?: number;
  max?: number;
  unit?: MetafieldDefinitionUnit;
  amount?: number | string;
  currency_code?: string;
};
/*=====================*/

/* Response */
export type MetafieldDefinitionCountResponse = {
  owner_resource: MetafieldDefinitionOwnerResource;
  count: number;
};

export type MetafieldDefinitionResponse = {
  id: number;
  name: string;
  key: string;
  description: string;
  namespace: string;
  type: MetafieldDefinitionType;
  owner_resource: MetafieldDefinitionOwnerResource;
  pinned_position?: number;
  standard_template_id?: number;
  use_as_collection_condition?: boolean;
  use_as_admin_filter?: boolean;
  visible_to_storefront_api?: boolean;
  validation_status: MetafieldDefinitionValidationStatus;
  pin: boolean;
  validations?: MetafieldDefinitionValidation[];
  created_on: string;
  modified_on?: string;
  metafields_count?: number;
  invalid_metafields_count?: number;
};

export type MetafieldDefinitionMeasureValidation = {
  value?: number;
  unit: MetafieldDefinitionUnit;
};

export type MetafieldDefinitionValidation = {
  name: MetafieldDefinitionValidationName;
  value?: string | string[] | number | number[];
};

export type MetafieldDefinitionFilterValue = {
  definition_id: number;
  type: MetafieldDefinitionType;
  filter_param: string;
  owner_resource: MetafieldDefinitionOwnerResource;
  allow_multiple: boolean;
  name: string;
  type_filter: MetafieldDefinitionTypeFilter;
  namespace: string;
  key: string;
};

export type MetafieldDefitionFilterChoiceItem = {
  display_name: string;
  filter_value: string;
};

export type MetafieldDefinitionFilterChoices = {
  id: number;
  filter_param: string;
  namespace: string;
  key: string;
  paginated_choices?: {
    list_choices: MetafieldDefitionFilterChoiceItem[];
    total_count: number;
  };
  unpaginated_choices?: {
    list_choices: MetafieldDefitionFilterChoiceItem[];
  };
};

export type MetafieldDefinitionChoiceFiltersResponse = {
  filter: MetafieldDefinitionFilterValue;
  choices: MetafieldDefinitionFilterChoices;
};

/*===================*/

/* Request */
export type MetafieldDefinitionRequest = {
  name: string;
  key: string;
  description: string;
  namespace: string;
  namespace_key?: string;
  type?: MetafieldDefinitionType;
  owner_resource: MetafieldDefinitionOwnerResource;
  use_as_collection_condition?: boolean;
  use_as_admin_filter?: boolean;
  visible_to_storefront_api?: boolean;
  pin: boolean;
  validations: MetafieldDefinitionValidation[];
};

export interface MetafieldDefinitionFilterRequest extends PaginationFilter {
  owner_resource?: MetafieldDefinitionOwnerResource;
  sort_key?: "id" | "pinned_position";
}

export type MetafieldDefinitionPositionRequest = {
  id: number;
  position: number;
};

export type MetafieldDefinitionDeleteRequest = {
  id: number;
  delete_all_associated_metafields: boolean;
};

export interface MetafieldDefinitionFilterChoiceRequest extends PaginationFilter {
  query?: string;
  definition_id: number;
}

export type MetafieldDefinitionChoiceFiltersRequest = {
  owner_resource: MetafieldDefinitionOwnerResource;
  queries: {
    key: string;
    value: string;
  }[];
};
/*===================*/
