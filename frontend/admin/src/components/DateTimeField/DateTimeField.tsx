import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Popover, type PopoverProps, Stack } from "@/ui-components";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
} from "date-fns";

import { useToggle } from "app/utils/useToggle";

import MonthPrevNext from "./Toolbar/MonthPrevNext";
import { TimeRangeSelect } from "./Toolbar/TimeRangeSelect";
import { TimeSelect } from "./Toolbar/TimeSelect";
import Toolbar from "./Toolbar/Toolbar";
import YearSelect from "./Toolbar/YearSelect";
import Calendar from "./Calendar";
import DateField from "./DateField";
import { fakeI18n } from "./DateUtils";
import { TextDateTransfer } from "./types";
import useDateRangePicker from "./useDateRangePicker";

export type DatePickerVariant = "base" | "timePicker" | "option";

export interface ActivatorDatePickerProps {
  /** toggle Đóng - Mở phần chọn ngày giờ */
  toggle: () => void;
  /** Trạng thái đóng - mở */
  open: boolean;
}

export interface DateTimeFieldProps extends Pick<PopoverProps, "preferredAlignment"> {
  /** Giá trị ngày - giờ */
  value: Date | null | undefined;
  /** Hàm thay đổi giá trị ngày - giờ */
  onChange: (date: Date | null) => void;
  /** Giá trị ngày - giờ thứ 2 */
  secondValue?: Date | null | undefined;
  /** Hàm thay đổi giá trị ngày - giờ thứ 2, Khi truyền hàm này sẽ tự động chọn kiểu DateTimeRange */
  onChangeSecond?: (date: Date | null) => void;
  /** Thay đổi ToolBar từ chuyển giữa các tháng thành chọn Tháng và Năm - Không áp dụng cho TimePicker */
  monthYearSelect?: boolean;
  /** Giá trị ngày tối thiểu*/
  minDate?: Date | null;
  /** Giá trị ngày tối đa  */
  maxDate?: Date | null;
  /** Text hiển thị trong placeholder nếu k custom activator */
  placeholder?: string;
  /** Label nếu k custom activator */
  label?: string;
  /** Trạng thái disabled với custom activator cũng k thể mở lên được*/
  disabled?: boolean;
  /** Giá trị ngày mặc định khi mở lần đầu tiên */
  dateAppendOnFirstOpen?: Date | null;
  /** Nội dung activator thay thế TextField mặc định */
  activator?: (props: ActivatorDatePickerProps) => React.ReactElement;
  /** Kiểu DatePicker */
  variant?: DatePickerVariant;
  /** Thay đổi giá trị khi submit - Chỉ dùng cho variant.ts option */
  changeOnSubmit?: boolean;
  /** event khi nhấn submit */
  onSubmit?: (data: {
    firstDate?: Date | null;
    lastDate?: Date | null;
    textTransfer?: TextDateTransfer | null;
  }) => void;
  /** Bỏ xóa giá trị khi click lại vào option - Chỉ dùng cho variant.ts option */
  disabledClear?: boolean;
  /** Giá trị mặc định của option */
  option?: TextDateTransfer;
  /** Hàm thay đổi giá trị option */
  onChangeOption?: (option: TextDateTransfer) => void;
  /** Các option có thể chọn - Chỉ dùng cho variant.ts option */
  options?: TextDateTransfer[];
  /** Khoảng thời gian cách nhau trong danh sách lựa chọn khoảng phút - Chỉ dùng cho variant.ts timePicker */
  periodTime?: 15 | 30;
  /** Inline, hiển thị luôn popover DateTimePicker mà không cần activator */
  inline?: boolean;
  maxWidth?: CSSProperties["maxWidth"];
  /** Focus vào input với TextField mặc định */
  focused?: boolean;
}

type DateTransfer = { firstDate?: Date | null; lastDate?: Date | null; textTransfer: TextDateTransfer };

