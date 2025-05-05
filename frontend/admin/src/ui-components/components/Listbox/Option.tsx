import React, { memo, useCallback, useContext, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useUniqueId } from "../../utils/uniqueId";
import { MappedActionContext } from "../Autocomplete/context";

import { ActionContext, useListbox } from "./context";
import { StyledTextOption, TextOption } from "./TextOption";

export interface OptionProps {
  /** Giá trị đơn nhất của item */
  value: string;
  /** Nội dung của option. Khi là string sẽ được render với style TextOption */
  children?: React.ReactNode;
  /** Option có được chọn */
  selected?: boolean;
  /** Option bị disable */
  disabled?: boolean;
  /** Đường viền bên dưới option */
  divider?: boolean;
}

export const Option = memo(function Option({ value, children, selected, disabled = false, divider }: OptionProps) {
  const { onOptionSelect } = useListbox();
  const mappedActionContext = useContext(MappedActionContext);
  const listItemRef = useRef<HTMLLIElement>(null);
  const domId = useUniqueId("ListboxOption");
  const isAction = useContext(ActionContext);
  const mappedAction = mappedActionContext?.onAction;

  const handleSelectOption = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      mappedAction?.();
      if (listItemRef.current && !mappedAction) {
        onOptionSelect({
          domId,
          value,
          element: listItemRef.current,
          disabled,
        });
      }
    },
    [mappedAction, onOptionSelect, domId, value, disabled]
  );

  // prevents lost of focus on Textfield
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const contentMarkup =
    typeof children === "string" ? (
      <TextOption selected={selected} disabled={disabled}>
        {children}
      </TextOption>
    ) : (
      children
    );

  return (
    <StyledOption
      data-listbox-option
      data-listbox-option-action={isAction}
      data-listbox-option-value={value}
      data-listbox-option-destructive={mappedActionContext?.destructive}
      id={domId}
      ref={listItemRef}
      tabIndex={-1}
      role={mappedActionContext?.role || "option"}
      aria-selected={selected}
      aria-disabled={disabled}
      onClick={disabled ? undefined : handleSelectOption}
      onMouseDown={handleMouseDown}
      divider={divider}
      mappedAction={!!mappedActionContext}
    >
      {contentMarkup}
    </StyledOption>
  );
});

const StyledOption = styled.li<{
  divider: OptionProps["divider"];
  mappedAction: boolean;
}>`
  display: flex;
  margin: 0;
  padding: 0;
  &:focus {
    outline: none;
  }
  ${(p) =>
    p.divider &&
    css`
      border-bottom: ${p.theme.shape.borderDivider};
    `}

  &:first-of-type > ${StyledTextOption} {
    margin-top: 0;
  }
  ${(p) =>
    p.mappedAction &&
    css`
      ${StyledTextOption} {
        margin-top: 0;
      }
    `}
`;
