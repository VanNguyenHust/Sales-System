import type { ChoiceListProps, ComplexAction, MenuGroupDescriptor } from "@/ui-components";

import type { Icon } from "app/features/mobile-bridge/actions/Button";

export type PaginationFilter = {
  page?: number;
  limit?: number;
};

export type SetResponse = {
  jobId?: string;
  message: string;
  ids: number[] | null;
};

export type DataSource<T> = {
  data: T[];
  total: number;
};

export type Metadata = {
  page: number;
  limit: number;
  total_elements: number;
  total_pages: number;
};

type ChoiceItem = ChoiceListProps["choices"][number];

export type ChoiceItemDescriptor<T = string> = Without<ChoiceItem, "value"> & {
  value: T;
};

export type BusinessType = {
  id: number;
  name: string;
  theme_alias: string;
};

export type OnboardingRequest = {
  channels: string[];
};

export type CompleteRegistrationRequest = {
  preferred_service?: string | null;
};

export type RelativeDateValue =
  | "today"
  | "yesterday"
  | "day_last_7"
  | "day_last_30"
  | "this_week"
  | "last_week"
  | "last_month"
  | "this_month"
  | "last_year"
  | "this_year";

export type DateRangeValue = {
  start?: Date;
  end?: Date;
  relative?: RelativeDateValue;
};

export type Action = Without<ComplexAction, "icon"> & {
  icon?: Icon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export type ActionGroup = Without<MenuGroupDescriptor, "actions"> & {
  actions: Action[];
};
