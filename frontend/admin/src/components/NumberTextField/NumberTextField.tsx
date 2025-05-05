import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Icon, TextField, type TextFieldProps } from "@/ui-components";
import { ArrowCaretDownIcon, ArrowCaretUpIcon } from "@/ui-icons";
import { Decimal } from "decimal.js";

import { decimalRound } from "app/utils/decimal";

const INT_REGEX = /^\d+$/;

type UnstableProps =
  | {
      allowEmpty?: undefined;
      value: number | string;
      onChange: (value: number, valueString: string) => void;
    }
  | {
      allowEmpty: true;
      value?: number | string | null;
      onChange: (value: number | null, valueString: string | null) => void;
    };

export type NumberTextFieldProps = {
  onBlur?: () => void;
  name?: string;
  decimalScale?: number;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  /**
   * @deprecated
   */
  inputMode?: "numeric" | "decimal";
  suffix?: ReactNode;
  max?: number;
  min?: number;
  align?: TextFieldProps["align"];
  /**
   * @default true
   */
  selectTextOnFocus?: boolean;
  labelTooltip?: string;
  /**
   * @default true
   */
  showControlButton?: boolean;
  id?: string;
  connectedRight?: TextFieldProps["connectedRight"];
  connectedLeft?: TextFieldProps["connectedLeft"];
  focused?: boolean;
  helpText?: TextFieldProps["helpText"];
  stripTrailingZeros?: boolean;
  allowNegative?: boolean;
} & UnstableProps;

