import React from "react";
import styled from "@emotion/styled";

export interface SectionProps {
  /** Đặt section có vai trò là secondary, chiều rộng sẽ bé hơn primary */
  secondary?: boolean;
  /** section có chiều rộng 1/2 */
  oneHalf?: boolean;
  /** section có chiều rộng 1/3 */
  oneThird?: boolean;
  /** section có chiều rộng 100% */
  fullWidth?: boolean;
  /** Nội dung section */
  children?: React.ReactNode;
}

export function Section({ children, ...rest }: SectionProps) {
  return <StyledSection {...rest}>{children}</StyledSection>;
}

const StyledSection = styled.div<Omit<SectionProps, "children">>`
  flex: ${(p) => {
    const layout = p.theme.components.layout;
    let ratio = 1;
    let basic = "";
    if (p.secondary) {
      basic = `${layout.widthSecondary}`;
    } else if (p.oneHalf) {
      basic = `${layout.widthOneHalf}`;
    } else if (p.oneThird) {
      basic = `${layout.widthOneThird}`;
    } else if (p.fullWidth) {
      basic = "100%";
    } else {
      basic = `${layout.widthPrimary}`;
      ratio = parseFloat(layout.widthPrimary) / parseFloat(layout.widthSecondary);
    }
    return `${ratio} ${ratio} ${basic}`;
  }};
  min-width: ${(p) => {
    if (p.secondary || p.oneHalf || p.oneThird) {
      return "0";
    } else {
      return "51%";
    }
  }};

  @media print {
    flex: 2 2 360px;
  }
  max-width: calc(100% - ${(p) => p.theme.spacing(4)});
  margin-top: ${(p) => p.theme.spacing(4)};
  margin-left: ${(p) => p.theme.spacing(4)};
`;
