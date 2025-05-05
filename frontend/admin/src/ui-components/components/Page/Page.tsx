import React from "react";
import styled from "@emotion/styled";

import { Header, HeaderProps } from "./Header";

export interface PageProps extends HeaderProps {
  /** Hiển thị đường viền giữa header và content */
  divider?: boolean;
  /** Hiển thị trang full chiều dài */
  fullWidth?: boolean;
  /** Giảm chiều dài tối đa phục vụ cho layout 1 cột */
  narrowWidth?: boolean;
  /** Nội dung của page */
  children?: React.ReactNode;
}

/**
 * Dùng để dựng wrapper bên ngoài trang, bao gồm tiêu đề và danh sách các action
 */
export function Page({ children, divider, fullWidth, narrowWidth, ...rest }: PageProps) {
  const hasHeader = !!(
    rest.title ||
    rest.titleMetadata ||
    rest.subtitle ||
    rest.additionalMetadata ||
    rest.backAction ||
    rest.actionGroups ||
    rest.primaryAction ||
    rest.secondaryActions ||
    rest.pagination
  );
  const headerMarkup = hasHeader ? <Header {...rest} /> : undefined;

  let contentMarkup: JSX.Element;
  if (hasHeader) {
    if (divider) {
      contentMarkup = <StyledContentDivider>{children}</StyledContentDivider>;
    } else {
      contentMarkup = <div>{children}</div>;
    }
  } else {
    contentMarkup = <StyledContent>{children}</StyledContent>;
  }

  return (
    <StyledPage fullWidth={fullWidth} narrowWidth={narrowWidth}>
      {headerMarkup}
      {contentMarkup}
    </StyledPage>
  );
}

const StyledPage = styled.div<{
  fullWidth?: boolean;
  narrowWidth?: boolean;
}>`
  margin: 0 auto;
  padding: 0;
  max-width: ${(p) =>
    p.fullWidth ? "none" : p.narrowWidth ? p.theme.components.layout.widthPrimary : p.theme.components.page.maxWidth};

  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => p.theme.spacing(0, 8)};
  }
`;

const StyledContentDivider = styled.div`
  border-top: ${(p) => p.theme.shape.borderDivider};
  padding-top: ${(p) => p.theme.spacing(8)};
`;

const StyledContent = styled.div`
  padding: ${(p) => p.theme.spacing(2, 0)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding-top: ${(p) => p.theme.spacing(5)};
  }
`;
