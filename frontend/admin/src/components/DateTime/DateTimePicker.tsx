import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { DatePicker, type DatePickerProps, Icon, Stack, TextField, useBreakpoints } from "@/ui-components";
import { CalendarIcon, HistoryIcon } from "@/ui-icons";
import { isValid as isValidDate, setDate as setDayOfMonth, setHours, setMinutes, setMonth, setYear } from "date-fns";

import { useDatetime } from "app/utils/datetime";

import { TimeSelect } from "./TimeSelect";

export interface DateTimePickerProps extends Pick<DatePickerProps, "monthYearSelection"> {
  /** utc iso string */
  value: string;
  /**
   * callback when change date time
   * @param value utc iso string
   * */
  onChange(value: string): void;
  disableDatesAfter?: string;
  disableDatesBefore?: string;
}

const dateFormat = "yyyy-MM-dd";
const timeFormat = "HH:mm";

export const DateTimePicker = ({
  value,
  onChange,
  disableDatesAfter,
  disableDatesBefore,
  ...datePickerProps
}: DateTimePickerProps) => {
  const { mdUp } = useBreakpoints();
  const { formatDate } = useDatetime();
  const currentValue = useMemo(() => new Date(value), [value]);
  const [pendingDate, setPendingDate] = useState<string | undefined>(undefined);
  const [pendingTime, setPendingTime] = useState<string | undefined>(undefined);

  const handleValueChange = (zoned: Date) => {
    onChange(zoned.toISOString());
  };

  const handleSubmitPendingDate = () => {
    if (!pendingDate) {
      return;
    }
    const tokens = pendingDate.split("-");
    if (tokens.length === 3) {
      const year = Number(tokens[0]);
      const month = Number(tokens[1]);
      const day = Number(tokens[2]);
      const value = setDayOfMonth(setMonth(setYear(currentValue, year), month - 1), day);
      if (isValidDate(value)) {
        handleValueChange(value);
      }
    }
    setPendingDate(undefined);
  };

  const handleSetTime = (time: string) => {
    const tokens = time.split(":");
    if (tokens.length === 2) {
      const hour = Number(tokens[0]);
      const minute = Number(tokens[1]);
      const value = setMinutes(setHours(currentValue, hour), minute);
      if (isValidDate(value)) {
        handleValueChange(value);
      }
    }
  };

  const handleSubmitPendingTime = () => {
    if (!pendingTime) {
      return;
    }
    handleSetTime(pendingTime);
    setPendingTime(undefined);
  };

  return (
    <Stack vertical>
      <StyledFields>
        <StyledInputOverride>
          <TextField
            type="date"
            value={pendingDate ? pendingDate : formatDate(value, dateFormat)}
            pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
            suffix={<Icon source={CalendarIcon} color="base" />}
            onChange={setPendingDate}
            onBlur={handleSubmitPendingDate}
          />
        </StyledInputOverride>
        <StyledInputOverride>
          <TextField
            type="time"
            value={pendingTime ? pendingTime : formatDate(value, timeFormat)}
            pattern="[0-2][0-9]:[0-5][0-9]"
            onChange={setPendingTime}
            onBlur={handleSubmitPendingTime}
            suffix={<Icon source={HistoryIcon} color="base" />}
            maxLength={5}
          />
        </StyledInputOverride>
      </StyledFields>
      <Stack.Item fill>
        <StyledGroupPicker>
          <Stack spacing="extraTight" wrap={false}>
            <Stack.Item fill>
              <DatePicker
                month={currentValue.getMonth()}
                year={currentValue.getFullYear()}
                onMonthChange={(m, y) => handleValueChange(setYear(setMonth(currentValue, m), y))}
                onChange={({ start: zoned }) =>
                  handleValueChange(
                    setDayOfMonth(
                      setMonth(setYear(currentValue, zoned.getFullYear()), zoned.getMonth()),
                      zoned.getDate()
                    )
                  )
                }
                selected={currentValue}
                disableDatesAfter={disableDatesAfter ? new Date(disableDatesAfter) : undefined}
                disableDatesBefore={disableDatesBefore ? new Date(disableDatesBefore) : undefined}
                {...datePickerProps}
              />
            </Stack.Item>
            {mdUp ? <TimeSelect value={formatDate(value, timeFormat)} onChange={handleSetTime} /> : null}
          </Stack>
        </StyledGroupPicker>
      </Stack.Item>
    </Stack>
  );
};

const StyledInputOverride = styled.span`
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-time-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator,
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
`;

const StyledGroupPicker = styled.div`
  padding: ${(p) => p.theme.spacing(3, 4, 3, 0)};
  border: ${(p) => p.theme.shape.borderBase};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledFields = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  gap: ${(p) => p.theme.spacing(5)};
  > * {
    flex: 1;
  }
`;
