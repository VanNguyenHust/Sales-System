import React, { useMemo, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronRightIcon } from "@/ui-icons";

import { isElementOfType, wrapWithComponent } from "../../utils/components";
import { useI18n } from "../../utils/i18n";
import { useToggle } from "../../utils/useToggle";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Popover } from "../Popover";
import { PaneHint } from "../Popover/PaneHint";
import { Tag } from "../Tag";
import { Text } from "../Text";

import { FilterItemContentType, FilterItemContext, FilterPopoverLayerContext, useFilters } from "./context";
import { Item } from "./Item";
import { NoItem } from "./NoItem";
import { OptionItem } from "./OptionItem";
import { TagRollup } from "./TagRollup";
import { AlphaFilterInterface } from "./types";

interface FilterProps {
  filter: AlphaFilterInterface;
  inGroup?: boolean;
}

export const Filter = ({ filter, inGroup }: FilterProps) => {
  const i18n = useI18n();
  const { appliedFilters, clearFilter } = useFilters();
  const appliedFilter = appliedFilters.find((item) => item.key === filter.key);
  const { value: expanded, toggle: toggleExpand, setFalse: closeExpand } = useToggle(false);
  const { value: expandedTagValues, toggle: toggleExpandedTagValues } = useToggle(false);
  const stopPropagationRef = useRef(false);

  const stopPropagation = () => {
    stopPropagationRef.current = true;
  };

  const stopPropagationIfKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      stopPropagationRef.current = true;
    }
  };

  const handleExpandClick = () => {
    if (stopPropagationRef.current) {
      stopPropagationRef.current = false;
    } else if (!filter.disabled) {
      toggleExpand();
    }
  };

  const handleExpandKeyDown = (e: React.KeyboardEvent) => {
    if (stopPropagationRef.current) {
      stopPropagationRef.current = false;
    } else if (!filter.disabled && (e.key === "Enter" || e.key === " ")) {
      toggleExpand();
    }
  };

  const labelValuesMarkup = filter.labelValues
    ? filter.labelValues.map((tag) => (
        <StyledTagWrapper key={tag.key} onClick={stopPropagation} onKeyDown={stopPropagationIfKeyDown}>
          <Tag key={tag.key} onRemove={tag.onRemove}>
            {tag.label}
          </Tag>
        </StyledTagWrapper>
      ))
    : [];

  const rollup = labelValuesMarkup.length && filter.labelValuesRollupAfter;

  const activeLabelValuesMarkup = rollup
    ? labelValuesMarkup.slice(0, filter.labelValuesRollupAfter)
    : labelValuesMarkup;

  const additionalLabelValues = rollup ? labelValuesMarkup.slice(filter.labelValuesRollupAfter) : [];

  const additionalLabelValuesMarkup =
    rollup && additionalLabelValues.length > 0 && !expandedTagValues ? (
      <span onClick={stopPropagation} onKeyDown={stopPropagationIfKeyDown}>
        <TagRollup key="rollup" onClick={toggleExpandedTagValues}>
          +{additionalLabelValues.length}
        </TagRollup>
      </span>
    ) : (
      additionalLabelValues
    );

  const defaultLabelValueMarkup =
    !filter.labelValues && appliedFilter ? <StyledDefaultLabel>{appliedFilter.label}</StyledDefaultLabel> : null;

  const hasFilterValue = (filter.labelValues || []).length > 0 || !!defaultLabelValueMarkup;

  const clearButtonMarkup = !filter.hideClearButton ? (
    <span style={{ alignSelf: "flex-start" }} onClick={stopPropagation} onKeyDown={stopPropagationIfKeyDown}>
      <Button
        plain
        onClick={() => (filter.onClear ? filter.onClear(filter.key) : clearFilter(filter.key))}
        disabled={!hasFilterValue}
      >
        {i18n.translate("UI.Common.clear")}
      </Button>
    </span>
  ) : null;

  const filterValueMarkup =
    !expanded && hasFilterValue ? (
      <StyledFilterHeadWrapper>
        <StyledFilterValuesWrapper>
          {activeLabelValuesMarkup}
          {additionalLabelValuesMarkup}
          {defaultLabelValueMarkup}
        </StyledFilterValuesWrapper>
        {clearButtonMarkup}
      </StyledFilterHeadWrapper>
    ) : null;

  const context: FilterItemContentType = useMemo(
    () => ({
      inGroup,
    }),
    [inGroup]
  );

  const isOptionItem = isElementOfType(filter.filter, OptionItem) || isElementOfType(filter.filter, NoItem);
  let filterMarkup: JSX.Element | React.ReactNode;
  if (isOptionItem) {
    filterMarkup = filter.filter;
  } else {
    filterMarkup = wrapWithComponent(filter.filter, Item, {});
  }

  const controlMarkup = (
    <StyledTitleWrapper
      active={hasFilterValue}
      disabled={filter.disabled}
      expanded={expanded}
      onClick={!filter.disabled ? handleExpandClick : undefined}
      onKeyDown={!filter.disabled ? handleExpandKeyDown : undefined}
      tabIndex={filter.disabled ? undefined : 0}
    >
      <StyledTitle>
        <Text as="span" color={filter.disabled ? "subdued" : undefined}>
          {filter.label}
        </Text>
        <StyledArrow>
          <Icon source={ArrowChevronRightIcon} color={expanded ? "interactive" : "base"} />
        </StyledArrow>
      </StyledTitle>
      {filterValueMarkup}
    </StyledTitleWrapper>
  );

  return (
    <StyledFilter inGroup={inGroup}>
      <FilterPopoverLayerContext.Provider value>
        <FilterItemContext.Provider value={context}>
          <Popover
            active={expanded}
            onClose={closeExpand}
            activator={controlMarkup}
            preventCloseOnChildOverlayClick
            fullWidth
          >
            <PaneHint>{filterMarkup}</PaneHint>
          </Popover>
        </FilterItemContext.Provider>
      </FilterPopoverLayerContext.Provider>
    </StyledFilter>
  );
};

