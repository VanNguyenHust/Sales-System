import {
  CalendarOutlined,
  FileTextOutlined,
  NumberOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import { PaginationFilter } from "./common";
import { MetafieldRules } from "@/features/store/type";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@/constants/datetime";
import { isValid, parseISO } from "date-fns";

export type MetafieldDefinitionResponse = {
  id: number;
  name: string;
  key: string;
  description: string;
  namespace: string;
  type: MetafieldDefinitionType;
  ownerResource: MetafieldDefinitionOwnerResource;
  pinnedPosition?: number;
  standardTemplateId?: number;
  validationStatus: MetafieldDefinitionValidationStatus;
  pin: boolean;
  validations?: MetafieldDefinitionValidation[];
  createdOn: string;
  modifiedOn?: string;
  metafieldsCount?: number;
  invalidMetafieldsCount?: number;
};

export type MetafieldDefinitionRequest = {
  name: string;
  key: string;
  description: string;
  namespace: string;
  namespaceKey?: string;
  type?: MetafieldDefinitionType;
  ownerResource: MetafieldDefinitionOwnerResource;
  pin: boolean;
  validations: MetafieldDefinitionValidation[];
};

export interface MetafieldDefinitionFilterRequest extends PaginationFilter {
  owner_resource?: MetafieldDefinitionOwnerResource;
  sort_key?: "id" | "pinned_position";
}

export enum MetafieldDefinitionValidationStatus {
  ALL_VALID = "all_valid",
  IN_PROGRESS = "in_progress",
  SOME_INVALID = "some_invalid",
}

export type MetafieldDefinitionValidation = {
  name: MetafieldDefinitionValidationName;
  value?: string | string[] | number | number[];
};

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

export type MetafieldDefinitionCountResponse = {
  count: number;
  ownerResource: string;
};

export enum MetafieldDefinitionType {
  BOOLEAN = "boolean",
  DATE_TIME = "date_time",
  NUMBER_DECIMAL = "number_decimal",
  SINGLE_LINE_TEXT_FIELD = "single_line_text_field",
}

export enum MetafieldDefinitionOwnerResource {
  PRODUCT = "product",
  VARIANT = "variant",
  COLLECTION = "collection",
  ORDER = "order",
  CUSTOMER = "customer",
}

export function getInfoType(type?: MetafieldDefinitionType) {
  let icon = null;
  let label = "";
  switch (type) {
    case MetafieldDefinitionType.BOOLEAN:
      label = "Đúng / Sai";
      icon = SwitcherOutlined;
      break;
    case MetafieldDefinitionType.DATE_TIME:
      label = "Ngày và giờ";
      icon = CalendarOutlined;
      break;
    case MetafieldDefinitionType.NUMBER_DECIMAL:
      label = "Số thập phân";
      icon = NumberOutlined;
      break;
    case MetafieldDefinitionType.SINGLE_LINE_TEXT_FIELD:
      label = "Văn bản một dòng";
      icon = FileTextOutlined;
      break;
  }

  return { label, icon };
}

export function buildRulesMetafieldDefinition(
  validations?: MetafieldDefinitionValidation[]
): MetafieldRules {
  return {
    formatDate: DATE_FORMAT,
    formatDateTime: DATE_TIME_FORMAT,
    min: validations?.find(
      (item) => item.name === MetafieldDefinitionValidationName.MIN
    )?.value as string,
    max: validations?.find(
      (item) => item.name === MetafieldDefinitionValidationName.MAX
    )?.value as string,
    maxPrecision: tryParseNumberWithDefault(
      validations?.find(
        (item) => item.name === MetafieldDefinitionValidationName.MAX_PRECISION
      )?.value as string
    ),
    listMin: tryParseNumberWithDefault(
      validations?.find(
        (item) => item.name === MetafieldDefinitionValidationName.LIST_MIN
      )?.value as string
    ),
    listMax: tryParseNumberWithDefault(
      validations?.find(
        (item) => item.name === MetafieldDefinitionValidationName.LIST_MAX
      )?.value as string
    ),
    regex: validations?.find(
      (item) => item.name === MetafieldDefinitionValidationName.REGEX
    )?.value as string,
    choices: tryParseJsonWithDefault(
      validations?.find(
        (item) => item.name === MetafieldDefinitionValidationName.CHOICES
      )?.value as string,
      undefined
    ) as string[],
    allowedDomains: tryParseJsonWithDefault(
      validations?.find(
        (item) =>
          item.name === MetafieldDefinitionValidationName.ALLOWED_DOMAINS
      )?.value as string,
      undefined
    ) as string[],
    fileTypeOptions: tryParseJsonWithDefault(
      validations?.find(
        (item) =>
          item.name === MetafieldDefinitionValidationName.FILE_TYPE_OPTIONS
      )?.value as string,
      undefined
    ) as string[],
    schema: validations?.find(
      (item) => item.name === MetafieldDefinitionValidationName.SCHEMA
    )?.value as string,
  };
}

export function tryParseJsonWithDefault(
  value: string,
  defaultValue?: any,
  checkArray?: boolean
) {
  if (isNullOrUndefined(value) || value === "") {
    return defaultValue;
  }
  try {
    const result = JSON.parse(value);
    return (checkArray && Array.isArray(result) && result.length > 0) ||
      !checkArray
      ? result
      : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function tryParseNumberWithDefault(value: string, defaultValue?: any) {
  if (isNullOrUndefined(value) || value === "") {
    return defaultValue;
  }
  if (isNaN(Number(value))) {
    return defaultValue;
  }
  return Number(value);
}

export function tryParseISOWithDefault(value: string, defaultValue?: any) {
  if (isNullOrUndefined(value) || value === "") {
    return defaultValue;
  }
  try {
    const parsedDate = parseISO(value);
    return isValid(parsedDate) ? parsedDate : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function isNullOrUndefined(value?: any) {
  return value === undefined || value === null;
}

export function convertDateTimeToValue(
  type: MetafieldDefinitionType,
  value: Date | string
) {
  if (typeof value === "string") {
    return value;
  }
  return `${value.toISOString().split(".")[0]}Z`;
}

export type MetafieldDefinitionAppliedFilter = PaginationFilter & {
  owner_resource: MetafieldDefinitionOwnerResource;
  resource_id?: number;
  pin?: boolean;
  sort_key?: "id" | "pinned_position";
};

export type Metafield = {
  id: number;
  storeId: number;
  description?: string;
  key: string;
  namespace: string;
  ownerResource: string;
  ownerId: number;
  ownerName: string;
  value: string;
  valueType: MetafieldDefinitionType;
  errorMessage?: string;
};

export type MetafieldDefinitionAppliedResponse = {
  metafieldDefinition: MetafieldDefinitionResponse;
  metafield?: Metafield;
};
