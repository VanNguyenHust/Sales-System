import { useMoney } from "app/utils/useMoney";

interface Props {
  amount: number | string;
  /** currency code */
  currency?: string;
  withoutSymbol?: boolean;
}

/** Format money theo cấu hình shop hoặc iso code truyền vào */
export function Money({ amount, currency, withoutSymbol }: Props) {
  const { formatMoney, formatMoneyWithoutCurrency } = useMoney(currency);

  return <>{withoutSymbol ? formatMoneyWithoutCurrency(amount) : formatMoney(amount)}</>;
}
