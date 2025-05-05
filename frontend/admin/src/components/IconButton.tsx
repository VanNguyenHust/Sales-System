import styled from "@emotion/styled";
import { Icon, type IconProps, type IconSource } from "@/ui-components";

interface Props {
  icon: IconSource;
  onClick?: () => void;
  color?: IconProps["color"];
}

export const IconButton = ({ icon, onClick, ...rest }: Props) => {
  return (
    <StyledIconButton type="button" onClick={onClick}>
      <Icon source={icon} {...rest} />
    </StyledIconButton>
  );
};

const StyledIconButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: ${(p) => p.theme.shape.borderRadius("half")};
  background: transparent;
  color: ${(p) => p.theme.colors.icon};
  :hover {
    color: ${(p) => p.theme.colors.iconHovered};
  }
  :active {
    color: ${(p) => p.theme.colors.iconPressed};
  }
`;
