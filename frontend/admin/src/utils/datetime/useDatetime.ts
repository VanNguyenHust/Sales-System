import { useCallback, useMemo } from "react";
import { tz, TZDate } from "@date-fns/tz";
import { format } from "date-fns";

import { useSelector } from "app/types";

/** @deprecated */
export enum DateFormat {
  DateSlash = "dd/MM/yyyy",
  DateDash = "yyyy-MM-dd",
  DateDashTime = "yyyy-MM-dd HH:mm",
  Time = "HH:mm",
}

type TimezoneConvert = (value: Date | number | string) => TZDate;

type FormatDateOptions = {
  in?: TimezoneConvert;
};

interface UseDateTimeReturn {
  /**
   * format date time. Mặc định theo timezone của shop
   * @param value Đối tượng Date hoặc utc date string
   * @param pattern Date format pattern. Mặc định "yyyy-MM-dd HH:mm"
   * @param options Thay đổi timezone
   */
  formatDate(value: string | Date | number, pattern?: string, options?: FormatDateOptions): string;
  /**
   * Convert date time sang date time có timezone của shop
   */
  toZonedTime(value: string | Date): TZDate;
  /**
   * Convert date time sang date time có timezone utc
   */
  toUTCTime(value: string | Date): TZDate;
  /**
   * Convert sang utc để truyền vào options `in` của các util trong date-fns
   * @example
   * format(date, "yyyy-MM-dd", { in: inUTC })
   */
  inUTC: TimezoneConvert;
  /**
   * Convert sang shop timezone để truyền vào options `in` của các util trong date-fns
   * @example
   * format(date, "yyyy-MM-dd", { in: inShop })
   */
  inShop: TimezoneConvert;
  /**
   * Convert utc date time sang date time có timezone của shop
   * @deprecated using toZonedTime
   * @param value Đối tượng Date hoặc utc date string
   */
  utcToZonedTime(value: string | Date): TZDate;
  /**
   * Convert date time có timezone của shop sang utc date time
   * @deprecated using toUTCTime
   * @param value Đối tượng Date có timezone của shop
   */
  zonedTimeToUtc(value: string | Date): TZDate;
}

/** Format date time theo timezone của shop */
export function useDatetime(): UseDateTimeReturn {
  const timezone = useSelector((state) => state.tenant.timezone);
  if (!timezone) {
    throw new Error("Missing timezone info");
  }

  const inShop = useMemo(() => tz(timezone.timezone_iana), [timezone.timezone_iana]);
  const inUTC = useMemo(() => tz("utc"), []);

  const formatDate: UseDateTimeReturn["formatDate"] = (value, pattern = DateFormat.DateDashTime, options) => {
    if (options?.in) {
      return format(value, pattern, { in: options.in });
    }
    if (value instanceof TZDate) {
      return format(value, pattern);
    }
    return format(value, pattern, { in: inShop });
  };

  const toZonedTime: UseDateTimeReturn["toZonedTime"] = useCallback(
    (value) => {
      return new TZDate(value as any, timezone.timezone_iana);
    },
    [timezone.timezone_iana]
  );

  const toUTCTime: UseDateTimeReturn["toUTCTime"] = useCallback((value) => {
    return new TZDate(value as any, "utc");
  }, []);

  return {
    formatDate: useCallback(formatDate, [inShop]),
    toZonedTime,
    toUTCTime,
    utcToZonedTime: toZonedTime,
    zonedTimeToUtc: toUTCTime,
    inUTC,
    inShop,
  };
}
