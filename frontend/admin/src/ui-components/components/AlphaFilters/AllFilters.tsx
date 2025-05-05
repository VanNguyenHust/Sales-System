import React, { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CloseBigIcon, SearchIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { boundary } from "../../utils/shared";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Scrollable } from "../Scrollable";
import { Sheet } from "../Sheet";
import { Text } from "../Text";
import { TextField } from "../TextField";

import { Filter } from "./Filter";
import { AlphaFilterGroupInterface, AlphaFilterInterface } from "./types";
import { isGroup } from "./utils";

interface AllFiltersProps {
  open: boolean;
  dismissToggle(): void;
  filters: (AlphaFilterInterface | AlphaFilterGroupInterface)[];
  showSearchFilter?: boolean;
  searchFilterFunc?: (label: string, query: string) => boolean;
  onSubmit?(): void;
  onClearAll(): void;
}

function defaultSearchFunc(label: string, query: string) {
  return !query || label.toLowerCase().indexOf(query.toLowerCase()) >= 0;
}

export const AllFilters = ({
  open,
  dismissToggle,
  filters,
  onClearAll,
  showSearchFilter,
  searchFilterFunc = defaultSearchFunc,
  onSubmit,
}: AllFiltersProps) => {
  const i18n = useI18n();
  const [query, setQuery] = useState<string>("");

  const filtersMarkup = filters
    .filter((filter) => isGroup(filter) || searchFilterFunc(filter.label, query))
    .map((filter, index) =>
      isGroup(filter) ? (
        <StyledFilterGroup key={`${filter.label}Group`} first={index === 0}>
          <StyledFilterGroupTitle>
            <Text as="h4" variant="headingMd">
              {filter.label}
            </Text>
          </StyledFilterGroupTitle>
          {filter.filters
            .filter((filter) => searchFilterFunc(filter.label, query))
            .map((filterInGroup) => (
              <Filter key={filterInGroup.key} filter={filterInGroup} inGroup />
            ))}
        </StyledFilterGroup>
      ) : (
        <Filter key={filter.key} filter={filter} />
      )
    );

  const searchFilterMarkup = showSearchFilter ? (
    <StyledFilterSearch>
      <TextField
        prefix={<Icon source={SearchIcon} color="base" />}
        placeholder={i18n.translate("UI.Filters.searchFilters")}
        value={query}
        onChange={setQuery}
        clearButton
        onClearButtonClick={() => setQuery("")}
      />
    </StyledFilterSearch>
  ) : null;

  const primaryActionMarkup = onSubmit ? (
    <Button
      primary
      onClick={() => {
        onSubmit();
        dismissToggle();
      }}
    >
      {i18n.translate("UI.Filters.submit")}
    </Button>
  ) : (
    <Button primary onClick={dismissToggle}>
      {i18n.translate("UI.Filters.done")}
    </Button>
  );

  return (
    <Sheet open={open} onClose={dismissToggle}>
      <StyledWrapper>
        <StyledHeader>
          <Text variant="headingLg" as="h3">
            {i18n.translate("UI.Filters.moreFilters")}
          </Text>
          <Button plain icon={CloseBigIcon} onClick={dismissToggle} />
        </StyledHeader>
        {searchFilterMarkup}
        <StyledBodyWrapper hideSearchFilter={!showSearchFilter} {...boundary.props}>
          <StyledScrollable>
            <StyledBody>{filtersMarkup}</StyledBody>
          </StyledScrollable>
        </StyledBodyWrapper>

        <StyledFooter>
          <Button outline destructive onClick={onClearAll}>
            {i18n.translate("UI.Filters.clearAllFilters")}
          </Button>
          {primaryActionMarkup}
        </StyledFooter>
      </StyledWrapper>
    </Sheet>
  );
};

const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledFilterGroup = styled.div<{
  first?: boolean;
}>`
  margin-top: ${(p) => (p.first ? p.theme.spacing(0) : p.theme.spacing(4))};
`;

const StyledFilterGroupTitle = styled.div`
  padding: ${(p) => p.theme.spacing(1)} ${(p) => p.theme.spacing(3)}
    calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)});
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  height: calc(${(p) => p.theme.components.form.controlHeight} + ${(p) => p.theme.spacing(4)});
  padding: ${(p) => p.theme.spacing(0, 5)};
  border-bottom: ${(p) => p.theme.shape.borderDivider};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledBody = styled.div``;

const StyledFilterSearch = styled.div`
  margin-top: ${(p) => p.theme.spacing(4)};
  margin-bottom: ${(p) => p.theme.spacing(4)};
  padding: ${(p) => p.theme.spacing(0, 5)};
`;

const StyledBodyWrapper = styled.div<{
  hideSearchFilter?: boolean;
}>`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  ${(p) =>
    p.hideSearchFilter &&
    css`
      padding-top: ${p.theme.spacing(4)};
    `}
`;

const StyledScrollable = styled(Scrollable)`
  padding-top: 0.25rem;
  padding-left: ${(p) => p.theme.spacing(2)};
  flex: 1 1 0;
  border-bottom: ${(p) => p.theme.shape.borderDivider};
  /* TODO: fix scrollbar shift but not ready for all browser */
  scrollbar-gutter: stable;
`;

const StyledFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: ${(p) => p.theme.spacing(4, 5)};
  gap: ${(p) => p.theme.spacing(3)};

  ${(p) => p.theme.breakpoints.up("sm")} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: ${(p) => p.theme.spacing(4)};
  }
`;
