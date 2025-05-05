import React, { useContext, useLayoutEffect, useRef } from "react";
import { SearchIcon } from "@/ui-icons";

import { useI18n } from "../../../utils/i18n";
import { useUniqueId } from "../../../utils/uniqueId";
import { Icon } from "../../Icon";
import { usePopover } from "../../Popover/context";
import { TextField, TextFieldProps } from "../../TextField";
import { OptionItemContent } from "../context";
import { Pane } from "../Pane";

export interface OptionSearchProps
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
  > {
  /**
   * @default true
   */
  autoFocus?: boolean;
}

export function OptionSearch({
  value,
  autoFocus = true,
  prefix: prefixProp,
  placeholder: placeholderProp,
  ...rest
}: OptionSearchProps) {
  const i18n = useI18n();
  const searchId = useUniqueId("OptionSearch");
  const limitWidth = useContext(OptionItemContent)?.limitWidth;
  const placeholder = placeholderProp || i18n.translate("UI.Combobox.headerSearch");
  const prefixMarkup = prefixProp ? prefixProp : <Icon source={SearchIcon} color="base" />;
  const { isPositioned } = usePopover();
  const ref = useRef<HTMLDivElement>(null);

  // Because floating-ui position after mount, so autofocus input inside popper content causes scroll jump.
  // Then we manual focus input using preventScroll api
  // see: https://floating-ui.com/docs/react#effects
  // see: https://stackoverflow.com/questions/4963053/focus-to-input-without-scrolling
  useLayoutEffect(() => {
    if (autoFocus && isPositioned && ref.current) {
      // add timeout for Popoover#autofocusTarget default "container"
      setTimeout(() => {
        ref.current?.querySelector("input")?.focus({
          preventScroll: true,
        });
      });
    }
  }, [autoFocus, isPositioned]);

  return (
    <Pane fixed limitWidth={limitWidth}>
      <div ref={ref}>
        <TextField
          {...rest}
          value={value}
          id={searchId}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          prefix={prefixMarkup}
          borderless
        />
      </div>
    </Pane>
  );
}
