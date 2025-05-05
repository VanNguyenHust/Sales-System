import React, { memo } from "react";
import styled from "@emotion/styled";

const Toolbar = ({ children }: React.PropsWithChildren) => {
  return <StyledToolbar>{children}</StyledToolbar>;
};

const StyledToolbar = styled.div`
  justify-content: space-between;
  align-items: center;
`;
export default memo(Toolbar);
