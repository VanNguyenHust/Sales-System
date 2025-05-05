import styled from "@emotion/styled";

interface ColGroupProps {
  children?: React.ReactNode;
}
export const ColGroup = ({ children }: ColGroupProps) => {
  return <StyledColGroup>{children}</StyledColGroup>;
};

const StyledColGroup = styled.div`
  width: 100%;
  display: flex;
  ${(p) => p.theme.breakpoints.down("md")} {
    flex-direction: column;
  }
`;
