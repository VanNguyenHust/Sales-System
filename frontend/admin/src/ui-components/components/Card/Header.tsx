import React, { isValidElement } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { DisableableAction } from "../../types";
import { buttonsFrom } from "../../utils/buttonFrom";
import { ButtonGroup } from "../ButtonGroup";
import { Stack } from "../Stack";
import { Text } from "../Text";

export interface CardHeaderProps {
  /** Tiêu đề của card */
  title?: React.ReactNode;
  /**
   * Ngăn header với body bởi đường viền
   * @deprecated Sẽ xóa đợt tới
   * */
  divider?: boolean;
  /** Card header actions */
  actions?: DisableableAction[];
  /** Nội dung của header */
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Header({ title, children, actions, divider }: CardHeaderProps) {
  const actionMarkup = actions ? <ButtonGroup>{buttonsFrom(actions, { plain: true })}</ButtonGroup> : null;

  const titleMarkup = isValidElement(title) ? (
    title
  ) : (
    <Text variant="headingMd" as="h2">
      {title}
    </Text>
  );

  const headingMarkup =
    actionMarkup || children ? (
      <Stack alignment="leading">
        <Stack.Item fill>{titleMarkup}</Stack.Item>
        {actionMarkup}
        {children}
      </Stack>
    ) : (
      titleMarkup
    );
  return <StyledHeader divider={divider}>{headingMarkup}</StyledHeader>;
}

const StyledHeader = styled.div<{
  divider?: boolean;
}>`
  padding: ${(p) => p.theme.spacing(4, 4, 0)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => p.theme.spacing(5, 5, 0)};
  }
  ${(p) =>
    p.divider &&
    css`
      border-bottom: ${p.theme.shape.borderDivider};
      padding: ${p.theme.spacing(4)};
      ${p.theme.breakpoints.up("sm")} {
        padding: ${p.theme.spacing(5)};
      }
    `}
`;
