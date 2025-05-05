import { useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  DATA_ATTRIBUTE,
  DatePicker,
  type DatePickerProps,
  Icon,
  Popover,
  TextField,
  type TextFieldProps,
  useTheme,
} from "@/ui-components";
import { CalendarIcon } from "@/ui-icons";
import { format as formatDate, getYear, isMatch, isValid as isValidDate, parse as parseDate } from "date-fns";

import { useToggle } from "app/utils/useToggle";

export interface DateFieldProps
  extends Pick<DatePickerProps, "monthYearSelection" | "disableDatesAfter" | "disableDatesBefore">,
    Without<TextFieldProps, "suffix" | "value" | "onChange" | "readOnly"> {
  /**
   * format hiển thị.
   * @default "dd/MM/yyyy"
   * */
  format?: "dd/MM/yyyy";
  value?: Date;
  onChange(value?: Date): void;
}

export function DateField({
  format = "dd/MM/yyyy",
  disabled,
  value: valueProp,
  onChange,
  disableDatesAfter,
  disableDatesBefore,
  monthYearSelection,
  placeholder: placeholderProp,
  ...textFieldProps
}: DateFieldProps) {
  const current = useMemo(() => valueProp ?? new Date(), [valueProp]);
  const [monthYear, setMonthYear] = useState({ month: current.getMonth(), year: current.getFullYear() });
  const { value: isOpenPopover, setFalse: closePopover, setTrue: openPopover } = useToggle(false);
  const [pendingText, setPendingText] = useState<string | undefined>(undefined);
  const placeholder = placeholderProp ? placeholderProp : format;
  const pickerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleOpen = () => {
    if (!isOpenPopover) {
      setMonthYear({ month: current.getMonth(), year: current.getFullYear() });
      openPopover();
    }
  };

  const handleSelectDate = (value: Date) => {
    onChange(value);
    closePopover();
  };

  const handleChangePendingText = (value: string) => {
    setPendingText(value);
    if (value) {
      const { ok, date: pendingDate } = parseDateFormat(value, format);
      if (ok) {
        setMonthYear({ month: pendingDate.getMonth(), year: pendingDate.getFullYear() });
        onChange(pendingDate);
      }
    }
  };

  const handleSubmitPendingText = (e: React.FocusEvent<HTMLInputElement>) => {
    if (pickerRef.current && pickerRef.current.contains(e.relatedTarget)) {
      setPendingText(undefined);
      e.target.focus();
      return;
    }
    if (pendingText === "") {
      onChange(undefined);
      setPendingText(undefined);
      return;
    }
    if (!pendingText) {
      return;
    }
    const { ok, date: pendingDate } = parseDateFormat(pendingText, format);
    if (ok) {
      onChange(pendingDate);
    }
    setPendingText(undefined);
    closePopover();
  };

  const attrs = monthYearSelection
    ? {
        ...DATA_ATTRIBUTE.layer.props,
        style: { zIndex: theme.zIndex.modal },
      }
    : undefined;

  return (
    <Popover
      active={isOpenPopover}
      sectioned
      onClose={closePopover}
      activator={
        <StyledField onClick={disabled ? undefined : handleOpen} $active={isOpenPopover}>
          <TextField
            {...textFieldProps}
            value={pendingText !== undefined ? pendingText : valueProp ? formatDate(valueProp, format) : ""}
            disabled={disabled}
            placeholder={placeholder}
            suffix={<Icon source={CalendarIcon} color={isOpenPopover ? "interactive" : "base"} />}
            onChange={handleChangePendingText}
            onBlur={handleSubmitPendingText}
          />
        </StyledField>
      }
      autofocusTarget="none"
      fullHeight
      preferInputActivator={false}
      preventCloseOnChildOverlayClick
      zIndexOverride={theme.zIndex.modal}
    >
      <div ref={pickerRef} {...attrs}>
        <DatePicker
          month={monthYear.month}
          year={monthYear.year}
          onMonthChange={(m, y) => setMonthYear({ month: m, year: y })}
          onChange={({ start: value }) => {
            handleSelectDate(value);
          }}
          selected={valueProp ? valueProp : undefined}
          disableDatesAfter={disableDatesAfter}
          disableDatesBefore={disableDatesBefore}
          monthYearSelection={monthYearSelection}
        />
      </div>
    </Popover>
  );
}

const StyledField = styled.span<{
  $active: boolean;
}>`
  ${(p) =>
    p.$active &&
    css`
      [data-segment-control] {
        border-color: ${p.theme.colors.interactive};
      }
    `}
`;

function parseDateFormat(value: string, format: string): { ok: true; date: Date } | { ok: false; date: undefined } {
  if (isMatch(value, format)) {
    const parsed = parseDate(value, format, new Date());
    // issue: https://github.com/date-fns/date-fns/issues/1998#issuecomment-719905538
    const parsedYear = getYear(parsed);
    if (isValidDate(parsed) && parsedYear > 999 && parsedYear <= 9999) {
      return { ok: true, date: parsed };
    }
  }
  return { ok: false, date: undefined };
}
