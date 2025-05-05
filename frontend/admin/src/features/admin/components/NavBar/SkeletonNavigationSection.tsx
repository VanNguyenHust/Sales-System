import { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Text } from "@/ui-components";

import { useSelector } from "app/types";

type Props = {
  title?: string | true;
  separator?: boolean;
  items?: number;
};

export function SkeletonNavigationSection({ title, separator, items = 3 }: Props) {
  const collapsed = useSelector((state) => state.ui.navbarCollapsed);
  const itemLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < items; i++) {
      lines.push(
        <StyledItem key={i}>
          <StyledItemInner>
            <StyledIcon />
            {!collapsed && <StyledItemLabel />}
          </StyledItemInner>
        </StyledItem>
      );
    }
    return lines;
  }, [items, collapsed]);

  let headingMarkup: JSX.Element | undefined = undefined;
  if (title !== undefined) {
    if (collapsed) {
      headingMarkup = <StyledHeading />;
    } else {
      headingMarkup = (
        <StyledHeading>
          <StyledHeadingText>
            {title !== true ? (
              <Text as="span" variant="headingSm" fontWeight="medium" breakWord>
                {title}
              </Text>
            ) : (
              <StyledTitle />
            )}
          </StyledHeadingText>
        </StyledHeading>
      );
    }
  }

  return (
    <StyledSection separator={separator} collapsed={collapsed}>
      {headingMarkup}
      {itemLines}
    </StyledSection>
  );
}

const StyledHeading = styled.li`
  display: flex;
  align-items: center;
  min-height: ${(p) => p.theme.components.navigation.desktopHeight};
  padding: ${(p) => p.theme.spacing(0, 3)};
  width: ${(p) => p.theme.components.navigation.baseWidth};
`;

const StyledHeadingText = styled.div`
  color: ${(p) => p.theme.components.navigation.textColor};
  text-transform: uppercase;
  padding: ${(p) => p.theme.spacing(0, 2)};
  flex-grow: 1;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: stretch;
  min-height: ${(p) => p.theme.spacing(8)};
  padding: ${(p) => p.theme.spacing(0, 3)};
`;

const StyledTitle = styled.div`
  height: 16px;
  width: 60%;
  background-color: ${(p) => p.theme.components.navigation.backgroundSelectedColor};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledItemInner = styled.div`
  padding: 6px;
  display: flex;
  flex: 1;
  align-items: center;
  gap: ${(p) => p.theme.spacing(3)};
`;

const StyledIcon = styled.div`
  width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  background-color: ${(p) => p.theme.components.navigation.backgroundSelectedColor};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledItemLabel = styled.div`
  height: 70%;
  background-color: ${(p) => p.theme.components.navigation.backgroundSelectedColor};
  flex: 1;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledSection = styled.ul<{
  separator?: boolean;
  collapsed?: boolean;
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

  ${(p) =>
    p.collapsed &&
    css`
      ${StyledHeading} {
        width: ${p.theme.components.navigation.collapsedWidth};
        padding: ${p.theme.spacing(0, 2)};
      }
      ${StyledItem} {
        padding: 0;
      }
      ${StyledItemInner} {
        justify-content: center;
        gap: 0;
      }
    `}
`;
