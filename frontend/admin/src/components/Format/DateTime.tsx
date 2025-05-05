import { useDatetime } from "app/utils/datetime";

export const DATE_FORMAT_FORWARD_SLASH = "dd/MM/yyyy";
export const DATE_FORMAT_BACKWARD_DASH = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm";

interface Props {
  /** Đối tượng Date hoặc utc date string */
  value: Date | string;
  /** format pattern, có thể lấy trong util datetime. Mặc đinh "yyyy-MM-dd HH:mm" */
  pattern?: string;
  /**
   * Hiển thị ngày tháng năm
   *
   * @deprecated đổi sang dùng pattern
   * */
  date?: boolean;
  /**
   * Sử dụng date backward dash format
   *
   * @deprecated đổi sang dùng pattern
   * */
  backwardDate?: boolean;
  /**
   * Hiển thị thời gian
   *
   * @deprecated đổi sang dùng pattern
   * */
  time?: boolean;
}

export function DateTime({ value, date = true, time = true, backwardDate, pattern }: Props) {
  const { formatDate } = useDatetime();
  const theDate = typeof value === "string" ? new Date(value) : value;
  const dateFormat = backwardDate ? DATE_FORMAT_BACKWARD_DASH : DATE_FORMAT_FORWARD_SLASH;
  const formatPattern = [date ? dateFormat : null, time ? TIME_FORMAT : null].filter(Boolean).join(" ");
  return <>{formatDate(theDate, pattern ? pattern : formatPattern)}</>;
}
