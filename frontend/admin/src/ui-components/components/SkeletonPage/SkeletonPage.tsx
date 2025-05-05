import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export interface SkeletonPageProps {
  /** Tiêu đề trang */
  title?: string;
  /** Hiển thị trang full chiều dài */
  fullWidth?: boolean;
  /** Giảm chiều dài tối đa phục vụ cho layout 1 cột */
  narrowWidth?: boolean;
  /** Hiển thị primary action */
  primaryAction?: boolean;
  /** Hiển thị back action */
  backAction?: boolean;
  /** Nội dung của page */
  children?: React.ReactNode;
}

/**
 * SkeletonTabs được dùng là skeleton các nội dung đang chờ load cho Page
 */
export function SkeletonPage({
  children,
  fullWidth,
  narrowWidth,
  primaryAction,
  title = "",
  backAction,
}: SkeletonPageProps) {
  const breadcrumbsmarkup = backAction ? (
    <StyledBreadcrumbsWrapper>
      <StyledSkeletonBackAction />
    </StyledBreadcrumbsWrapper>
  ) : null;

  const titleMarkup = title ? (
    <StyledTitleWrapper>
      <StyledTitle>{title}</StyledTitle>
    </StyledTitleWrapper>
  ) : (
    <StyledTitleWrapper>
      <StyledSkeletonTitle />
    </StyledTitleWrapper>
  );

  const rightAlignMarkup = primaryAction ? (
    <StyledRightAlign>
      <StyledSkeletonPrimaryAction />
    </StyledRightAlign>
  ) : (
    <StyledRightAlign />
  );

  return (
    <StyledPage narrowWidth={narrowWidth} fullWidth={fullWidth}>
      <StyledHeaderWrapper>
        <StyledHeaderRow backAction={backAction}>
          {breadcrumbsmarkup}
          {titleMarkup}
          {rightAlignMarkup}
        </StyledHeaderRow>
      </StyledHeaderWrapper>
      <StyledContent>{children}</StyledContent>
    </StyledPage>
  );
}

const StyledTitle = styled.div`
  word-break: break-word;
  overflow-wrap: break-word;
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  font-size: ${(p) => p.theme.typography.fontSize300};
  line-height: ${(p) => p.theme.typography.fontLineHeight3};
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize350};
    line-height: ${(p) => p.theme.typography.fontLineHeight4};
  }
`;

const StyledSkeletonTitle = styled.div`
  background: ${(p) => p.theme.colors.backgroundStrong};
  width: 120px;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  min-height: ${(p) => p.theme.typography.fontLineHeight3};
  ${(p) => p.theme.breakpoints.up("md")} {
    min-height: ${(p) => p.theme.typography.fontLineHeight4};
  }
`;

const StyledSkeletonPrimaryAction = styled.div`
  background: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  min-width: 6.25rem;
`;

const StyledSkeletonBackAction = styled.div`
  background: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  min-width: ${(p) => p.theme.components.form.controlHeight};
`;

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

const StyledHeaderWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => p.theme.spacing(4, 0)};
  }
`;

const StyledHeaderRow = styled.div<{
  backAction?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  min-height: ${(p) => p.theme.spacing(8)};
  ${(p) =>
    p.backAction &&
    css`
      ${p.theme.breakpoints.down("md")} {
        display: grid;
        gap: ${p.theme.spacing(2, 4)};
        grid-template-columns: auto 1fr;
        grid-template-areas: "breadcrumbs actions" "title title";
      }
    `}
`;

const StyledBreadcrumbsWrapper = styled.div`
  padding-right: ${(p) => p.theme.spacing(4)};
  grid-area: breadcrumbs;
`;

const StyledTitleWrapper = styled.div`
  grid-area: title;
  align-self: center;
  padding: calc((${(p) => p.theme.components.form.controlHeight} - ${(p) => p.theme.typography.fontLineHeight3}) / 2)
    ${(p) => p.theme.spacing(0.5)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: calc((${(p) => p.theme.components.form.controlHeight} - ${(p) => p.theme.typography.fontLineHeight4}) / 2)
      ${(p) => p.theme.spacing(0.5)};
  }
`;

const StyledRightAlign = styled.div`
  grid-area: actions;
  display: flex;
  align-content: flex-end;
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  justify-content: flex-end;
  margin-left: ${(p) => p.theme.spacing(4)};
  white-space: nowrap;
`;

const StyledContent = styled.div``;
