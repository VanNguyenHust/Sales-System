import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Icon, Stack, Text, TextContainer, TextField } from "@/ui-components";
import { CalendarIcon } from "@/ui-icons";
import {
  endOfDay,
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { isEmpty, isNil } from "lodash-es";

import { fakeI18n } from "./DateUtils";
import { TextDateTransfer } from "./types";

interface DateFieldProps {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  format: string;
  secondValue?: Date | null;
  onChangeSecond?: (date: Date | null) => void;
  onChangeDateFocus?: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  placeholder?: string;
  label?: string;
  isDateRange?: boolean;
  isTimeSameDay?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  selectedOption?: TextDateTransfer | null;
  focused?: boolean;
}

const DateField = function DateField({
  label,
  value,
  onChange,
  format,
  secondValue,
  onChangeSecond,
  onChangeDateFocus,
  placeholder,
  isDateRange,
  isTimeSameDay,
  disabled,
  onClick,
  minDate,
  maxDate,
  selectedOption,
  focused: focusedInput,
}: DateFieldProps) {
  const isPredefinedDate = !!selectedOption && selectedOption !== "custom";

  const [focused, setFocused] = useState(focusedInput);
  const [forceUpdate, setForceUpdate] = useState(0);

  const getText = useCallback(() => {
    if (isDateRange) {
      return value || secondValue
        ? `${value ? formatDate(value, format) : fakeI18n("from")} - ${
            secondValue ? formatDate(secondValue, format) : fakeI18n("to")
          }`
        : undefined;
    } else if (isTimeSameDay) {
      return [value ? formatDate(value, format) : null, secondValue ? formatDate(secondValue, "HH:mm") : null]
        .filter((x) => !!x)
        .join(" - ");
    }
    return value ? formatDate(value, format) : undefined;
  }, [format, isDateRange, isTimeSameDay, secondValue, value]);

  const [text, setText] = useState(getText());

  useEffect(() => {
    setText(getText());
  }, [value, secondValue, isDateRange, forceUpdate, getText]);

  const handleSubmit = useCallback(
    (text: string | null | undefined, date: Date | null | undefined) => {
      if (isDateRange) {
        if (isNil(text) || isEmpty(text)) {
          onChange(null);
          onChangeSecond?.(null);
          return;
        }
        const dates = text?.split(" - ") || [];
        const firstDate = dates[0] ? parse(dates[0], format, new Date()) : null;
        const lastDate = dates[1] ? parse(dates[1], format, new Date()) : null;
        if (firstDate && !isNaN(firstDate.getTime()) && (!value || !isSameDay(firstDate, value))) {
          onChange(firstDate);
          return;
        } else if (lastDate && !isNaN(lastDate.getTime()) && (!secondValue || !isSameDay(lastDate, secondValue))) {
          if (value && isSameDay(lastDate, value)) {
            onChangeSecond?.(null);
          } else if (value && isBefore(lastDate, value)) {
            onChange(lastDate);
          } else {
            onChangeSecond?.(lastDate);
          }
          return;
        } else if (value || secondValue) {
          setForceUpdate((prev) => prev + 1);
        }
      } else if (isTimeSameDay) {
        if (isNil(text) || isEmpty(text)) {
          onChange(null);
          onChangeSecond?.(null);
          return;
        }
        const dates = text?.split(" - ") || [];
        const firstTime = dates[0] ? parse(dates[0], format, new Date()) : null;
        const _lastTime = dates[1] ? parse(dates[1], "HH:mm", new Date()) : null;
        if (firstTime && !isNaN(firstTime.getTime()) && _lastTime && !isNaN(_lastTime.getTime())) {
          onChangeDateFocus?.({
            month: firstTime.getMonth(),
            year: firstTime.getFullYear(),
          });
          if (!isNaN(_lastTime.getTime())) {
            let lastTime = new Date(firstTime);
            lastTime = setHours(lastTime, _lastTime.getHours());
            lastTime = setMinutes(lastTime, _lastTime.getMinutes());
            if (isBefore(firstTime, lastTime)) {
              onChange(firstTime);
              onChangeSecond?.(lastTime);
            } else {
              onChange(lastTime);
              onChangeSecond?.(firstTime);
            }
          } else {
            onChange(firstTime);
            onChangeSecond?.(endOfDay(firstTime));
          }
        } else if (firstTime && !isNaN(firstTime.getTime())) {
          onChangeDateFocus?.({
            month: firstTime.getMonth(),
            year: firstTime.getFullYear(),
          });
          onChange(firstTime);
        } else {
          setForceUpdate((prev) => prev + 1);
        }
      } else {
        if (isNil(text) || isEmpty(text) || isNil(date)) {
          onChange(null);
          return;
        }
        if (isNaN(date.getTime())) {
          setForceUpdate((prev) => prev + 1);
          return;
        }
        if (!!(minDate && isBefore(date, startOfDay(minDate))) || !!(maxDate && isAfter(date, maxDate))) {
          setForceUpdate((prev) => prev + 1);
          return;
        }
        onChange(date);
        onChangeDateFocus?.({
          month: date.getMonth(),
          year: date.getFullYear(),
        });
      }
    },
    [
      isDateRange,
      isTimeSameDay,
      format,
      value,
      secondValue,
      onChange,
      onChangeSecond,
      onChangeDateFocus,
      minDate,
      maxDate,
    ]
  );

  const handleBlur = useCallback(() => {
    handleSubmit(text, text ? parse(text, format, new Date()) : null);
  }, [text, format, handleSubmit]);

  const onPressEscape = useCallback(
    (event: KeyboardEvent) => {
      event.code === "Enter" && handleSubmit(text, text ? parse(text, format, new Date()) : null);
    },
    [format, handleSubmit, text]
  );
  useEffect(() => {
    document.addEventListener("keyup", onPressEscape);
    return () => {
      document.removeEventListener("keyup", onPressEscape);
    };
  }, [onPressEscape]);

  const content = (
    <TextField
      value={isPredefinedDate ? fakeI18n(selectedOption) : text || ""}
      onFocus={() => {
        if (!isPredefinedDate) setFocused(true);
        onClick?.();
      }}
      onChange={(value) => {
        if (!isPredefinedDate) setText(value);
      }}
      readOnly={isPredefinedDate}
      disabled={disabled}
      onBlur={() => {
        if (!isPredefinedDate) setFocused(false);
        handleBlur();
      }}
      placeholder={placeholder}
      suffix={<Icon source={CalendarIcon} color={focused ? "primary" : "base"} />}
      focused={focusedInput}
    />
  );
  if (!label) return content;
  return (
    <StyledTextContainerWrap>
      <TextContainer spacing="tight">
        <Stack vertical spacing="extraTight">
          <Text variant="bodyMd" as="p">
            {label}
          </Text>
          {content}
        </Stack>
      </TextContainer>
    </StyledTextContainerWrap>
  );
};
const StyledTextContainerWrap = styled.div`
  width: 100%;
  > div {
    width: 100%;
  }
`;
export default memo(DateField);
