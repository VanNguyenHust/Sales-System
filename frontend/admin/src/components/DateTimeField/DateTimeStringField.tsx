import React, { useEffect, useState } from "react";
import { addHours, endOfDay, format, parse as parseDate, startOfDay, subHours } from "date-fns";

import { useSelector } from "app/types";

import { StopPropagation } from "../StopPropagation";

import DateTimeField, { DateTimeFieldProps } from "./DateTimeField";
import { TextDateTransfer } from "./types";

export interface DateTimeStringFieldProps
  extends Omit<DateTimeFieldProps, "value" | "onChange" | "secondValue" | "onChangeSecond" | "onSubmit"> {
  /** Giá trị ngày - giờ */
  value: string | null | undefined;
  /** Hàm thay đổi giá trị ngày - giờ */
  onChange?: (date: string | null) => void;
  /** Giá trị ngày - giờ thứ 2 */
  secondValue?: string | null | undefined;
  /** Hàm thay đổi giá trị ngày - giờ thứ 2, Khi truyền hàm này sẽ tự động chọn kiểu DateTimeRange */
  onChangeSecond?: (date: string | null) => void;
  /** Chọn kiểu DateTimeRange khi không truyền onChangeSecond - variant.ts option thì k cần*/
  rangePicker?: boolean;
  /** format */
  dateFormat?: string;
  /** Chỉnh về giờ UTC hàm onChange và onChangeSecond */
  convertToUTC?: boolean;
  onSubmit?: (data: {
    firstDate?: string | null | undefined;
    lastDate?: string | null | undefined;
    textTransfer?: TextDateTransfer | null;
  }) => void;
}

const DateTimeStringField = ({
  value,
  onChange,
  secondValue,
  onChangeSecond,
  convertToUTC,
  onSubmit,
  rangePicker,
  ...props
}: DateTimeStringFieldProps) => {
  const timezone = useSelector((state) => state.tenant.timezone);
  const GTM = timezone?.diff || 0;
  const dateFormat = props.dateFormat ? props.dateFormat : "yyyy-MM-dd'T'HH:mm:ss'Z'";
  const [_value, _setValue] = useState<Date | null>(
    value
      ? convertToUTC
        ? addHours(parseDate(value, dateFormat, new Date()), GTM)
        : parseDate(value, dateFormat, new Date())
      : null
  );
  const [_secondValue, _setSecondValue] = useState<Date | null>(
    secondValue
      ? convertToUTC
        ? addHours(parseDate(secondValue, dateFormat, new Date()), GTM)
        : parseDate(secondValue || "", dateFormat, new Date())
      : null
  );

  const [_option, _setOption] = useState<TextDateTransfer | null>(props.option || null);

  const refPropOption = React.useRef(props.option);
  useEffect(() => {
    if (props.option !== refPropOption.current) {
      refPropOption.current = props.option;
      _setOption(props.option || null);
    }
  }, [_option, props]);
  const onChangeValue = (date: Date | null) => {
    _setValue(date);
    onChange &&
      onChange(
        date
          ? format(
              convertToUTC
                ? props.variant === "timePicker"
                  ? subHours(date, GTM)
                  : subHours(startOfDay(date), GTM)
                : date,
              dateFormat
            )
          : null
      );
  };
  const onChangeSecondValue =
    props.variant === "option" || rangePicker || !!onChangeSecond
      ? (date: Date | null) => {
          _setSecondValue(date);
          onChangeSecond &&
            onChangeSecond(
              date
                ? format(
                    convertToUTC
                      ? props.variant === "timePicker"
                        ? subHours(date, GTM)
                        : subHours(endOfDay(date), GTM)
                      : date,
                    dateFormat
                  )
                : null
            );
        }
      : undefined;

  const _onSubmit = (data: {
    firstDate?: Date | null;
    lastDate?: Date | null;
    textTransfer?: TextDateTransfer | null;
  }) => {
    if (data.textTransfer === "custom" && !data.firstDate && !data.lastDate) {
      return;
    }

    onSubmit &&
      onSubmit({
        firstDate: data.firstDate
          ? format(
              convertToUTC
                ? props.variant === "timePicker"
                  ? subHours(data.firstDate, GTM)
                  : subHours(startOfDay(data.firstDate), GTM)
                : data.firstDate,
              dateFormat
            )
          : null,
        lastDate: data.lastDate
          ? format(
              convertToUTC
                ? props.variant === "timePicker"
                  ? subHours(data.lastDate, GTM)
                  : subHours(endOfDay(data.lastDate), GTM)
                : data.lastDate,
              dateFormat
            )
          : null,
        textTransfer: data.textTransfer,
      });
  };

  useEffect(() => {
    _setValue(
      value
        ? convertToUTC
          ? addHours(parseDate(value, dateFormat, new Date()), GTM)
          : parseDate(value, dateFormat, new Date())
        : null
    );
  }, [convertToUTC, dateFormat, value, GTM]);
  useEffect(() => {
    _setSecondValue(
      secondValue
        ? convertToUTC
          ? addHours(parseDate(secondValue, dateFormat, new Date()), GTM)
          : parseDate(secondValue || "", dateFormat, new Date())
        : null
    );
  }, [convertToUTC, dateFormat, secondValue, GTM]);
  return (
    <StopPropagation>
      <DateTimeField
        {...props}
        value={_value}
        secondValue={_secondValue}
        onChange={onChangeValue}
        onChangeSecond={onChangeSecondValue}
        onSubmit={_onSubmit}
        option={_option || undefined}
      />
    </StopPropagation>
  );
};

export default DateTimeStringField;
