import { INVENTORY_DECIMAL_SCALE } from "app/utils/decimal";

import NumberTextField, { NumberTextFieldProps } from "./NumberTextField/NumberTextField";

export const InventoryField = ({ selectTextOnFocus = true, ...rest }: NumberTextFieldProps) => {
  return <NumberTextField {...rest} decimalScale={INVENTORY_DECIMAL_SCALE} selectTextOnFocus={selectTextOnFocus} />;
};
