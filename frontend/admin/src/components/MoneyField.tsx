import { useState } from "react";
import { TextField, type TextFieldProps } from "@/ui-components";

import { useMoney } from "app/utils/useMoney";

type Props = {
  /** Giá trị */
  value?: number;
  /** Hàm thay đổi giá trị */
  onChange(value?: number): void;
  /** Cho phép tiền âm */
  negative?: boolean;
  /** Giá trị lớn nhất. Nhập quá sẽ bị reset về giá trị này */
  max?: number;
  /** Giá trị nhỏ nhất. Nhập quá sẽ bị reset về giá trị này */
  min?: number;
  /** Currency code. Mặc định lấy thông tin của shop */
  currency?: string;
  /** Ẩn thông tin tiền tệ */
  hiddenCurrency?: boolean;
  /** Không cho phép empty */
  zeroEmpty?: boolean;
} & Omit<TextFieldProps, "value" | "onChange" | "type">;

/** MoneyField xử lý input theo thông tin currency */
export function MoneyField({
  value: valueProp,
  onChange,
  onBlur,
  max,
  min,
  negative,
  suffix,
  hiddenCurrency,
  currency,
  zeroEmpty,
  ...restProps
}: Props) {
  const { currencySymbol, currencyDecimalDigits, formatMoneyWithoutCurrency } = useMoney(currency);

  const [pendingText, setPendingText] = useState<string | undefined>();

  const convertToNumber = (value: string): number | undefined => {
    if (value) {
      value = value.replaceAll(/[^0-9.-]/g, "");
    }
    if (value) {
      let numberValue = parseFloat(value);
      if (isNaN(numberValue)) {
        return zeroEmpty ? min || 0 : undefined;
      }
      if (!negative) {
        numberValue = Math.abs(numberValue);
      }
      if (max !== undefined && numberValue > max) {
        numberValue = max;
      }
      if (min !== undefined && numberValue < min) {
        numberValue = min;
      }
      return Number(numberValue.toFixed(currencyDecimalDigits));
    }

    return zeroEmpty ? min || 0 : undefined;
  };

  const convertToText = (value: number | undefined): string => {
    return value !== undefined && !isNaN(value) ? formatMoneyWithoutCurrency(value) : "";
  };

  const handleChange = (value: string) => {
    setPendingText(value);
    onChange?.(convertToNumber(value));
  };

  const handleBlur = () => {
    setPendingText(undefined);
    onBlur?.();
  };

  return (
    <TextField
      {...restProps}
      type="text"
      inputMode="decimal"
      suffix={!hiddenCurrency && !suffix ? currencySymbol : suffix}
      value={pendingText !== undefined ? pendingText : convertToText(valueProp ?? undefined)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
