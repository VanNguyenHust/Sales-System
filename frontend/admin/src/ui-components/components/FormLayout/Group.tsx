import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { useUniqueId } from "../../utils/uniqueId";

import { Item, StyledItem } from "./Item";

export interface GroupProps {
  /** Nội dung của group */
  children?: React.ReactNode;
  /** Bố trí các item một cách cô đọng */
  condensed?: boolean;
  /** Tiêu đề của group */
  title?: string;
  /** Mô tả của group */
  helpText?: string;
}

export function Group({ children, condensed, title, helpText }: GroupProps) {
  const id = useUniqueId("FormLayoutGroup");
  let helpTextElement = null;
  let helpTextID: undefined | string;
  let titleElement = null;
  let titleID: undefined | string;

  if (helpText) {
    helpTextID = `${id}HelpText`;
    helpTextElement = <StyledHelpText id={helpTextID}>{helpText}</StyledHelpText>;
  }

  if (title) {
    titleID = `${id}Title`;
    titleElement = <StyledTitle id={titleID}>{title}</StyledTitle>;
  }

  const itemsMarkup = React.Children.map(children, (child) => wrapWithComponent(child, Item, {}));

  return (
    <StyledGroup role="group" condensed={condensed}>
      {titleElement}
      <StyledItems>{itemsMarkup}</StyledItems>
      {helpTextElement}
    </StyledGroup>
  );
}

const StyledHelpText = styled.div`
  padding: ${(p) => p.theme.spacing(2, 5, 0, 5)};
  color: ${(p) => p.theme.colors.textSubdued};
`;

const StyledTitle = styled.div`
  margin-bottom: calc(-1 * ${(p) => p.theme.spacing(2)});
  padding: ${(p) => p.theme.spacing(4, 5, 0)};
`;

const StyledGroup = styled.div<{ condensed: GroupProps["condensed"] }>`
  ${StyledItem} {
    min-width: ${(p) => p.theme.components.form.itemMinWidth};
    ${(p) =>
      p.condensed &&
      css`
        flex-basis: calc(0.5 * ${p.theme.components.form.itemMinWidth});
        min-width: calc(0.5 * ${p.theme.components.form.itemMinWidth});
      `}
  }
`;

const StyledItems = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
