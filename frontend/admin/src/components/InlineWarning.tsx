import { ReactNode } from "react";
import styled from "@emotion/styled";
import { Icon, Text } from "@/ui-components";
import { ErrorOutlineIcon } from "@/ui-icons";

interface Props {
  message: ReactNode;
  color?: "subdued" | "slim" | "base";
  iconSize?: number;
}

/** Like InlineError component but for warning message */
export function InlineWarning({ message, color = "subdued", iconSize = 20 }: Props) {
  return (
    <StyledInlineWarning>
      <StyledIcon size={iconSize}>
        <Icon source={ErrorOutlineIcon} />
      </StyledIcon>
      <Text as="span" color={color !== "base" ? color : undefined}>
        {message}
      </Text>
    </StyledInlineWarning>
  );
}

const StyledInlineWarning = styled.div`
  display: flex;
  align-items: start;
`;

const StyledIcon = styled.div<{ size: number }>`
  color: ${(p) => p.theme.colors.textWarning};
  fill: ${(p) => p.theme.colors.iconWarning};
  margin-left: calc(-1 * ${(p) => p.theme.spacing(0.5)});
  margin-right: calc(${(p) => p.theme.spacing(0.5)} + ${(p) => p.theme.spacing(1)});
  span {
    width: ${(p) => p.size}px;
    height: ${(p) => p.size}px;
  }
`;
