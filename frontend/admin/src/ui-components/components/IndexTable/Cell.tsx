import React, { memo, ReactNode } from "react";
import styled from "@emotion/styled";

export interface CellProps {
  /** Nội dung của cell */
  children?: ReactNode;
  /** Xóa padding mặc định của cell */
  flush?: boolean;
  /** Thêm class name vào cell, được dùng để cấu hình chiều rộng của cell */
  className?: string;
}

export const Cell = memo(function Cell({ children, flush, className }: CellProps) {
  return (
    <StyledCell $flush={flush} className={className}>
      {children}
    </StyledCell>
  );
});

export const StyledCell = styled.td<{
  $flush?: boolean;
}>`
  text-align: left;
  white-space: nowrap;
  padding: ${(p) => (p.$flush ? 0 : p.theme.spacing(2, 4))};
`;

export const StyledCellFirst = styled(StyledCell)<{
  $offset?: string;
}>`
  position: sticky;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.indexTableStickyCell};
  padding: ${(p) => p.theme.spacing(2, 0)};
  vertical-align: middle;
  & + ${StyledCell} {
    left: ${(p) => p.$offset};
    padding-left: 0;
  }
`;

export const StyledCellPrefix = styled(StyledCell)<{
  $offset?: string;
}>`
  position: sticky;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.indexTableStickyCell};
  padding: ${(p) => p.theme.spacing(2, 4)};
  vertical-align: middle;
  & + ${StyledCell}, & + ${StyledCellFirst} {
    left: ${(p) => p.$offset};
  }
`;
