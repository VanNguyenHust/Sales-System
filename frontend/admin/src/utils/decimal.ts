export const INVENTORY_DECIMAL_SCALE = 3;
export const INVENTORY_QUANTITY_MAX = 999999.999;
export const decimalCompare = (a: number, b: number, scale: number) => {
  const roundedA = decimalRound(a, scale);
  const roundedB = decimalRound(b, scale);
  if (roundedA > roundedB) {
    return 1;
  } else if (roundedA < roundedB) {
    return -1;
  } else {
    return 0;
  }
};

export const decimalRound = (value: number, scale: number) => {
  const scaleProperty = Math.pow(10, scale);
  return Math.round((value + Number.EPSILON) * scaleProperty) / scaleProperty;
};

export const inventoryCompare = (a: number, b: number) => decimalCompare(a, b, INVENTORY_DECIMAL_SCALE);
export const inventoryEqual = (a: number, b: number) => decimalCompare(a, b, INVENTORY_DECIMAL_SCALE) === 0;
export const inventoryRound = (value: number) => decimalRound(value, INVENTORY_DECIMAL_SCALE);

export const formatInventory = (value: number) => {
  if (isNaN(value)) {
    return "0";
  }
  const roundedValue = inventoryRound(value);
  return formatNumberString(String(roundedValue));
};

const currencyThousandRegex = /(\d)(?=(\d\d\d)+(?!\d))/g;
function formatNumberString(numberString: string, thousands = ",", decimal = ".") {
  const parts = numberString.split(".");
  const beforeDecimalAmount = parts[0].replace(currencyThousandRegex, `$1${thousands}`);
  const afterDecimalAmount = parts[1] ? decimal + parts[1] : "";
  return beforeDecimalAmount + afterDecimalAmount;
}

export const formatComponentInventory = (value: number) => {
  if (isNaN(value)) {
    return "0";
  }
  const formatted = Math.floor(value);
  return formatNumberString(String(formatted));
};
