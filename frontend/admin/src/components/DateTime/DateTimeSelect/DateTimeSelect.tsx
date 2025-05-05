import { useCallback, useMemo, useState } from "react";
import { Button, ButtonGroup, Modal, Popover, type PopoverProps, Stack, useBreakpoints } from "@/ui-components";

import { getDatetime, isValidDatetime } from "app/utils/datetime";
import { useToggle } from "app/utils/useToggle";

import { DateTimePicker, DateTimePickerProps } from "../DateTimePicker";

import { Button as DateTimeSelectButton, ButtonProps as DateTimeSelectButtonProps } from "./Button";
import { DateTimeSelectTextFieldContext, DateTimeSelectTextFieldContextType } from "./context";
import { DateField, DateFieldProps } from "./DateField";

interface DateTimeSelectProps extends DateTimePickerProps {
  activator: React.ReactElement<DateFieldProps | DateTimeSelectButtonProps>;
  preferredPosition?: PopoverProps["preferredPosition"];
  arrow?: PopoverProps["arrow"];
}

export const DateTimeSelect: React.FC<DateTimeSelectProps> & {
  DateField: typeof DateField;
  Button: typeof DateTimeSelectButton;
} = ({
  value: valueProp,
  onChange,
  activator,
  preferredPosition,
  arrow,
  ...dateTimePickerProps
}: DateTimeSelectProps) => {
  const [value, setValue] = useState<string>(getValidDateOrDefault(valueProp));
  const { value: isOpenPopover, setFalse: closePopover, setTrue: openPopover } = useToggle(false);
  const { mdUp } = useBreakpoints();

  const handleChange = () => {
    onChange(value);
    closePopover();
  };

  const handleClose = () => {
    setValue(getValidDateOrDefault(valueProp));
    closePopover();
  };

  const handleToggle = useCallback(() => {
    if (isOpenPopover) {
      setValue(getValidDateOrDefault(valueProp));
      closePopover();
    } else {
      openPopover();
    }
  }, [closePopover, isOpenPopover, openPopover, valueProp]);

  const textFieldContextValue = useMemo(
    (): DateTimeSelectTextFieldContextType => ({
      onTextFieldClick: handleToggle,
      value: valueProp,
      active: isOpenPopover,
    }),
    [isOpenPopover, handleToggle, valueProp]
  );

  return mdUp ? (
    <Popover
      activator={
        <DateTimeSelectTextFieldContext.Provider value={textFieldContextValue}>
          {activator}
        </DateTimeSelectTextFieldContext.Provider>
      }
      onClose={handleClose}
      active={isOpenPopover}
      sectioned
      fullHeight
      arrow={arrow}
      preferredPosition={preferredPosition}
    >
      <Stack vertical>
        <DateTimePicker value={value} onChange={setValue} {...dateTimePickerProps} />
        <Stack distribution="trailing">
          <ButtonGroup noWrap>
            <Button outline primary onClick={handleClose}>
              Huỷ
            </Button>
            <Button primary onClick={handleChange}>
              Áp dụng
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Popover>
  ) : (
    <>
      <DateTimeSelectTextFieldContext.Provider value={textFieldContextValue}>
        {activator}
      </DateTimeSelectTextFieldContext.Provider>
      <Modal
        title="Chọn thời gian"
        onClose={handleClose}
        open={isOpenPopover}
        sectioned
        primaryAction={{
          content: "Áp dụng",
          onAction: handleChange,
        }}
        secondaryActions={[
          {
            content: "Huỷ",
            onAction: handleClose,
          },
        ]}
      >
        <DateTimePicker value={value} onChange={setValue} {...dateTimePickerProps} />
      </Modal>
    </>
  );
};

DateTimeSelect.DateField = DateField;
DateTimeSelect.Button = DateTimeSelectButton;

function getValidDateOrDefault(value: string): string {
  return isValidDatetime(value) ? value : getDatetime();
}
