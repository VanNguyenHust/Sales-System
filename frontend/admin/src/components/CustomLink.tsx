import { Link, LinkProps } from "react-router-dom";
import styled from "@emotion/styled";

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CustomLink = (props: LinkProps) => {
  return <StyledLink {...props} />;
};

export default CustomLink;