const NumberTextField = ({
  id,
  value,
  onChange,
  onBlur,
  name,
  decimalScale = 0,
  error,
  disabled,
  label,
  placeholder,
  required,
  suffix,
  align,
  max,
  min = 0,
  labelTooltip,
  selectTextOnFocus = true,
  showControlButton = true,
  connectedLeft,
  connectedRight,
  allowEmpty,
  focused,
  stripTrailingZeros,
  helpText,
  allowNegative = false,
}: NumberTextFieldProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const rootRef = useRef<HTMLDivElement>(null);
  const effectiveMin = !allowNegative ? min : undefined;

  const handleChangeValue = useCallback(
    (value: string, ignoreTouched?: boolean) => {
      if ((isTouched || ignoreTouched) && !value.endsWith(".") && value !== "-") {
        if (value.trim() === "" && allowEmpty) {
          onChange(null, null);
        } else {
          const convertValue = value.replaceAll(",", "");
          if (decimalScale && decimalScale > 0) {
            onChange(parseFloat(convertValue), new Decimal(new Decimal(convertValue).toFixed(decimalScale)).toString());
            return;
          }
          onChange(parseFloat(convertValue), convertValue);
        }
      }
    },
    [isTouched, allowEmpty, onChange, decimalScale]
  );

  const compareChangeValue = useCallback(() => {
    let newValue = "";
    if (typeof value === "number") {
      newValue = `${new Decimal(value.toFixed(decimalScale))}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (typeof value === "string") {
      newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (newValue !== inputValue) {
      setInputValue(newValue);
    }
  }, [inputValue, value, decimalScale]);
  useEffect(() => {
    compareChangeValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimalScale]);

  const handleChange = (data: string) => {
    let transformData = data.trim().replaceAll(",", "");
    if (INT_REGEX.test(transformData) && Number(transformData) === 0) {
      transformData = "0";
    }
    if (transformData.indexOf("-") > -1) {
      if ((effectiveMin && effectiveMin >= 0) || (Number(value) ?? 0) > 0) return;
      transformData = transformData.substring(transformData.indexOf("-"), transformData.length);
    }
    if ((transformData.match(/\./g) || []).length > 1) return;
    if (
      transformData.indexOf(".") > -1 &&
      (!decimalScale || transformData.length - transformData.indexOf(".") > decimalScale + 1)
    ) {
      return;
    }
    if (!transformData.endsWith(".") && Number.isNaN(Number(transformData)) && transformData !== "-") {
      return;
    }
    if (max !== undefined && parseFloat(transformData) > max) return;
    if (effectiveMin && parseFloat(transformData) < effectiveMin) return;
    const integerValue =
      transformData.indexOf(".") > -1 ? transformData.substring(0, transformData.indexOf(".")) : transformData;
    if (integerValue.length > 1 || transformData === "-") {
      transformData = transformData.replace(/^0+/, "");
    } else if (!allowEmpty) {
      if (transformData.length === 0 && effectiveMin) {
        transformData = effectiveMin < 0 ? `${0}` : `${effectiveMin}`;
      } else if (integerValue.length === 0) {
        transformData = `0${transformData}`;
      }
    }
    const _value = transformData.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInputValue(_value);
    handleChangeValue(_value);
  };

  const standardizedDecimal = (value: string) => {
    const _value = Number(value.replaceAll(",", ""));
    setInputValue(_value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const handleBlur = useCallback(() => {
    if (!isTouched) setTouched(true);
    if (decimalScale > 0 && stripTrailingZeros) standardizedDecimal(inputValue);
    onBlur?.();
  }, [isTouched, decimalScale, stripTrailingZeros, inputValue, onBlur]);

  const handleFocus = useCallback(() => {
    if (!isTouched) setTouched(true);
  }, [isTouched]);

  const handlePlus = () => {
    if (rootRef.current) {
      rootRef.current.getElementsByTagName("input")?.[0]?.focus();
    }

    let transformValue = decimalRound((parseFloat(inputValue.replaceAll(",", "")) || 0) + 1, decimalScale);

    if (max !== undefined && transformValue > max) transformValue = max;
    const value = `${transformValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInputValue(value);
    handleChangeValue(value, true);
  };

  const handleMinus = () => {
    if (rootRef.current) {
      rootRef.current.getElementsByTagName("input")?.[0]?.focus();
    }

    let transformValue = decimalRound((parseFloat(inputValue.replaceAll(",", "")) || 0) - 1, decimalScale);

    if (effectiveMin !== undefined && transformValue < effectiveMin) transformValue = effectiveMin;
    const value = `${transformValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInputValue(value);
    handleChangeValue(value, true);
  };

  const controlButtonMarkup = disabled ? null : (
    <StyledSuffixWrapper>
      <StyledControlButtonWrapper>
        <StyledControlButton disabled={disabled} onClick={handlePlus}>
          <Icon source={ArrowCaretUpIcon} />
        </StyledControlButton>
        <StyledControlButton disabled={disabled} onClick={handleMinus}>
          <Icon source={ArrowCaretDownIcon} />
        </StyledControlButton>
      </StyledControlButtonWrapper>
    </StyledSuffixWrapper>
  );

  const inputArgs = {
    id,
    value: inputValue,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    error,
    name,
    align,
    disabled,
    label,
    placeholder,
    inputMode: (decimalScale > 0 ? "decimal" : "numeric") as TextFieldProps["inputMode"],
    selectTextOnFocus,
    requiredIndicator: required,
    suffix: suffix ? suffix : showControlButton ? controlButtonMarkup : undefined,
    labelTooltip,
    connectedLeft,
    connectedRight,
    focused,
    helpText,
  };

  return (
    <StyedRoot ref={rootRef}>
      <TextField {...inputArgs} />
    </StyedRoot>
  );
};

const StyledControlButtonWrapper = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(0.5)};
  z-index: ${(p) => p.theme.zIndex(1)};
  margin-right: -${(p) => p.theme.spacing(2)};
`;
const StyedRoot = styled.div`
  position: relative;
  width: 100%;
  :hover {
    ${StyledControlButtonWrapper} {
      display: flex;
    }
  }
`;

const StyledControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.theme.spacing(5)};
  height: 14px;
  border: unset;
  outline: unset;
  cursor: pointer;
  padding: 0;
  background-color: ${(p) => p.theme.colors.actionSecondaryHovered};
  :hover {
    background-color: ${(p) => p.theme.colors.actionSecondaryHovered};
  }
  :active {
    background-color: ${(p) => p.theme.colors.actionSecondaryPressed};
  }
  :first-child {
    border-radius: 2px 2px 0 0;
  }
  :last-child {
    border-radius: 0 0 2px 2px;
  }
`;

const StyledSuffixWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default NumberTextField;
