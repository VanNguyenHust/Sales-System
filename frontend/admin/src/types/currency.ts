export interface Currency {
  id: number;
  name: string;
  code: string;
  culture_code: string;
  symbol: string;
  symbol_position: boolean;
  currency_decimal_digits: number;
}

export interface CurrencyFormatTemplate {
  currency: string;
  money_format: string;
  money_with_currency_format: string;
}
