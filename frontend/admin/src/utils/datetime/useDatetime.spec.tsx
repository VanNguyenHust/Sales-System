import { TZDate } from "@date-fns/tz";
import { renderHook } from "@testing-library/react";
import { format, startOfDay } from "date-fns";
import { describe, expect, it } from "vitest";

import { TestProvider } from "test/redux/TestProvider";

import { useDatetime } from "./useDatetime";

describe("useDatetime", () => {
  const {
    result: {
      current: { formatDate, toZonedTime, toUTCTime, inShop, inUTC },
    },
  } = renderHook(() => useDatetime(), {
    wrapper: ({ children }) => (
      <TestProvider
        storeState={{
          tenant: {
            timezone: {
              timezone_iana: "Asia/Bangkok",
            } as any,
          },
        }}
      >
        {children}
      </TestProvider>
    ),
  });

  it("should correct formatDate", () => {
    expect(formatDate("2024-11-28T15:06:21.499Z", "yyy-MM-dd HH:mm")).toBe("2024-11-28 22:06");
    expect(formatDate("2024-11-28T15:06:21.499Z", "yyy-MM-dd HH:mm", { in: inShop })).toBe("2024-11-28 22:06");
    expect(formatDate("2024-11-28T15:06:21.499Z", "yyy-MM-dd HH:mm", { in: inUTC })).toBe("2024-11-28 15:06");
    expect(formatDate(new TZDate("2024-11-28T15:06:21.499Z", "asia/bangkok"), "yyy-MM-dd HH:mm")).toBe(
      "2024-11-28 22:06"
    );
  });

  it("should correct toZonedTime", () => {
    expect(format(toZonedTime("2024-11-28T15:06:21.499Z"), "yyy-MM-dd HH:mm")).toBe("2024-11-28 22:06");
    expect(startOfDay(toZonedTime("2024-11-28T15:06:21.499Z"))).toEqual(new Date("2024-11-28T00:00+07:00"));
  });

  it("should correct toUTCTime", () => {
    expect(format(toUTCTime("2024-11-28T15:06:21.499Z"), "yyy-MM-dd HH:mm")).toBe("2024-11-28 15:06");
    expect(startOfDay(toUTCTime("2024-11-28T15:06:21.499Z"))).toEqual(new Date("2024-11-28T00:00+00:00"));
  });
});
