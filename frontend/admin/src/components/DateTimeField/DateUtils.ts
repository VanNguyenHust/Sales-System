import {
  addHours,
  eachDayOfInterval,
  format,
  getDaysInMonth,
  isToday,
  isYesterday,
  parse as parseDate,
  startOfWeek,
} from "date-fns";

export const getDaysInAMonth = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(startDate);
  const endDate = new Date(year, month, daysInMonth);
  const weeks: Date[] = [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  days.forEach((it) => {
    if (!weeks.some((e) => format(e, "wo yyy", { weekStartsOn: 1 }) === format(it, "wo yyy", { weekStartsOn: 1 }))) {
      weeks.push(it);
    }
  });
  const calendar: Date[][] = [];
  weeks.forEach((m) => {
    const firstWeekDay = startOfWeek(m, { weekStartsOn: 1 });
    const lastWeekDay = new Date(firstWeekDay.getFullYear(), firstWeekDay.getMonth(), firstWeekDay.getDate() + 6);
    const weekRange = eachDayOfInterval({ start: firstWeekDay, end: lastWeekDay });
    calendar.push(weekRange);
  });
  return calendar;
};

export const DateUtils = {
  DATE_FORMAT: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  getDate(dateString: string, format?: string, refDate?: Date) {
    return parseDate(dateString, format || "dd/MM/yyyy HH:mm", refDate || new Date());
  },
  getFilterDateText(from?: string, to?: string, textRange?: string, convertToGMT?: boolean) {
    if (!from || !to) {
      if (from) {
        return `Từ ${format(
          addHours(DateUtils.getDate(from, DateUtils.DATE_FORMAT), convertToGMT ? 7 : 0),
          "dd/MM/yyyy"
        )}`;
      }
      if (to) {
        return `Đến ${format(
          addHours(DateUtils.getDate(to, DateUtils.DATE_FORMAT), convertToGMT ? 7 : 0),
          "dd/MM/yyyy"
        )}`;
      }
      return "";
    }
    let fromDate = DateUtils.getDate(from, DateUtils.DATE_FORMAT);
    let toDate = DateUtils.getDate(to, DateUtils.DATE_FORMAT);
    if (convertToGMT) {
      fromDate = addHours(fromDate, 7);
      toDate = addHours(toDate, 7);
    }
    const fromText = format(fromDate, "dd/MM/yyyy");
    const toText = format(toDate, "dd/MM/yyyy");
    if (textRange && textRange !== "custom") {
      if (textRange === "today" || textRange === "yesterday") {
        if (isToday(toDate)) {
          return `${fakeI18n("today")} (${fromText})`;
        } else if (isYesterday(toDate)) {
          return `${fakeI18n("yesterday")} (${fromText})`;
        }
        return `Từ ${fromText} đến ${toText}`;
      }
      return `${fakeI18n(textRange)} (${fromText} - ${toText})`;
    }
    return `Từ ${fromText} đến ${toText}`;
  },
};

export const fakeI18n = (key: string): string => {
  const data = {
    search: "Tìm kiếm",
    result: "kết quả",
    display: "Hiển thị",
    pagination_from_to: "Từ {{from}} đến {{to}} trên tổng {{total}}",
    selected_all_in_page: "Đã chọn tất cả trên trang này",
    selected_count_in_page: "Đã chọn {{count}} {{name}} trên trang này",
    no_result: "Không tìm thấy dữ liệu phù hợp",
    count_selected: "Đã chọn {{num}}",
    option_all: "Chọn tất cả",
    filter: "Lọc",
    today: "Hôm nay",
    yesterday: "Hôm qua",
    day_last_7: "7 ngày qua",
    day_last_30: "30 ngày qua",
    last_week: "Tuần trước",
    this_week: "Tuần này",
    last_month: "Tháng trước",
    this_month: "Tháng này",
    last_year: "Năm trước",
    this_year: "Năm nay",
    custom: "Tùy chọn",
    remove_all: "Xóa tất cả",
    from: "Từ trước",
    to: "đến nay",
    january: "Tháng 1",
    february: "Tháng 2",
    march: "Tháng 3",
    april: "Tháng 4",
    may: "Tháng 5",
    june: "Tháng 6",
    july: "Tháng 7",
    august: "Tháng 8",
    september: "Tháng 9",
    october: "Tháng 10",
    november: "Tháng 11",
    december: "Tháng 12",
    monday: "T2",
    tuesday: "T3",
    wednesday: "T4",
    thursday: "T5",
    friday: "T6",
    saturday: "T7",
    sunday: "CN",
    text_add: "Thêm",
  };
  return data[key as keyof typeof data];
};
