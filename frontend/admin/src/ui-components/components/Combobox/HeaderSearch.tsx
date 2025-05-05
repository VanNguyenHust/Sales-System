import React, { useCallback, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { SearchIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { useUniqueId } from "../../utils/uniqueId";
import { Icon } from "../Icon";
import { usePopover } from "../Popover/context";
import { TextField, TextFieldProps } from "../TextField";

import { useComboboxHeader } from "./context";
import { HeaderItem } from "./HeaderItem";

export interface HeaderSearchProps
  extends Pick<
    TextFieldProps,
    | "value"
    | "prefix"
    | "suffix"
    | "disabled"
    | "autoFocus"
    | "placeholder"
    | "selectTextOnFocus"
    | "onChange"
    | "clearButton"
    | "onFocus"
    | "onBlur"
    | "onClearButtonClick"
    | "borderless"
  > {
  /**
   * @default true
   */
  autoFocus?: boolean;
  /**
   * @default true
   */
  borderless?: boolean;
}

export function HeaderSearch({
  value,
  autoFocus = true,
  borderless = true,
  prefix: prefixProp,
  placeholder: placeholderProp,
  onFocus,
  ...rest
}: HeaderSearchProps) {
  const i18n = useI18n();
  const searchId = useUniqueId("HeaderSearch");
  const placeholder = placeholderProp || i18n.translate("UI.Combobox.headerSearch");
  const prefixMarkup = prefixProp ? prefixProp : <Icon source={SearchIcon} color="base" />;
  const { setTextFieldFocusedIn } = useComboboxHeader();
  const { isPositioned } = usePopover();
  const ref = useRef<HTMLDivElement>(null);

  // Because floating-ui position after mount, so autofocus input inside popper content causes scroll jump.
  // Then we manual focus input using preventScroll api
  // see: https://floating-ui.com/docs/react#effects
  // see: https://stackoverflow.com/questions/4963053/focus-to-input-without-scrolling
  useLayoutEffect(() => {
    if (autoFocus && isPositioned && ref.current) {
      ref.current.querySelector("input")?.focus({
        preventScroll: true,
      });
    }
  }, [autoFocus, isPositioned]);

  const handleFocus = useCallback(
    (event?: React.FocusEvent) => {
      onFocus?.(event);
      setTextFieldFocusedIn?.(true);
    },
    [onFocus, setTextFieldFocusedIn]
  );

  return (
    <HeaderItem flush>
      <StyledSearchField ref={ref}>
        <TextField
          {...rest}
          value={value}
          id={searchId}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          prefix={prefixMarkup}
          onFocus={handleFocus}
          borderless={borderless}
        />
      </StyledSearchField>
    </HeaderItem>
  );
}

const StyledSearchField = styled.div``;