export default function DateTimeField(props: DateTimeFieldProps) {
  const {
    value,
    onChange,
    secondValue,
    onChangeSecond,
    option,
    variant = "base",
    disabledClear,
    changeOnSubmit,
    onSubmit,
    monthYearSelect,
    onChangeOption,
    placeholder,
    label,
    minDate,
    maxDate,
    disabled,
    dateAppendOnFirstOpen,
    activator,
    periodTime,
    inline,
    maxWidth,
    focused,
    preferredAlignment = "right",
  } = props;
  const [dateNow, setDateNow] = useState(new Date());
  const [dateTimeEnd, setDateTimeEnd] = useState(new Date());
  const format = variant === "timePicker" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
  const isDateRange = variant === "option" || !!props.onChangeSecond;
  const [{ month, year }, setDateFocus] = useState({
    month: value ? value.getMonth() : dateNow.getMonth(),
    year: value ? value.getFullYear() : dateNow.getFullYear(),
  });

  const { value: open, toggle: toggleDatePicker } = useToggle(false);
  const handleDateRange = useDateRangePicker();
  const refFirstOpen = useRef(false);
  const [selectedOption, setSelectedOption] = useState<TextDateTransfer | null | undefined>(props.option);
  const [firstDate, setFirstDate] = useState(value);
  const [lastDate, setLastDate] = useState(secondValue);

  const refPropOption = React.useRef(props.option);
  useEffect(() => {
    if (props.option !== refPropOption.current) {
      refPropOption.current = props.option;
      setSelectedOption(props.option || null);
    }
  }, [selectedOption, props]);

  const {
    value: openCustomFirstDate,
    toggle: toggleCustomFirstDate,
    setFalse: setFalseCustomFirstDate,
  } = useToggle(false);
  const {
    value: openCustomLastDate,
    toggle: toggleCustomLastDate,
    setFalse: setFalseCustomLastDate,
  } = useToggle(false);

  const handleUpdateTimePicker = useCallback(
    (date: Date) => {
      const _startTime = value
        ? {
            hour: value.getHours(),
            minute: value.getMinutes(),
          }
        : dateAppendOnFirstOpen
        ? {
            hour: dateAppendOnFirstOpen.getHours(),
            minute: dateAppendOnFirstOpen.getMinutes(),
          }
        : { hour: dateNow.getHours(), minute: dateNow.getMinutes() };
      onChange(setMinutes(setHours(date, _startTime.hour), _startTime.minute));
      if (onChangeSecond) {
        const _endTime = secondValue
          ? {
              hour: secondValue.getHours(),
              minute: secondValue.getMinutes(),
            }
          : {
              hour: dateTimeEnd.getHours(),
              minute: dateNow.getMinutes(),
            };
        onChangeSecond(setMinutes(setHours(date, _endTime.hour), _endTime.minute));
      }
    },
    [value, dateAppendOnFirstOpen, dateNow, onChange, onChangeSecond, secondValue, dateTimeEnd]
  );
  const handleClick = useCallback(() => {
    if (open) {
      setFalseCustomFirstDate();
      setFalseCustomLastDate();
      toggleDatePicker();
      return;
    }
    if (open || disabled) return;
    setDateFocus({
      month: value ? value.getMonth() : dateNow.getMonth(),
      year: value ? value.getFullYear() : dateNow.getFullYear(),
    });
    toggleDatePicker();
    if (dateAppendOnFirstOpen && !refFirstOpen.current) {
      if (variant === "timePicker") {
        handleUpdateTimePicker(dateAppendOnFirstOpen);
      } else {
        onChange(dateAppendOnFirstOpen);
      }

      refFirstOpen.current = true;
    }
  }, [
    open,
    disabled,
    value,
    dateNow,
    toggleDatePicker,
    dateAppendOnFirstOpen,
    setFalseCustomFirstDate,
    setFalseCustomLastDate,
    variant,
    handleUpdateTimePicker,
    onChange,
  ]);

  const handleClickDay = useCallback(
    (date: Date) => {
      if (variant === "timePicker") {
        handleUpdateTimePicker(date);
        return;
      }
      if (isDateRange && onChangeSecond) {
        const { firstValue: _f, secondValue: _s } = handleDateRange(date, value, secondValue);
        onChange(_f);
        onChangeSecond(_s ? endOfDay(_s) : null);
        return;
      }
      if (!value || !isSameDay(date, value)) {
        toggleDatePicker();
        onChange(startOfDay(date));
        return;
      }
    },
    [
      variant,
      isDateRange,
      onChangeSecond,
      value,
      handleUpdateTimePicker,
      handleDateRange,
      secondValue,
      onChange,
      toggleDatePicker,
    ]
  );

  useEffect(() => {
    setFirstDate(value);
  }, [value]);
  useEffect(() => {
    setLastDate(secondValue);
  }, [secondValue]);

  const onChangeDateOption = useCallback(
    ({
      firstDate,
      lastDate,
      textTransfer,
    }: {
      firstDate?: Date | null;
      lastDate?: Date | null;
      textTransfer?: TextDateTransfer | null;
    }) => {
      onChange(firstDate ? startOfDay(firstDate) : null);
      if (onChangeSecond) {
        onChangeSecond(lastDate ? endOfDay(lastDate) : null);
      }
      if (onChangeOption && textTransfer) {
        onChangeOption(textTransfer);
      }
      setSelectedOption(textTransfer);
      onSubmit && !changeOnSubmit && onSubmit({ firstDate, lastDate, textTransfer });
    },
    [changeOnSubmit, onChange, onChangeOption, onChangeSecond, onSubmit]
  );

  const handleChange = useCallback(
    (
      newDateTransfer: { firstDate?: Date | null; lastDate?: Date | null; textTransfer: typeof selectedOption },
      isSubmitted?: boolean
    ) => {
      if (changeOnSubmit && !isSubmitted) {
        if (
          newDateTransfer.firstDate &&
          newDateTransfer.lastDate &&
          isAfter(newDateTransfer.firstDate, newDateTransfer.lastDate)
        ) {
          setFirstDate(newDateTransfer.lastDate ? startOfDay(newDateTransfer.lastDate) : null);
          setLastDate(newDateTransfer.firstDate ? endOfDay(newDateTransfer.firstDate) : null);
        } else {
          setFirstDate(newDateTransfer.firstDate ? startOfDay(newDateTransfer.firstDate) : null);
          setLastDate(newDateTransfer.lastDate ? endOfDay(newDateTransfer.lastDate) : null);
        }
        setSelectedOption(newDateTransfer.textTransfer);
      } else {
        if (
          newDateTransfer.firstDate &&
          newDateTransfer.lastDate &&
          isAfter(newDateTransfer.firstDate, newDateTransfer.lastDate)
        ) {
          onChangeDateOption({
            firstDate: newDateTransfer.lastDate ? startOfDay(newDateTransfer.lastDate) : null,
            lastDate: newDateTransfer.firstDate ? endOfDay(newDateTransfer.firstDate) : null,
            textTransfer: newDateTransfer.textTransfer,
          });
        } else {
          onChangeDateOption({
            firstDate: newDateTransfer.firstDate ? startOfDay(newDateTransfer.firstDate) : null,
            lastDate: newDateTransfer.lastDate ? endOfDay(newDateTransfer.lastDate) : null,
            textTransfer: newDateTransfer.textTransfer,
          });
        }
        setSelectedOption(newDateTransfer.textTransfer);
      }
      if (changeOnSubmit && isSubmitted) toggleDatePicker();
    },
    [changeOnSubmit, toggleDatePicker, onChangeDateOption]
  );
  const getDateTransfer = useCallback(
    (_option: string) => {
      if (_option === "custom") {
        return {
          firstDate: value,
          lastDate: secondValue,
          textTransfer: "custom",
        } as DateTransfer;
      } else {
        return getDateFormOption(_option, dateNow);
      }
    },
    [dateNow, secondValue, value]
  );
  const handleClickOption = useCallback(
    (_option: string) => {
      if (selectedOption === _option) {
        if (disabledClear) return;
        handleChange({
          firstDate: null,
          lastDate: null,
          textTransfer: null,
        });
        return;
      }
      const dateTransfer = getDateTransfer(_option);
      if (dateTransfer) {
        handleChange(dateTransfer);
      }
    },
    [disabledClear, getDateTransfer, handleChange, selectedOption]
  );
  const setCustomDateRef = useRef(false);
  useEffect(() => {
    if (!setCustomDateRef.current && option && option !== "custom" && !value && !secondValue) {
      setCustomDateRef.current = true;
      const dateTransfer = getDateTransfer(option);
      if (dateTransfer) {
        handleChange(dateTransfer);
      }
    }
  }, [getDateTransfer, handleChange, option, secondValue, value]);

  const _options = useMemo(
    () =>
      [
        { label: fakeI18n("today"), id: "today" },
        { label: fakeI18n("yesterday"), id: "yesterday" },
        { label: fakeI18n("day_last_7"), id: "day_last_7" },
        { label: fakeI18n("day_last_30"), id: "day_last_30" },
        { label: fakeI18n("last_week"), id: "last_week" },
        { label: fakeI18n("this_week"), id: "this_week" },
        { label: fakeI18n("last_month"), id: "last_month" },
        { label: fakeI18n("this_month"), id: "this_month" },
        { label: fakeI18n("last_year"), id: "last_year" },
        { label: fakeI18n("this_year"), id: "this_year" },
        { label: fakeI18n("custom"), id: "custom" },
      ].filter((e) => !props.options || props.options.includes(e.id as any)),
    [props.options]
  );
  const startTime = useMemo(() => {
    return value
      ? {
          hour: value.getHours(),
          minute: value.getMinutes(),
        }
      : { hour: dateNow.getHours(), minute: 0 };
  }, [dateNow, value]);
  const endTime = useMemo(() => {
    return secondValue
      ? {
          hour: secondValue.getHours(),
          minute: secondValue.getMinutes(),
        }
      : {
          hour: dateNow.getHours(),
          minute: 59,
        };
  }, [dateNow, secondValue]);
  const handleChangeStartTime = useCallback(
    (hour: number, minute: number) => {
      let _value = value;
      if (!_value) _value = dateNow;
      onChange(setMinutes(setHours(_value, hour), minute));
    },
    [value, dateNow, onChange]
  );

  const handleChangeEndTime = useCallback(
    (hour: number, minute: number) => {
      if (!onChangeSecond || !value) return;
      onChangeSecond?.(setMinutes(setHours(value, hour), minute));
    },
    [value, onChangeSecond]
  );
  const handleChangeFirstDate = useCallback(
    (_firstDate: Date | null) => {
      if ((!_firstDate && !firstDate) || (_firstDate && firstDate && isSameDay(_firstDate, firstDate))) return;
      handleChange({
        firstDate: _firstDate,
        lastDate,
        textTransfer: "custom",
      });
    },
    [firstDate, handleChange, lastDate]
  );

  const handleChangeLastDate = useCallback(
    (_lastDate: Date | null) => {
      if ((!_lastDate && !lastDate) || (_lastDate && lastDate && isSameDay(_lastDate, lastDate))) return;
      handleChange({
        lastDate: _lastDate,
        firstDate,
        textTransfer: "custom",
      });
    },
    [firstDate, handleChange, lastDate]
  );
  const ToolBarMarkup =
    variant === "timePicker" ? (
      <>
        <MonthPrevNext month={month} year={year} onChangeDateFocus={setDateFocus} />
        {isDateRange && (
          <TimeRangeSelect
            startTime={startTime}
            endTime={endTime}
            onChangeStartTime={handleChangeStartTime}
            onChangeEndTime={handleChangeEndTime}
            periodTime={periodTime}
            getSelectedTimeRange={(startTime, endTime) => {
              setDateNow(setHours(setMinutes(dateNow, startTime.minute), startTime.hour));
              setDateTimeEnd(setHours(setMinutes(dateTimeEnd, endTime.minute), endTime.hour));
            }}
          />
        )}
      </>
    ) : monthYearSelect ? (
      <YearSelect month={month} year={year} minDate={minDate} maxDate={maxDate} onChangeDateFocus={setDateFocus} />
    ) : (
      <MonthPrevNext month={month} year={year} onChangeDateFocus={setDateFocus} />
    );
  const Content = (
    <>
      <Toolbar>{ToolBarMarkup}</Toolbar>
      <Stack>
        <Calendar
          firstDate={value}
          secondDate={variant !== "timePicker" ? secondValue : undefined}
          month={month}
          year={year}
          onClickDay={handleClickDay}
          minDate={minDate}
          maxDate={maxDate}
          isDateRange={variant !== "timePicker" && isDateRange}
        />
        {variant === "timePicker" && !isDateRange && (
          <TimeSelect
            value={value}
            onChange={handleChangeStartTime}
            getTempTime={(hour, minute) => {
              setDateNow(setHours(setMinutes(dateNow, minute), hour));
            }}
          />
        )}
      </Stack>
    </>
  );

  const ContentOption = (
    <StyledContentOption $inline={inline} $maxWidth={maxWidth}>
      <Stack vertical>
        <StyledListOption>
          {_options.map((option) => (
            <StyledOption key={option.id} isCustom={option.id === "custom"} isSelected={option.id === selectedOption}>
              <Button primary={option.id === selectedOption} outline onClick={() => handleClickOption(option.id)}>
                {option.label}
              </Button>
            </StyledOption>
          ))}
        </StyledListOption>
        {selectedOption === "custom" && (
          <StyledListOption>
            <StyledOption>
              <Popover
                active={openCustomFirstDate}
                preferredPosition="below"
                preferInputActivator
                preventCloseOnChildOverlayClick
                fixed
                activator={
                  <DateField
                    onClick={() => {
                      toggleCustomFirstDate();
                      setFalseCustomLastDate();
                    }}
                    format={format}
                    value={firstDate}
                    onChange={handleChangeFirstDate}
                    onChangeDateFocus={setDateFocus}
                    placeholder={format}
                  />
                }
                onClose={toggleCustomFirstDate}
              >
                <Toolbar>
                  <YearSelect month={month} year={year} onChangeDateFocus={setDateFocus} />
                </Toolbar>
                <Calendar
                  firstDate={firstDate}
                  month={month}
                  year={year}
                  onClickDay={(_firstDate) => {
                    handleChangeFirstDate(_firstDate);
                    toggleCustomFirstDate();
                  }}
                />
              </Popover>
            </StyledOption>
            <StyledOption>
              <Popover
                active={openCustomLastDate}
                preferredPosition="below"
                preventCloseOnChildOverlayClick
                activator={
                  <DateField
                    onClick={() => {
                      toggleCustomLastDate();
                      setFalseCustomFirstDate();
                    }}
                    format={format}
                    value={lastDate}
                    onChange={handleChangeLastDate}
                    onChangeDateFocus={setDateFocus}
                    placeholder={format}
                  />
                }
                onClose={toggleCustomLastDate}
              >
                <Toolbar>
                  <YearSelect month={month} year={year} onChangeDateFocus={setDateFocus} />
                </Toolbar>
                <Calendar
                  firstDate={lastDate}
                  month={month}
                  year={year}
                  onClickDay={(_lastDate) => {
                    handleChangeLastDate(_lastDate);
                    toggleCustomLastDate();
                  }}
                />
              </Popover>
            </StyledOption>
          </StyledListOption>
        )}
        {changeOnSubmit && (
          <StyledSubmitButtonWrap>
            <Button
              primary
              onClick={() => {
                handleChange(
                  {
                    firstDate,
                    lastDate,
                    textTransfer: selectedOption,
                  },
                  true
                );
                onSubmit?.({ firstDate, lastDate, textTransfer: selectedOption });
              }}
            >
              {fakeI18n("filter")}
            </Button>
          </StyledSubmitButtonWrap>
        )}
      </Stack>
    </StyledContentOption>
  );

  const activatorMarkup: React.ReactElement = activator ? (
    activator({ toggle: handleClick, open })
  ) : (
    <DateField
      onClick={handleClick}
      format={format}
      isDateRange={variant !== "timePicker" && isDateRange}
      value={value}
      isTimeSameDay={variant === "timePicker"}
      onChange={onChange}
      secondValue={secondValue}
      onChangeSecond={onChangeSecond}
      onChangeDateFocus={setDateFocus}
      placeholder={placeholder}
      label={label}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      selectedOption={selectedOption}
      focused={focused}
    />
  );

  const contentMarkup = variant === "option" ? ContentOption : Content;
  if (inline && variant === "timePicker")
    return (
      <StyledDatePicker>
        {activatorMarkup}
        {contentMarkup}
      </StyledDatePicker>
    );
  if (inline) return contentMarkup;

  return (
    <StyledDatePicker>
      <Popover
        preferInputActivator
        preferredAlignment={preferredAlignment}
        fixed
        active={open}
        activator={activatorMarkup}
        onClose={() => {
          setFalseCustomFirstDate();
          setFalseCustomLastDate();
          toggleDatePicker();
        }}
        autofocusTarget="none"
      >
        {contentMarkup}
      </Popover>
    </StyledDatePicker>
  );
}

