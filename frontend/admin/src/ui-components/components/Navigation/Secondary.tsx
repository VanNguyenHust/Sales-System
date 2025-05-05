import React from "react";
import styled from "@emotion/styled";

import { useTheme } from "../../themes/ThemeContext";
import { Collapsible } from "../Collapsible";

interface SecondaryProps {
  expanded: boolean;
  children?: React.ReactNode;
  id?: string;
}

export function Secondary({ id, children, expanded }: SecondaryProps) {
  const theme = useTheme();
  return (
    <Collapsible
      id={id}
      open={expanded}
      transition={{ duration: theme.motion.duration300, timingFunction: theme.motion.transformEaseInOut }}
    >
      <StyledList>{children}</StyledList>
    </Collapsible>
  );
}

export const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;
