import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { useI18n } from "../../utils/i18n";
import { FilterButton } from "../AlphaFilters/FilterButton";
import { Button } from "../Button";
import { Focus } from "../Focus";
import { Popover } from "../Popover";

import { FilterItemContentType, FilterItemContext, useFilters } from "./context";
import { Item } from "./Item";
import { FilterInterface } from "./types";

interface ShortcutProps extends FilterInterface {
  index: number;
  length: number;
  shortcutKey: string;
  hasMore: boolean;
}

export const Shortcut = ({
  index,
  label,
  filter,
  length,
  disabled,
  shortcutKey,
  hideClearButton,
  submitAction,
  onShortcutOpen,
  hasMore,
}: ShortcutProps) => {
  const i18n = useI18n();
  const shortcutRef = useRef<HTMLDivElement>(null);
  const [shortcutActive, setShortcutActive] = useState(false);
  const context = useFilters();

  const hasFilterValue = Boolean(context.appliedFilters.find((item) => item.key === shortcutKey));

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

  const filterMarkup = wrapWithComponent(filter, Item, {});

  const submitActionMarkup = submitAction ? (
    <Button
      primary
      fullWidth={hideClearButton}
      onClick={() => {
        submitAction.onAction?.();
        const { autoCloseShortcut = true } = submitAction;
        if (autoCloseShortcut) {
          setShortcutActive(false);
        }
      }}
      disabled={submitAction.disabled}
    >
      {submitAction.content}
    </Button>
  ) : null;

  const clearActionMarkup = !hideClearButton ? (
    <Button plain onClick={() => context.clearFilter(shortcutKey)} disabled={!hasFilterValue}>
      {i18n.translate("UI.Common.clear")}
    </Button>
  ) : null;

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
        autofocusTarget="none"
      >
        <StyledShortcut ref={shortcutRef}>
          <Focus root={shortcutRef as React.RefObject<HTMLElement>} disabled={!shortcutActive}>
            {filterMarkup}
            {(submitActionMarkup || clearActionMarkup) && (
              <StyledShortcutAction>
                {clearActionMarkup}
                {submitActionMarkup}
              </StyledShortcutAction>
            )}
          </Focus>
        </StyledShortcut>
      </Popover>
    </FilterItemContext.Provider>
  );
};

const StyledShortcut = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledShortcutAction = styled.div`
  padding: ${(p) => p.theme.spacing(0, 3, 3)};
  display: flex;
  justify-content: space-between;
`;
