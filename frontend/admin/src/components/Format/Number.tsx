import { useTenant } from "app/utils/useTenant";

interface Props {
  /**
   * Độ chính xác
   * @default 2
   * */
  precision?: number;

  /** Giá trị */
  value: number;
}

/** Format số theo cấu hình của shop */
export function Number({ precision = 2, value }: Props) {
  const { formatNumber } = useTenant();
  return <>{formatNumber(value, precision)}</>;
}
