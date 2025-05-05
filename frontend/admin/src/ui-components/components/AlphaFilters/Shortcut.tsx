import React, { useCallback, useMemo, useState } from "react";
import type { JSX } from "react";

import { isElementOfType, wrapWithComponent } from "../../utils/components";
import { useI18n } from "../../utils/i18n";
import { Button } from "../Button";
import { Popover } from "../Popover";
import { PaneHint } from "../Popover/PaneHint";

import { FilterItemContentType, FilterItemContext } from "./context";
import { FilterButton } from "./FilterButton";
import { Item } from "./Item";
import { NoItem } from "./NoItem";
import { OptionItem } from "./OptionItem";
import { Pane } from "./Pane";
import { AlphaFilterInterface } from "./types";

interface ShortcutProps extends AlphaFilterInterface {
  filterKey: string;
  index: number;
  length: number;
  hasMore: boolean;
}

export const Shortcut = ({
  filterKey,
  index,
  label,
  filter,
  length,
  disabled,
  onSubmit,
  onShortcutOpen,
  hasMore,
}: ShortcutProps) => {
  const i18n = useI18n();
  const [shortcutActive, setShortcutActive] = useState(false);

  const handleShortcutClick = useCallback(() => {
    if (!shortcutActive) {
      setShortcutActive(true);
      onShortcutOpen?.();
    } else {
      setShortcutActive(false);
    }
  }, [onShortcutOpen, shortcutActive]);

  const closeShortcut = useCallback(() => setShortcutActive(false), []);

  const buttonActivatorMarkup = (
    <FilterButton
      first={index === 0}
      last={index === length - 1 && !hasMore}
      disclosure
      disabled={disabled}
      onClick={handleShortcutClick}
      pressed={shortcutActive}
    >
      {label}
    </FilterButton>
  );

  const isOptionItem = isElementOfType(filter, OptionItem) || isElementOfType(filter, NoItem);
  let filterMarkup: JSX.Element | React.ReactNode;
  if (isOptionItem) {
    filterMarkup = filter;
  } else {
    filterMarkup = wrapWithComponent(filter, Item, {});
  }

  const filterItemContext: FilterItemContentType = useMemo(
    () => ({
      inShortcut: true,
    }),
    []
  );

  return (
    <FilterItemContext.Provider value={filterItemContext}>
      <Popover
        active={shortcutActive}
        onClose={closeShortcut}
        activator={buttonActivatorMarkup}
        preventCloseOnChildOverlayClick
      >
        <PaneHint>{filterMarkup}</PaneHint>
        <Pane sectioned fixed>
          <Button
            primary
            fullWidth
            onClick={() => {
              onSubmit?.(filterKey);
              setShortcutActive(false);
            }}
          >
            {i18n.translate("UI.Filters.submit")}
          </Button>
        </Pane>
      </Popover>
    </FilterItemContext.Provider>
  );
};
