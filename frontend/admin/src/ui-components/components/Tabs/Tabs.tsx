import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowCaretDownIcon, MoreHorizontalIcon } from "@/ui-icons";

import type { Theme } from "../../themes/types";
import { focusRing, unstyledButton } from "../../utils/styles";
import { useToggle } from "../../utils/useToggle";
import { Icon } from "../Icon";
import { Popover } from "../Popover";
import { Stack } from "../Stack";
import { UnstyledLink } from "../UnstyledLink";

import { Tab } from "./Tab";
import { TabDescriptor } from "./types";
import { useTab } from "./useTab";

export interface TabsProps {
  /** Nội dung trong Tab */
  children?: React.ReactNode;
  /** Index Tab đang được chọn */
  selected: number;
  /** Danh sách các tabs */
  tabs: TabDescriptor[];
  /** Mở rộng các tab theo kích thước của container */
  fitted?: boolean;
  /** Thay dấu 3 chấm khi nội dung các tabs dài hơn màn hình */
  disclosureText?: string;
  /** Callback khi chọn tab */
  onSelect?(selectedTabIndex: number): void;
  /** Callback khi xóa tab */
  onDelete?(selectedTabIndex: number): void;
}

/**
 * Tabs dùng cho việc lưu các bộ lọc của các màn danh sách hoặc có thể sử dụng làm menu ngang
 */
export function Tabs({ tabs, selected, fitted, children, disclosureText, onSelect, onDelete }: TabsProps) {
  const { value: isOpenHiddenTabs, toggle: toggleOpenHiddenTabs, setFalse: hideHiddenTabs } = useToggle(false);
  const { measurementContainerRef, visibleTabs, hiddenTabs } = useTab(tabs, selected);

  const handleTabSelected = (id: string) => {
    const selectedIndex = tabs.findIndex((tab) => tab.id === id);
    if (selectedIndex !== -1) {
      hideHiddenTabs();
      selectedIndex !== selected && onSelect?.(selectedIndex);
    }
  };

  const tabsMarkup = tabs.map((tab, index) => (
    <Tab
      key={tab.id}
      selected={index === selected}
      url={tab.url}
      onClick={() => handleTabSelected(tab.id)}
      canDelete={tab.canDelete && selected === index}
      onDelete={() => onDelete?.(index)}
    >
      {tab.content}
    </Tab>
  ));
  const visibleTabsMarkup = tabsMarkup.filter((_, index) => visibleTabs.includes(index));

  const disclosureMarkup = (
    <Tab onClick={toggleOpenHiddenTabs}>
      {disclosureText ? (
        <Stack spacing="none" alignment="center" wrap={false}>
          {disclosureText}
          <Icon source={ArrowCaretDownIcon} color="subdued" />
        </Stack>
      ) : (
        <Icon source={MoreHorizontalIcon} />
      )}
    </Tab>
  );

  const hasDisclosure = visibleTabsMarkup.length < tabsMarkup.length;
  const activatorMarkup = hasDisclosure ? (
    <Popover activator={disclosureMarkup} active={isOpenHiddenTabs} onClose={hideHiddenTabs}>
      <StyledDisclosureList>
        {tabs
          .filter((_, index) => hiddenTabs.includes(index))
          .map((tab) =>
            tab.url ? (
              <StyledDisclosureLink key={tab.id} url={tab.url} onClick={() => handleTabSelected(tab.id)}>
                {tab.content}
              </StyledDisclosureLink>
            ) : (
              <StyledDisclosureButton key={tab.id} type="button" onClick={() => handleTabSelected(tab.id)}>
                {tab.content}
              </StyledDisclosureButton>
            )
          )}
      </StyledDisclosureList>
    </Popover>
  ) : null;

  return (
    <>
      <StyledTabMeasurer ref={measurementContainerRef}>
        {tabsMarkup}
        {disclosureMarkup}
      </StyledTabMeasurer>
      <StyledTabList fitted={fitted} role="tablist">
        {visibleTabsMarkup}
        {activatorMarkup}
      </StyledTabList>
      <StyledPanel>{children}</StyledPanel>
    </>
  );
}

const StyledPanel = styled.div`
  &:focus {
    outline: none;
  }
`;

const StyledTabList = styled.ul<{
  fitted?: TabsProps["fitted"];
}>`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: ${(p) => p.theme.shape.borderDivider};
  ${(p) =>
    p.fitted &&
    css`
      flex-wrap: nowrap;
      > * {
        flex: 1;
      }
    `}
`;

const StyledTabMeasurer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  visibility: hidden;
  height: 0;
`;

const StyledDisclosureList = styled.ul`
  list-style-type: none;
  padding: ${(p) => p.theme.spacing(2)};
  margin: 0;
`;

const itemStyle = (theme: Theme) => css`
  ${unstyledButton}
  ${focusRing(theme)}
  display: block;
  width: 100%;
  min-height: ${theme.spacing(4)};
  padding: ${theme.spacing(2, 4)};
  text-align: left;
  border-radius: ${theme.shape.borderRadius("base")};
  text-decoration: none;

  &:hover {
    background-color: ${theme.colors.surfaceHovered};
  }

  &:active {
    background-color: ${theme.colors.surfacePressed};
  }

  &:focus-visible {
    ${focusRing(theme, { style: "focused" })}
  }
`;

const StyledDisclosureButton = styled.button`
  ${(p) => itemStyle(p.theme)}
`;

const StyledDisclosureLink = styled(UnstyledLink)`
  ${(p) => itemStyle(p.theme)}
`;
