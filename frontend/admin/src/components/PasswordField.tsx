import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon, TextField, type TextFieldProps } from "@/ui-components";
import { VisibilityBlackIcon, VisibilityOffBlackIcon } from "@/ui-icons";

type Props = Without<TextFieldProps, "type" | "suffix">;

export const PasswordField = (props: Props) => {
  const { disabled } = props;
  const [hiddenProp, setHiddenProp] = useState(true);
  return (
    <TextField
      {...props}
      type={hiddenProp ? "password" : "text"}
      suffix={
        <StyledIcon onClick={() => !disabled && setHiddenProp(!hiddenProp)} $disabled={disabled}>
          <Icon source={hiddenProp ? VisibilityOffBlackIcon : VisibilityBlackIcon} />
        </StyledIcon>
      }
    />
  );
};

const StyledIcon = styled.span<{
  $disabled?: boolean;
}>`
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
  svg {
    color: ${(p) => p.theme.colors.icon};
    &:hover {
      color: ${(p) => p.theme.colors.iconHovered};
    }
  }
  ${(p) =>
    p.$disabled &&
    css`
      svg,
      svg:hover {
        color: ${p.theme.colors.icon};
      }
    `}
`;
