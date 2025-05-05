import styled from "@emotion/styled";
import { type TextProps } from "@/ui-components";

type Color = TextProps["color"] | "primary" | "normal";
type Props = Without<TextProps, "color"> & {
  color?: Color;
};

export const CustomText = ({ children, color, ...props }: Props) => {
  return (
    <StyledCustomText
      style={{
        color: color === "primary" ? "#08f" : color === "normal" ? "black" : undefined,
      }}
      {...props}
    >
      {children}
    </StyledCustomText>
  );
};

const StyledCustomText = styled.span``;
