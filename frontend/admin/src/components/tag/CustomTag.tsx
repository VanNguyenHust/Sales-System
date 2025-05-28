// CustomTag.tsx
import { Tag } from "antd";
import styled from "@emotion/styled";

const StyledTag = styled(Tag)`
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 14px;
`;

type CustomTagProps = {
  color?: string;
  children: React.ReactNode;
};

const CustomTag = ({ color = "blue", children }: CustomTagProps) => {
  return <StyledTag color={color}>{children}</StyledTag>;
};

export default CustomTag;
