import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ComplexAction } from "../../types";
import { buttonsFrom } from "../../utils/buttonFrom";
import { ButtonGroup } from "../ButtonGroup";
import { Stack } from "../Stack";
import { Text } from "../Text";

export interface CardSectionProps {
  /** Tiêu để của section */
  title?: React.ReactNode;
  /** Subdued section */
  subdued?: boolean;
  /** Bỏ padding mặc định */
  flush?: boolean;
  /** Section header actions */
  actions?: ComplexAction[];
  /** Nội dung trong card */
  children?: React.ReactNode;
}

export function Section({ children, subdued, flush, title, actions }: CardSectionProps) {
  const titleMarkup =
    typeof title === "string" ? (
      <Text variant="headingSm" as="h3">
        {title}
      </Text>
    ) : (
      title
    );

  const actionMarkup = actions ? <ButtonGroup>{buttonsFrom(actions, { plain: true })}</ButtonGroup> : null;

  const titleAreaMarkup =
    titleMarkup || actionMarkup ? (
      <StyledSectionHeader>
        {actionMarkup ? (
          <Stack alignment="leading">
            <Stack.Item fill>{titleMarkup}</Stack.Item>
            {actionMarkup}
          </Stack>
        ) : (
          titleMarkup
        )}
      </StyledSectionHeader>
    ) : null;

  return (
    <StyledSection subdued={subdued} flush={flush} className="ui-card__section">
      {titleAreaMarkup}
      {children}
    </StyledSection>
  );
}

const StyledSection = styled.div<{
  subdued?: boolean;
  flush?: boolean;
}>`
  padding: ${(p) => (p.flush ? 0 : p.theme.spacing(4))};
  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => (p.flush ? 0 : p.theme.spacing(5))};
  }

  &:first-of-type {
    border-top-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
    border-top-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }

  &:last-child {
    border-bottom-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
    border-bottom-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }

  // ui-card__section class workaround for & + & issue
  & + .ui-card__section {
    border-top: ${(p) => p.theme.shape.borderDivider};
  }

  ${(p) =>
    p.subdued &&
    css`
      background-color: ${p.theme.colors.surfaceSubdued};
    `}
`;

const StyledSectionHeader = styled.div`
  padding-bottom: ${(p) => p.theme.spacing(2)};
`;
