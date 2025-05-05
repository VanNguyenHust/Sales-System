import { addDays, addSeconds } from "date-fns";

import { fakeI18n } from "app/components/DateTimeField/DateUtils";
import { DATE_FORMAT_FORWARD_SLASH } from "app/components/Format/DateTime";

import { useDatetime } from "./datetime";

const useFormatDateTime = () => {
  const { formatDate: format } = useDatetime();
  const formatDate = (value: Date | string, isEndDate = false, formatPattern = DATE_FORMAT_FORWARD_SLASH) => {
    const theDate = typeof value === "string" ? new Date(value) : value;
    if (isEndDate) {
      addDays(theDate, 1);
      addSeconds(theDate, -1);
    }
    return format(theDate, formatPattern);
  };
  const formatDateISO = (value: Date | string, isEndDate = false) => {
    if (!value) {
      return "";
    }
    const theDate = typeof value === "string" ? new Date(value) : value;
    if (isEndDate) {
      addDays(theDate, 1);
      addSeconds(theDate, -1);
    }
    return `${theDate.toISOString().split(".")[0]}Z`;
  };

  const getFilterDateText = (from?: string | null, to?: string | null, textRange?: string) => {
    if (!from || !to) {
      if (from) {
        return `Từ ${formatDate(from)}`;
      }
      if (to) {
        return `Đến ${formatDate(to, true)}`;
      }
      return "";
    }
    const fromText = formatDate(from);
    const toText = formatDate(to, true);
    if (textRange && textRange !== "custom") {
      if (textRange === "today" || textRange === "yesterday") {
        return `${fakeI18n(textRange)} (${fromText})`;
      }
      return `${fakeI18n(textRange)} (${fromText} - ${toText})`;
    }
    return `Từ ${fromText} đến ${toText}`;
  };

  return {
    formatDate,
    formatDateISO,
    getFilterDateText,
  };
};

export default useFormatDateTime;
