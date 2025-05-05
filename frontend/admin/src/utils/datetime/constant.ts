import { RelativeDateValue } from "app/types";

export const DATE_FORMAT = "dd/MM/yyyy";
export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm";
export const DATE_TIME_UTC_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
export const DATE_TIME_UTC_FULL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

export const relativeDateOptions: { label: string; value: RelativeDateValue }[] = [
  {
    value: "today",
    label: "Hôm nay",
  },
  {
    value: "yesterday",
    label: "Hôm qua",
  },
  {
    value: "day_last_7",
    label: "7 ngày qua",
  },
  {
    value: "day_last_30",
    label: "30 ngày qua",
  },
  {
    value: "last_week",
    label: "Tuần trước",
  },
  {
    value: "this_week",
    label: "Tuần này",
  },
  {
    value: "last_month",
    label: "Tháng trước",
  },
  {
    value: "this_month",
    label: "Tháng này",
  },
  {
    value: "last_year",
    label: "Năm trước",
  },
  {
    value: "this_year",
    label: "Năm nay",
  },
];
