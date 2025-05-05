import { useCallback, useMemo } from "react";

import { useSelector } from "app/types";

interface UseMoneyReturn {
  /**
   * Format money
   * @param code Currency code. Mặc định lấy từ lúc khởi tạo hook
   * @param withoutCurrency Bỏ hiển thị currency symbol
   */
  formatMoney(amount: number | string, code?: string, withoutCurrency?: boolean): string;

  /**
   * Format money không có thông tin currency
   * @param code Currency code. Mặc định lấy từ lúc khởi tạo hook
   */
  formatMoneyWithoutCurrency(amount: number | string, code?: string): string;
  compareMoney(firstValue: number, secondValue: number, code?: string): -1 | 0 | 1;
  isEqualMoney(firstValue: number, secondValue: number, code?: string): boolean;
  currencySymbol: string;
  currencyCode: string;
  currencyDecimalDigits: number;
}

/**
 * Util format money
 *
 * @example
 *   const { formatMoney } = useMoney();
 *   formatMoney(12000); // return 12,000đ
 *   const { formatMoney } = useMoney("USD");
 *   formatMoney(12000); // return $12,000
 * @param code Currency code. Mặc định lấy từ thông tin tenant
 * */
export function useMoney(code?: string): UseMoneyReturn {
  const { currencies, tenant } = useSelector((state) => state.tenant);

  if (!currencies?.length || !tenant) {
    throw new Error("Currencies is not be initialized");
  }

  const theCurrency = useMemo(() => {
    const finalCode = code ?? tenant.currency;
    const currency = currencies.find((c) => c.code === finalCode);
    if (!currency) {
      throw new Error(`Unsupported currency code ${finalCode}`);
    }
    return currency;
  }, [code, currencies, tenant.currency]);

  const formatMoney: UseMoneyReturn["formatMoney"] = (amount, optionCode, withoutCurrency) => {
    const currency =
      !optionCode || optionCode === tenant.currency ? theCurrency : currencies.find((c) => c.code === optionCode);
    if (!currency) {
      throw new Error(`Unsupported currency code ${optionCode}`);
    }
    let amountNumber: number;
    if (typeof amount === "string") {
      amountNumber = parseFloat(amount);
    } else {
      amountNumber = amount;
    }

    let formattedAmount: string;
    if (isNaN(amountNumber)) {
      formattedAmount = "0";
    } else {
      formattedAmount = formatNumberString(amountNumber.toFixed(currency.currency_decimal_digits));
    }
    if (withoutCurrency) {
      return formattedAmount;
    }
    if (currency.symbol_position) {
      return `${currency.symbol}${formattedAmount}`;
    }
    return `${formattedAmount}${currency.symbol}`;
  };

  const formatMoneyWithoutCurrency: UseMoneyReturn["formatMoneyWithoutCurrency"] = (amount, optionCode) => {
    const currency =
      !optionCode || optionCode === tenant.currency ? theCurrency : currencies.find((c) => c.code === optionCode);
    if (!currency) {
      throw new Error(`Unsupported currency code ${optionCode}`);
    }
    let amountNumber: number;
    if (typeof amount === "string") {
      amountNumber = parseFloat(amount);
    } else {
      amountNumber = amount;
    }

    let formattedAmount: string;
    if (isNaN(amountNumber)) {
      formattedAmount = "0";
    } else {
      formattedAmount = formatNumberString(amountNumber.toFixed(currency.currency_decimal_digits));
    }
    return formattedAmount;
  };

  const compareMoney: UseMoneyReturn["compareMoney"] = useCallback(
    (firstValue, secondValue, optionCode) => {
      const currency =
        !optionCode || optionCode === tenant.currency ? theCurrency : currencies.find((c) => c.code === optionCode);
      if (!currency) {
        throw new Error(`Unsupported currency code ${currency}`);
      }
      const multiply = Math.pow(10, currency.currency_decimal_digits);
      const subtractResult = Math.round(multiply * firstValue) - Math.round(multiply * secondValue);
      return subtractResult === 0 ? 0 : subtractResult > 0 ? 1 : -1;
    },
    [currencies, tenant.currency, theCurrency]
  );
  const isEqualMoney: UseMoneyReturn["isEqualMoney"] = (firstValue, secondValue, optionCode) => {
    return compareMoney(firstValue, secondValue, optionCode) === 0;
  };
  return {
    formatMoney: useCallback(formatMoney, [currencies, tenant.currency, theCurrency]),
    formatMoneyWithoutCurrency: useCallback(formatMoneyWithoutCurrency, [currencies, tenant.currency, theCurrency]),
    compareMoney,
    isEqualMoney: useCallback(isEqualMoney, [compareMoney]),
    currencyCode: theCurrency.code,
    currencySymbol: theCurrency.symbol,
    currencyDecimalDigits: theCurrency.currency_decimal_digits,
  };
}

const currencyThousandRegex = /(\d)(?=(\d\d\d)+(?!\d))/g;

function formatNumberString(numberString: string, thousands = ",", decimal = ".") {
  const parts = numberString.split(".");
  const beforeDecimalAmount = parts[0].replace(currencyThousandRegex, `$1${thousands}`);
  const afterDecimalAmount = parts[1] ? decimal + parts[1] : "";
  return beforeDecimalAmount + afterDecimalAmount;
}
