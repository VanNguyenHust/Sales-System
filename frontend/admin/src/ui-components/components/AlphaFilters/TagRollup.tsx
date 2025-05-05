import React from "react";
import styled from "@emotion/styled";

import { Tag } from "../Tag";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  large?: boolean;
}

export const TagRollup = ({ large, children, onClick }: Props) => {
  return (
    <Tag onClick={onClick} large={large}>
      <StyledContent>{children}</StyledContent>
    </Tag>
  );
};

const StyledContent = styled.span`
  color: ${(p) => p.theme.colors.interactive};
`;