const StyledArrow = styled.span``;

const StyledDefaultLabel = styled.span`
  padding: ${(p) => p.theme.spacing(0.5, 3)};
  background-color: ${(p) => p.theme.colors.surfacePrimarySelected};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  color: ${(p) => p.theme.colors.text};
  outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
  overflow-wrap: anywhere;
  word-break: normal;
`;

const StyledTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledFilterHeadWrapper = styled.div<{ disable?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledFilterValuesWrapper = styled.div<{ disable?: boolean }>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: ${(p) => p.theme.spacing(1, 0)};
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledTitleWrapper = styled.div<{
  disabled?: boolean;
  expanded: boolean;
  active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  ${(p) => css`
    padding: calc(${p.theme.spacing(1)} + ${p.theme.spacing(0.5)}) ${p.theme.spacing(3)};
  `}
  padding-right: ${(p) => p.theme.spacing(2)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  ${(p) =>
    p.disabled
      ? css`
          color: ${p.theme.colors.textDisabled};
          background-color: ${p.theme.colors.surfaceDisabled};
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${p.theme.colors.surfacePrimarySelectedHovered};
          }
        `}

  ${StyledArrow} {
    transition: transform ease-in 100ms;
    transform: rotate(0);
  }

  ${(p) =>
    p.active &&
    !p.expanded &&
    !p.disabled &&
    css`
      background-color: ${p.theme.colors.surfacePrimarySelectedHovered};
    `}

  ${(p) =>
    p.expanded &&
    css`
      background-color: ${p.theme.colors.surfacePrimarySelectedHovered};
      ${StyledArrow} {
        transform: rotate(90deg);
      }
    `}

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledFilterContent = styled.div<{ inline?: boolean }>`
  ${(p) =>
    !p.inline &&
    css`
      margin-top: ${p.theme.spacing(1)};
    `}
`;

const StyledFilter = styled.div<{
  inGroup?: boolean;
}>`
  margin-bottom: ${(p) => p.theme.spacing(1)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  ${(p) =>
    p.inGroup &&
    css`
      ${StyledTitleWrapper} {
        margin-left: ${p.theme.spacing(3)};
      }
      ${StyledFilterContent} {
        padding-left: ${p.theme.spacing(3)};
      }
    `}
`;

const StyledTagWrapper = styled.span`
  max-width: 100%;
`;
