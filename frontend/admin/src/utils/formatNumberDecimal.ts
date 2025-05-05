import { toNumber } from "lodash-es";

export function formatNumberDecimal(number: number | null | undefined, fixed?: number) {
  if (number === null || number === undefined || isNaN(number)) return "0";
  else {
    const numberText = roundDecimal(number, fixed)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (numberText === "NaN") return "0";
    else return numberText;
  }
}

function roundDecimal(a: number, k = 3) {
  const K = Math.pow(10, k);
  return Math.round(a * K) / K;
}

export function toNumberDecimal(str: string | null | undefined) {
  if (str === null || str === undefined) return 0;
  const regex = new RegExp(`[\\d,]+(\\.\\d+)?`);
  if (regex.test(str)) return toNumber(str.replace(/,/g, ""));
  if (/^[0-9]+$/.test(str)) return toNumber(str);
  return 0;
}
