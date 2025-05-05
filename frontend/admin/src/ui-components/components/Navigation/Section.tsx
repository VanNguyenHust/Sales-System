import React, { useContext, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { unstyledButton } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { useToggle } from "../../utils/useToggle";
import { Collapsible } from "../Collapsible";
import { Icon, IconProps } from "../Icon";
import { Text } from "../Text";
import { Tooltip, TooltipProps } from "../Tooltip";

import { Item, ItemProps, ToggleRollupItem } from "./Item";
import { NavigationContext } from "./NavigationContext";
import { StyledList } from "./Secondary";

export interface SectionProps {
  /** Danh sách các item để render trong section */
  items: ItemProps[];
  /** Tiêu đề của section */
  title?: string;
  /** Icon hiển thị bên cạnh tiêu đề */
  icon?: IconProps["source"];
  /** Vẽ đường viền ngăn cách cho section */
  separator?: boolean;
  /** Dùng để cuộn các item trong section */
  rollup?: {
    /** Cuộn các item sau chỉ số cho trước (1-based index) */
    after: number;
    /** label hỗ trợ của nút view thanh cuộn */
    accessibilityViewLabel?: string;
    /** label hỗ trợ của nút hide thanh cuộn */
    accessibilityHideLabel?: string;
  };
  /** Hiển thị icon thể hiện hành động hỗ trợ cho section */
  action?: {
    /** Icon cho hành động */
    icon: IconProps["source"];
    /** label hỗ trợ của hành động */
    accessibilityLabel?: string;
    /** tooltip của hành động */
    tooltip?: TooltipProps;
    /** Callback của hành động */
    onClick(): void;
  };
}

export function Section({ items, title, action, separator, rollup }: SectionProps) {
  const { value: expanded, toggle: toggleExpanded } = useToggle(false);
  const { collapsed } = useContext(NavigationContext);
  const [expandedIndex, setExpandedIndex] = useState<number>();

  const buttonMarkup = action ? (
    <StyledAction onClick={action.onClick} aria-label={action.accessibilityLabel}>
      <Icon source={action.icon} />
    </StyledAction>
  ) : null;

  const actionMarkup =
    action && (action.tooltip ? <Tooltip {...action.tooltip}>{buttonMarkup}</Tooltip> : buttonMarkup);

  const sectionHeadingMarkup = title && (
    <StyledHeading collapsed={collapsed}>
      {!collapsed && (
        <StyledHeadingText>
          <Text as="span" variant="headingSm" fontWeight="medium" breakWord>
            {title}
          </Text>
        </StyledHeadingText>
      )}
      {actionMarkup}
    </StyledHeading>
  );

  const itemsMarkup = items.map((item, index) => {
    const { onClick, label, subNavigationItems, ...rest } = item;

    const handleToggleExpand = () => {
      if (expandedIndex === index) {
        setExpandedIndex(-1);
      } else {
        setExpandedIndex(index);
      }
    };

    return (
      <Item
        key={label}
        {...rest}
        label={label}
        expanded={expandedIndex === index}
        subNavigationItems={subNavigationItems}
        onToggleExpand={handleToggleExpand}
        onClick={onClick}
      />
    );
  });

  const activeItemsMarkup = rollup ? itemsMarkup.slice(0, rollup.after) : itemsMarkup;

  const toggleRollupMarkup = rollup && items.length > rollup.after && (
    <ToggleRollupItem
      onClick={toggleExpanded}
      accessibilityLabel={expanded ? rollup.accessibilityHideLabel : rollup.accessibilityViewLabel}
    />
  );

  const additionalItems = rollup ? itemsMarkup.slice(rollup.after) : [];

  const additionalItemsId = useUniqueId("AdditionalItems");

  const additionalItemsMarkup = rollup && additionalItems.length > 0 && (
    <StyledRollupSection>
      <Collapsible id={additionalItemsId} open={expanded}>
        <StyledList>{additionalItems}</StyledList>
      </Collapsible>
      {toggleRollupMarkup}
    </StyledRollupSection>
  );
  return (
    <StyledSection separator={separator}>
      {sectionHeadingMarkup}
      {activeItemsMarkup}
      {additionalItemsMarkup}
    </StyledSection>
  );
}

const StyledAction = styled.button`
  ${unstyledButton}
  display: flex;
  align-items: center;
  height: ${(p) => p.theme.components.navigation.mobileHeight};
  padding: ${(p) => p.theme.spacing(1)} calc(${(p) => p.theme.spacing(2)} - ${(p) => p.theme.spacing(0.5)});
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  svg {
    color: ${(p) => p.theme.components.navigation.iconColor};
    fill: ${(p) => p.theme.components.navigation.iconColor};
  }

  ${(p) => p.theme.breakpoints.up("md")} {
    height: ${(p) => p.theme.components.navigation.desktopHeight};
  }

  &:hover,
  &:focus {
    background: ${(p) => p.theme.components.navigation.backgroundHoveredColor};
    svg {
      color: ${(p) => p.theme.components.navigation.textColor};
      fill: ${(p) => p.theme.components.navigation.textColor};
    }
  }

  &:focus:hover {
    svg {
      color: ${(p) => p.theme.components.navigation.textColor};
      fill: ${(p) => p.theme.components.navigation.textColor};
    }
  }

  &:active,
  &:active:hover {
    background: ${(p) => p.theme.components.navigation.backgroundPressedColor};
    svg {
      color: ${(p) => p.theme.components.navigation.textColor};
      fill: ${(p) => p.theme.components.navigation.textColor};
    }
  }

  &:focus,
  &:active {
    outline: none;
  }

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledHeading = styled.li<{ collapsed?: boolean }>`
  text-transform: none;
  display: flex;
  align-items: center;
  min-height: ${(p) => p.theme.components.navigation.desktopHeight};
  padding: ${(p) => (p.collapsed ? p.theme.spacing(0, 2) : p.theme.spacing(0, 3))};
  width: ${(p) =>
    p.collapsed ? p.theme.components.navigation.collapsedWidth : p.theme.components.navigation.baseWidth};
  > :first-of-type {
    ${(p) => p.theme.breakpoints.down("md")} {
      font-size: ${(p) => p.theme.typography.fontSize100};
      line-height: ${(p) => p.theme.typography.fontLineHeight2};
    }
  }
`;

const StyledHeadingText = styled.div`
  color: ${(p) => p.theme.components.navigation.textColor};
  text-transform: uppercase;
  padding: ${(p) => p.theme.spacing(0, 2)};
  flex-grow: 1;
`;

const StyledSection = styled.ul<{
  separator?: boolean;
}>`
  flex: 0 0 auto;
  margin: 0;
  padding: ${(p) => p.theme.spacing(2, 0)};
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(1)};
  &:not(:first-of-type) {
    padding-top: ${(p) => p.theme.spacing(2)};
    padding-bottom: ${(p) => p.theme.spacing(2)};
  }

  ${(p) =>
    p.separator &&
    css`
      border-top: ${`${p.theme.shape.borderWidth(1)} solid ${p.theme.components.navigation.dividerColor}`};
    `}
`;

const StyledRollupSection = styled.li`
  opacity: 1;
`;
