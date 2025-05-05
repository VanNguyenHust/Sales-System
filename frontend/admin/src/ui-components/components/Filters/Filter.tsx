import React, { useMemo, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronRightIcon } from "@/ui-icons";

import { wrapWithComponent } from "../../utils/components";
import { useI18n } from "../../utils/i18n";
import { useToggle } from "../../utils/useToggle";
import { TagRollup } from "../AlphaFilters/TagRollup";
import { Button } from "../Button";
import { Collapsible } from "../Collapsible";
import { Focus } from "../Focus";
import { Icon } from "../Icon";
import { Tag } from "../Tag";
import { Text } from "../Text";

import { FilterItemContentType, FilterItemContext, useFilters } from "./context";
import { Item } from "./Item";
import { FilterInterface } from "./types";

interface FilterProps {
  filter: FilterInterface;
  inGroup?: boolean;
}

export const Filter = ({ filter, inGroup }: FilterProps) => {
  const i18n = useI18n();
  const { appliedFilters, clearFilter } = useFilters();
  const filterRef = useRef<HTMLDivElement>(null);
  const appliedFilter = appliedFilters.find((item) => item.key === filter.key);
  const { value: readyForFocus, setTrue: setReadyForFocusTrue } = useToggle(false);
  const { value: expanded, toggle: toggleExpand } = useToggle(false);
  const { value: expandedTagValues, toggle: toggleExpandedTagValues } = useToggle(false);
  const stopPropagationRef = useRef(false);

  const stopPropagation = () => {
    stopPropagationRef.current = true;
  };

  const handleExpandClick = () => {
    if (stopPropagationRef.current) {
      stopPropagationRef.current = false;
    } else if (!filter.disabled) {
      toggleExpand();
    }
  };

  const labelValuesMarkup = filter.labelValues
    ? filter.labelValues.map((tag) => (
        <StyledTagWrapper key={tag.key} onClick={stopPropagation}>
          <Tag onRemove={tag.onRemove}>{tag.label}</Tag>
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
      <span onClick={stopPropagation}>
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

  const filterValueMarkup =
    !expanded && hasFilterValue ? (
      <StyledFilterValuesWrapper>
        {activeLabelValuesMarkup}
        {additionalLabelValuesMarkup}
        {defaultLabelValueMarkup}
      </StyledFilterValuesWrapper>
    ) : null;

  const clearButtonMarkup = !filter.hideClearButton ? (
    <StyledClear>
      <Button plain onClick={() => clearFilter(filter.key)} disabled={!appliedFilter}>
        {i18n.translate("UI.Common.clear")}
      </Button>
    </StyledClear>
  ) : null;

  const context: FilterItemContentType = useMemo(
    () => ({
      inGroup,
    }),
    [inGroup]
  );

  const filterMarkup = wrapWithComponent(filter.filter, Item, {});

  return (
    <StyledFilter inGroup={inGroup} ref={filterRef}>
      <StyledTitleWrapper
        active={hasFilterValue}
        disabled={filter.disabled}
        expanded={expanded}
        onClick={!filter.disabled ? handleExpandClick : undefined}
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

      <Collapsible
        open={expanded}
        transition={{ duration: "100ms", timingFunction: "ease-out" }}
        onAnimationEnd={setReadyForFocusTrue}
      >
        <FilterItemContext.Provider value={context}>
          <Focus root={filterRef as React.RefObject<HTMLElement>} disabled={!expanded || !readyForFocus}>
            <StyledFilterContent>
              {filterMarkup}
              {clearButtonMarkup}
            </StyledFilterContent>
          </Focus>
        </FilterItemContext.Provider>
      </Collapsible>
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
`;

const StyledTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(3)};
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
`;

const StyledFilterContent = styled.div`
  margin-top: ${(p) => p.theme.spacing(0.5)};
`;

const StyledClear = styled.div`
  padding-left: ${(p) => p.theme.spacing(3)};
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
