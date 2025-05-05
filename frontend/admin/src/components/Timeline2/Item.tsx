import { useContext } from "react";
import styled from "@emotion/styled";

import { TimelineItemContext } from "./context";

interface ItemProps {
  children?: React.ReactNode;
}
export const Item = ({ children }: ItemProps) => {
  const isLast = useContext(TimelineItemContext);
  return (
    <StyledItem>
      <StyledSeparator>
        <StyledCircleStep />
        {!isLast && <StyledConnector />}
      </StyledSeparator>
      <StyledContent>{children}</StyledContent>
    </StyledItem>
  );
};
const StyledItem = styled.div`
  width: 100%;
  display: flex;
  ${(p) => p.theme.breakpoints.up("md")} {
    gap: ${(p) => p.theme.spacing(1)};
  }
  justify-content: flex-start;
`;
const StyledConnector = styled.div`
  height: 100%;
  width: 2px;
  background-color: ${(p) => p.theme.colors.interactive};
  border-radius: 2px;
  flex-grow: 1;
`;
const StyledSeparator = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0;
  align-items: center;
`;
const StyledCircleStep = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #0088ff;
  border: 2px solid #e6f4ff;
  box-sizing: border-box;
  margin: 5px;
  padding: 5px;
`;
const StyledContent = styled.div`
  width: 100%;
  display: flex;
  justify-items: start;
  gap: 16px;
  margin-bottom: 24px;
  margin-top: 2px;
`;