export const getDateFormOption = (_option: string, dateNow?: Date) => {
  if (!dateNow) dateNow = new Date();
  switch (_option) {
    case "today":
      return {
        firstDate: startOfDay(dateNow),
        lastDate: endOfDay(dateNow),
        textTransfer: "today",
      } as DateTransfer;
    case "yesterday":
      return {
        firstDate: sub(startOfDay(dateNow), { days: 1 }),
        lastDate: sub(endOfDay(dateNow), { days: 1 }),
        textTransfer: "yesterday",
      } as DateTransfer;
    case "day_last_7":
      return {
        firstDate: sub(startOfDay(dateNow), { days: 7 }),
        lastDate: sub(endOfDay(dateNow), { days: 1 }),
        textTransfer: "day_last_7",
      } as DateTransfer;
    case "day_last_30":
      return {
        firstDate: sub(startOfDay(dateNow), { days: 30 }),
        lastDate: sub(endOfDay(dateNow), { days: 1 }),
        textTransfer: "day_last_30",
      } as DateTransfer;
    case "this_week":
      return {
        firstDate: startOfWeek(dateNow, { weekStartsOn: 1 }), // todo add 1 day
        lastDate: endOfWeek(dateNow, { weekStartsOn: 1 }),
        textTransfer: "this_week",
      } as DateTransfer;
    case "last_week":
      return {
        firstDate: sub(startOfWeek(dateNow, { weekStartsOn: 1 }), { weeks: 1 }),
        lastDate: sub(endOfWeek(dateNow, { weekStartsOn: 1 }), { weeks: 1 }),
        textTransfer: "last_week",
      } as DateTransfer;
    case "last_month":
      return {
        firstDate: startOfMonth(sub(dateNow, { months: 1 })),
        lastDate: endOfMonth(sub(dateNow, { months: 1 })),
        textTransfer: "last_month",
      } as DateTransfer;
    case "this_month":
      return {
        firstDate: startOfMonth(dateNow),
        lastDate: endOfMonth(dateNow),
        textTransfer: "this_month",
      } as DateTransfer;
    case "last_year":
      return {
        firstDate: startOfYear(sub(dateNow, { years: 1 })),
        lastDate: endOfYear(sub(dateNow, { years: 1 })),
        textTransfer: "last_year",
      } as DateTransfer;
    case "this_year":
      return {
        firstDate: startOfYear(dateNow),
        lastDate: endOfYear(dateNow),
        textTransfer: "this_year",
      } as DateTransfer;
  }
};

const StyledDatePicker = styled.div``;
const StyledContentOption = styled.div<{
  $inline?: DateTimeFieldProps["inline"];
  $maxWidth?: DateTimeFieldProps["maxWidth"];
}>`
  ${(p) =>
    !p.$inline &&
    css`
      padding: ${p.theme.spacing(4)};
    `};
  max-width: ${(p) => p.$maxWidth || "312px"};
  width: 100%;
`;
const StyledSubmitButtonWrap = styled.div`
  & > button {
    width: 100%;
  }
`;
const StyledListOption = styled.div`
  display: flex;
  box-sizing: border-box;
  margin: calc(${(p) => p.theme.spacing(1)} * -1);
  flex-wrap: wrap;
`;
const StyledOption = styled.div<{
  isCustom?: boolean;
  isSelected?: boolean;
}>`
  width: calc(50% - ${(p) => p.theme.spacing(2)});
  margin: ${(p) => p.theme.spacing(1)};
  & > button {
    width: 100%;
    border: ${(p) => (p.isSelected ? "" : "1px solid #d3d5d7")};
    span {
      font-weight: 400;
    }
  }
  ${(p) =>
    p.isCustom &&
    css`
      width: calc(100% - ${p.theme.spacing(1)});
    `}
`;
