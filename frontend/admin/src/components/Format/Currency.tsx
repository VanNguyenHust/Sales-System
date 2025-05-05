import { CurrencyResponse } from "app/types";

import { Money } from "./Money";

interface Props {
  amount: number | string;
  currency?: CurrencyResponse;

  /** @default true */
  withSymbol?: boolean;
}

/**
 * @deprecated using Format.Money instead
 * */
export function Currency({ amount, currency, withSymbol = true }: Props) {
  return <Money amount={amount} currency={currency?.code} withoutSymbol={!withSymbol} />;
}
