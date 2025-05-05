import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Icon, IconProps } from "../Icon";

import { ActionContext } from "./context";
import { Option, OptionProps } from "./Option";
import { TextOption } from "./TextOption";

interface ActionProps extends OptionProps {
  /** icon của action */
  icon?: IconProps["source"];
}

export function Action(props: ActionProps) {
  const { selected, disabled, children, icon, divider } = props;

  const iconMarkup = icon ? (
    <StyledIcon>
      <Icon color="base" source={icon} />
    </StyledIcon>
  ) : null;

  return (
    <ActionContext.Provider value>
      <Option {...props}>
        <StyledAction divider={divider}>
          <TextOption selected={selected} disabled={disabled}>
            {iconMarkup}
            {children}
          </TextOption>
        </StyledAction>
      </Option>
    </ActionContext.Provider>
  );
}

const StyledIcon = styled.div`
  padding-right: ${(p) => p.theme.spacing(2)};
`;

const StyledAction = styled.div<{ divider: ActionProps["divider"] }>`
  display: flex;
  flex: 1;
  ${(p) =>
    p.divider &&
    css`
      margin-bottom: ${p.theme.spacing(1)};
    `};
`;
