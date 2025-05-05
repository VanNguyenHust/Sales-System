import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FilterButton } from "./FilterButton";
import { Shortcut } from "./Shortcut";
import { AlphaFilterInterface } from "./types";
import { useFilterControlMeasurement } from "./useFilterControlMeasurement";

interface Props {
  children: React.ReactNode;
  shortcuts: AlphaFilterInterface[];
  moreFilters?: React.ReactNode;
  auxiliary?: React.ReactNode;
  disabled?: boolean;
  queryFieldHidden?: boolean;
  forceShowMorefiltersButton?: boolean;
}

export const ConnectedFilterControl = ({
  children,
  shortcuts,
  moreFilters,
  auxiliary,
  disabled,
  queryFieldHidden,
  forceShowMorefiltersButton,
}: Props) => {
  const { availableWidth, measurementButtonsWidth, refs } = useFilterControlMeasurement(queryFieldHidden || false);

  const measurementMarkup = shortcuts.length ? (
    <StyledMeasurementContainer ref={refs.container}>
      {shortcuts.map(({ key, label, disabled: filterDisabled }) => (
        <div key={key} data-key={key}>
          <FilterButton key={key} disclosure disabled={disabled || filterDisabled}>
            {label}
          </FilterButton>
        </div>
      ))}
    </StyledMeasurementContainer>
  ) : null;

  const getShortcutsToRender = () => {
    let remainingWidth = availableWidth;
    const shortcutsToReturn: AlphaFilterInterface[] = [];
    for (let i = 0; remainingWidth > 0 && i < shortcuts.length; i++) {
      const shortcut = shortcuts[i];
      const shortcutWidth = measurementButtonsWidth[shortcut.key];
      if (shortcutWidth <= remainingWidth) {
        shortcutsToReturn.push(shortcut);
        remainingWidth -= shortcutWidth;
      } else {
        // When we can't fit an action, we break the loop.
        // The ones that didn't fit will be accessible through the "More filters" button
        break;
      }
    }
    return shortcutsToReturn;
  };

  const shortcutsToRender = getShortcutsToRender();

  const shouldRenderMoreFiltersButton = forceShowMorefiltersButton || shortcuts.length !== shortcutsToRender.length;

  const shortcutsMarkup = shortcutsToRender.length ? (
    <StyledShortcuts>
      {shortcutsToRender.map(({ key, disabled: filterDisabled, ...rest }, index) => (
        <Shortcut
          key={key}
          filterKey={key}
          index={index}
          length={shortcutsToRender.length}
          hasMore={shouldRenderMoreFiltersButton}
          disabled={disabled || filterDisabled}
          {...rest}
        />
      ))}
    </StyledShortcuts>
  ) : null;

  const moreFiltersMarkup = moreFilters ? (
    <StyledMoreFiltersContainer ref={refs.moreFilters} onlyMoreButton={shortcutsToRender.length === 0}>
      {shouldRenderMoreFiltersButton ? moreFilters : null}
    </StyledMoreFiltersContainer>
  ) : null;

  const auxMarkup = auxiliary ? <StyeldAuxiliaryContainer>{auxiliary}</StyeldAuxiliaryContainer> : null;

  return (
    <>
      {measurementMarkup}
      <StyledWrapper>
        <StyledFilterControl ref={refs.filterControl}>
          {children ? <StyledChildren>{children}</StyledChildren> : null}
          {shortcutsMarkup}
          {moreFiltersMarkup}
        </StyledFilterControl>
        {auxMarkup}
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
`;

const StyledMeasurementContainer = styled.div`
  position: absolute;
  top: -1000px;
  left: -1000px;
  display: flex;
  width: 100%;
  height: 0;
  visibility: hidden;
  overflow: hidden;
  > * {
    flex-shrink: 0;
  }
`;

const StyledFilterControl = styled.div`
  display: flex;
  flex-grow: 1;
  & + * {
    margin-left: ${(p) => p.theme.spacing(4)};
  }
`;

const StyledMoreFiltersContainer = styled.div<{
  onlyMoreButton?: boolean;
}>`
  button {
    ${(p) =>
      !p.onlyMoreButton &&
      css`
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        margin-left: calc(${p.theme.spacing(0.25)}*-1);
      `}
  }
`;

const StyledShortcuts = styled.div`
  display: flex;
  > * {
    flex-shrink: 0;
  }
`;

const StyledChildren = styled.div`
  flex: 1 1 auto;
  min-width: 100px;
  & + ${StyledShortcuts}, & + ${StyledMoreFiltersContainer} {
    margin-left: ${(p) => p.theme.spacing(4)};
  }
`;

const StyeldAuxiliaryContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`;
