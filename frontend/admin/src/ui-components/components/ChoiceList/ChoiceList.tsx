import React from "react";
import styled from "@emotion/styled";

import type { Error } from "../../types";
import { useUniqueId } from "../../utils/uniqueId";
import { Checkbox } from "../Checkbox";
import { HelpIndicator, HelpIndicatorProps } from "../HelpIndicator";
import { InlineError } from "../InlineError";
import { RadioButton } from "../RadioButton";
import { Text } from "../Text";

interface ChoiceItemDescriptor {
  /** Giá trị của lựa chon */
  value: string;
  /** Tiêu đề của lựa chon */
  label: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** ID của lựa chọn */
  id?: string;
  /** Disable lựa chọn */
  disabled?: boolean;
  /** Thông tin mô tả của lựa chọn */
  helpText?: React.ReactNode;
  /** Method để render các con của lựa chọn */
  renderChildren?(isSelected: boolean): React.ReactNode | false;
}

export interface ChoiceListProps {
  /** Tiêu đề cho danh sách các lựa chọn */
  title?: React.ReactNode;
  /** Tooltip mô tả title */
  titleTooltip?: string | HelpIndicatorProps;
  /** Danh sách các lựa chọn */
  choices: ChoiceItemDescriptor[];
  /** Danh sách các lựa chọn được chọn */
  selected: string[];
  /** Tên của form input */
  name?: string;
  /** Cho phép lựa chọn nhiều lựa chọn */
  allowMultiple?: boolean;
  /** Thông tin lỗi của form input */
  error?: Error;
  /** Disable tất cả các lựa chọn **/
  disabled?: boolean;
  /** Callback khi danh sách các lựa chọn thay đổi */
  onChange?(selected: string[], name: string): void;
}

/**
 * Danh sách các lựa chọn cho phép tạo thành 1 list nhóm các radio button hoặc checkbox.
 * Sử dụng component này nếu cần group các lựa chọn có liên quan đến nhau.
 */
export function ChoiceList({
  title,
  titleTooltip,
  allowMultiple,
  choices,
  selected,
  onChange = noop,
  error,
  disabled,
  name: nameProp,
}: ChoiceListProps) {
  const ControlComponent = allowMultiple ? Checkbox : RadioButton;
  const name = useUniqueId("ChoiceList", nameProp);
  const finalName = allowMultiple ? `${name}[]` : name;

  const helpMarkup = titleTooltip ? (
    typeof titleTooltip === "string" ? (
      <HelpIndicator content={titleTooltip} />
    ) : (
      <HelpIndicator {...titleTooltip} />
    )
  ) : null;
  const titleMarkup = title ? (
    <StyledTitleMarkup>
      {typeof title === "string" ? (
        <Text as="span" color="slim" variant="bodyMd">
          {title}
        </Text>
      ) : (
        title
      )}
      {helpMarkup}
    </StyledTitleMarkup>
  ) : null;
  const choicesMarkup = choices.map((choice) => {
    const { value, id, label, labelTooltip, helpText, disabled: choiceDisabled } = choice;
    function handleChange(checked: boolean) {
      let newSelected;
      if (checked) {
        newSelected = allowMultiple ? [...selected, value] : [value];
      } else {
        newSelected = selected.filter((selectedChoice) => selectedChoice !== value);
      }
      onChange(newSelected, name);
    }
    const isSelected = selected.includes(choice.value);
    const renderedChildren = choice.renderChildren ? choice.renderChildren(isSelected) : null;
    const children = renderedChildren ? <StyledChoiceChildren>{renderedChildren}</StyledChoiceChildren> : null;
    return (
      <StyledWrapperControlComponent key={value}>
        <ControlComponent
          name={finalName}
          value={value}
          id={id}
          label={label}
          labelTooltip={labelTooltip}
          disabled={choiceDisabled || disabled}
          checked={isSelected}
          helpText={helpText}
          onChange={handleChange}
        />
        {children}
      </StyledWrapperControlComponent>
    );
  });
  const errorMarkup = error && (
    <StyledErrorMarkup>
      <InlineError message={error} fieldID={finalName} />
    </StyledErrorMarkup>
  );
  return (
    <StyledWrapperChoiceList>
      {titleMarkup}
      <StyledChoiceList>{choicesMarkup}</StyledChoiceList>
      {errorMarkup}
    </StyledWrapperChoiceList>
  );
}

const StyledWrapperChoiceList = styled.fieldset`
  border: 0;
  margin: ${(p) => p.theme.spacing(0)};
  padding: ${(p) => p.theme.spacing(0)};
`;

const StyledChoiceList = styled.ul`
  list-style: none;
  padding-left: ${(p) => p.theme.spacing(0)};
  margin: ${(p) => p.theme.spacing(0, 0)};
`;

const StyledTitleMarkup = styled.legend`
  padding-bottom: ${(p) => p.theme.spacing(1)};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
  font-size: ${(p) => p.theme.typography.fontSize200};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
`;

const StyledChoiceChildren = styled.div`
  padding-left: calc(${(p) => p.theme.spacing(5)} + ${(p) => p.theme.spacing(2)});
  ${(p) => p.theme.breakpoints.down("md")} {
    padding-left: calc(${(p) => p.theme.spacing(5)} + ${(p) => p.theme.spacing(0.5)} + ${(p) => p.theme.spacing(2)});
  }
`;

const StyledWrapperControlComponent = styled.li`
  padding: ${(p) => p.theme.spacing(0.5, 0)};
`;

const StyledErrorMarkup = styled.div`
  padding: ${(p) => p.theme.spacing(1, 0, 2, 0)};
`;

const noop = () => {};
