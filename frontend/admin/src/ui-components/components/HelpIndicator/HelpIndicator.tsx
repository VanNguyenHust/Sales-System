import React from "react";
import styled from "@emotion/styled";
import { InfoCircleOutlineIcon } from "@/ui-icons";

import { Tooltip, TooltipProps } from "../Tooltip";

export type HelpIndicatorProps = Pick<
  TooltipProps,
  "content" | "dismissOnMouseOut" | "width" | "padding" | "persistOnClick"
> & {
  /**
   * Độ trễ khi hiện tooltip theo milliseconds
   * @default 200
   * */
  hoverDelay?: number;
};

export function HelpIndicator({ content, hoverDelay = 200, ...rest }: HelpIndicatorProps) {
  return (
    <Tooltip content={content} preferredPosition="above" {...rest} hoverDelay={hoverDelay}>
      <StyledHelpTextIcon>
        <InfoCircleOutlineIcon />
      </StyledHelpTextIcon>
    </Tooltip>
  );
}

const StyledHelpTextIcon = styled.span`
  color: ${(p) => p.theme.colors.textPrimary};
  width: ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(4)};
  display: block;
`;
